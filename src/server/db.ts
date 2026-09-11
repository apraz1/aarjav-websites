import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { User, Lead, BankProduct } from '../types';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

interface DatabaseSchema {
  users: Record<string, User & { passwordHash: string; salt: string }>;
  leads: Record<string, Lead>;
  products: BankProduct[];
}

const SALT_LENGTH = 16;
const HASH_ITERATIONS = 1000;
const HASH_KEY_LEN = 64;
const HASH_DIGEST = 'sha512';

function hashPassword(password: string, salt: string): string {
  return crypto
    .pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEY_LEN, HASH_DIGEST)
    .toString('hex');
}

// Seed data: High-quality mortgage lending banks in India
const DEFAULT_PRODUCTS: BankProduct[] = [
  {
    id: 'prod_sbi',
    bankName: 'State Bank of India',
    minRoi: 7.20,
    maxRoi: 8.20,
    processingFee: '0.50% of loan amount + GST (Max ₹10,000)',
    maxTenureYears: 30,
    maxLtv: 90,
    minLoanAmount: 5,
    specialFeatures: ['Lowest rate for women borrowers', 'Zero pre-closure charges', 'Sbi Maxgain overdraft option']
  },
  {
    id: 'prod_hdfc',
    bankName: 'HDFC Bank',
    minRoi: 7.35,
    maxRoi: 8.40,
    processingFee: '0.50% of loan amount + GST',
    maxTenureYears: 30,
    maxLtv: 90,
    minLoanAmount: 10,
    specialFeatures: ['Instant digital approval', 'Flexible repayment schemes', 'Finstant Capital preferred partner rates']
  },
  {
    id: 'prod_icici',
    bankName: 'ICICI Bank',
    minRoi: 7.50,
    maxRoi: 8.55,
    processingFee: '0.50% of loan amount + GST',
    maxTenureYears: 30,
    maxLtv: 85,
    minLoanAmount: 15,
    specialFeatures: ['Step-up EMIs for young professionals', 'Home Search assistance', 'Minimal documentation']
  },
  {
    id: 'prod_axis',
    bankName: 'Axis Bank',
    minRoi: 7.60,
    maxRoi: 8.70,
    processingFee: '0.50% of loan amount + GST',
    maxTenureYears: 30,
    maxLtv: 85,
    minLoanAmount: 10,
    specialFeatures: ['Asha Home Loans for affordable housing', 'Balance transfer benefits', '12 EMI waivers on timely payment']
  },
  {
    id: 'prod_kotak',
    bankName: 'Kotak Mahindra Bank',
    minRoi: 7.25,
    maxRoi: 8.35,
    processingFee: '0.50% of loan amount + GST',
    maxTenureYears: 25,
    maxLtv: 90,
    minLoanAmount: 10,
    specialFeatures: ['Competitive interest rate', 'Paperless application process', 'Top-up loans up to 100% of original loan']
  },
  {
    id: 'prod_lic',
    bankName: 'LIC Housing Finance',
    minRoi: 7.40,
    maxRoi: 8.50,
    processingFee: '0.50% of loan amount + GST',
    maxTenureYears: 30,
    maxLtv: 85,
    minLoanAmount: 5,
    specialFeatures: ['Special scheme for pensioners', 'Low processing fees', 'No hidden charges']
  }
];

