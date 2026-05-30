/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Sparkles, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  Layanan: [
    { label: "Pembersihan Rumah", href: "#" },
    { label: "Pembersihan Kantor", href: "#" },
    { label: "Pembersihan Menyeluruh", href: "#" },
    { label: "Pembersihan Pindah Rumah", href: "#" },
  ],
  Perusahaan: [
    { label: "Tentang Kami", href: "#about" },
    { label: "Tim Kami", href: "#" },
    { label: "Karir", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Legal: [
    { label: "Kebijakan Privasi", href: "#" },
    { label: "Syarat & Ketentuan", href: "#" },
    { label: "Kebijakan Cookie", href: "#" },
  ],
};

const socials = [
  { icon: Sparkles, iconName: "Facebook", href: "#", label: "Facebook" },
  { icon: Sparkles, iconName: "Instagram", href: "#", label: "Instagram" },
  { icon: Sparkles, iconName: "Sparkles", href: "#", label: "Twitter" },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/logo.jpeg"
                alt="SatSet Cleaning Logo"
                className="w-8 h-8 rounded-lg object-cover bg-white"
              />
              <span className="font-bold text-lg text-white tracking-tight">
                SatSet Cleaning<span className="text-blue-400">.</span>
              </span>
            </Link>
            <p className="text-lg leading-relaxed mb-6 max-w-xs">
              Layanan kebersihan profesional yang membuat ruangan Anda berkilau.
              Dipercaya oleh ribuan pelanggan yang puas.
            </p>
            <div className="flex flex-col gap-2 text-lg mb-6">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>cleaningsatset@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+62 813-3741-8441</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Jl. KH Abu Su&apos;ud Sutapranan, Dukuhturi, Tegal</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold text-lg mb-4">
                {category}
              </h3>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-lg hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-base">
            © {new Date().getFullYear()} SatSet Cleaning. Hak Cipta Dilindungi.
          </p>
          <p className="text-base">
            Dibuat dengan ❤️ untuk dunia yang lebih bersih.
          </p>
        </div>
      </div>
    </footer>
  );
}
