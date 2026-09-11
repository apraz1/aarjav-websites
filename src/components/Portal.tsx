import React, { useState, useEffect } from 'react';
import { User, Lead, LeadStatus, LoanType } from '../types';
import {
  PlusCircle,
  TrendingUp,
  CheckCircle2,
  Building,
  Search,
  Trash2,
  AlertCircle
} from 'lucide-react';

interface PortalProps {
  currentUser: User;
  onUpdateUser: (updated: User) => void;
}

export const Portal: React.FC<PortalProps> = ({ currentUser, onUpdateUser }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'pipeline' | 'newLead' | 'payouts' | 'profile'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal / Form state for New Lead
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [loanAmount, setLoanAmount] = useState<number>(5000000);
  const [loanType, setLoanType] = useState<LoanType>('Home Loan');
  const [propertyStatus, setPropertyStatus] = useState('Selected');
  const [incomeType, setIncomeType] = useState('Salaried');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(85000);
  const [currentEmi, setCurrentEmi] = useState<number>(0);
  const [bankName, setBankName] = useState('State Bank of India');
  const [roi, setRoi] = useState<number>(8.4);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bank profile state
  const [accHolder, setAccHolder] = useState(currentUser.bankDetails?.accountHolder || currentUser.name);
  const [accNumber, setAccNumber] = useState(currentUser.bankDetails?.accountNumber || '');
  const [ifsc, setIfsc] = useState(currentUser.bankDetails?.ifscCode || '');
  const [pan, setPan] = useState(currentUser.bankDetails?.panNumber || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Fetch leads with auth token
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        headers: {
          Authorization: `Bearer ${currentUser.id}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [currentUser.id]);

  // Create new lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.id}`,
        },
        body: JSON.stringify({
          clientName,
          clientEmail,
          clientPhone,
          loanAmount,
          loanType,
          propertyStatus,
          incomeType,
          monthlyIncome,
          currentEmi,
          bankName,
          roi,
          tenureYears,
          notes,
        }),
      });

      if (res.ok) {
        const newLead = await res.json();
        setLeads((prev) => [newLead, ...prev]);
        setActiveSubTab('pipeline');
        // Reset
        setClientName('');
        setClientEmail('');
        setClientPhone('');
        setNotes('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update lead status
  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.id}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus, updatedAt: new Date().toISOString() } : l))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete lead
  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('Are you sure you want to remove this lead case?')) return;
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${currentUser.id}`,
        },
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== leadId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save bank details
  const handleSaveBankDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSavedMsg(false);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.id}`,
        },
        body: JSON.stringify({
          bankDetails: {
            accountHolder: accHolder,
            accountNumber: accNumber,
            ifscCode: ifsc,
            panNumber: pan,
          },
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        onUpdateUser(updated);
        setProfileSavedMsg(true);
        setTimeout(() => setProfileSavedMsg(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  // Computed metrics
  const totalVolume = leads.reduce((acc, l) => acc + (l.loanAmount || 0), 0);
  const disbursedLeads = leads.filter((l) => l.status === 'Disbursed');
  const disbursedVolume = disbursedLeads.reduce((acc, l) => acc + (l.loanAmount || 0), 0);
  const earnedCommission = disbursedLeads.reduce((acc, l) => acc + (l.estimatedPayout || 0), 0);
  const activePipelineVolume = leads
    .filter((l) => l.status !== 'Disbursed' && l.status !== 'Rejected')
    .reduce((acc, l) => acc + (l.loanAmount || 0), 0);

  // Filtered list
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.bankName && l.bankName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.clientPhone && l.clientPhone.includes(searchQuery));
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'Disbursed':
        return 'bg-[#D4AF37]/20 text-[#FCE59F] border-[#D4AF37]/50';
      case 'Sanctioned':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
      case 'File Logged':
        return 'bg-blue-950/60 text-blue-300 border-blue-500/40';
      case 'Documents Received':
        return 'bg-purple-950/60 text-purple-300 border-purple-500/40';
      case 'Rejected':
        return 'bg-rose-950/60 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#181C26] via-[#12151E] to-[#0B0D12] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl border border-[#D4AF37]/25 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-[#D4AF37]/15 text-[#FCE59F] border border-[#D4AF37]/35 rounded-full">
              DSA Partner Portal
            </span>
            <span className="text-xs text-slate-400">ID: {currentUser.id.substring(0, 12)}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Welcome back, {currentUser.name}</h2>
          <p className="text-sm text-slate-400">
            Track lead pipelines, calculate partner payouts, and log new loan cases with Finstant Capital direct bank desks.
          </p>
        </div>

        <div className="flex items-center gap-3 relative">
          <button
            id="portal-add-lead-btn"
            onClick={() => setActiveSubTab('newLead')}
            className="px-4 py-2.5 bg-gradient-to-r from-[#FCE59F] via-[#D4AF37] to-[#B38724] hover:brightness-110 text-slate-950 font-bold text-xs rounded-xl shadow-[0_4px_15px_rgba(212,175,55,0.2)] transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log New Loan File</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[#12151E] p-5 rounded-2xl border border-[#D4AF37]/20 shadow-xl">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Pipeline</div>
          <div className="text-2xl font-black text-white mt-1">
            ₹{(activePipelineVolume / 100000).toFixed(1)} Lakhs
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{leads.length} Total Leads Active</div>
        </div>

        <div className="bg-[#12151E] p-5 rounded-2xl border border-[#D4AF37]/20 shadow-xl">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Disbursed Volume</div>
          <div className="text-2xl font-black text-[#FCE59F] mt-1">
            ₹{(disbursedVolume / 100000).toFixed(1)} Lakhs
          </div>
          <div className="text-[11px] text-[#D4AF37] mt-1">{disbursedLeads.length} Files Disbursed</div>
        </div>

        <div className="bg-[#12151E] p-5 rounded-2xl border border-[#D4AF37]/20 shadow-xl">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Earned Commission</div>
          <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D0] to-[#D4AF37] mt-1">
            ₹{earnedCommission.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Avg 0.65% Payout Rate</div>
        </div>

        <div className="bg-[#12151E] p-5 rounded-2xl border border-[#D4AF37]/20 shadow-xl">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Overall Portfolio</div>
          <div className="text-2xl font-black text-white mt-1">
            ₹{(totalVolume / 100000).toFixed(1)} Lakhs
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Total Loan Inquiries</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-white/10 space-x-6 text-sm font-medium">
        <button
          id="portal-tab-pipeline"
          onClick={() => setActiveSubTab('pipeline')}
          className={`pb-3 transition-colors ${
            activeSubTab === 'pipeline'
              ? 'border-b-2 border-[#D4AF37] text-[#FCE59F] font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Lead Pipeline CRM ({leads.length})
        </button>
        <button
          id="portal-tab-new-lead"
          onClick={() => setActiveSubTab('newLead')}
          className={`pb-3 transition-colors ${
            activeSubTab === 'newLead'
              ? 'border-b-2 border-[#D4AF37] text-[#FCE59F] font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          + Log New Case
        </button>
        <button
          id="portal-tab-payouts"
          onClick={() => setActiveSubTab('payouts')}
          className={`pb-3 transition-colors ${
            activeSubTab === 'payouts'
              ? 'border-b-2 border-[#D4AF37] text-[#FCE59F] font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Bank & Payout Profile
        </button>
      </div>

      {/* Sub-Tab 1: Pipeline View */}
      {activeSubTab === 'pipeline' && (
        <div className="space-y-4">
          {/* Filters and search bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#12151E] p-4 rounded-2xl border border-[#D4AF37]/20">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by client name, bank, phone..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#0B0D12] border border-white/10 rounded-xl text-white focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 shrink-0">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-[#0B0D12] border border-white/10 rounded-xl px-2.5 py-1.5 text-white focus:outline-hidden"
              >
                <option value="all">All Stages</option>
                <option value="Lead Created">Lead Created</option>
                <option value="Documents Received">Documents Received</option>
                <option value="File Logged">File Logged</option>
                <option value="Sanctioned">Sanctioned</option>
                <option value="Disbursed">Disbursed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#12151E] rounded-2xl border border-[#D4AF37]/20 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0B0D12] border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Client Name & Contact</th>
                    <th className="py-3 px-4">Loan Details</th>
                    <th className="py-3 px-4">Bank & ROI</th>
                    <th className="py-3 px-4">Stage / Status</th>
                    <th className="py-3 px-4">Est. Partner Payout</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-500">
                        No lead records found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((l) => (
                      <tr key={l.id} className="hover:bg-[#181C26]/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{l.clientName}</div>
                          <div className="text-[11px] text-slate-400">
                            {l.clientPhone || 'No phone'} | {l.clientEmail || 'No email'}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-200">
                            ₹{(l.loanAmount / 100000).toFixed(2)} Lakhs
                          </div>
                          <div className="text-[11px] text-slate-400">{l.loanType}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-200">{l.bankName || 'Under Evaluation'}</div>
                          <div className="text-[11px] text-[#FCE59F] font-semibold">{l.roi}% p.a.</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={l.status}
                            onChange={(e) => handleUpdateStatus(l.id, e.target.value as LeadStatus)}
                            className={`text-xs font-semibold px-2 py-1 rounded-md border cursor-pointer ${getStatusBadge(
                              l.status
                            )}`}
                          >
                            <option value="Lead Created">Lead Created</option>
                            <option value="Documents Received">Documents Received</option>
                            <option value="File Logged">File Logged</option>
                            <option value="Sanctioned">Sanctioned</option>
                            <option value="Disbursed">Disbursed</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-black text-[#FCE59F]">
                            ₹{(l.estimatedPayout || Math.round(l.loanAmount * 0.0065)).toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] text-slate-400">0.65% Standard Payout</div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteLead(l.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="Remove lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Log New Lead */}
      {activeSubTab === 'newLead' && (
        <div className="bg-[#12151E] rounded-3xl border border-[#D4AF37]/25 p-6 sm:p-8 shadow-2xl max-w-3xl mx-auto">
          <div className="border-b border-white/10 pb-4 mb-6">
            <h3 className="text-xl font-bold text-white">Log New Loan Case</h3>
            <p className="text-xs text-slate-400 mt-1">
              Submit client credentials to trigger automated multi-bank eligibility appraisal and file pickup.
            </p>
          </div>

          <form onSubmit={handleCreateLead} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full p-2.5 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Client Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+91 98100 12345"
                  className="w-full p-2.5 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Client Email (Optional)</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@example.com"
                  className="w-full p-2.5 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Loan Amount (in ₹) *</label>
                <input
                  type="number"
                  required
                  min="500000"
                  step="50000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full p-2.5 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white font-bold focus:outline-hidden focus:border-[#D4AF37]"
                />
                <span className="text-[10px] text-[#FCE59F] font-medium">
                  ₹{(loanAmount / 100000).toFixed(2)} Lakhs
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Loan Type</label>
                <select
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value as LoanType)}
                  className="w-full p-2.5 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white focus:outline-hidden focus:border-[#D4AF37]"
                >
                  <option value="Home Loan">Home Loan</option>
                  <option value="Balance Transfer">Balance Transfer</option>
                  <option value="Loan Against Property">Loan Against Property</option>
                  <option value="Commercial Property Loan">Commercial Property</option>
                  <option value="Plot + Construction">Plot + Construction</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Preferred Bank</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white focus:outline-hidden focus:border-[#D4AF37]"
                >
                  <option value="State Bank of India">State Bank of India</option>
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  <option value="LIC Housing Finance">LIC Housing Finance</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Income Type</label>
                <select
                  value={incomeType}
                  onChange={(e) => setIncomeType(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white focus:outline-hidden focus:border-[#D4AF37]"
                >
                  <option value="Salaried">Salaried</option>
                  <option value="Self-Employed">Self-Employed</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Notes & Special Requirements</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specify property location, builder name, or fast-track sanction requirements..."
                className="w-full p-2.5 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setActiveSubTab('pipeline')}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-[#FCE59F] via-[#D4AF37] to-[#B38724] hover:brightness-110 text-slate-950 font-bold text-xs rounded-xl shadow-[0_4px_15px_rgba(212,175,55,0.2)] transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Logging File...' : 'Submit File to Finstant Capital'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sub-Tab 3: Bank Payout Profile */}
      {activeSubTab === 'payouts' && (
        <div className="bg-[#12151E] rounded-3xl border border-[#D4AF37]/25 p-6 sm:p-8 shadow-2xl max-w-2xl mx-auto space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold text-white">Partner Commission & Banking Profile</h3>
            <p className="text-xs text-slate-400 mt-1">
              Ensure your bank account details and PAN are verified to receive direct NEFT/RTGS commission disbursements.
            </p>
          </div>

          {profileSavedMsg && (
            <div className="p-3 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#FCE59F] rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Banking and payout details updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveBankDetails} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Beneficiary / Account Holder Name</label>
              <input
                type="text"
                required
                value={accHolder}
                onChange={(e) => setAccHolder(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Bank Account Number</label>
                <input
                  type="text"
                  required
                  value={accNumber}
                  onChange={(e) => setAccNumber(e.target.value)}
                  placeholder="e.g. 501002348911"
                  className="w-full p-2.5 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white font-mono focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">IFSC Code</label>
                <input
                  type="text"
                  required
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  placeholder="e.g. HDFC0001234"
                  className="w-full p-2.5 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white font-mono focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">PAN Number (for TDS 194H deduction)</label>
              <input
                type="text"
                required
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
                className="w-full p-2.5 text-xs rounded-xl border border-white/10 bg-[#0B0D12] text-white font-mono focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-5 py-2.5 bg-gradient-to-r from-[#FCE59F] via-[#D4AF37] to-[#B38724] hover:brightness-110 text-slate-950 font-bold text-xs rounded-xl shadow-[0_4px_15px_rgba(212,175,55,0.2)] transition-all disabled:opacity-50"
              >
                {savingProfile ? 'Saving Details...' : 'Save Payout Details'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
