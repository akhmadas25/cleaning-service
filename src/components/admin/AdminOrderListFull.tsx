"use client";

import { useState, useTransition } from "react";
import { approvePayment, assignTechnician } from "@/lib/actions/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Download, Search, Filter, CalendarDays, User, MapPin, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import dynamic from "next/dynamic";

const OrderMapPreview = dynamic(() => import("@/components/common/OrderMapPreview"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-50 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-slate-300" /></div>
});

interface AdminOrderListFullProps {
  orders: any[];
  technicians: { id: string; name: string; email: string }[];
}

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING:    { label: "Menunggu",        color: "bg-yellow-100 text-yellow-800" },
  ASSIGNED:   { label: "Ditugaskan",      color: "bg-blue-100 text-blue-800" },
  ON_THE_WAY: { label: "OTW",             color: "bg-indigo-100 text-indigo-800" },
  IN_PROGRESS:{ label: "Pengerjaan",      color: "bg-purple-100 text-purple-800" },
  CANCELLED:  { label: "Batal",           color: "bg-red-100 text-red-800" },
  COMPLETED:  { label: "Selesai",         color: "bg-green-100 text-green-800" },
  APPROVED:   { label: "Lunas/ACC",       color: "bg-emerald-100 text-emerald-800" },
};

export function AdminOrderListFull({ orders, technicians }: AdminOrderListFullProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedTechs, setSelectedTechs] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = (orderId: string) => {
    const techId = selectedTechs[orderId];
    if (!techId) {
      toast.error("Pilih teknisi terlebih dahulu");
      return;
    }
    
    startTransition(async () => {
      const result = await assignTechnician(orderId, techId);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  };

  const handleApprove = (orderId: string) => {
    startTransition(async () => {
      const result = await approvePayment(orderId);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  };

  const downloadIncomeReport = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text("Laporan Pemasukan CleanPro", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleString("id-ID")}`, 14, 30);
    
    // Filter only completed/approved orders for income
    const incomeOrders = orders.filter(o => ["COMPLETED", "APPROVED"].includes(o.status));
    const totalIncome = incomeOrders.reduce((acc, o) => acc + (o.finalPrice || o.initialPrice || 0), 0);

    const tableData = incomeOrders.map((o, i) => [
      i + 1,
      new Date(o.createdAt).toLocaleDateString("id-ID"),
      o.name,
      o.serviceType,
      o.technician?.name || "-",
      `Rp ${(o.finalPrice || o.initialPrice || 0).toLocaleString("id-ID")}`
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["No", "Tanggal", "Pelanggan", "Layanan", "Teknisi", "Pemasukan"]],
      body: tableData,
      foot: [["", "", "", "", "TOTAL", `Rp ${totalIncome.toLocaleString("id-ID")}`]],
      headStyles: { fillColor: [0, 34, 102] },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
    });

    doc.save(`Laporan_Pemasukan_CleanPro_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("Laporan berhasil diunduh");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari pesanan, pelanggan, atau alamat..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          onClick={downloadIncomeReport}
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 shadow-sm shadow-emerald-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Laporan Pemasukan
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredOrders.length === 0 ? (
          <Card className="col-span-full p-12 text-center border-dashed bg-white">
            <p className="text-slate-500">Tidak ada pesanan ditemukan.</p>
          </Card>
        ) : (
          filteredOrders.map(order => {
            const s = statusMap[order.status] || { label: order.status, color: "bg-slate-100 text-slate-800" };
            return (
              <Card key={order.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all group">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row h-full">
                    <div className="sm:w-40 md:w-48 h-48 sm:h-auto relative shrink-0 overflow-hidden bg-slate-100">
                      {order.latitude && order.longitude ? (
                        <OrderMapPreview lat={order.latitude} lng={order.longitude} />
                      ) : order.customerPhotoUrl ? (
                        <Image src={order.customerPhotoUrl} alt="Area" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-slate-300" />
                        </div>
                      )}
                      
                      {/* Floating Open Map Button */}
                      {order.latitude && order.longitude && (
                        <a 
                          href={`https://www.google.com/maps?q=${order.latitude},${order.longitude}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute bottom-2 right-2 z-20 p-1.5 bg-white/90 backdrop-blur rounded-lg shadow-sm border border-slate-200 text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-base text-slate-900">{order.serviceType}</h3>
                              <Badge className={`text-[9px] h-4 leading-none uppercase font-black border-0 px-1.5 ${s.color}`}>{s.label}</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                              <span className="flex items-center gap-1 font-medium text-slate-500"><CalendarDays className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString("id-ID")}</span>
                              <span className="text-slate-300">•</span>
                              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {order.name}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] text-slate-400 uppercase font-black leading-none mb-1">Harga</p>
                            <p className="text-base font-black text-blue-600">Rp {(order.finalPrice || order.initialPrice || 0).toLocaleString("id-ID")}</p>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 mb-4 line-clamp-2 flex items-start gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          {order.address}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-50 flex flex-wrap gap-2 items-center justify-between">
                        {order.status === "PENDING" && (
                          <div className="flex items-center gap-2 w-full">
                            <Select onValueChange={(val) => setSelectedTechs(prev => ({...prev, [order.id]: val}))}>
                              <SelectTrigger className="h-9 flex-1 rounded-lg text-xs">
                                <SelectValue placeholder="Pilih Teknisi" />
                              </SelectTrigger>
                              <SelectContent>
                                {technicians.map(tech => (
                                  <SelectItem key={tech.id} value={tech.id} className="text-xs">{tech.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button onClick={() => handleAssign(order.id)} disabled={isPending} size="sm" className="h-9 bg-blue-600 text-xs px-3">
                              {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Kirim"}
                            </Button>
                          </div>
                        )}

                        {order.status === "COMPLETED" && (
                          <div className="flex items-center gap-3 w-full">
                            {order.completionPhotoUrl && (
                              <div className="w-9 h-9 relative rounded border border-slate-100 overflow-hidden shrink-0">
                                <Image src={order.completionPhotoUrl} alt="Bukti" fill className="object-cover" />
                              </div>
                            )}
                            <Button onClick={() => handleApprove(order.id)} disabled={isPending} size="sm" className="h-9 bg-emerald-600 text-[11px] flex-1">
                              {isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : "ACC Pembayaran"}
                            </Button>
                          </div>
                        )}

                        {order.technician && order.status !== "PENDING" && (
                          <div className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md border border-slate-100">
                              <User className="w-3 h-3 text-blue-500" />
                              <span className="text-[10px] font-bold text-slate-600 uppercase">Teknisi: {order.technician.name.split(" ")[0]}</span>
                            </div>
                            {order.status === "APPROVED" && <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-100 bg-emerald-50/50">Lunas</Badge>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
