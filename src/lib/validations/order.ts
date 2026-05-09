import * as z from "zod";
import { ServiceType } from "@prisma/client";

export const createOrderSchema = z.object({
  serviceType: z.nativeEnum(ServiceType, {
    message: "Silakan pilih jenis layanan",
  }),
  name: z.string().min(2, { message: "Nama terlalu pendek" }),
  phone: z.string().min(8, { message: "Nomor telepon tidak valid" }),
  address: z.string().min(10, { message: "Alamat terlalu pendek" }),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  areaSqm: z.number().min(1, { message: "Luas area minimal 1 meter persegi" }).optional(),
  estimatedHours: z.number().min(1, { message: "Waktu minimal 1 jam" }).optional(),
  customerPhotoUrl: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
