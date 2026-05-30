import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sparkles,
  LayoutDashboard,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  UserPlus,
  Mail,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { logoutUser } from "@/lib/actions/auth";
import { AddTechnicianModal } from "@/components/admin/AddTechnicianModal";
import { EditTechnicianModal } from "@/components/admin/EditTechnicianModal";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Kelola Teknisi — CleanPro Admin",
};

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: ClipboardList, label: "Semua Pesanan", href: "/admin/orders" },
  { icon: Users, label: "Kelola Teknisi", href: "/admin/technicians" },
];

export default async function AdminTechniciansPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const technicians = await prisma.user.findMany({
    where: { role: "TECHNICIAN" },
    select: { id: true, name: true, email: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const userInitials = session.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar (Same as Admin Dashboard) */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col z-40 hidden lg:flex">
        <div className="px-6 py-5 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              CleanPro<span className="text-blue-400">.</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {sidebarLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.label === "Kelola Teknisi"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
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

      <div className="lg:pl-64 flex-1">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">Kelola Teknisi</h1>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-none">
                {session.user?.name}
              </p>
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                Administrator
              </p>
            </div>
            <Avatar className="w-9 h-9 border border-slate-100">
              <AvatarFallback className="bg-slate-900 text-white text-xs font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-800">
              Daftar Teknisi
            </h2>
            <AddTechnicianModal />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {technicians.length === 0 ? (
              <p className="text-slate-500 text-sm italic col-span-full text-center py-10 bg-white rounded-xl border border-dashed">
                Belum ada teknisi terdaftar.
              </p>
            ) : (
              technicians.map((tech) => (
                <Card
                  key={tech.id}
                  className="border-0 shadow-sm overflow-hidden group"
                >
                  <CardHeader className="pb-2 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        {tech.name[0]}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold">
                          {tech.name}
                        </CardTitle>
                        <Badge className="text-[10px] h-4 bg-slate-200 text-slate-700">
                          TEKNISI
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Mail className="w-3.5 h-3.5" /> {tech.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Shield className="w-3.5 h-3.5" /> Terdaftar:{" "}
                      {new Date(tech.createdAt).toLocaleDateString("id-ID")}
                    </div>
                    <div className="pt-2 flex gap-2">
                      <EditTechnicianModal technician={tech} />
                      <button className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
