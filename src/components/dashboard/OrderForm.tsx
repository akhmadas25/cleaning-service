"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createOrderSchema, type CreateOrderInput } from "@/lib/validations/order";
import { createOrder, checkIsFirstOrder } from "@/lib/actions/order";
import { getServicePricing } from "@/lib/actions/pricing";

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
import { Loader2, Calculator, Info, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";



interface PricingInfo {
  basePrice: number;
  pricePerSqm: number;
  pricePerHour: number;
}

export function OrderForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [pricingMap, setPricingMap] = useState<Record<string, PricingInfo>>({});
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [isFirstOrder, setIsFirstOrder] = useState(false);

  useEffect(() => {
    checkIsFirstOrder().then(setIsFirstOrder);
    
    // Fetch all pricing up front
    setLoadingPricing(true);
    Promise.all([
      getServicePricing("TOILET"),
      getServicePricing("RUMPUT"),
      getServicePricing("RUANGAN"),
      getServicePricing("GUDANG"),
    ]).then(([t, rp, ru, g]) => {
      setPricingMap({
        TOILET: t as PricingInfo,
        RUMPUT: rp as PricingInfo,
        RUANGAN: ru as PricingInfo,
        GUDANG: g as PricingInfo,
      });
      setLoadingPricing(false);
    });
  }, []);

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      items: [{ serviceType: "TOILET", panjang: undefined, lebar: undefined, estimatedHours: undefined }],
      customerPhotoUrl: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchItems = form.watch("items");

  // Calculate estimated price
  useEffect(() => {
    if (Object.keys(pricingMap).length === 0) return;

    let total = 0;
    for (const item of watchItems) {
      if (!item) continue;
      const p = pricingMap[item.serviceType];
      if (!p) continue;

      let itemTotal = p.basePrice || 0;
      const useArea = ["RUMPUT", "RUANGAN", "GUDANG"].includes(item.serviceType);
      
      if (useArea && item.panjang && item.lebar && item.panjang > 0 && item.lebar > 0) {
        itemTotal += (item.panjang * item.lebar) * p.pricePerSqm;
      } else if (item.serviceType === "TOILET" && item.estimatedHours && item.estimatedHours > 0) {
        itemTotal += item.estimatedHours * p.pricePerHour;
      }
      total += itemTotal;
    }

    if (isFirstOrder && total > 0) {
      total = total * 0.8;
    }

    setEstimatedPrice(total > 0 ? total : null);
  }, [watchItems, pricingMap, isFirstOrder]);

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

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Pesan Layanan Kebersihan</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 border-b pb-2">Layanan yang Dipesan</h3>
            {fields.map((field, index) => {
              const currentServiceType = watchItems[index]?.serviceType || "TOILET";
              const useAreaInput = ["RUMPUT", "RUANGAN", "GUDANG"].includes(currentServiceType);
              const p = pricingMap[currentServiceType];

              return (
                <div key={field.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl relative">
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.serviceType`}
                      render={({ field: selectField }) => (
                        <FormItem>
                          <FormLabel>Jenis Layanan</FormLabel>
                          <Select onValueChange={(val) => {
                            selectField.onChange(val);
                            form.setValue(`items.${index}.panjang`, undefined);
                            form.setValue(`items.${index}.lebar`, undefined);
                            form.setValue(`items.${index}.estimatedHours`, undefined);
                          }} defaultValue={selectField.value}>
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
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`items.${index}.panjang`}
                          render={({ field: inputField }) => (
                            <FormItem>
                              <FormLabel>Panjang (m)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Contoh: 5"
                                  {...inputField}
                                  onChange={(e) => inputField.onChange(e.target.valueAsNumber || undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.lebar`}
                          render={({ field: inputField }) => (
                            <FormItem>
                              <FormLabel>Lebar (m)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Contoh: 4"
                                  {...inputField}
                                  onChange={(e) => inputField.onChange(e.target.valueAsNumber || undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {p && p.pricePerSqm > 0 && (
                          <div className="col-span-2 mt-[-8px]">
                            <p className="text-xs text-slate-500">
                              Harga: Rp {p.pricePerSqm.toLocaleString("id-ID")} / m²
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <FormField
                        control={form.control}
                        name={`items.${index}.estimatedHours`}
                        render={({ field: inputField }) => (
                          <FormItem>
                            <FormLabel>Estimasi Waktu (Jam)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Contoh: 2"
                                {...inputField}
                                onChange={(e) => inputField.onChange(e.target.valueAsNumber || undefined)}
                              />
                            </FormControl>
                            {p && p.pricePerHour > 0 && (
                              <p className="text-xs text-slate-500">
                                Rp {p.pricePerHour.toLocaleString("id-ID")} / jam
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              );
            })}
            
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={() => append({ serviceType: "TOILET", panjang: undefined, lebar: undefined, estimatedHours: undefined })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Layanan Lainnya
            </Button>
          </div>

          {/* Box Estimasi Harga */}
          <div className={`rounded-xl border-2 p-4 transition-all ${
            estimatedPrice 
              ? "border-blue-200 bg-blue-50" 
              : "border-slate-100 bg-slate-50"
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-slate-700">Total Estimasi Biaya</span>
              {isFirstOrder && (
                <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] uppercase tracking-wider font-bold rounded-full">
                  Diskon 20%
                </span>
              )}
            </div>

            {loadingPricing ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 className="w-3 h-3 animate-spin" />
                Memuat harga...
              </div>
            ) : estimatedPrice ? (
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  Rp {estimatedPrice.toLocaleString("id-ID")}
                </p>
                {isFirstOrder && (
                  <p className="text-xs text-green-600 font-medium mt-1">Diskon pengguna baru sebesar 20% telah diterapkan!</p>
                )}
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Harga final dapat berubah sesuai kondisi lapangan
                </p>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">
                Masukkan detail layanan untuk melihat estimasi harga
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
