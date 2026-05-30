/* eslint-disable @next/next/no-img-element */
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminOrderList } from "@/components/admin/AdminOrderList";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard, ClipboardList,
  Users, Settings, LogOut, DollarSign, Clock, CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { logoutUser } from "@/lib/actions/auth";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin Dashboard — SatSet Cleaning",
};

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: ClipboardList,   label: "Semua Pesanan", href: "/admin/orders" },
  { icon: Users,           label: "Kelola Teknisi", href: "/admin/technicians" },
  { icon: Settings,        label: "Atur Harga", href: "/admin/pricing" },
];

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const userInitials = session.user?.name
    ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const [orders, techData] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        technician: { select: { name: true, email: true } },
        items: true
      },
    }),
    prisma.user.findMany({
      where: { role: "TECHNICIAN" },
      select: { id: true, name: true, email: true },
    }),
  ]);

  const pendingCount   = orders.filter((o) => o.status === "PENDING").length;
  const activeCount    = orders.filter((o) => ["ASSIGNED","ON_THE_WAY","IN_PROGRESS"].includes(o.status)).length;
  const completedCount = orders.filter((o) => ["COMPLETED","APPROVED"].includes(o.status)).length;

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
          {sidebarLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
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
            <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-500">Halo, {session.user?.name?.split(" ")[0]}!</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-none">{session.user?.name}</p>
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Administrator</p>
            </div>
            <Avatar className="w-9 h-9 border border-slate-100">
              <AvatarFallback className="bg-slate-900 text-white text-xs font-bold">
                {userInitials ?? "A"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Menunggu Konfirmasi", value: pendingCount, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
              { label: "Sedang Berjalan",     value: activeCount,  icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Selesai",             value: completedCount, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
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

          {/* Order List */}
          <AdminOrderList orders={orders} technicians={techData} />
        </main>
      </div>
    </div>
  );
}
