import * as z from "zod";
import { ServiceType } from "@prisma/client";

export const createOrderSchema = z.object({
  items: z.array(z.object({
    serviceType: z.nativeEnum(ServiceType),
    panjang: z.number().min(1, { message: "Panjang minimal 1 meter" }).optional(),
    lebar: z.number().min(1, { message: "Lebar minimal 1 meter" }).optional(),
    estimatedHours: z.number().min(1, { message: "Waktu minimal 1 jam" }).optional(),
  })).min(1, { message: "Pilih minimal 1 layanan" }),
  name: z.string().min(2, { message: "Nama terlalu pendek" }),
  phone: z.string().min(8, { message: "Nomor telepon tidak valid" }),
  address: z.string().min(10, { message: "Alamat terlalu pendek" }),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  customerPhotoUrl: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
