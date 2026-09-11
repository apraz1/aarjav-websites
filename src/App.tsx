import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BankProductComparator } from './components/BankProductComparator';
import { LoanProducts } from './components/LoanProducts';
import { Calculators } from './components/Calculators';
import { FinstantAI } from './components/FinstantAI';
import { Portal } from './components/Portal';
import { Contact } from './components/Contact';
import { Logo } from './components/Logo';
import { User } from './types';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, ArrowRight } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Auth Form State
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Check stored auth session
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('finstant_token') || localStorage.getItem('aarjav_token');
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const user = await res.json();
            setCurrentUser(user);
          } else {
            localStorage.removeItem('finstant_token');
            localStorage.removeItem('aarjav_token');
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    checkUser();
  }, []);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthError(null);
    setAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setAuthModalOpen(false);
    setAuthError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('finstant_token');
    localStorage.removeItem('aarjav_token');
    setCurrentUser(null);
    if (activeTab === 'portal') {
      setActiveTab('home');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSubmitting(true);
    setAuthError(null);

    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload =
      authMode === 'login'
        ? { email: authEmail, password: authPassword }
        : { name: authName, email: authEmail, contactNumber: authPhone, password: authPassword, role: 'partner' };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        localStorage.setItem('finstant_token', data.user.id);
        setCurrentUser(data.user);
        setAuthModalOpen(false);
        setActiveTab('portal');
      } else {
        setAuthError(data.error || 'Authentication failed. Please check credentials.');
      }
    } catch {
      setAuthError('Connection error. Please try again.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // 1-Click Demo Partner Access for immediate frictionless testing
  const handleQuickDemoPartner = async () => {
    setAuthSubmitting(true);
    try {
      const demoEmail = 'partner.demo@finstantcapital.com';
      const demoPass = 'Password123!';
      // Try login first
      let res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPass }),
      });

      if (!res.ok) {
        // Register demo user
        res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Demo Partner (DSA Desk)',
            email: demoEmail,
            contactNumber: '+91 98110 54321',
            password: demoPass,
            role: 'partner',
          }),
        });
      }

      const data = await res.json();
      if (data.user) {
        localStorage.setItem('finstant_token', data.user.id);
        setCurrentUser(data.user);
        setAuthModalOpen(false);
        setActiveTab('portal');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAuthSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 flex flex-col selection:bg-[#D4AF37]/30 selection:text-[#FCE59F]">
      {/* Header with Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-4">
            <Hero
              onNavigate={setActiveTab}
              onOpenAuth={handleOpenAuth}
              isLoggedIn={!!currentUser}
            />
            {/* Embedded highlight of rates */}
            <BankProductComparator onSelectProduct={() => setActiveTab('portal')} />
            {/* Embedded loan products preview */}
            <LoanProducts onSelectProductType={() => setActiveTab('comparator')} />
          </div>
        )}

        {activeTab === 'comparator' && (
          <BankProductComparator onSelectProduct={() => setActiveTab('portal')} />
        )}

        {activeTab === 'products' && (
          <LoanProducts onSelectProductType={() => setActiveTab('comparator')} />
        )}

        {activeTab === 'calculators' && <Calculators />}

        {activeTab === 'ai' && <FinstantAI />}

        {activeTab === 'portal' && (
          currentUser ? (
            <Portal currentUser={currentUser} onUpdateUser={setCurrentUser} />
          ) : (
            <div className="py-24 max-w-lg mx-auto px-4 text-center space-y-6">
              <div className="w-20 h-20 bg-[#12151E] border border-[#D4AF37]/30 text-[#FCE59F] rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                <Logo variant="mark" size="md" />
              </div>
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D4AF37]/15 text-[#FCE59F] border border-[#D4AF37]/30">
                  Institutional Network
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">Partner CRM Access Required</h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                  Log in with your verified DSA Partner or Broker credentials to view commission rate sheets, manage lead pipelines, and monitor disbursement status.
                </p>
              </div>
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="w-full py-3 bg-gradient-to-r from-[#FCE59F] via-[#D4AF37] to-[#B38724] hover:brightness-110 text-slate-950 font-bold text-xs rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.25)] transition-all"
                >
                  Partner Sign In
                </button>
                <button
                  onClick={handleQuickDemoPartner}
                  className="w-full py-2.5 bg-[#12151E] hover:bg-[#181C26] text-slate-200 hover:text-white font-semibold text-xs rounded-xl border border-[#D4AF37]/30 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Experience Demo Partner Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'contact' && <Contact />}
      </main>

      {/* Footer */}
      <footer className="bg-[#0B0D12] text-slate-400 text-xs border-t border-[#D4AF37]/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <Logo variant="horizontal" size="sm" />
              <p className="text-slate-400 text-xs max-w-md leading-relaxed pt-2">
                India's premier digital mortgage distributor and institutional DSA network. Facilitating seamless home loans, balance transfers, and loan against property with top scheduled commercial banks.
              </p>
              <div className="text-[11px] text-slate-500">
                Registered Office: DLF Cyber City, Tower B, Gurugram, Delhi NCR | CIN: U65999DL2021PTC384210
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-white font-semibold uppercase tracking-wider text-[11px]">Solutions</div>
              <ul className="space-y-1.5 text-xs">
                <li><button onClick={() => setActiveTab('comparator')} className="hover:text-[#FCE59F] transition-colors">Bank Rate Cards</button></li>
                <li><button onClick={() => setActiveTab('products')} className="hover:text-[#FCE59F] transition-colors">Mortgage Products</button></li>
                <li><button onClick={() => setActiveTab('calculators')} className="hover:text-[#FCE59F] transition-colors">EMI Calculator</button></li>
                <li><button onClick={() => setActiveTab('ai')} className="hover:text-[#FCE59F] transition-colors">Finstant AI Advisory</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-white font-semibold uppercase tracking-wider text-[11px]">Channel Partner Desk</div>
              <ul className="space-y-1.5 text-xs">
                <li><button onClick={() => setActiveTab('portal')} className="hover:text-[#FCE59F] transition-colors">Partner CRM Login</button></li>
                <li><button onClick={() => handleOpenAuth('register')} className="hover:text-[#FCE59F] transition-colors">Become a DSA Partner</button></li>
                <li><button onClick={() => setActiveTab('contact')} className="hover:text-[#FCE59F] transition-colors">Direct Desk Contact</button></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} Finstant Capital Financial Technologies Private Limited. All rights reserved.</p>
            <p className="text-slate-500">
              Disclaimer: Interest rates, processing fees, and LTV are subject to individual bank underwriting and credit policies.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#12151E] rounded-3xl border border-[#D4AF37]/35 shadow-2xl w-full max-w-md p-6 sm:p-8 relative space-y-6">
            <button
              onClick={handleCloseAuth}
              className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <Logo variant="mark" size="sm" />
              <div>
                <h3 className="text-xl font-bold text-white">
                  {authMode === 'login' ? 'Partner Sign In' : 'Join as Channel Partner'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {authMode === 'login'
                    ? 'Access your lead CRM, commission records, and bank rate sheets.'
                    : 'Empanel your firm with Finstant Capital for direct banking commission payouts.'}
                </p>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-rose-950/60 border border-rose-500/40 text-rose-300 rounded-xl text-xs">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Full Name</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="e.g. Vikram Malhotra"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white focus:outline-hidden focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Mobile / WhatsApp Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white focus:outline-hidden focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="partner@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white focus:outline-hidden focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white focus:outline-hidden focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-2.5 bg-gradient-to-r from-[#FCE59F] via-[#D4AF37] to-[#B38724] hover:brightness-110 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {authSubmitting
                  ? 'Processing...'
                  : authMode === 'login'
                  ? 'Sign In to Portal'
                  : 'Complete Registration'}
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-3 text-[11px] text-slate-500">or testing access</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <button
              onClick={handleQuickDemoPartner}
              disabled={authSubmitting}
              className="w-full py-2.5 bg-[#141722] hover:bg-[#1C212E] text-slate-200 hover:text-white font-semibold text-xs rounded-xl border border-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
            >
              <span>1-Click Demo Partner Login</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>

            <div className="text-center text-xs text-slate-400">
              {authMode === 'login' ? (
                <span>
                  Don't have a partner account?{' '}
                  <button
                    onClick={() => setAuthMode('register')}
                    className="text-[#FCE59F] font-semibold hover:underline"
                  >
                    Register here
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    className="text-[#FCE59F] font-semibold hover:underline"
                  >
                    Sign in here
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
