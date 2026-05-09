"use client";

import { useState, useTransition } from "react";
import { assignTechnician, approvePayment } from "@/lib/actions/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface AdminOrderListProps {
  orders: any[];
  technicians: { id: string; name: string; email: string }[];
}

export function AdminOrderList({ orders, technicians }: AdminOrderListProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedTechs, setSelectedTechs] = useState<Record<string, string>>({});

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

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <Card key={order.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{order.serviceType}</h3>
                    <p className="text-sm text-slate-500">
                      Pemesan: {order.name} ({order.phone})
                    </p>
                  </div>
                  <Badge>{order.status}</Badge>
                </div>
                
                <p className="text-sm text-slate-700 mb-2"><strong>Alamat:</strong> {order.address}</p>
                <div className="flex gap-4 mb-4">
                  <p className="text-sm text-slate-700">
                    <strong>Estimasi:</strong> Rp {order.initialPrice?.toLocaleString('id-ID')}
                  </p>
                  {order.finalPrice && (
                    <p className="text-sm font-bold text-blue-600">
                      <strong>Final:</strong> Rp {order.finalPrice?.toLocaleString('id-ID')}
                    </p>
                  )}
                </div>

                {order.status === "PENDING" && (
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                    <Select onValueChange={(val) => setSelectedTechs(prev => ({...prev, [order.id]: val}))}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Pilih Teknisi" />
                      </SelectTrigger>
                      <SelectContent>
                        {technicians.map(tech => (
                          <SelectItem key={tech.id} value={tech.id}>{tech.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={() => handleAssign(order.id)} disabled={isPending}>
                      {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Tugaskan"}
                    </Button>
                  </div>
                )}

                {order.status === "COMPLETED" && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4 items-center">
                    {order.completionPhotoUrl && (
                      <div className="w-32 h-32 relative rounded border overflow-hidden">
                        <Image src={order.completionPhotoUrl} alt="Bukti" fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm mb-2">Pekerjaan telah selesai. Teknisi menunggu persetujuan pembayaran.</p>
                      <Button onClick={() => handleApprove(order.id)} disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Terima Pembayaran"}
                      </Button>
                    </div>
                  </div>
                )}
                
                {order.technician && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm"><strong>Teknisi Ditugaskan:</strong> {order.technician.name}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
