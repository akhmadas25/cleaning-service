import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Building2,
  Sparkles,
  MoveRight,
  Wind,
  Car,
} from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Pembersihan Rumah",
    description:
      "Pembersihan interior rutin termasuk vakum, pel, membersihkan debu, dan sanitasi seluruh permukaan.",
    color: "from-blue-500 to-blue-600",
    badge: "Paling Populer",
    price: "Mulai Rp 80.000",
  },
  {
    icon: Building2,
    title: "Pembersihan Kantor",
    description:
      "Jaga produktivitas dan kebersihan ruang kerja Anda dengan pembersihan komersial profesional kami.",
    color: "from-violet-500 to-violet-600",
    badge: null,
    price: "Mulai Rp 120.000",
  },
  {
    icon: Sparkles,
    title: "Pembersihan Menyeluruh",
    description:
      "Pembersihan menyeluruh dari atas ke bawah untuk setiap sudut, perabotan, dan permukaan tersembunyi.",
    color: "from-cyan-500 to-cyan-600",
    badge: "Direkomendasikan",
    price: "Mulai Rp 200.000",
  },
  {
    icon: MoveRight,
    title: "Pindah Rumah",
    description:
      "Buat transisi Anda bebas stres dengan pembersihan properti lengkap untuk tuan tanah dan penyewa.",
    color: "from-orange-500 to-orange-600",
    badge: null,
    price: "Mulai Rp 180.000",
  },
  {
    icon: Wind,
    title: "Pasca Renovasi",
    description:
      "Hilangkan debu dan puing konstruksi, biarkan ruang yang direnovasi tanpa noda dan siap digunakan.",
    color: "from-green-500 to-green-600",
    badge: null,
    price: "Mulai Rp 250.000",
  },
  {
    icon: Car,
    title: "Cuci Eksterior",
    description:
      "Cuci tekanan tinggi untuk jalan masuk, teras, dan fasad untuk meningkatkan daya tarik properti Anda.",
    color: "from-rose-500 to-rose-600",
    badge: null,
    price: "Mulai Rp 100.000",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Apa yang Kami Tawarkan
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Layanan Kebersihan Kami
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Dari kerapian rutin hingga pembersihan mendalam yang intensif, kami memiliki layanan yang tepat untuk menjaga ruangan Anda tetap bersih.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.title}
                className="group border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-md`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {service.badge && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-blue-50 text-blue-700 border-blue-100"
                      >
                        {service.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-semibold text-sm">
                      {service.price}
                    </span>
                    <button className="text-xs font-medium text-slate-400 hover:text-blue-600 transition-colors group-hover:text-blue-600">
                      Pelajari lebih lanjut →
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
