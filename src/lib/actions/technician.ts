"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateTaskStatus(orderId: string, status: "ON_THE_WAY" | "IN_PROGRESS" | "CANCELLED") {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "TECHNICIAN") {
      return { error: "Akses ditolak" };
    }

    // Verify ownership
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (order?.technicianId !== session.user.id) {
      return { error: "Pesanan ini bukan milik Anda" };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    revalidatePath("/technician");
    revalidatePath("/dashboard/orders");
    return { success: `Status pesanan berhasil diperbarui ke ${status}!` };
  } catch (error) {
    console.error("Update task status error:", error);
    return { error: "Terjadi kesalahan sistem saat memperbarui status." };
  }
}

export async function updateTechnicianLocation(orderId: string, lat: number, lng: number) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "TECHNICIAN") {
      return { error: "Akses ditolak" };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { 
        technicianLat: lat,
        technicianLng: lng
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Update location error:", error);
    return { error: "Failed to update location" };
  }
}

export async function completeTask(orderId: string, finalPrice: number, completionPhotoUrl: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "TECHNICIAN") {
      return { error: "Akses ditolak" };
    }

    // Verify ownership
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (order?.technicianId !== session.user.id) {
      return { error: "Pesanan ini bukan milik Anda" };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: "COMPLETED",
        finalPrice,
        completionPhotoUrl
      }
    });

    revalidatePath("/technician");
    return { success: "Pesanan telah diselesaikan!" };
  } catch (error) {
    console.error("Complete task error:", error);
    return { error: "Terjadi kesalahan sistem saat menyelesaikan pesanan." };
  }
}
