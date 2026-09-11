export interface User {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  role: 'partner' | 'client';
  createdAt: string;
  bankDetails?: {
    accountHolder?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    panNumber?: string;
    gstNumber?: string;
  };
  businessDocs?: {
    panDoc?: string;
    gstDoc?: string;
    cancelledCheque?: string;
  };
  eligibilityAssessments?: any[];
}

export type LeadStatus =
  | 'Lead Created'
  | 'Documents Received'
  | 'File Logged'
  | 'Sanctioned'
  | 'Disbursed'
  | 'Rejected';

export type LoanType =
  | 'Home Loan'
  | 'Balance Transfer'
  | 'Loan Against Property'
  | 'Commercial Property Loan'
  | 'Plot + Construction';

export interface Lead {
  id: string;
  userId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  loanAmount: number;
  loanType: LoanType | string;
  propertyStatus?: string;
  incomeType?: string;
  monthlyIncome?: number;
  currentEmi?: number;
  status: LeadStatus;
  bankName?: string;
  roi?: number;
  tenureYears?: number;
  commissionRate?: number;
  estimatedPayout?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankProduct {
  id: string;
  bankName: string;
  minRoi: number;
  maxRoi: number;
  processingFee: string;
  maxTenureYears: number;
  maxLtv: number;
  minLoanAmount: number; // in Lakhs
  specialFeatures?: string[];
}

export interface RateCardComparisonItem {
  bankName: string;
  productType: string;
  roiRange: string;
  maxTenure: string;
  maxLtv: string;
  processingFee: string;
  partnerPayout: string;
  turnaroundTime: string;
}
