import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sparkles, LayoutDashboard, Calendar,
  PlusCircle, ClipboardList, LogOut, MapPin, Clock, CalendarDays,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { logoutUser } from "@/lib/actions/auth";
import { CustomerOrderList } from "@/components/dashboard/CustomerOrderList";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Pesanan Saya — CleanPro",
};

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Ringkasan", href: "/dashboard/home" },
  { icon: PlusCircle,      label: "Pesan Layanan", href: "/dashboard/book" },
  { icon: ClipboardList,   label: "Pesanan Saya",  href: "/dashboard/orders" },
];

export default async function CustomerOrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      technician: { select: { name: true } }
    }
  });

  const userInitials = session.user?.name
    ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col z-40 hidden lg:flex">
        <div className="px-6 py-5 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">CleanPro<span className="text-blue-400">.</span></span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {sidebarLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.label === "Pesanan Saya" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 pb-6 border-t border-slate-800 pt-4">
          <form action={logoutUser}><button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"><LogOut className="w-4 h-4" />Keluar</button></form>
        </div>
      </aside>

      <div className="lg:pl-64 flex-1">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">Pesanan Saya</h1>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-none">{session.user?.name}</p>
              <p className="text-[10px] text-slate-400 font-medium">Pelanggan</p>
            </div>
            <Avatar className="w-9 h-9 border border-slate-100">
              <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">{userInitials}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="p-6">
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed shadow-sm">
              <p className="text-slate-500 mb-6">Anda belum memiliki pesanan.</p>
              <Link href="/dashboard/book" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                Pesan Sekarang
              </Link>
            </div>
          ) : (
            <CustomerOrderList orders={orders} />
          )}
        </main>
      </div>
    </div>
  );
}
