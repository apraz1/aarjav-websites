import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Partner with Finstant Capital
        </h2>
        <p className="text-sm text-slate-400">
          Have a large mortgage syndication case or want to empanel your real estate firm or DSA agency? Reach our institutional credit desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Info Panel */}
        <div className="lg:col-span-5 bg-[#12151E] text-white rounded-3xl p-8 flex flex-col justify-between space-y-8 border border-[#D4AF37]/25 shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-2xl" />

          <div className="space-y-6 relative">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37]">Direct Advisory Desk</span>
              <h3 className="text-2xl font-bold mt-1 text-white">Get in Touch with our Credit Desks</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Our senior credit managers and empanelled bank relationship officers respond within 2 business hours.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#FCE59F]" />
                </div>
                <div>
                  <div className="text-slate-400 font-medium text-[11px]">Partner Hotline</div>
                  <div className="text-sm font-semibold text-white mt-0.5">+91 (011) 4982-3000 / +91 98110 54321</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#FCE59F]" />
                </div>
                <div>
                  <div className="text-slate-400 font-medium text-[11px]">Official Inquiries</div>
                  <div className="text-sm font-semibold text-white mt-0.5">contact@finstantcapital.com</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#FCE59F]" />
                </div>
                <div>
                  <div className="text-slate-400 font-medium text-[11px]">Registered Corporate Office</div>
                  <div className="text-slate-300 mt-0.5 leading-relaxed">
                    Level 8, DLF Cyber City, Tower B, Gurugram, Delhi NCR - 122002
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B0D12] border border-[#D4AF37]/20 text-[11px] text-slate-400 space-y-1 relative">
            <div className="flex items-center gap-1.5 text-[#D4AF37] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>RBI Regulated DSA Institutional Network</span>
            </div>
            <p>Empanelled with SBI, HDFC, ICICI, Axis, Kotak, Bank of Baroda, and leading AAA-rated housing finance institutions.</p>
          </div>
        </div>

        {/* Right Contact / Inquiry Form */}
        <div className="lg:col-span-7 bg-[#12151E] rounded-3xl border border-[#D4AF37]/25 p-8 shadow-xl">
          {submitted ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#FCE59F] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Inquiry Received Successfully</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Thank you, {name}! A Finstant Capital Senior Relationship Manager has been assigned to your case and will connect with you at {phone} shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#FCE59F] to-[#D4AF37] rounded-xl hover:brightness-110 transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-lg font-bold text-white">Send an Inquiry or Request Empanelment</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full p-2.5 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">City / Operational Region</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Delhi NCR, Mumbai, Bengaluru, Pune"
                  className="w-full p-2.5 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Message / Case Details</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your loan inquiry, monthly deal volume, or partner empanelment query..."
                  className="w-full p-2.5 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#FCE59F] via-[#D4AF37] to-[#B38724] hover:brightness-110 text-slate-950 font-bold text-xs rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.25)] transition-all flex items-center justify-center gap-2"
              >
                <span>Submit Inquiry</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
