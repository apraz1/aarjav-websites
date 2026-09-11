import React from 'react';
import { Home, Repeat, Building, Briefcase, LandPlot, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

interface LoanProductsProps {
  onSelectProductType?: (type: string) => void;
}

export const LoanProducts: React.FC<LoanProductsProps> = ({ onSelectProductType }) => {
  const products = [
    {
      id: 'home-loan',
      title: 'Home Loan',
      subtitle: 'New Purchase / Resale / Construction',
      icon: Home,
      roi: 'Starting @ 7.20%',
      tenure: 'Up to 30 Years',
      ltv: 'Up to 90%',
      features: [
        'Direct institutional tie-ups with SBI, HDFC, ICICI, Kotak',
        'Special concessional rates for women borrowers',
        'Zero pre-closure charges on floating rate options',
        'Doorstep document collection and fast appraisal',
      ],
      docs: 'Aadhaar, PAN, 6-Month Bank Statement, 3-Month Salary Slips / 2-Year ITR',
    },
    {
      id: 'balance-transfer',
      title: 'Balance Transfer + Top-Up',
      subtitle: 'Refinance at lower ROI + Liquid Cash',
      icon: Repeat,
      roi: 'Starting @ 7.35%',
      tenure: 'Up to 30 Years',
      ltv: 'Up to 85%',
      features: [
        'Slash existing EMI by up to 1.50% interest rate margin',
        'Immediate top-up loan sanction for home renovation or business',
        'Minimal paperwork for standard clean repayment track',
        'Finstant Capital handles entire NOC and foreclosure process',
      ],
      docs: 'Foreclosure letter, List of Documents (LOD), 12-Month EMI Track, KYC',
    },
    {
      id: 'lap',
      title: 'Loan Against Property (LAP)',
      subtitle: 'Unlock High Liquidity from Residential / Commercial Real Estate',
      icon: Building,
      roi: 'Starting @ 8.75%',
      tenure: 'Up to 15-20 Years',
      ltv: 'Up to 75%',
      features: [
        'High ticket sizes up to ₹25 Crores for working capital or expansion',
        'Accepts self-occupied, rented, or industrial property titles',
        'Flexible overdraft (OD) / drop-line facility available',
        'Interest charged only on utilized funds in OD mode',
      ],
      docs: 'Complete Title Deed chain, Sanction Plan, Tax receipts, Audited Financials',
    },
    {
      id: 'commercial',
      title: 'Commercial Property Loan',
      subtitle: 'Office Spaces, Retail Outlets, Industrial Sheds',
      icon: Briefcase,
      roi: 'Starting @ 9.00%',
      tenure: 'Up to 15 Years',
      ltv: 'Up to 70%',
      features: [
        'Funding for ready commercial offices and under-construction units',
        'Structured repayments aligned with cash-flow cycles',
        'Balance transfer facility available for high-cost NBFC loans',
        'Comprehensive title legal check by senior empanelled advocates',
      ],
      docs: 'Sale agreement, builder NOC, 3-Year Audited Balance Sheets, GST returns',
    },
    {
      id: 'plot-construction',
      title: 'Plot + Construction Loan',
      subtitle: 'Composite Residential Financing',
      icon: LandPlot,
      roi: 'Starting @ 7.85%',
      tenure: 'Up to 25 Years',
      ltv: 'Up to 80%',
      features: [
        'Single composite sanction for purchasing land and building your house',
        'Stage-wise disbursement based on actual architect milestone certificates',
        'Option to buy from statutory development authorities (DDA, HUDA, CIDCO, BDA)',
        'Extended construction moratorium periods up to 24 months',
      ],
      docs: 'Allotment letter, approved architectural blueprint, estimate certificate',
    },
    {
      id: 'lrd',
      title: 'Lease Rental Discounting (LRD)',
      subtitle: 'Monetize Long-Term Commercial Rental Cash Flows',
      icon: FileText,
      roi: 'Starting @ 8.25%',
      tenure: 'Up to Lease Expiry (10-15 Yrs)',
      ltv: 'Up to 85% of Net Present Value',
      features: [
        'Discount rental agreements with MNCs, banks, IT firms, and retail giants',
        'Escrow account mechanism for seamless automatic debt servicing',
        'Substantial debt capacity without impacting personal balance sheet',
        'Institutional syndication with private and PSU consortia',
      ],
      docs: 'Registered Lease Deed, Tenant profile, Tripartite agreement draft, Rent receipts',
    },
  ];

  return (
    <div className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Comprehensive Mortgage & Institutional Solutions
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          From prime retail homebuyers to large corporate LAP syndication, Finstant Capital provides end-to-end processing with
          over 30 premier Indian banking institutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((prod) => {
          const Icon = prod.icon;
          return (
            <div
              key={prod.id}
              className="bg-[#12151E] rounded-3xl border border-[#D4AF37]/20 p-7 flex flex-col justify-between hover:shadow-[0_10px_40px_rgba(212,175,55,0.12)] hover:border-[#D4AF37]/60 transition-all group relative overflow-hidden"
            >
              {/* Subtle ambient accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl group-hover:bg-[#D4AF37]/10 transition-all" />

              <div className="space-y-5 relative">
                {/* Icon & Title */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 text-[#FCE59F] border border-[#D4AF37]/30 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37] group-hover:text-slate-950 transition-colors shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#FCE59F] transition-colors">
                      {prod.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{prod.subtitle}</p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-[#0B0D12] rounded-2xl text-center border border-white/5">
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Pricing</div>
                    <div className="text-xs font-bold text-[#FCE59F] mt-0.5">{prod.roi}</div>
                  </div>
                  <div className="border-x border-white/10">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Max Tenure</div>
                    <div className="text-xs font-bold text-slate-200 mt-0.5">{prod.tenure}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Max LTV</div>
                    <div className="text-xs font-bold text-slate-200 mt-0.5">{prod.ltv}</div>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider">Key Advantages</div>
                  {prod.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Docs snippet */}
                <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-200">Required KYC & Docs: </span>
                  {prod.docs}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-6 mt-4 relative">
                <button
                  onClick={() => onSelectProductType && onSelectProductType(prod.title)}
                  className="w-full py-2.5 px-4 bg-[#181C26] hover:bg-gradient-to-r hover:from-[#FCE29A] hover:to-[#C59B33] text-slate-200 hover:text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-[#D4AF37]/30 transition-all shadow-xs"
                >
                  <span>Check Eligibility / Log File</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
