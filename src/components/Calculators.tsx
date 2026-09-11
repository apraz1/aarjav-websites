import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { CheckCircle2 } from 'lucide-react';

export const Calculators: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<'emi' | 'eligibility' | 'balanceTransfer'>('emi');

  // --- 1. EMI Calculator States ---
  const [emiPrincipal, setEmiPrincipal] = useState<number>(5000000); // 50 Lakhs
  const [emiRate, setEmiRate] = useState<number>(8.5); // 8.5%
  const [emiTenureYears, setEmiTenureYears] = useState<number>(20);

  // EMI Math
  const monthlyRate = emiRate / (12 * 100);
  const totalMonths = emiTenureYears * 12;
  const calculatedEmi = Math.round(
    (emiPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
  const totalPayment = calculatedEmi * totalMonths;
  const totalInterest = totalPayment - emiPrincipal;

  const pieData = [
    { name: 'Principal Loan Amount', value: emiPrincipal, color: '#D4AF37' },
    { name: 'Total Interest Payable', value: totalInterest, color: '#7E580D' },
  ];

  // --- 2. Eligibility Calculator States ---
  const [netSalary, setNetSalary] = useState<number>(85000);
  const [existingEmi, setExistingEmi] = useState<number>(10000);
  const [eligTenure, setEligTenure] = useState<number>(25);
  const [eligRate, setEligRate] = useState<number>(8.4);

  // Eligibility Math (FOIR ~ 55%)
  const foir = 0.55;
  const maxAllowableEmi = Math.max(0, netSalary * foir - existingEmi);
  const eligMonthlyRate = eligRate / (12 * 100);
  const eligTotalMonths = eligTenure * 12;
  const calculatedMaxLoan = Math.round(
    (maxAllowableEmi * (Math.pow(1 + eligMonthlyRate, eligTotalMonths) - 1)) /
      (eligMonthlyRate * Math.pow(1 + eligMonthlyRate, eligTotalMonths))
  );

  // --- 3. Balance Transfer Savings States ---
  const [btOutstanding, setBtOutstanding] = useState<number>(4000000); // 40 Lakhs
  const [btCurrentRate, setBtCurrentRate] = useState<number>(9.5); // 9.5%
  const [btNewRate, setBtNewRate] = useState<number>(8.4); // 8.4%
  const [btRemainingYears, setBtRemainingYears] = useState<number>(15);

  const curMonthlyRate = btCurrentRate / (12 * 100);
  const curMonths = btRemainingYears * 12;
  const curEmi = Math.round(
    (btOutstanding * curMonthlyRate * Math.pow(1 + curMonthlyRate, curMonths)) /
      (Math.pow(1 + curMonthlyRate, curMonths) - 1)
  );
  const curTotalPayment = curEmi * curMonths;

  const newMonthlyRate = btNewRate / (12 * 100);
  const newEmi = Math.round(
    (btOutstanding * newMonthlyRate * Math.pow(1 + newMonthlyRate, curMonths)) /
      (Math.pow(1 + newMonthlyRate, curMonths) - 1)
  );
  const newTotalPayment = newEmi * curMonths;

  const totalSavedInterest = Math.max(0, curTotalPayment - newTotalPayment);
  const monthlySavings = Math.max(0, curEmi - newEmi);

  return (
    <div className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Financial Mortgage Calculators
        </h2>
        <p className="text-sm text-slate-400">
          Make data-driven financing decisions. Calculate monthly EMIs, maximum borrowing eligibility, and net balance transfer savings.
        </p>
      </div>

      {/* Tabs with Gold Highlights */}
      <div className="flex justify-center">
        <div className="bg-[#12151E] p-1.5 rounded-2xl border border-[#D4AF37]/25 flex gap-1.5 shadow-lg">
          <button
            id="tab-calc-emi"
            onClick={() => setActiveCalc('emi')}
            className={`px-5 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeCalc === 'emi'
                ? 'bg-gradient-to-r from-[#FCE59F] to-[#D4AF37] text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            EMI Calculator
          </button>
          <button
            id="tab-calc-elig"
            onClick={() => setActiveCalc('eligibility')}
            className={`px-5 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeCalc === 'eligibility'
                ? 'bg-gradient-to-r from-[#FCE59F] to-[#D4AF37] text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Loan Eligibility (FOIR)
          </button>
          <button
            id="tab-calc-bt"
            onClick={() => setActiveCalc('balanceTransfer')}
            className={`px-5 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeCalc === 'balanceTransfer'
                ? 'bg-gradient-to-r from-[#FCE59F] to-[#D4AF37] text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Balance Transfer Savings
          </button>
        </div>
      </div>

      {/* Calculator 1: Standard EMI Calculator */}
      {activeCalc === 'emi' && (
        <div className="bg-[#12151E] rounded-3xl border border-[#D4AF37]/25 shadow-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-bold text-white">Mortgage Loan Parameters</h3>

            {/* Loan Amount */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Loan Amount</span>
                <span className="font-bold text-[#FCE59F] text-base">
                  ₹{(emiPrincipal / 100000).toFixed(2)} Lakhs
                </span>
              </div>
              <input
                type="range"
                min="500000"
                max="50000000"
                step="100000"
                value={emiPrincipal}
                onChange={(e) => setEmiPrincipal(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>₹5 Lakhs</span>
                <span>₹2.5 Cr</span>
                <span>₹5 Cr</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Interest Rate (ROI)</span>
                <span className="font-bold text-[#FCE59F] text-base">{emiRate}% p.a.</span>
              </div>
              <input
                type="range"
                min="6.5"
                max="15.0"
                step="0.05"
                value={emiRate}
                onChange={(e) => setEmiRate(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>6.5%</span>
                <span>10.0%</span>
                <span>15.0%</span>
              </div>
            </div>

            {/* Tenure */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Loan Tenure</span>
                <span className="font-bold text-[#FCE59F] text-base">{emiTenureYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={emiTenureYears}
                onChange={(e) => setEmiTenureYears(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>1 Year</span>
                <span>15 Years</span>
                <span>30 Years</span>
              </div>
            </div>

            <div className="pt-4 p-4 rounded-xl bg-[#0B0D12] border border-white/5 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculated on monthly reducing balance method per standard RBI guidelines for Indian scheduled commercial banks.
              </p>
            </div>
          </div>

          {/* Results Visuals */}
          <div className="lg:col-span-5 bg-[#0B0D12] rounded-2xl p-6 border border-white/5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-center p-4 bg-[#141722] rounded-xl border border-[#D4AF37]/20 shadow-xs">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Monthly Loan EMI
                </div>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D0] via-[#E5BF5A] to-[#BA8B24] mt-1">
                  ₹{calculatedEmi.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Pie Breakdown */}
              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => (val != null ? `₹${Number(val).toLocaleString('en-IN')}` : '')}
                      contentStyle={{ backgroundColor: '#12151E', borderColor: '#D4AF37', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend & Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#141722] border border-white/5">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className="w-3 h-3 rounded-full bg-[#D4AF37]" />
                    Principal Amount:
                  </span>
                  <span className="font-bold text-white">₹{emiPrincipal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#141722] border border-white/5">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className="w-3 h-3 rounded-full bg-[#7E580D]" />
                    Total Interest:
                  </span>
                  <span className="font-bold text-[#FCE59F]">₹{totalInterest.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#141722] border border-[#D4AF37]/30">
                  <span className="font-semibold text-slate-300">Total Outflow:</span>
                  <span className="font-black text-[#FCE59F]">₹{totalPayment.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert('Proceeding to Rate Comparator with selected amount.')}
              className="w-full py-3 bg-gradient-to-r from-[#FCE59F] via-[#D4AF37] to-[#B38724] hover:brightness-110 text-slate-950 font-bold text-xs rounded-xl shadow-[0_4px_15px_rgba(212,175,55,0.25)] transition-all"
            >
              Compare Lender Rates for this EMI
            </button>
          </div>
        </div>
      )}

      {/* Calculator 2: Eligibility FOIR Calculator */}
      {activeCalc === 'eligibility' && (
        <div className="bg-[#12151E] rounded-3xl border border-[#D4AF37]/25 shadow-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-bold text-white">Income & Existing Liabilities</h3>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Monthly Net In-Hand Income</span>
                <span className="font-bold text-[#FCE59F] text-base">₹{netSalary.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="25000"
                max="500000"
                step="5000"
                value={netSalary}
                onChange={(e) => setNetSalary(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Existing Monthly EMIs / Obligations</span>
                <span className="font-bold text-[#FCE59F] text-base">₹{existingEmi.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="0"
                max="200000"
                step="2000"
                value={existingEmi}
                onChange={(e) => setExistingEmi(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Tenure (Years)</span>
                <input
                  type="number"
                  min="5"
                  max="30"
                  value={eligTenure}
                  onChange={(e) => setEligTenure(Number(e.target.value))}
                  className="w-full p-2.5 text-xs font-bold rounded-xl border border-[#D4AF37]/30 bg-[#0B0D12] text-white"
                />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Assumed ROI (%)</span>
                <input
                  type="number"
                  step="0.1"
                  value={eligRate}
                  onChange={(e) => setEligRate(Number(e.target.value))}
                  className="w-full p-2.5 text-xs font-bold rounded-xl border border-[#D4AF37]/30 bg-[#0B0D12] text-white"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#0B0D12] rounded-2xl p-6 border border-white/5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-center p-6 bg-[#141722] rounded-xl border border-[#D4AF37]/20 shadow-xs">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Estimated Loan Eligibility
                </div>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D0] via-[#E5BF5A] to-[#BA8B24] mt-2">
                  ₹{(calculatedMaxLoan / 100000).toFixed(2)} Lakhs
                </div>
                <div className="text-xs text-slate-400 mt-1 font-medium">
                  (₹{calculatedMaxLoan.toLocaleString('en-IN')})
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 rounded-lg bg-[#141722] border border-white/5">
                  <span className="text-slate-400">Permissible Monthly EMI (55% FOIR):</span>
                  <span className="font-bold text-white">₹{Math.round(netSalary * foir).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-[#141722] border border-white/5">
                  <span className="text-slate-400">Net Disposable EMI for New Loan:</span>
                  <span className="font-bold text-[#FCE59F]">₹{maxAllowableEmi.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert('Proceeding to Partner Desk with calculated eligibility.')}
              className="w-full py-3 bg-gradient-to-r from-[#FCE59F] via-[#D4AF37] to-[#B38724] hover:brightness-110 text-slate-950 font-bold text-xs rounded-xl shadow-[0_4px_15px_rgba(212,175,55,0.25)] transition-all"
            >
              Get Sanction Offer from Empaneled Banks
            </button>
          </div>
        </div>
      )}

      {/* Calculator 3: Balance Transfer Savings */}
      {activeCalc === 'balanceTransfer' && (
        <div className="bg-[#12151E] rounded-3xl border border-[#D4AF37]/25 shadow-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-bold text-white">Current Loan vs Refinancing Offer</h3>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Existing Loan Outstanding Balance</span>
                <span className="font-bold text-[#FCE59F] text-base">₹{(btOutstanding / 100000).toFixed(2)} Lakhs</span>
              </div>
              <input
                type="range"
                min="1000000"
                max="30000000"
                step="500000"
                value={btOutstanding}
                onChange={(e) => setBtOutstanding(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Current Rate of Interest</span>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={btCurrentRate}
                    onChange={(e) => setBtCurrentRate(Number(e.target.value))}
                    className="w-full p-2.5 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white font-bold"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#FCE59F]">Proposed Finstant Capital Rate</span>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={btNewRate}
                    onChange={(e) => setBtNewRate(Number(e.target.value))}
                    className="w-full p-2.5 text-xs rounded-xl border border-[#D4AF37]/40 bg-[#0B0D12] text-[#FCE59F] font-bold"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-[#D4AF37] font-bold">%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Remaining Tenure</span>
                <span className="font-bold text-[#FCE59F] text-base">{btRemainingYears} Years</span>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                step="1"
                value={btRemainingYears}
                onChange={(e) => setBtRemainingYears(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#0B0D12] rounded-2xl p-6 border border-white/5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-center p-6 bg-[#141722] rounded-xl border border-[#D4AF37]/20 shadow-xs">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total Interest You Save
                </div>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D0] via-[#E5BF5A] to-[#BA8B24] mt-2">
                  ₹{(totalSavedInterest / 100000).toFixed(2)} Lakhs
                </div>
                <div className="text-xs text-slate-400 mt-1 font-medium">
                  (₹{totalSavedInterest.toLocaleString('en-IN')})
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 rounded-lg bg-[#141722] border border-white/5">
                  <span className="text-slate-400">Monthly EMI Reduced By:</span>
                  <span className="font-bold text-[#FCE59F]">₹{monthlySavings.toLocaleString('en-IN')} / mo</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-[#141722] border border-white/5">
                  <span className="text-slate-400">Current Monthly EMI:</span>
                  <span className="font-semibold text-slate-200">₹{curEmi.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-[#141722] border border-[#D4AF37]/30">
                  <span className="text-slate-400">New Monthly EMI:</span>
                  <span className="font-bold text-[#FCE59F]">₹{newEmi.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert('Initiate Balance Transfer: Contact Finstant Capital desk at contact@finstantcapital.com')}
              className="w-full py-3 bg-gradient-to-r from-[#FCE59F] via-[#D4AF37] to-[#B38724] hover:brightness-110 text-slate-950 font-bold text-xs rounded-xl shadow-[0_4px_15px_rgba(212,175,55,0.25)] transition-all"
            >
              Start Balance Transfer Process
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
