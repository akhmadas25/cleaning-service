/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#00c6ff] to-[#0072ff] pt-20">
      {/* Animated background bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[5%] w-16 h-16 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm shadow-[inset_0_0_20px_rgba(255,255,255,0.7)]" />
        <div className="absolute top-[5%] left-[30%] w-8 h-8 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm shadow-[inset_0_0_10px_rgba(255,255,255,0.7)]" />
        <div className="absolute bottom-[20%] left-[15%] w-24 h-24 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm shadow-[inset_0_0_30px_rgba(255,255,255,0.7)]" />
        <div className="absolute top-[35%] right-[40%] w-12 h-12 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm shadow-[inset_0_0_30px_rgba(255,255,255,0.7)]" />
        <div className="absolute top-[10%] right-[10%] w-20 h-20 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm shadow-[inset_0_0_40px_rgba(255,255,255,0.7)]" />
        <div className="absolute bottom-[30%] right-[5%] w-14 h-14 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm shadow-[inset_0_0_40px_rgba(255,255,255,0.7)]" />
        <div className="absolute -bottom-10 left-0 right-0 h-32 bg-white/30 blur-3xl rounded-[100%]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left space-y-6 pt-10">
            <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-extrabold text-white leading-[1.1] tracking-tight uppercase">
              <span className="text-[#FFD700] block">Layanan</span>
              Kebersihan
              <br />
              Berkualitas
            </h1>

            <p className="text-lg text-white/90 max-w-md leading-relaxed">
              Kami menyediakan layanan kebersihan profesional dengan tim yang handal dan terpercaya untuk menjaga kebersihan dan kenyamanan tempat Anda.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/register"
                className="inline-flex items-center justify-center bg-[#002266] hover:bg-[#001133] text-white rounded-full px-10 h-14 text-lg font-semibold transition-colors"
              >
                Pesan Sekarang
              </Link>
              <Link 
                href="#services"
                className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white/10 rounded-full px-10 h-14 text-lg font-semibold bg-transparent transition-colors"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
            
            {/* Dots */}
            <div className="flex gap-2 pt-6">
              <div className="w-2 h-2 rounded-full bg-[#002266]" />
              <div className="w-2 h-2 rounded-full bg-white" />
              <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
              <div className="w-2 h-2 rounded-full bg-[#002266]" />
              <div className="w-2 h-2 rounded-full bg-[#002266]" />
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="relative h-[600px] hidden lg:block">
            {/* Main large circle */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border-[12px] border-[#FFD700] overflow-hidden bg-white z-10 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop" 
                alt="Cleaning technician" 
                className="w-full h-full object-cover object-center"
              />
            </div>
            
            {/* Top small circle */}
            <div className="absolute right-[320px] top-[40px] w-[200px] h-[200px] rounded-full border-[10px] border-[#FFD700] overflow-hidden bg-white z-20 shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=400&auto=format&fit=crop" 
                alt="Cleaning surface" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom medium circle */}
            <div className="absolute right-[280px] bottom-[50px] w-[260px] h-[260px] rounded-full border-[10px] border-[#FFD700] overflow-hidden bg-white z-20 shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=500&auto=format&fit=crop" 
                alt="Mopping floor" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave transition for fluid progression to white */}
      <div className="absolute bottom-0 left-0 right-0 w-full z-20 overflow-hidden leading-[0]">
        <svg viewBox="0 0 1440 120" className="relative block w-full h-[60px] md:h-[120px]" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,64L80,74.7C160,85,320,107,480,106.7C640,107,800,85,960,80C1120,75,1280,85,1360,90.7L1440,96L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            fill="#ffffff"
          ></path>
        </svg>
      </div>
    </section>
  );
}
