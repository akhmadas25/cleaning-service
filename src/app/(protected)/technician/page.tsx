import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TechnicianTaskList } from "@/components/technician/TechnicianTaskList";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sparkles, LayoutDashboard, ClipboardList,
  LogOut, Clock, CheckCircle, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { logoutUser } from "@/lib/actions/auth";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Dashboard Teknisi — SatSet Cleaning",
};

export default async function TechnicianDashboardPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "TECHNICIAN") {
    redirect("/dashboard");
  }

  const userInitials = session.user?.name
    ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const tasks = await prisma.order.findMany({
    where: { technicianId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  const pendingTasks    = tasks.filter((t) => ["ASSIGNED","ON_THE_WAY","IN_PROGRESS"].includes(t.status)).length;
  const completedTasks  = tasks.filter((t) => ["COMPLETED","APPROVED"].includes(t.status)).length;
  const cancelledTasks  = tasks.filter((t) => t.status === "CANCELLED").length;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col z-40 hidden lg:flex">
        <div className="px-6 py-5 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.jpeg" alt="SatSet Cleaning Logo" className="w-8 h-8 rounded-lg object-cover bg-white" />
            <span className="font-bold text-lg tracking-tight">
              SatSet Cleaning
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link
            href="/technician"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white"
          >
            <LayoutDashboard className="w-4 h-4" />
            Ringkasan
          </Link>
          <Link
            href="/technician"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ClipboardList className="w-4 h-4" />
            Tugas Saya
          </Link>
        </nav>

        <div className="px-4 pb-6 border-t border-slate-800 pt-4">
          <form action={logoutUser}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64 flex-1">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Dashboard Teknisi</h1>
            <p className="text-sm text-slate-500">Halo, {session.user?.name?.split(" ")[0]}!</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-none">{session.user?.name}</p>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Teknisi Lapangan</p>
            </div>
            <Avatar className="w-9 h-9 border border-slate-100">
              <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">{userInitials}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Tugas Aktif",   value: pendingTasks,   icon: Clock,        color: "text-blue-600",   bg: "bg-blue-50" },
              { label: "Selesai",       value: completedTasks, icon: CheckCircle,  color: "text-green-600",  bg: "bg-green-50" },
              { label: "Dibatalkan",    value: cancelledTasks, icon: AlertCircle,  color: "text-red-600",    bg: "bg-red-50" },
            ].map((stat) => (
              <Card key={stat.label} className="border-0 shadow-sm">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Task List */}
          <TechnicianTaskList tasks={tasks} />
        </main>
      </div>
    </div>
  );
}
