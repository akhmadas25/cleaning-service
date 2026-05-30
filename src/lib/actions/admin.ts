"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function assignTechnician(orderId: string, technicianId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return { error: "Akses ditolak" };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        technicianId,
        status: "ASSIGNED",
      },
    });

    revalidatePath("/admin");
    revalidatePath("/dashboard/orders");
    return { success: "Teknisi berhasil ditugaskan!" };
  } catch (error) {
    console.error("Assign technician error:", error);
    return { error: "Terjadi kesalahan sistem saat menugaskan teknisi." };
  }
}

export async function approvePayment(orderId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return { error: "Akses ditolak" };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "APPROVED",
      },
    });

    revalidatePath("/admin");
    revalidatePath("/dashboard/orders");
    return { success: "Pembayaran telah disetujui, pesanan selesai!" };
  } catch (error) {
    console.error("Approve payment error:", error);
    return { error: "Terjadi kesalahan sistem saat menyetujui pembayaran." };
  }
}

export async function updateServicePricing(data: {
  serviceType: any;
  basePrice: number;
  pricePerSqm: number;
  pricePerHour: number;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return { error: "Akses ditolak" };
    }

    await prisma.servicePricing.upsert({
      where: { serviceType: data.serviceType },
      update: {
        basePrice: data.basePrice,
        pricePerSqm: data.pricePerSqm,
        pricePerHour: data.pricePerHour,
      },
      create: {
        serviceType: data.serviceType,
        basePrice: data.basePrice,
        pricePerSqm: data.pricePerSqm,
        pricePerHour: data.pricePerHour,
      },
    });

    revalidatePath("/admin/pricing");
    return { success: "Harga layanan berhasil diperbarui!" };
  } catch (error) {
    console.error("Update pricing error:", error);
    return { error: "Terjadi kesalahan saat memperbarui harga." };
  }
}

export async function registerTechnician(data: { name: string, email: string, password: string }) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return { error: "Akses ditolak" };
    }

    const { name, email, password } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email sudah terdaftar!" };
    }

    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role: "TECHNICIAN",
      },
    });

    revalidatePath("/admin/technicians");
    return { success: "Teknisi berhasil didaftarkan!" };
  } catch (error) {
    console.error("Register technician error:", error);
    return { error: "Terjadi kesalahan saat mendaftarkan teknisi." };
  }
}

export async function editTechnician(data: { id: string, name: string, email: string, password?: string }) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return { error: "Akses ditolak" };
    }

    const { id, name, email, password } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== id) {
      return { error: "Email sudah digunakan oleh pengguna lain!" };
    }

    const updateData: any = { name, email };

    if (password && password.trim() !== "") {
      const bcrypt = await import("bcryptjs");
      updateData.hashedPassword = await bcrypt.hash(password, 12);
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/technicians");
    return { success: "Data teknisi berhasil diperbarui!" };
  } catch (error) {
    console.error("Edit technician error:", error);
    return { error: "Terjadi kesalahan saat memperbarui teknisi." };
  }
}
