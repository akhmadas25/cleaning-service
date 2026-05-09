"use client";

import { useState, useTransition } from "react";
import { updateTaskStatus, completeTask } from "@/lib/actions/technician";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin, Phone, Play, CheckCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/common/ImageUpload";
import Image from "next/image";
import { TechnicianLocationTracker } from "@/components/technician/TechnicianLocationTracker";
import dynamic from "next/dynamic";

const OrderMapPreview = dynamic(() => import("@/components/common/OrderMapPreview"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-50 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-slate-300" /></div>
});

export function TechnicianTaskList({ tasks }: { tasks: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [completionData, setCompletionData] = useState<Record<string, { finalPrice: number, photo: string }>>({});

  const handleStatusUpdate = (orderId: string, status: "ON_THE_WAY" | "IN_PROGRESS" | "CANCELLED") => {
    startTransition(async () => {
      const result = await updateTaskStatus(orderId, status);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  };

  const handleComplete = (orderId: string) => {
    const data = completionData[orderId];
    if (!data?.finalPrice || !data?.photo) {
      toast.error("Harap masukkan harga final dan unggah foto bukti.");
      return;
    }
    
    startTransition(async () => {
      const result = await completeTask(orderId, data.finalPrice, data.photo);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  };

  const updateCompletionData = (orderId: string, field: 'finalPrice' | 'photo', value: any) => {
    setCompletionData(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value
      }
    }));
  };

  const statusColors: Record<string, string> = {
    ASSIGNED: "bg-blue-100 text-blue-700 border-blue-200",
    ON_THE_WAY: "bg-indigo-100 text-indigo-700 border-indigo-200",
    IN_PROGRESS: "bg-purple-100 text-purple-700 border-purple-200",
    COMPLETED: "bg-green-100 text-green-700 border-green-200",
    APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className="space-y-6">
      {tasks.length === 0 ? (
        <Card className="text-center py-16 bg-white border-dashed border-2">
          <p className="text-slate-400">Belum ada tugas yang ditugaskan kepada Anda.</p>
        </Card>
      ) : (
        tasks.map(task => (
          <Card key={task.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all">
            <TechnicianLocationTracker orderId={task.id} isActive={task.status === "ON_THE_WAY"} />
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-56 h-56 relative shrink-0 overflow-hidden bg-slate-100">
                  {task.latitude && task.longitude ? (
                    <OrderMapPreview lat={task.latitude} lng={task.longitude} />
                  ) : task.customerPhotoUrl ? (
                    <Image src={task.customerPhotoUrl} alt="Kondisi" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-10 h-10 text-slate-300" />
                    </div>
                  )}

                  {/* Floating Open Map Button */}
                  {task.latitude && task.longitude && (
                    <a 
                      href={`https://www.google.com/maps?q=${task.latitude},${task.longitude}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 z-20 p-2 bg-white/90 backdrop-blur rounded-xl shadow-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Badge className={`text-[10px] uppercase font-bold px-2 py-0.5 border ${statusColors[task.status]}`}>
                        {task.status}
                      </Badge>
                      <h3 className="font-black text-xl text-slate-900 mt-1">{task.serviceType}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Estimasi</p>
                      <p className="text-lg font-black text-blue-600">Rp {task.initialPrice?.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] uppercase">P</span>
                        {task.name}
                      </p>
                      <p className="text-sm text-slate-500 flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-blue-500" /> {task.phone}
                      </p>
                    </div>
                    <p className="text-sm text-slate-500 flex items-start gap-2 bg-slate-50 p-3 rounded-xl">
                      <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> {task.address}
                    </p>
                  </div>

                  {/* Actions based on status */}
                  {task.status === "ASSIGNED" && (
                    <div className="flex gap-3 pt-4 border-t">
                      <Button onClick={() => handleStatusUpdate(task.id, "ON_THE_WAY")} disabled={isPending} className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 rounded-xl font-bold shadow-lg shadow-blue-100">
                        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Mulai Berangkat (Otw)"}
                      </Button>
                    </div>
                  )}

                  {task.status === "ON_THE_WAY" && (
                    <div className="flex gap-3 pt-4 border-t">
                      <div className="flex-1 space-y-3">
                        <div className="bg-blue-50 text-blue-700 p-3 rounded-xl text-xs flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                          Pelanggan sedang melacak lokasi Anda secara realtime.
                        </div>
                        <Button onClick={() => handleStatusUpdate(task.id, "IN_PROGRESS")} disabled={isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl font-bold shadow-lg shadow-indigo-100">
                          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <> <Play className="w-4 h-4 mr-2" /> Sampai & Mulai Kerja </>}
                        </Button>
                      </div>
                    </div>
                  )}

                  {task.status === "IN_PROGRESS" && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-5">
                        <h4 className="font-black text-slate-900 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" /> Selesaikan Tugas
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Harga Final (Rp)</label>
                            <Input 
                              type="number" 
                              className="h-11 rounded-xl"
                              defaultValue={task.initialPrice || 0}
                              onChange={(e) => updateCompletionData(task.id, 'finalPrice', Number(e.target.value))}
                              placeholder="Harga final"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Foto Bukti</label>
                            <ImageUpload 
                              value={completionData[task.id]?.photo ? [completionData[task.id].photo] : []}
                              onChange={(url) => updateCompletionData(task.id, 'photo', url)}
                              onRemove={() => updateCompletionData(task.id, 'photo', '')}
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button 
                            onClick={() => handleComplete(task.id)} 
                            disabled={isPending} 
                            className="flex-1 bg-green-600 hover:bg-green-700 h-12 rounded-xl font-bold shadow-lg shadow-green-100"
                          >
                            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Konfirmasi Selesai"}
                          </Button>
                          <Button 
                            onClick={() => handleStatusUpdate(task.id, "CANCELLED")} 
                            disabled={isPending} 
                            variant="destructive"
                            className="h-12 px-6 rounded-xl font-bold"
                          >
                            Batal
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {(task.status === "COMPLETED" || task.status === "APPROVED") && (
                    <div className="mt-4 pt-4 border-t flex gap-4">
                      {task.completionPhotoUrl && (
                        <div className="w-24 h-24 relative rounded overflow-hidden">
                          <Image src={task.completionPhotoUrl} alt="Bukti" fill className="object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm"><strong>Harga Final:</strong> Rp {task.finalPrice?.toLocaleString('id-ID')}</p>
                        <p className="text-sm text-green-600 font-medium mt-1">Tugas Selesai!</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