class DatabaseManager {
  private db: DatabaseSchema = { users: {}, leads: {}, products: DEFAULT_PRODUCTS };

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        this.db = {
          users: parsed.users || {},
          leads: parsed.leads || {},
          products: parsed.products && parsed.products.length ? parsed.products : DEFAULT_PRODUCTS,
        };
      } else {
        this.save();
      }
    } catch (e) {
      console.error('Error loading database:', e);
      this.db = { users: {}, leads: {}, products: DEFAULT_PRODUCTS };
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving database:', e);
    }
  }

  // --- Auth API ---
  public registerUser(name: string, email: string, contactNumber: string, password: string, role: 'partner' | 'client' = 'partner'): User {
    const normalizedEmail = email.toLowerCase().trim();
    if (this.db.users[normalizedEmail]) {
      throw new Error('User with this email already exists.');
    }

    const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const id = 'user_' + crypto.randomUUID();

    const newUser: User = {
      id,
      name,
      email: normalizedEmail,
      contactNumber,
      role,
      createdAt: new Date().toISOString(),
    };

    this.db.users[normalizedEmail] = {
      ...newUser,
      passwordHash,
      salt,
    };

    // Auto-seed some initial demo leads for a new partner to make the portal immediately functional!
    if (role === 'partner') {
      this.seedLeadsForUser(id);
    }

    this.save();
    return newUser;
  }

  public loginUser(email: string, password: string): User {
    const normalizedEmail = email.toLowerCase().trim();
    const record = this.db.users[normalizedEmail];
    if (!record) {
      throw new Error('Invalid email or password.');
    }

    const calculatedHash = hashPassword(password, record.salt);
    if (calculatedHash !== record.passwordHash) {
      throw new Error('Invalid email or password.');
    }

    const { passwordHash, salt, ...user } = record;
    return user;
  }

  public getUser(email: string): User | null {
    const normalizedEmail = email.toLowerCase().trim();
    const record = this.db.users[normalizedEmail];
    if (!record) return null;
    const { passwordHash, salt, ...user } = record;
    return user;
  }

  public getUserById(id: string): User | null {
    const record = Object.values(this.db.users).find((u) => u.id === id);
    if (!record) return null;
    const { passwordHash, salt, ...user } = record;
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User {
    const emailKey = Object.keys(this.db.users).find((key) => this.db.users[key].id === id);
    if (!emailKey) {
      throw new Error('User not found.');
    }

    const record = this.db.users[emailKey];
    const updatedRecord = {
      ...record,
      ...updates,
      name: updates.name !== undefined ? updates.name : record.name,
      email: updates.email !== undefined ? updates.email : record.email,
      contactNumber: updates.contactNumber !== undefined ? updates.contactNumber : record.contactNumber,
      bankDetails: updates.bankDetails !== undefined ? updates.bankDetails : record.bankDetails,
      businessDocs: updates.businessDocs !== undefined ? updates.businessDocs : record.businessDocs,
      eligibilityAssessments: updates.eligibilityAssessments !== undefined ? updates.eligibilityAssessments : record.eligibilityAssessments,
    };

    this.db.users[emailKey] = updatedRecord;
    this.save();

    const { passwordHash, salt, ...user } = updatedRecord;
    return user;
  }

  // --- Lead Management API ---
  public getLeads(userId: string): Lead[] {
    return Object.values(this.db.leads).filter((lead) => lead.userId === userId);
  }

  public getAllLeadsAdmin(): Lead[] {
    return Object.values(this.db.leads);
  }

  public createLead(userId: string, data: Omit<Lead, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'status'>): Lead {
    const id = 'lead_' + crypto.randomUUID();
    const commissionRate = 0.65; // average commission on loan: 0.65%
    const estimatedPayout = Math.round((data.loanAmount * commissionRate) / 100);

    const newLead: Lead = {
      ...data,
      id,
      userId,
      status: 'Lead Created',
      commissionRate,
      estimatedPayout,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.db.leads[id] = newLead;
    this.save();
    return newLead;
  }

  public updateLead(id: string, userId: string, updates: Partial<Lead>): Lead {
    const lead = this.db.leads[id];
    if (!lead) {
      throw new Error('Lead not found.');
    }

    // Security check: Only owner can update (unless admin, but for now we check owner)
    if (lead.userId !== userId) {
      throw new Error('Unauthorized to update this lead.');
    }

    let estimatedPayout = lead.estimatedPayout;
    const loanAmount = updates.loanAmount !== undefined ? updates.loanAmount : lead.loanAmount;
    const commRate = updates.commissionRate !== undefined ? updates.commissionRate : lead.commissionRate || 0.65;
    
    if (updates.loanAmount !== undefined || updates.commissionRate !== undefined) {
      estimatedPayout = Math.round((loanAmount * commRate) / 100);
    }

    const updatedLead: Lead = {
      ...lead,
      ...updates,
      estimatedPayout,
      updatedAt: new Date().toISOString(),
    };

    this.db.leads[id] = updatedLead;
    this.save();
    return updatedLead;
  }

  public deleteLead(id: string, userId: string): boolean {
    const lead = this.db.leads[id];
    if (!lead) return false;
    if (lead.userId !== userId) {
      throw new Error('Unauthorized to delete this lead.');
    }
    delete this.db.leads[id];
    this.save();
    return true;
  }

  // --- Bank Products API ---
  public getProducts(): BankProduct[] {
    return this.db.products;
  }

  // Seed standard partner leads to make dashboard rich immediately
  private seedLeadsForUser(userId: string) {
    const demoLeads: Omit<Lead, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
      {
        clientName: 'Rajesh Kumar Sharma',
        clientEmail: 'rajesh.sharma@gmail.com',
        clientPhone: '+91 98765 43210',
        loanAmount: 4500000, // 45 Lakhs
        loanType: 'Home Loan',
        propertyStatus: 'Selected',
        incomeType: 'Salaried',
        monthlyIncome: 85000,
        currentEmi: 0,
        status: 'Disbursed',
        bankName: 'HDFC Bank',
        roi: 8.50,
        tenureYears: 20,
        commissionRate: 0.60,
        estimatedPayout: 27000,
        notes: 'Disbursed smoothly. Property located in Dwarka, Delhi.'
      },
      {
        clientName: 'Priya Chawla',
        clientEmail: 'priya.chawla@outlook.com',
        clientPhone: '+91 99112 23344',
        loanAmount: 8500000, // 85 Lakhs
        loanType: 'Home Loan',
        propertyStatus: 'Under Construction',
        incomeType: 'Self-Employed',
        monthlyIncome: 150000,
        currentEmi: 15000,
        status: 'Sanctioned',
        bankName: 'State Bank of India',
        roi: 8.40,
        tenureYears: 25,
        commissionRate: 0.70,
        estimatedPayout: 59500,
        notes: 'Sanction letter generated. Property valuation completed.'
      },
      {
        clientName: 'Amit Verma',
        clientEmail: 'amit.verma@techcorp.in',
        clientPhone: '+91 88001 22334',
        loanAmount: 3200000, // 32 Lakhs
        loanType: 'Balance Transfer',
        propertyStatus: 'Selected',
        incomeType: 'Salaried',
        monthlyIncome: 65000,
        currentEmi: 28500,
        status: 'File Logged',
        bankName: 'Kotak Mahindra Bank',
        roi: 8.45,
        tenureYears: 15,
        commissionRate: 0.65,
        estimatedPayout: 20800,
        notes: 'BT from Axis Bank logged. BT process initiated.'
      },
      {
        clientName: 'Sanjay Gupta & Sons',
        clientEmail: 'sgupta.sons@yahoo.com',
        clientPhone: '+91 98100 88221',
        loanAmount: 12000000, // 1.2 Crore
        loanType: 'Loan Against Property',
        propertyStatus: 'Selected',
        incomeType: 'Self-Employed',
        monthlyIncome: 250000,
        currentEmi: 40000,
        status: 'Documents Received',
        bankName: 'ICICI Bank',
        roi: 9.75,
        tenureYears: 15,
        commissionRate: 0.80,
        estimatedPayout: 96000,
        notes: 'KYC & GST returns collected. Checking property titles.'
      }
    ];

    demoLeads.forEach((leadData) => {
      const id = 'lead_seed_' + crypto.randomBytes(4).toString('hex');
      const lead: Lead = {
        ...leadData,
        id,
        userId,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.db.leads[id] = lead;
    });
  }
}

export const db = new DatabaseManager();
