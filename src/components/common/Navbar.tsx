/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";

const navLinks = [
  { href: "/", label: "Beranda", isHome: true },
  { href: "#about", label: "Tentang" },
  { href: "#services", label: "Layanan" },
  { href: "#testimonials", label: "Testimoni" },
  { href: "#contact", label: "Hubungi Kami" },
];

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userInitials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.jpeg" alt="SatSet Cleaning Logo" className="w-10 h-10 rounded-md object-cover bg-white" />
            <span className="font-extrabold text-xl text-white tracking-widest uppercase">
              SatSet Cleaning
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg font-semibold transition-colors ${
                  link.isHome
                    ? "text-[#FFD700] hover:text-yellow-300"
                    : "text-white hover:text-white/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-full hover:bg-slate-100 pl-1 pr-3 py-1 transition-colors">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={session.user?.image ?? ""} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold">
                      {userInitials ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-slate-700">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dasbor
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut({ redirect: false });
                      window.location.href = "/";
                    }}
                    className="text-red-600 focus:text-red-600 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center text-white hover:text-white/80 text-lg font-semibold transition-colors px-4 py-2 rounded-md hover:bg-white/10"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center bg-[#002266] hover:bg-[#001133] text-white rounded-full font-semibold px-6 h-10 text-lg transition-colors"
                >
                  Mulai
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 px-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-100">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="py-2 px-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dasbor
                  </Link>
                  <button
                    onClick={async () => {
                      setMobileOpen(false);
                      await signOut({ redirect: false });
                      window.location.href = "/";
                    }}
                    className="py-2 px-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 text-left"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 h-10 px-4 text-base font-medium transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center justify-center rounded-md bg-[#002266] hover:bg-[#001133] text-white h-10 px-4 text-base font-medium transition-colors"
                  >
                    Mulai
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
