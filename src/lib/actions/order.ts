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
      serviceType, areaSqm, estimatedHours, customerPhotoUrl 
    } = validatedFields.data;

    // Hitung estimasi harga lagi di server untuk keamanan
    const pricing = await prisma.servicePricing.findUnique({
      where: { serviceType }
    });

    let initialPrice = pricing?.basePrice || 0;
    if (["RUMPUT", "RUANGAN", "GUDANG"].includes(serviceType) && areaSqm) {
      initialPrice += areaSqm * (pricing?.pricePerSqm || 0);
    } else if (serviceType === "TOILET" && estimatedHours) {
      initialPrice += estimatedHours * (pricing?.pricePerHour || 0);
    }

    await prisma.order.create({
      data: {
        userId: session.user.id,
        name,
        phone,
        address,
        latitude,
        longitude,
        serviceType,
        areaSqm,
        estimatedHours,
        customerPhotoUrl,
        initialPrice,
        status: "PENDING",
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
  } catch (error) {
    return { error: "Failed to fetch location" };
  }
}
