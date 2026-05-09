import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Pemilik Rumah",
    initials: "SM",
    rating: 5,
    text: "CleanPro mengubah rumah saya. Timnya profesional, teliti, dan sangat ramah. Saya selalu pulang ke rumah yang tanpa noda — saya sangat senang!",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "James Okafor",
    role: "Manajer Kantor",
    initials: "JO",
    rating: 5,
    text: "Kami beralih ke CleanPro untuk pembersihan kantor enam bulan lalu dan perbedaannya luar biasa. Timnya dapat diandalkan, efisien, dan memperhatikan setiap detail.",
    color: "bg-violet-100 text-violet-700",
  },
  {
    name: "Priya Sharma",
    role: "Tuan Tanah",
    initials: "PS",
    rating: 5,
    text: "Layanan pembersihan pindah rumah mereka luar biasa! Properti sewaan saya berkilau, membuatnya mudah untuk mendapatkan penyewa baru dengan cepat. Sangat direkomendasikan untuk semua tuan tanah.",
    color: "bg-green-100 text-green-700",
  },
  {
    name: "Tom Reynolds",
    role: "Pemilik Rumah",
    initials: "TR",
    rating: 5,
    text: "Tim pembersihan menyeluruh melakukan pekerjaan yang luar biasa. Mereka menjangkau tempat-tempat yang bahkan tidak saya pikirkan. Rumah terasa seperti baru. Pasti akan pesan lagi!",
    color: "bg-orange-100 text-orange-700",
  },
  {
    name: "Lena Chen",
    role: "Pemilik Restoran",
    initials: "LC",
    rating: 5,
    text: "Sebagai pemilik restoran, kebersihan adalah segalanya. CleanPro memahaminya. Tim komersial mereka cepat, teliti, dan selalu menghormati jam bisnis kami.",
    color: "bg-rose-100 text-rose-700",
  },
  {
    name: "Daniel Brooks",
    role: "Pengembang Properti",
    initials: "DB",
    rating: 5,
    text: "Pembersihan pasca renovasi selalu menjadi mimpi buruk — kecuali jika Anda memanggil CleanPro. Mereka menangani kompleks 12 unit kami dengan sempurna. Akan menggunakan mereka di setiap proyek.",
    color: "bg-cyan-100 text-cyan-700",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Cerita Pelanggan
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Apa Kata Klien Kami
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Jangan hanya percaya kata-kata kami — inilah pengalaman pelanggan kami yang puas.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card
              key={t.name}
              className="border-0 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white"
            >
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-blue-100 mb-4 fill-blue-100" />
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className={`text-xs font-bold ${t.color}`}>
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
