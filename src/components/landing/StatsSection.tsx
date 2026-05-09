import { Users, Star, Home, Award } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Pelanggan Puas",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Star,
    value: "4.9 / 5",
    label: "Rata-rata Penilaian",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  {
    icon: Home,
    value: "50,000+",
    label: "Pembersihan Selesai",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Award,
    value: "8 Tahun",
    label: "Beroperasi",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-1 tabular-nums">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
