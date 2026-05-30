"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  MapPin,
  Clock,
  CalendarDays,
  PlusCircle,
  X,
  CheckCircle2,
  User,
  Phone,
  Info,
  Navigation,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";

const OrderTrackerMap = dynamic(
  () => import("@/components/customer/OrderTrackerMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-80 bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 text-xs">
        Memuat Peta Lacak...
      </div>
    ),
  },
);

interface CustomerOrderListProps {
  orders: any[];
}

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: {
    label: "Menunggu Teknisi",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  ASSIGNED: {
    label: "Teknisi Ditugaskan",
    color: "bg-blue-100 text-blue-800",
    icon: User,
  },
  ON_THE_WAY: {
    label: "Dalam Perjalanan",
    color: "bg-indigo-100 text-indigo-800",
    icon: MapPin,
  },
  IN_PROGRESS: {
    label: "Sedang Dikerjakan",
    color: "bg-purple-100 text-purple-800",
    icon: Sparkles,
  },
  CANCELLED: { label: "Dibatalkan", color: "bg-red-100 text-red-800", icon: X },
  COMPLETED: {
    label: "Selesai (Nunggu ACC)",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle2,
  },
  APPROVED: {
    label: "Lunas",
    color: "bg-emerald-100 text-emerald-800",
    icon: CheckCircle2,
  },
};

export function CustomerOrderList({ orders }: CustomerOrderListProps) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        const s = statusMap[order.status] || {
          label: order.status,
          color: "bg-slate-100 text-slate-800",
          icon: Info,
        };
        return (
          <Card
            key={order.id}
            className="border-0 shadow-sm overflow-hidden group"
          >
            <div className="flex flex-col md:flex-row">
              {order.customerPhotoUrl && (
                <div className="md:w-48 h-48 relative overflow-hidden shrink-0">
                  <Image
                    src={order.customerPhotoUrl}
                    alt="Area"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {order.serviceType}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />{" "}
                        {new Date(order.createdAt).toLocaleDateString("id-ID")}
                      </span>
                      {order.technician && (
                        <span className="flex items-center gap-1 font-medium text-slate-600">
                          <User className="w-3 h-3" /> Teknisi:{" "}
                          {order.technician.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge
                    className={`text-[10px] font-bold border-0 ${s.color}`}
                  >
                    {s.label}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-slate-600 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />{" "}
                    {order.address}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                      Total Pembayaran
                    </p>
                    <p className="text-xl font-extrabold text-blue-600">
                      Rp{" "}
                      {(
                        order.finalPrice ||
                        order.initialPrice ||
                        0
                      ).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {order.status === "ON_THE_WAY" && (
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[10px] font-bold bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm shadow-blue-200 animate-pulse"
                      >
                        <Navigation className="w-3 h-3" /> Lacak Teknisi
                      </button>
                    )}
                    <a
                      href={`https://wa.me/6281337418441?text=Halo CS SatSet Cleaning, saya ${order.name} ingin bertanya tentang pesanan saya untuk layanan ${order.serviceType} di alamat ${order.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 border border-green-200"
                    >
                      Chat CS <MessageCircle className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-[10px] font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      Detail <Info className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      {/* Detail Modal */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogContent className="sm:max-w-[500px] p-0 overflow-y-auto max-h-[90vh] border-0 shadow-2xl rounded-2xl">
          {selectedOrder && (
            <div className="flex flex-col">
              <div className="relative h-40 shrink-0">
                {selectedOrder.customerPhotoUrl ? (
                  <Image
                    src={selectedOrder.customerPhotoUrl}
                    alt="Header"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700" />
                )}
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-4 left-6">
                  <Badge
                    className={`mb-2 border-0 shadow-sm ${statusMap[selectedOrder.status]?.color}`}
                  >
                    {statusMap[selectedOrder.status]?.label}
                  </Badge>
                  <h2 className="text-xl font-black text-white drop-shadow-md">
                    {selectedOrder.serviceType}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {(selectedOrder.status === "ASSIGNED" ||
                  selectedOrder.status === "ON_THE_WAY" ||
                  selectedOrder.status === "IN_PROGRESS") && (
                  <div className="space-y-3 px-4">
                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 ml-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                      Live Tracking
                    </h4>
                    <OrderTrackerMap
                      orderId={selectedOrder.id}
                      destLat={selectedOrder.latitude}
                      destLng={selectedOrder.longitude}
                      initialTechLat={selectedOrder.technicianLat}
                      initialTechLng={selectedOrder.technicianLng}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase font-black mb-1">
                      Tanggal Pesan
                    </p>
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
                      {new Date(selectedOrder.createdAt).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "long" },
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase font-black mb-1">
                      Ukuran/Durasi
                    </p>
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      {selectedOrder.areaSqm
                        ? `${selectedOrder.areaSqm} m²`
                        : `${selectedOrder.estimatedHours} Jam`}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] text-slate-400 uppercase font-black">
                        Lokasi Pengerjaan
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {selectedOrder.address}
                      </p>
                    </div>
                  </div>

                  {selectedOrder.technician && (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 font-black text-sm border-2 border-blue-200">
                        {selectedOrder.technician.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-[9px] text-blue-500 uppercase font-black">
                          Teknisi Bertugas
                        </p>
                        <p className="text-sm font-black text-slate-900">
                          {selectedOrder.technician.name}
                        </p>
                      </div>
                      <a
                        href={`tel:${selectedOrder.technician.phone || ""}`}
                        className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-green-600 border border-green-100 hover:bg-green-50 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>

                {selectedOrder.completionPhotoUrl && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Hasil Pekerjaan
                    </h4>
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                      <Image
                        src={selectedOrder.completionPhotoUrl}
                        alt="Hasil"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-black leading-none mb-1">
                      Total Biaya
                    </p>
                    <p className="text-2xl font-black text-blue-600 leading-none">
                      Rp{" "}
                      {(
                        selectedOrder.finalPrice ||
                        selectedOrder.initialPrice ||
                        0
                      ).toLocaleString("id-ID")}
                    </p>
                  </div>
                  {selectedOrder.status === "COMPLETED" && (
                    <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
                      Selesai
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
