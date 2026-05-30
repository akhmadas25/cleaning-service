"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createOrderSchema, type CreateOrderInput } from "@/lib/validations/order";
import { revalidatePath } from "next/cache";

export async function createOrder(values: CreateOrderInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Silakan login terlebih dahulu" };

    const validatedFields = createOrderSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Data tidak valid" };

    const { 
      name, phone, address, latitude, longitude, 
      items, customerPhotoUrl 
    } = validatedFields.data;

    let initialPrice = 0;
    const orderItemsData = [];

    for (const item of items) {
      const pricing = await prisma.servicePricing.findUnique({
        where: { serviceType: item.serviceType }
      });
      
      let itemPrice = pricing?.basePrice || 0;
      const areaSqm = (item.panjang && item.lebar) ? (item.panjang * item.lebar) : 0;
      if (["RUMPUT", "RUANGAN", "GUDANG"].includes(item.serviceType) && areaSqm > 0) {
        itemPrice += areaSqm * (pricing?.pricePerSqm || 0);
      } else if (item.serviceType === "TOILET" && item.estimatedHours) {
        itemPrice += item.estimatedHours * (pricing?.pricePerHour || 0);
      }
      
      initialPrice += itemPrice;
      
      orderItemsData.push({
        serviceType: item.serviceType,
        areaSqm: areaSqm > 0 ? areaSqm : null,
        estimatedHours: item.estimatedHours,
        price: itemPrice,
      });
    }

    const orderCount = await prisma.order.count({
      where: { userId: session.user.id }
    });
    const isFirstOrder = orderCount === 0;

    if (isFirstOrder) {
      initialPrice = initialPrice * 0.8;
    }

    await prisma.order.create({
      data: {
        userId: session.user.id,
        name,
        phone,
        address,
        latitude,
        longitude,
        customerPhotoUrl,
        initialPrice,
        status: "PENDING",
        items: {
          create: orderItemsData,
        }
      },
    });

    revalidatePath("/dashboard/orders");
    return { success: "Pesanan berhasil dibuat!" };
  } catch (error) {
    console.error("Create order error:", error);
    return { error: "Terjadi kesalahan saat membuat pesanan" };
  }
}

export async function getOrderLocation(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        latitude: true,
        longitude: true,
        technicianLat: true,
        technicianLng: true,
        status: true
      }
    });
    return { success: order };
  } catch {
    return { error: "Failed to fetch location" };
  }
}

export async function checkIsFirstOrder() {
  try {
    const session = await auth();
    if (!session?.user?.id) return false;

    const count = await prisma.order.count({
      where: { userId: session.user.id }
    });

    return count === 0;
  } catch {
    return false;
  }
}
