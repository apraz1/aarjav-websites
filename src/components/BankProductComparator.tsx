import React, { useState, useEffect } from 'react';
import { BankProduct } from '../types';
import { Sparkles, Filter, Download, Check, RefreshCw } from 'lucide-react';
import jsPDF from 'jspdf';

interface BankProductComparatorProps {
  onSelectProduct?: (product: BankProduct) => void;
}

export const BankProductComparator: React.FC<BankProductComparatorProps> = ({ onSelectProduct }) => {
  const [products, setProducts] = useState<BankProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loanAmountLakhs, setLoanAmountLakhs] = useState<number>(50); // 50 Lakhs default
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [employmentType, setEmploymentType] = useState<'Salaried' | 'Self-Employed'>('Salaried');
  const [loanCategory, setLoanCategory] = useState<string>('Home Loan');
  const [sortBy, setSortBy] = useState<'roi' | 'ltv' | 'fee'>('roi');

  // AI Insights State
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const fetchRates = async (forceRefresh = false) => {
    setLoading(true);
    try {
      const url = forceRefresh ? '/api/comparator/rates?refresh=true' : '/api/products';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to load bank rates', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // Calculate approximate monthly EMI for a given ROI
  const calculateEmi = (pLakhs: number, annualRate: number, years: number) => {
    const principal = pLakhs * 100000;
    const monthlyRate = annualRate / (12 * 100);
    const months = years * 12;
    if (monthlyRate === 0) return Math.round(principal / months);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  // Generate AI comparison insight
  const generateAiInsights = async () => {
    setLoadingInsight(true);
    setAiInsight(null);
    try {
      const res = await fetch('/api/comparator/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loanAmount: loanAmountLakhs * 100000,
          tenureYears,
          loanType: loanCategory,
          employmentType,
          products,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiInsight(data.insight);
      } else {
        setAiInsight(
          `For a ₹${loanAmountLakhs} Lakh loan over ${tenureYears} years for ${employmentType} applicants: SBI and HDFC offer the lowest baseline cost, with SBI having the lowest processing fee cap. If quick turnaround is critical, ICICI and Kotak process digitally with fewer initial property title documents. Contact Finstant Capital for priority desk sanctioning.`
        );
      }
    } catch {
      setAiInsight(
        `For a ₹${loanAmountLakhs} Lakh loan over ${tenureYears} years: SBI currently provides the most competitive floating benchmark at 7.25%, while private lenders offer rapid digital sanctions within 48 hours via Finstant Capital partner desks.`
      );
    } finally {
      setLoadingInsight(false);
    }
  };

  // Download PDF Rate Card
  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('FINSTANT CAPITAL - MULTI-BANK RATE BENCHMARK', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 28);
    doc.text(`Configured Scenario: Rs ${loanAmountLakhs} Lakhs | ${tenureYears} Years | ${employmentType}`, 14, 34);

    let y = 46;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Bank / Lender', 14, y);
    doc.text('ROI Range', 70, y);
    doc.text('Est. EMI (Rs)', 110, y);
    doc.text('Max LTV', 150, y);
    doc.text('Processing Fee', 175, y);

    y += 4;
    doc.line(14, y, 196, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    products.forEach((p) => {
      const emi = calculateEmi(loanAmountLakhs, p.minRoi, tenureYears);
      doc.text(p.bankName, 14, y);
      doc.text(`${p.minRoi}% - ${p.maxRoi}%`, 70, y);
      doc.text(`Rs ${emi.toLocaleString('en-IN')}`, 110, y);
      doc.text(`${p.maxLtv}%`, 150, y);
      doc.text(p.processingFee.substring(0, 18), 175, y);
      y += 8;
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
    });

    y += 10;
    doc.setFontSize(8);
    doc.text('Official Document issued by Finstant Capital Digital Mortgage Network.', 14, y);
    doc.save(`Finstant_Capital_Rate_Card_${loanAmountLakhs}L.pdf`);
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'roi') return a.minRoi - b.minRoi;
    if (sortBy === 'ltv') return b.maxLtv - a.maxLtv;
    return a.bankName.localeCompare(b.bankName);
  });

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header & Description with Gold Highlights */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Multi-Bank Loan Rate Card Comparator
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-[#D4AF37]/15 text-[#F5D374] border border-[#D4AF37]/30 rounded-full">
              Live Feed
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time benchmarking across top national banks and NBFCs for prime mortgage and institutional loan portfolios.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="comparator-refresh-btn"
            onClick={() => fetchRates(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#141722] hover:bg-[#1A1F2C] border border-[#D4AF37]/25 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#D4AF37]' : 'text-[#D4AF37]'}`} />
            <span>Refresh Benchmark</span>
          </button>
          <button
            id="comparator-download-btn"
            onClick={downloadPdf}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#FCE59F] via-[#D4AF37] to-[#B38724] hover:brightness-110 rounded-xl shadow-[0_4px_15px_rgba(212,175,55,0.25)] flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Rate Card PDF</span>
          </button>
        </div>
      </div>

      {/* Interactive Controls & Filters in Luxury Dark Container */}
      <div className="bg-[#12151E] p-6 rounded-2xl border border-[#D4AF37]/25 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Filter className="w-4 h-4 text-[#D4AF37]" />
          <span>Configure Loan Scenario</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Loan Amount Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-300">Loan Amount</label>
              <span className="font-bold text-[#FCE59F]">₹{loanAmountLakhs} Lakhs</span>
            </div>
            <input
              id="comparator-amount-slider"
              type="range"
              min="5"
              max="500"
              step="5"
              value={loanAmountLakhs}
              onChange={(e) => setLoanAmountLakhs(Number(e.target.value))}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>₹5 Lakhs</span>
              <span>₹2.5 Cr</span>
              <span>₹5 Cr</span>
            </div>
          </div>

          {/* Tenure Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-300">Tenure (Years)</label>
              <span className="font-bold text-[#FCE59F]">{tenureYears} Years</span>
            </div>
            <input
              id="comparator-tenure-slider"
              type="range"
              min="5"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>5 Yrs</span>
              <span>15 Yrs</span>
              <span>30 Yrs</span>
            </div>
          </div>

          {/* Employment Profile */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Borrower Profile</label>
            <div className="flex rounded-xl border border-white/10 p-1 bg-[#0B0D12]">
              <button
                type="button"
                onClick={() => setEmploymentType('Salaried')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  employmentType === 'Salaried'
                    ? 'bg-gradient-to-r from-[#FCE59F] to-[#D4AF37] text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Salaried
              </button>
              <button
                type="button"
                onClick={() => setEmploymentType('Self-Employed')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  employmentType === 'Self-Employed'
                    ? 'bg-gradient-to-r from-[#FCE59F] to-[#D4AF37] text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Self-Employed
              </button>
            </div>
          </div>

          {/* Loan Category */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Loan Type</label>
            <select
              id="comparator-category-select"
              value={loanCategory}
              onChange={(e) => setLoanCategory(e.target.value)}
              className="w-full text-xs font-medium bg-[#0B0D12] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-slate-100 focus:ring-2 focus:ring-[#D4AF37] focus:outline-hidden"
            >
              <option value="Home Loan">Home Loan (Regular)</option>
              <option value="Balance Transfer">Balance Transfer + Top-Up</option>
              <option value="Loan Against Property">Loan Against Property (LAP)</option>
              <option value="Commercial Property">Commercial Property Loan</option>
            </select>
          </div>
        </div>

        {/* AI Insight Trigger */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/5">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Generate tailored underwriting recommendations for this exact ticket size and borrower profile</span>
          </div>

          <button
            id="comparator-ai-insights-btn"
            onClick={generateAiInsights}
            disabled={loadingInsight}
            className="px-4 py-2 text-xs font-semibold text-[#FCE59F] bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/35 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{loadingInsight ? 'Analyzing Underwriting Matrix...' : 'Get Gemini AI Evaluation'}</span>
          </button>
        </div>

        {/* AI Insight Box if present */}
        {aiInsight && (
          <div className="p-4 bg-gradient-to-r from-[#D4AF37]/15 via-[#181C26] to-[#12151E] border border-[#D4AF37]/40 rounded-xl text-xs sm:text-sm text-slate-200 space-y-1.5 shadow-lg">
            <div className="font-bold text-[#FCE59F] flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Finstant AI Advisory Synthesis</span>
            </div>
            <p className="leading-relaxed text-slate-300">{aiInsight}</p>
          </div>
        )}
      </div>

      {/* Sorting bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing {products.length} partnered institutional lenders</span>
        <div className="flex items-center gap-2">
          <span>Sort By:</span>
          <button
            onClick={() => setSortBy('roi')}
            className={`font-semibold px-2.5 py-1 rounded-lg transition-colors ${
              sortBy === 'roi' ? 'bg-[#D4AF37]/20 text-[#FCE59F] border border-[#D4AF37]/40' : 'hover:text-white'
            }`}
          >
            Lowest ROI
          </button>
          <button
            onClick={() => setSortBy('ltv')}
            className={`font-semibold px-2.5 py-1 rounded-lg transition-colors ${
              sortBy === 'ltv' ? 'bg-[#D4AF37]/20 text-[#FCE59F] border border-[#D4AF37]/40' : 'hover:text-white'
            }`}
          >
            Highest LTV %
          </button>
        </div>
      </div>

      {/* Comparison Grid with Luxury Gold Accents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((p) => {
          const emi = calculateEmi(loanAmountLakhs, p.minRoi, tenureYears);
          const totalPayable = emi * tenureYears * 12;
          const totalInterest = totalPayable - loanAmountLakhs * 100000;

          return (
            <div
              key={p.id}
              className="bg-[#12151E] rounded-2xl border border-[#D4AF37]/20 p-6 flex flex-col justify-between hover:border-[#D4AF37]/60 hover:shadow-[0_4px_30px_rgba(212,175,55,0.15)] transition-all group relative overflow-hidden"
            >
              {/* Subtle gold ambient glow on card hover */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#D4AF37]/5 rounded-full blur-2xl group-hover:bg-[#D4AF37]/15 transition-all" />

              <div className="space-y-4 relative">
                {/* Bank Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#FCE59F] transition-colors">
                      {p.bankName}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">Empaneled Lender</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#D4AF37]/15 text-[#FCE59F] border border-[#D4AF37]/30 shadow-xs">
                    {p.minRoi}% - {p.maxRoi}%
                  </span>
                </div>

                {/* Primary Numbers */}
                <div className="p-3.5 bg-[#0B0D12] rounded-xl border border-white/5 space-y-1">
                  <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                    Est. Monthly EMI
                  </div>
                  <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D0] to-[#D4AF37]">
                    ₹{emi.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-slate-400">/ mo</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Total Interest: ₹{(totalInterest / 100000).toFixed(2)} Lakhs
                  </div>
                </div>

                {/* Key Product Parameters */}
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Max LTV Ratio</span>
                    <span className="font-semibold text-slate-200">{p.maxLtv}% of property</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Max Tenure</span>
                    <span className="font-semibold text-slate-200">{p.maxTenureYears} Years</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Processing Fee</span>
                    <span className="font-semibold text-slate-200 text-right max-w-[160px] truncate" title={p.processingFee}>
                      {p.processingFee}
                    </span>
                  </div>
                </div>

                {/* Key Highlights */}
                {p.specialFeatures && (
                  <div className="pt-1 space-y-1.5">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Key Highlights</div>
                    {p.specialFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4 border-t border-white/5 relative">
                <button
                  id={`select-bank-${p.id}`}
                  onClick={() => onSelectProduct && onSelectProduct(p)}
                  className="w-full py-2.5 text-xs font-bold rounded-xl bg-[#181C26] hover:bg-gradient-to-r hover:from-[#FCE29A] hover:to-[#C59B33] text-slate-200 hover:text-slate-950 border border-[#D4AF37]/30 transition-all shadow-sm"
                >
                  Apply / Log Case with {p.bankName}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
