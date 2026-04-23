import { Invoice } from '../types';

const KEY = 'hng_invoices_v3';
const THEME_KEY = 'hng_theme_v2';

export function loadInvoices(): Invoice[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // If user deleted everything, still return empty (that's intentional)
      // But if the key doesn't exist at all, load seed
      return parsed;
    }
  } catch {}
  return [...SEED];
}

export function saveInvoices(invoices: Invoice[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(invoices)); } catch {}
}

export function loadTheme(): 'light' | 'dark' {
  return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'dark';
}

export function saveTheme(t: 'light' | 'dark'): void {
  localStorage.setItem(THEME_KEY, t);
}

const SEED: Invoice[] = [
  {
    id: 'RT3080',
    createdAt: '2021-08-18',
    paymentDue: '2021-08-19',
    description: 'Re-branding',
    paymentTerms: 1,
    clientName: 'Jensen Huang',
    clientEmail: 'jensenh@mail.com',
    status: 'paid',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '106 Kendell Street', city: 'Sharrington', postCode: 'NR24 5WQ', country: 'United Kingdom' },
    items: [{ id: 'a1', name: 'Brand Guidelines', quantity: 1, price: 1800.90, total: 1800.90 }],
    total: 1800.90,
  },
  {
    id: 'XM9141',
    createdAt: '2021-08-21',
    paymentDue: '2021-09-20',
    description: 'Graphic Design',
    paymentTerms: 30,
    clientName: 'Alex Grim',
    clientEmail: 'alexgrim@mail.com',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '84 Church Way', city: 'Bradford', postCode: 'BD1 9PB', country: 'United Kingdom' },
    items: [
      { id: 'b1', name: 'Banner Design', quantity: 1, price: 156.00, total: 156.00 },
      { id: 'b2', name: 'Email Design', quantity: 2, price: 200.00, total: 400.00 },
    ],
    total: 556.00,
  },
  {
    id: 'RG0314',
    createdAt: '2021-09-24',
    paymentDue: '2021-10-01',
    description: 'Website Redesign',
    paymentTerms: 7,
    clientName: 'John Morrison',
    clientEmail: 'jm@myco.com',
    status: 'paid',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '79 Dover Road', city: 'Westhall', postCode: 'IP19 3PF', country: 'United Kingdom' },
    items: [{ id: 'c1', name: 'Website Redesign', quantity: 1, price: 14002.33, total: 14002.33 }],
    total: 14002.33,
  },
  {
    id: 'RT2080',
    createdAt: '2021-10-01',
    paymentDue: '2021-10-12',
    description: 'Email Campaign',
    paymentTerms: 14,
    clientName: 'Alysa Werner',
    clientEmail: 'alysa@email.co.uk',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '63 Warwick Road', city: 'Carlisle', postCode: 'CA20 2TG', country: 'United Kingdom' },
    items: [{ id: 'd1', name: 'Email Campaign', quantity: 1, price: 102.04, total: 102.04 }],
    total: 102.04,
  },
  {
    id: 'AA1449',
    createdAt: '2021-10-01',
    paymentDue: '2021-10-14',
    description: 'Logo Re-design',
    paymentTerms: 14,
    clientName: 'Mellisa Clarke',
    clientEmail: 'mellisa.clarke@example.com',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '46 Abbey Row', city: 'Cambridge', postCode: 'CB5 6EG', country: 'United Kingdom' },
    items: [{ id: 'e1', name: 'Logo Re-design', quantity: 1, price: 4032.33, total: 4032.33 }],
    total: 4032.33,
  },
  {
    id: 'TY9141',
    createdAt: '2021-10-11',
    paymentDue: '2021-10-31',
    description: 'Digital Marketing',
    paymentTerms: 20,
    clientName: 'Thomas Wayne',
    clientEmail: 'thomasw@mail.com',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '3964 Queens Lane', city: 'Gotham', postCode: 'GT1 2AB', country: 'United Kingdom' },
    items: [{ id: 'f1', name: 'Social Media Ads', quantity: 1, price: 6155.91, total: 6155.91 }],
    total: 6155.91,
  },
  {
    id: 'FV2353',
    createdAt: '2021-11-05',
    paymentDue: '2021-11-12',
    description: 'Consultancy',
    paymentTerms: 7,
    clientName: 'Anita Wainwright',
    clientEmail: 'anitaw@mail.com',
    status: 'draft',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '15 Park Avenue', city: 'London', postCode: 'SW1A 1AA', country: 'United Kingdom' },
    items: [{ id: 'g1', name: 'Business Strategy', quantity: 1, price: 3102.04, total: 3102.04 }],
    total: 3102.04,
  },
];
