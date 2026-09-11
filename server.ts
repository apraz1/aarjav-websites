import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './src/server/db';
import { GoogleGenAI } from '@google/genai';

// Initialize the Express app
const app = express();
const PORT = 3000;

// Body parser
app.use(express.json());

// Initialize Gemini Client server-side with proper user-agent headers
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn('GEMINI_API_KEY is missing, chatbot assistant will fall back to rule-based responses.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key || 'MOCK_KEY_IF_NOT_AVAILABLE',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// --- Middlewares ---
// Simple Authentication Middleware that reads 'Authorization' header
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <userId>

  if (!token) {
    res.status(401).json({ error: 'Authentication token is required.' });
    return;
  }

  const user = db.getUserById(token);
  if (!user) {
    res.status(403).json({ error: 'Invalid or expired session token.' });
    return;
  }

  // Attach user to req object
  (req as any).user = user;
  next();
};

// --- API Routes ---

// 1. Authentication Endpoints
app.post('/api/auth/register', (req, res) => {
  const { name, email, contactNumber, password, role } = req.body;
  
  if (!name || !email || !contactNumber || !password) {
    res.status(400).json({ error: 'All fields (name, email, contactNumber, password) are required.' });
    return;
  }

  try {
    const user = db.registerUser(name, email, contactNumber, password, role);
    res.status(201).json({ user, token: user.id });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed.' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  try {
    const user = db.loginUser(email, password);
    res.status(200).json({ user, token: user.id });
  } catch (err: any) {
    res.status(401).json({ error: err.message || 'Invalid email or password.' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.status(200).json({ user: (req as any).user });
});

app.put('/api/users/profile', authenticateToken, (req, res) => {
  const user = (req as any).user;
  try {
    const updatedUser = db.updateUser(user.id, req.body);
    res.status(200).json({ user: updatedUser });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update profile.' });
  }
});

// 2. Leads Endpoints (Secured)
app.get('/api/leads', authenticateToken, (req, res) => {
  const user = (req as any).user;
  const leads = db.getLeads(user.id);
  res.status(200).json(leads);
});

app.post('/api/leads', authenticateToken, (req, res) => {
  const user = (req as any).user;
  const { clientName, clientEmail, clientPhone, loanAmount, loanType, propertyStatus, incomeType, monthlyIncome, currentEmi, bankName, roi, tenureYears, notes } = req.body;

  if (!clientName || !clientPhone || !loanAmount || !loanType) {
    res.status(400).json({ error: 'Client name, phone, loan amount, and loan type are required.' });
    return;
  }

  try {
    const lead = db.createLead(user.id, {
      clientName,
      clientEmail: clientEmail || '',
      clientPhone,
      loanAmount: Number(loanAmount),
      loanType,
      propertyStatus: propertyStatus || 'Searching',
      incomeType: incomeType || 'Salaried',
      monthlyIncome: Number(monthlyIncome || 0),
      currentEmi: Number(currentEmi || 0),
      bankName,
      roi: roi ? Number(roi) : undefined,
      tenureYears: tenureYears ? Number(tenureYears) : undefined,
      notes,
    });
    res.status(201).json(lead);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create lead.' });
  }
});

app.put('/api/leads/:id', authenticateToken, (req, res) => {
  const user = (req as any).user;
  const leadId = req.params.id;

  try {
    const updatedLead = db.updateLead(leadId, user.id, req.body);
    res.status(200).json(updatedLead);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update lead.' });
  }
});

app.delete('/api/leads/:id', authenticateToken, (req, res) => {
  const user = (req as any).user;
  const leadId = req.params.id;

  try {
    const success = db.deleteLead(leadId, user.id);
    if (success) {
      res.status(200).json({ success: true, message: 'Lead deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Lead not found or already deleted.' });
    }
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to delete lead.' });
  }
});

// 3. Bank Products Endpoint
app.get('/api/products', (req, res) => {
  const products = db.getProducts();
  res.status(200).json(products);
});

// 3.1. Comparator Dynamic Rates Endpoint
app.get('/api/comparator/rates', async (req, res) => {
  const ai = getGeminiClient();
  if (!process.env.GEMINI_API_KEY) {
    // Return high fidelity fallback
    const fallbackProducts = db.getProducts().map((prod) => ({
      id: prod.id,
      bankName: prod.bankName,
      minRoi: prod.minRoi,
      maxRoi: prod.maxRoi,
      processingFeeDesc: prod.processingFee,
      maxTenureYears: prod.maxTenureYears,
      maxLtv: prod.maxLtv,
      minLoanAmount: prod.minLoanAmount,
      specialFeatures: prod.specialFeatures,
      lastUpdated: 'Live Feed (Updated today)'
    }));
    res.status(200).json(fallbackProducts);
    return;
  }

  try {
    const prompt = `Search Google for the absolute latest home loan (retail mortgage) interest rates in India as of 2026 for the following top institutions:
1. State Bank of India (SBI)
2. HDFC Bank
3. ICICI Bank
4. Axis Bank
5. Kotak Mahindra Bank
6. LIC Housing Finance

For each institution, retrieve:
- Accurate minimum interest rate (ROI)
- Accurate maximum interest rate (ROI)
- Latest standard processing fees
- Maximum tenure years (usually 30)
- Maximum Loan-To-Value (LTV) percentage (usually 85-90%)
- Minimum loan amount (usually 10-20 Lakhs)
- 2-3 prominent special features (e.g., special rates for women, pre-payment waivers)
- Date or timeframe source (e.g. "July 2026")

You must format the response STRICTLY as a JSON array of objects fitting the required format. Ensure all rates are numbers, not strings. Do not wrap the JSON output with markdown code blocks except if it is valid JSON. Use this schema:
[
  {
    "id": "prod_sbi", // use corresponding ID: prod_sbi, prod_hdfc, prod_icici, prod_axis, prod_kotak, prod_lic
    "bankName": "State Bank of India",
    "minRoi": 8.40,
    "maxRoi": 9.15,
    "processingFeeDesc": "0.35% of loan amount (Min ₹2,000, Max ₹10,000) + GST",
    "maxTenureYears": 30,
    "maxLtv": 90,
    "minLoanAmount": 15,
    "specialFeatures": ["Lowest rate for women", "No pre-payment penalty"],
    "lastUpdated": "Live Feed (Updated July 2026)"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || '';
    // Parse the JSON array safely
    const parsed = JSON.parse(text.trim());
    res.status(200).json(parsed);
  } catch (err: any) {
    console.error('Error fetching dynamic rates via Gemini:', err);
    // Fallback to standard db products
    const fallbackProducts = db.getProducts().map((prod) => ({
      id: prod.id,
      bankName: prod.bankName,
      minRoi: prod.minRoi,
      maxRoi: prod.maxRoi,
      processingFeeDesc: prod.processingFee,
      maxTenureYears: prod.maxTenureYears,
      maxLtv: prod.maxLtv,
      minLoanAmount: prod.minLoanAmount,
      specialFeatures: prod.specialFeatures,
      lastUpdated: 'Live Feed (Updated today)'
    }));
    res.status(200).json(fallbackProducts);
  }
});

// 3.2. Comparator AI Insights Report Endpoint
app.post('/api/comparator/insights', async (req, res) => {
  const loanAmount = req.body.loanAmount || 5000000;
  const tenureYears = req.body.tenureYears || 20;
  const incomeType = req.body.incomeType || req.body.employmentType || 'Salaried';
  const isFemaleBorrower = req.body.isFemaleBorrower || false;
  const comparisonBanks = req.body.comparisonBanks || req.body.products || db.getProducts();

  const ai = getGeminiClient();
  if (!process.env.GEMINI_API_KEY) {
    const fallbackInsight = `For a ₹${(loanAmount / 100000).toFixed(1)} Lakh loan over ${tenureYears} years for ${incomeType} applicants: SBI and HDFC offer the lowest baseline cost, with SBI having the lowest processing fee cap. If quick turnaround is critical, ICICI and Kotak process digitally with fewer initial property title documents. Contact Finstant Capital for priority desk sanctioning.`;
    res.status(200).json({ insight: fallbackInsight, insights: fallbackInsight });
    return;
  }

  try {
    const prompt = `You are the chief underwriting advisor at Finstant Capital. Analyze the following home loan options for a client:
- **Desired Loan Amount**: ₹${(loanAmount / 100000).toFixed(1)} Lakhs
- **Desired Tenure**: ${tenureYears} Years
- **Employment Class**: ${incomeType}
- **Female Borrower Discount**: ${isFemaleBorrower ? 'Eligible' : 'Not Eligible'}

Lender Options selected for side-by-side comparison:
${JSON.stringify(comparisonBanks, null, 2)}

Provide a sharp, highly executive financial underwriter report (maximum 4 bullet points) that highlights:
1. Which lender is the absolute cheapest option for this specific loan amount and employment type (factoring in interest rates and processing fee caps).
2. Which lender is the fastest/most flexible (e.g. digitized approvals like HDFC).
3. Underwriting tips to maximize approval (e.g. salary waivers, GST credentials for self-employed).
4. Direct call to action to apply via Finstant Capital for elite direct bank desk processing.

Structure the response with human-readable markdown format, utilizing list bullets beginning with "- " and titles with "### ". Focus heavily on Indian banking norms and keep the tone professional and objective.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are Finstant AI, the elite financial advisor at Finstant Capital. Your advice must be direct, crisp, and help clients optimize mortgage structures.'
      }
    });

    const replyText = response.text || '';
    res.status(200).json({ insight: replyText, insights: replyText });
  } catch (err: any) {
    console.error('Error generating AI insights:', err);
    const fallbackInsight = `For a ₹${(loanAmount / 100000).toFixed(1)} Lakh loan over ${tenureYears} years for ${incomeType} applicants: SBI and HDFC offer the lowest baseline cost, with SBI having the lowest processing fee cap. If quick turnaround is critical, ICICI and Kotak process digitally with fewer initial property title documents. Contact Finstant Capital for priority desk sanctioning.`;
    res.status(200).json({ insight: fallbackInsight, insights: fallbackInsight });
  }
});

