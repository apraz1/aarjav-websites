import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, TrendingUp, ShieldCheck, Building, Users, Award, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

interface HeroProps {
  onNavigate: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  isLoggedIn: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenAuth, isLoggedIn }) => {
  return (
    <section className="relative overflow-hidden bg-[#0B0D12] pt-14 pb-24 border-b border-[#D4AF37]/20">
      {/* Luxury Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle fine geometric grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto space-y-7">
          {/* Logo Showcase Banner Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37]/15 via-[#D4AF37]/10 to-[#D4AF37]/5 border border-[#D4AF37]/30 text-xs font-semibold text-[#F7E19C] tracking-wide uppercase shadow-sm"
          >
            <Logo variant="mark" size="xs" />
            <span>Official Institutional Mortgage & DSA Network</span>
          </motion.div>

          {/* Main Display Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]"
          >
            Empower Your Loan Distribution with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D0] via-[#E5BF5A] to-[#BA8B24]">
              Finstant Capital
            </span>
          </motion.h1>

          {/* Subtitle with High-Contrast Typography */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto"
          >
            Partner with <strong className="text-[#F5D374] font-semibold">Finstant Capital</strong> to scale your financial practice.
            Equipping DSAs, chartered accountants, wealth managers, and real estate developers with direct multi-bank rate
            comparators, instant eligibility engines, and automated transparent commission payouts.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3"
          >
            <button
              id="hero-compare-btn"
              onClick={() => onNavigate('comparator')}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#FCE59F] via-[#D4AF37] to-[#B58622] hover:brightness-110 text-slate-950 font-bold rounded-xl shadow-[0_4px_25px_rgba(212,175,55,0.35)] transition-all flex items-center justify-center gap-2"
            >
              <span>Compare Live Bank Rates</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {isLoggedIn ? (
              <button
                id="hero-portal-btn"
                onClick={() => onNavigate('portal')}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#141720] hover:bg-[#1B202D] text-[#F3CD74] font-semibold rounded-xl border border-[#D4AF37]/35 shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Go to Partner CRM</span>
              </button>
            ) : (
              <button
                id="hero-partner-btn"
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#141720] hover:bg-[#1B202D] text-[#F3CD74] font-semibold rounded-xl border border-[#D4AF37]/35 shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Join as Channel Partner</span>
              </button>
            )}

            <button
              id="hero-ai-btn"
              onClick={() => onNavigate('ai')}
              className="w-full sm:w-auto px-5 py-3.5 text-slate-300 hover:text-[#F3CD74] font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Ask Finstant AI</span>
            </button>
          </motion.div>

          {/* Value pillars in luxury dark card styling */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="p-5 bg-[#12151E]/90 rounded-2xl border border-[#D4AF37]/20 shadow-md backdrop-blur group hover:border-[#D4AF37]/50 transition-all">
              <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D0] to-[#D4AF37]">
                30+
              </div>
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-1.5">
                <Building className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Banks & NBFCs</span>
              </div>
            </div>

            <div className="p-5 bg-[#12151E]/90 rounded-2xl border border-[#D4AF37]/20 shadow-md backdrop-blur group hover:border-[#D4AF37]/50 transition-all">
              <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D0] to-[#D4AF37]">
                7.20%
              </div>
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Starting ROI</span>
              </div>
            </div>

            <div className="p-5 bg-[#12151E]/90 rounded-2xl border border-[#D4AF37]/20 shadow-md backdrop-blur group hover:border-[#D4AF37]/50 transition-all">
              <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D0] to-[#D4AF37]">
                Up to 1.25%
              </div>
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-1.5">
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Partner Commission</span>
              </div>
            </div>

            <div className="p-5 bg-[#12151E]/90 rounded-2xl border border-[#D4AF37]/20 shadow-md backdrop-blur group hover:border-[#D4AF37]/50 transition-all">
              <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D0] to-[#D4AF37]">
                ₹450 Cr+
              </div>
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-1.5">
                <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Disbursed Volume</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
