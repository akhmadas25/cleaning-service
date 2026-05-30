import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SatSet Cleaning — Layanan Kebersihan Profesional",
  description:
    "Pesan layanan kebersihan rumah dan kantor profesional. Dinilai 4.9/5 oleh lebih dari 10.000 pelanggan yang puas. Tersedia di hari yang sama.",
};

const ctaFeatures = [
  "Tanpa kontrak terikat",
  "Profesional berasuransi",
  "Kepuasan terjamin",
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        <TestimonialsSection />

        {/* CTA Section */}
        <section
          id="contact"
          className="py-24 bg-gradient-to-br from-blue-600 to-cyan-600 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div
              style={{
                backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
              className="w-full h-full"
            />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Siap untuk Rumah yang Lebih Bersih?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Pesan pembersihan pertama Anda hari ini dan dapatkan diskon 20%. Bergabunglah dengan ribuan pelanggan yang puas.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              {ctaFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2 text-white/90 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <Link 
              href="/register"
              className="inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-white text-blue-600 hover:bg-blue-50 shadow-xl font-semibold h-12 px-8 text-base"
            >
              Pesan Sekarang — Diskon 20% Untuk Pertama Kali
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