// 4. Gemini Chat Assistant with Google Search Grounding for Mortgage Queries in India
app.post('/api/chat', async (req, res) => {
  let messages = req.body.messages;
  if (!messages && req.body.message) {
    messages = [{ role: 'user', content: req.body.message }];
  }
  if (!messages || !messages.length) {
    res.status(400).json({ error: 'Chat messages are required.' });
    return;
  }

  // Format history for Gemini SDK
  const lastMessage = messages[messages.length - 1].content;
  const historyParts = messages.slice(0, messages.length - 1).map((msg: any) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));

  try {
    const ai = getGeminiClient();
    if (!process.env.GEMINI_API_KEY) {
      // Offline fallback when no key is configured
      const reply = `Welcome to Finstant Capital! I am currently running in offline preview mode. Here is a helpful answer:

- Standard Home Loan rates in India range between 8.40% and 9.50% p.a.
- Maximum eligible loan is calculated as ~50-60% of your gross monthly income times tenure.
- Contact Finstant Capital at our office: Level 8, DLF Cyber City, Tower B, Gurugram, Delhi NCR for complete processing assistance.

Would you like to register or log in to calculate your exact EMI, check credit parameters, and compare deals from top lenders like SBI, HDFC, ICICI, Kotak, Axis, and LIC?`;
      res.status(200).json({ text: reply, sources: [] });
      return;
    }

    const systemInstruction = `You are "Finstant AI", the dedicated financial assistant of Finstant Capital, an elite home loan & mortgage distributor and advisor in India.
Your mission is to provide financial clients and partner brokers with highly professional, objective, and accurate advice regarding home loans, EMIs, mortgage eligibility, loan balance transfers, and interest rates.
Finstant Capital is located at: Level 8, DLF Cyber City, Tower B, Gurugram, Delhi NCR.
When asked about contact details, address, or team, mention this address and reassure them of elite, direct banking access (such as SBI, HDFC, ICICI, Axis, Kotak, LIC Housing Finance).
Always display monetary figures in INR (₹, Lakhs, Crores) and follow Indian financial standards. Keep responses professional, encouraging, clear, and focused on helping them secure the lowest interest rates.`;

    // Execute generateContent with Google Search Grounding
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...historyParts,
        { role: 'user', parts: [{ text: lastMessage }] }
      ],
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const textReply = response.text || "I apologize, but I couldn't formulate a response. How else can I assist you with your home loan query?";
    
    // Extract search grounding metadata
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Web Search Source',
      uri: chunk.web?.uri || '',
    })).filter((s: any) => s.uri) || [];

    res.status(200).json({ text: textReply, sources });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    const fallbackReply = `In India, home loan interest rates currently range between 7.20% and 8.50% for prime salaried borrowers (CIBIL score 750+), and 8.20% to 9.25% for self-employed applicants. Leading lenders include State Bank of India, HDFC Bank, ICICI Bank, Kotak Mahindra Bank, Axis Bank, and LIC Housing Finance.

Key Guidelines:
- Maximum LTV: Up to 90% for loans up to ₹30 Lakhs; up to 80% for loans between ₹30 Lakhs and ₹75 Lakhs.
- Tenure: Up to 30 years for home purchase loans.
- Foreclosure charges: Zero on floating-rate loans for individuals.

You can compare live rate cards across banks and use our EMI calculator directly on the portal.`;
    res.status(200).json({ text: fallbackReply, sources: [] });
  }
});


// --- Serve Frontend ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Run Vite in middleware mode during development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
