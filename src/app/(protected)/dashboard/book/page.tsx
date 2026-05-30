/* eslint-disable @next/next/no-img-element */
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { OrderForm } from "@/components/dashboard/OrderForm";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut, PlusCircle, ClipboardList } from "lucide-react";
import Link from "next/link";
import { logoutUser } from "@/lib/actions/auth";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Pesan Layanan — SatSet Cleaning",
};

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Ringkasan", href: "/dashboard/home" },
  { icon: PlusCircle,      label: "Pesan Layanan", href: "/dashboard/book" },
  { icon: ClipboardList,   label: "Pesanan Saya",  href: "/dashboard/orders" },
];

export default async function BookCleaningPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userInitials = session.user?.name
    ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.label === "Pesan Layanan" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
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
          <h1 className="text-xl font-bold text-slate-900">Pesan Layanan</h1>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-50 text-blue-700">Pelanggan</Badge>
            <Avatar className="w-9 h-9"><AvatarFallback>{userInitials}</AvatarFallback></Avatar>
          </div>
        </header>

        <main className="p-6 max-w-4xl mx-auto">
          <OrderForm />
        </main>
      </div>
    </div>
  );
}
