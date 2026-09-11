import React, { useState } from 'react';
import { UserCircle, LogOut, ArrowRight, ShieldCheck, Sparkles, Menu, X } from 'lucide-react';
import { User } from '../types';
import { Logo } from './Logo';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Overview' },
    { id: 'comparator', label: 'Bank Rate Cards' },
    { id: 'products', label: 'Mortgage Solutions' },
    { id: 'calculators', label: 'EMI Engine' },
    { id: 'ai', label: 'Finstant AI', badge: 'Active' },
    { id: 'contact', label: 'Desk Inquiries' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0D12]/90 backdrop-blur-xl border-b border-[#D4AF37]/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Official Brand Logo from User Image */}
          <div
            className="cursor-pointer group flex items-center transition-transform active:scale-95"
            onClick={() => handleNavClick('home')}
          >
            <Logo variant="horizontal" size="md" showTagline={true} />
          </div>

          {/* Desktop Nav Links with Gold Active Highlights */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#12151D]/80 p-1.5 rounded-2xl border border-white/5 shadow-inner">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#FCE59F] bg-gradient-to-b from-[#D4AF37]/25 to-[#D4AF37]/10 border border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#D4AF37]/20 text-[#F5D478] border border-[#D4AF37]/40">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Auth or Partner Portal Button */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  id="header-portal-btn"
                  onClick={() => handleNavClick('portal')}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl border flex items-center gap-2 transition-all shadow-xs ${
                    activeTab === 'portal'
                      ? 'bg-gradient-to-r from-[#DFBA58] to-[#B38724] text-slate-950 font-bold border-[#FCE59F] shadow-[0_0_20px_rgba(212,175,55,0.35)]'
                      : 'bg-[#151822] text-[#F3CD74] border-[#D4AF37]/30 hover:border-[#D4AF37]/60 hover:bg-[#1C212E]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Partner Portal</span>
                </button>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-[#151822] border border-white/5 px-3 py-2 rounded-xl">
                  <UserCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span className="max-w-[120px] truncate">{currentUser.name}</span>
                </div>
                <button
                  id="header-logout-btn"
                  onClick={onLogout}
                  title="Log out"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  id="header-signin-btn"
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/5 rounded-xl border border-white/10 transition-colors"
                >
                  Partner Sign In
                </button>
                <button
                  id="header-register-btn"
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#F7E19C] via-[#D4AF37] to-[#B28420] hover:brightness-110 rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-all flex items-center gap-1.5"
                >
                  <span>Empanel As Partner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white bg-[#151822] border border-[#D4AF37]/20 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D1017] border-b border-[#D4AF37]/20 px-4 py-5 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`p-2.5 text-xs font-semibold rounded-xl text-left transition-colors flex items-center justify-between ${
                  activeTab === item.id
                    ? 'text-[#FCE59F] bg-[#D4AF37]/15 border border-[#D4AF37]/40'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1 bg-[#D4AF37]/20 text-[#F5D478] rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => handleNavClick('portal')}
                  className="w-full py-2.5 text-xs font-bold bg-[#D4AF37] text-slate-950 rounded-xl text-center"
                >
                  Partner Portal ({currentUser.name})
                </button>
                <button
                  onClick={onLogout}
                  className="w-full py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl text-center"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="py-2.5 text-xs font-semibold text-slate-200 border border-white/10 rounded-xl text-center"
                >
                  Partner Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('register');
                  }}
                  className="py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#F7E19C] via-[#D4AF37] to-[#B28420] rounded-xl text-center"
                >
                  Empanel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
