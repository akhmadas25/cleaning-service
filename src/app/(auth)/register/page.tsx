import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Buat Akun — CleanPro",
  description: "Buat akun CleanPro gratis dan pesan pembersihan profesional pertama Anda hari ini.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00c6ff] to-[#0072ff] relative overflow-hidden flex items-center justify-center p-4 py-12">
      {/* Background decoration - Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-16 h-16 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm shadow-[inset_0_0_20px_rgba(255,255,255,0.5)]" />
        <div className="absolute top-[5%] right-[20%] w-8 h-8 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm shadow-[inset_0_0_10px_rgba(255,255,255,0.5)]" />
        <div className="absolute bottom-[20%] left-[5%] w-24 h-24 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm shadow-[inset_0_0_30px_rgba(255,255,255,0.5)]" />
        <div className="absolute top-[40%] right-[5%] w-32 h-32 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm shadow-[inset_0_0_40px_rgba(255,255,255,0.5)]" />
        <div className="absolute -bottom-10 left-0 right-0 h-32 bg-white/20 blur-3xl rounded-[100%]" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <RegisterForm />
      </div>
    </div>
  );
}
