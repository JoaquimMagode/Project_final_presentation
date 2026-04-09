export interface Quote {
  id: string;
  appointmentId: string;
  hospitalName: string;
  hospitalCity: string;
  patientName: string;
  reason: string;
  appointmentDate: string;
  appointmentTime: string;
  amount: number;
  currency: string;
  notes: string;
  status: 'pending' | 'accepted' | 'declined';
  sentAt: string;
  respondedAt?: string;
}

export interface BillingRecord {
  id: string;
  quoteId: string;
  appointmentId: string;
  hospitalName: string;
  hospitalCity: string;
  reason: string;
  appointmentDate: string;
  amount: number;
  currency: string;
  notes: string;
  acceptedAt: string;
  paymentStatus: 'unpaid' | 'paid';
}

const QUOTES_KEY = 'imap_quotes';
const BILLING_KEY = 'imap_billing';

export const quoteStore = {
  getQuotes(): Quote[] {
    return JSON.parse(localStorage.getItem(QUOTES_KEY) || '[]');
  },

  saveQuote(quote: Omit<Quote, 'id' | 'sentAt' | 'status'>): Quote {
    const quotes = quoteStore.getQuotes();
    const newQuote: Quote = {
      ...quote,
      id: `q_${Date.now()}`,
      status: 'pending',
      sentAt: new Date().toISOString(),
    };
    localStorage.setItem(QUOTES_KEY, JSON.stringify([...quotes, newQuote]));
    return newQuote;
  },

  acceptQuote(quoteId: string): BillingRecord {
    const quotes = quoteStore.getQuotes();
    const quote = quotes.find(q => q.id === quoteId)!;
    quote.status = 'accepted';
    quote.respondedAt = new Date().toISOString();
    localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));

    const billing = quoteStore.getBilling();
    const record: BillingRecord = {
      id: `b_${Date.now()}`,
      quoteId: quote.id,
      appointmentId: quote.appointmentId,
      hospitalName: quote.hospitalName,
      hospitalCity: quote.hospitalCity,
      reason: quote.reason,
      appointmentDate: quote.appointmentDate,
      amount: quote.amount,
      currency: quote.currency,
      notes: quote.notes,
      acceptedAt: new Date().toISOString(),
      paymentStatus: 'unpaid',
    };
    localStorage.setItem(BILLING_KEY, JSON.stringify([...billing, record]));
    return record;
  },

  declineQuote(quoteId: string) {
    const quotes = quoteStore.getQuotes();
    const quote = quotes.find(q => q.id === quoteId)!;
    quote.status = 'declined';
    quote.respondedAt = new Date().toISOString();
    localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
  },

  getBilling(): BillingRecord[] {
    return JSON.parse(localStorage.getItem(BILLING_KEY) || '[]');
  },

  markPaid(billingId: string) {
    const billing = quoteStore.getBilling();
    const record = billing.find(b => b.id === billingId)!;
    record.paymentStatus = 'paid';
    localStorage.setItem(BILLING_KEY, JSON.stringify(billing));
  },
};
