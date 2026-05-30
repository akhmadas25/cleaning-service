"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createOrderSchema, type CreateOrderInput } from "@/lib/validations/order";
import { createOrder } from "@/lib/actions/order";
import { getServicePricing } from "@/lib/actions/pricing";
import { ServiceType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPicker } from "@/components/common/MapPicker";
import { ImageUpload } from "@/components/common/ImageUpload";
import { Loader2, Calculator, Info } from "lucide-react";
import { toast } from "sonner";

const SERVICE_LABELS: Record<string, string> = {
  TOILET: "Pembersihan Toilet",
  RUMPUT: "Potong Rumput",
  RUANGAN: "Pembersihan Ruangan",
  GUDANG: "Pembersihan Gudang",
};

interface PricingInfo {
  basePrice: number;
  pricePerSqm: number;
  pricePerHour: number;
}

export function OrderForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [panjang, setPanjang] = useState<number | undefined>();
  const [lebar, setLebar] = useState<number | undefined>();

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      serviceType: "TOILET" as ServiceType,
      areaSqm: undefined,
      estimatedHours: undefined,
      customerPhotoUrl: "",
    },
  });

  const watchServiceType = form.watch("serviceType");
  const watchAreaSqm = form.watch("areaSqm");
  const watchHours = form.watch("estimatedHours");

  useEffect(() => {
    if (panjang !== undefined && lebar !== undefined) {
      form.setValue("areaSqm", panjang * lebar);
    } else {
      form.setValue("areaSqm", undefined);
    }
  }, [panjang, lebar, form]);

  // Fetch pricing saat service type berubah
  useEffect(() => {
    if (!watchServiceType) return;
    setLoadingPricing(true);
    setEstimatedPrice(null);
    setPricing(null);

    getServicePricing(watchServiceType as ServiceType).then((p) => {
      if (p) {
        setPricing({
          basePrice: p.basePrice,
          pricePerSqm: p.pricePerSqm,
          pricePerHour: p.pricePerHour,
        });
      }
      setLoadingPricing(false);
    });
  }, [watchServiceType]);

  // Hitung estimasi harga saat input berubah
  useEffect(() => {
    if (!pricing) { setEstimatedPrice(null); return; }

    let total = pricing.basePrice;

    const useArea = ["RUMPUT", "RUANGAN", "GUDANG"].includes(watchServiceType);
    if (useArea && watchAreaSqm && watchAreaSqm > 0) {
      total += watchAreaSqm * pricing.pricePerSqm;
    } else if (watchServiceType === "TOILET" && watchHours && watchHours > 0) {
      total += watchHours * pricing.pricePerHour;
    }

    setEstimatedPrice(total > 0 ? total : null);
  }, [pricing, watchAreaSqm, watchHours, watchServiceType]);

  function onSubmit(values: CreateOrderInput) {
    startTransition(async () => {
      const result = await createOrder(values);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        router.push("/dashboard/orders");
      }
    });
  }

  const useAreaInput = ["RUMPUT", "RUANGAN", "GUDANG"].includes(watchServiceType);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Pesan Layanan Kebersihan</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* Layanan + Input ukuran */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Layanan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Layanan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TOILET">Pembersihan Toilet</SelectItem>
                      <SelectItem value="RUMPUT">Potong Rumput</SelectItem>
                      <SelectItem value="RUANGAN">Pembersihan Ruangan</SelectItem>
                      <SelectItem value="GUDANG">Pembersihan Gudang</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {useAreaInput ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormItem>
                    <FormLabel>Panjang (m)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Contoh: 5"
                        value={panjang || ""}
                        onChange={(e) => setPanjang(e.target.valueAsNumber || undefined)}
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormLabel>Lebar (m)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Contoh: 4"
                        value={lebar || ""}
                        onChange={(e) => setLebar(e.target.valueAsNumber || undefined)}
                      />
                    </FormControl>
                  </FormItem>
                </div>
                
                {/* Hidden field for areaSqm validation */}
                <FormField
                  control={form.control}
                  name="areaSqm"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {pricing && pricing.pricePerSqm > 0 && (
                  <p className="text-xs text-slate-500">
                    Harga: Rp {pricing.pricePerSqm.toLocaleString("id-ID")} / m²
                    {panjang && lebar ? ` (Total Area: ${panjang * lebar} m²)` : ""}
                  </p>
                )}
                {form.formState.errors.areaSqm && (
                  <p className="text-[0.8rem] font-medium text-red-500">
                    {form.formState.errors.areaSqm.message}
                  </p>
                )}
              </div>
            ) : (
              <FormField
                control={form.control}
                name="estimatedHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimasi Waktu (Jam)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Contoh: 2"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                      />
                    </FormControl>
                    {pricing && pricing.pricePerHour > 0 && (
                      <p className="text-xs text-slate-500">
                        Rp {pricing.pricePerHour.toLocaleString("id-ID")} / jam
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Box Estimasi Harga */}
          <div className={`rounded-xl border-2 p-4 transition-all ${
            estimatedPrice 
              ? "border-blue-200 bg-blue-50" 
              : "border-slate-100 bg-slate-50"
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-slate-700">Estimasi Biaya</span>
            </div>

            {loadingPricing ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 className="w-3 h-3 animate-spin" />
                Memuat harga...
              </div>
            ) : !pricing || (pricing.basePrice === 0 && pricing.pricePerSqm === 0 && pricing.pricePerHour === 0) ? (
              <div className="flex items-start gap-2 text-slate-500 text-sm">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Harga belum diset oleh admin. Tim kami akan menghubungi Anda untuk konfirmasi harga.</span>
              </div>
            ) : estimatedPrice ? (
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  Rp {estimatedPrice.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Harga final dapat berubah sesuai kondisi lapangan
                </p>
                {pricing.basePrice > 0 && (
                  <div className="mt-2 text-xs text-slate-500 space-y-0.5">
                    <p>• Biaya dasar: Rp {pricing.basePrice.toLocaleString("id-ID")}</p>
                    {useAreaInput && watchAreaSqm && pricing.pricePerSqm > 0 && (
                      <p>• {watchAreaSqm} m² × Rp {pricing.pricePerSqm.toLocaleString("id-ID")} = Rp {(watchAreaSqm * pricing.pricePerSqm).toLocaleString("id-ID")}</p>
                    )}
                    {!useAreaInput && watchHours && pricing.pricePerHour > 0 && (
                      <p>• {watchHours} jam × Rp {pricing.pricePerHour.toLocaleString("id-ID")} = Rp {(watchHours * pricing.pricePerHour).toLocaleString("id-ID")}</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">
                {useAreaInput ? "Masukkan luas area untuk melihat estimasi harga" : "Masukkan estimasi waktu untuk melihat estimasi harga"}
              </p>
            )}
          </div>

          {/* Nama & No HP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Handphone (WhatsApp)</FormLabel>
                  <FormControl>
                    <Input placeholder="08123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Alamat */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detail Alamat Lengkap</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Jalan, Nomor Rumah, RT/RW, Patokan"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Peta */}
          <div className="space-y-3">
            <FormLabel>Pin Lokasi (Serlok)</FormLabel>
            <MapPicker
              onLocationSelect={(lat, lng, address) => {
                form.setValue("latitude", lat);
                form.setValue("longitude", lng);
                if (!form.getValues("address") && address) {
                  form.setValue("address", address);
                }
              }}
            />
          </div>

          {/* Upload Foto */}
          <FormField
            control={form.control}
            name="customerPhotoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unggah Foto Area (Opsional)</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} className="w-full h-12 bg-[#002266] hover:bg-[#001133] text-white text-base font-semibold">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Buat Pesanan"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
