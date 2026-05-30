import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sparkles, LayoutDashboard, Calendar,
  Settings, LogOut, Home, TrendingUp, ClipboardList, PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { logoutUser } from "@/lib/actions/auth";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Dashboard Pelanggan — SatSet Cleaning",
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  PENDING:    { label: "Menunggu Konfirmasi", color: "bg-yellow-50 text-yellow-700 border-yellow-100" },
  ASSIGNED:   { label: "Teknisi Ditugaskan",  color: "bg-blue-50 text-blue-700 border-blue-100" },
  ON_THE_WAY: { label: "Teknisi Dalam Perjalanan", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  IN_PROGRESS:{ label: "Sedang Dikerjakan",   color: "bg-purple-50 text-purple-700 border-purple-100" },
  COMPLETED:  { label: "Selesai",             color: "bg-green-50 text-green-700 border-green-100" },
  CANCELLED:  { label: "Dibatalkan",          color: "bg-red-50 text-red-700 border-red-100" },
  APPROVED:   { label: "Pembayaran Disetujui",color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
};

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Ringkasan", href: "/dashboard/home" },
  { icon: PlusCircle,      label: "Pesan Layanan", href: "/dashboard/book" },
  { icon: ClipboardList,   label: "Pesanan Saya",  href: "/dashboard/orders" },
];

export default async function CustomerDashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user?.role === "ADMIN") redirect("/admin");
  if (session.user?.role === "TECHNICIAN") redirect("/technician");

  const userInitials = session.user?.name
    ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const totalOrders   = orders.length;
  const activeOrders  = orders.filter((o) => !["COMPLETED","CANCELLED","APPROVED"].includes(o.status)).length;
  const doneOrders    = orders.filter((o) => ["COMPLETED","APPROVED"].includes(o.status)).length;

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
              key={item.href}
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
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Dasbor</h1>
            <p className="text-sm text-slate-500">Selamat datang, {session.user?.name?.split(" ")[0]}!</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-none">{session.user?.name}</p>
              <p className="text-[10px] text-blue-600 font-medium">Pelanggan</p>
            </div>
            <Avatar className="w-9 h-9 border border-slate-100">
              <AvatarFallback className="bg-blue-600 text-white text-sm font-bold">
                {userInitials ?? "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Pesanan", value: totalOrders, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Pesanan Aktif", value: activeOrders, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
              { label: "Selesai", value: doneOrders, icon: Home, color: "text-purple-600", bg: "bg-purple-50" },
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

          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-5 px-5">
              <h2 className="font-semibold text-slate-900">Aksi Cepat</h2>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/dashboard/book"
                  className="flex flex-col items-center gap-2 p-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors text-center text-white"
                >
                  <PlusCircle className="w-7 h-7" />
                  <span className="text-sm font-semibold">Pesan Layanan Baru</span>
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="flex flex-col items-center gap-2 p-5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-center"
                >
                  <ClipboardList className="w-7 h-7 text-slate-600" />
                  <span className="text-sm font-semibold text-slate-700">Lihat Semua Pesanan</span>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-5 px-5 flex flex-row items-center justify-between">
              <h2 className="font-semibold text-slate-900">Pesanan Terakhir</h2>
              <Link href="/dashboard/orders" className="text-xs text-blue-600 hover:underline">Lihat semua</Link>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              {orders.length === 0 ? (
                <div className="py-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <Calendar className="w-7 h-7 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-sm mb-4">Belum ada pesanan.</p>
                  <Link
                    href="/dashboard/book"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Pesan Sekarang
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {orders.map((order) => {
                    const s = STATUS_LABEL[order.status] ?? { label: order.status, color: "bg-slate-50 text-slate-600" };
                    return (
                      <div key={order.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 text-sm">{order.serviceType}</p>
                          <p className="text-xs text-slate-500 truncate">{order.address}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <Badge variant="outline" className={`shrink-0 text-xs ${s.color}`}>
                          {s.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
