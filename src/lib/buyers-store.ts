// Simple in-memory storage for demo purposes
// In production, this would be replaced with actual database operations

interface StoredBuyer {
  id: string;
  fullName: string;
  email: string | null;
  phone: string;
  city: string;
  propertyType: string;
  bhk: string;
  purpose: string;
  budgetMin: number;
  budgetMax: number;
  timeline: string;
  source: string;
  status: string;
  notes: string | null;
  tags: string[];
  profileImage: string | null;
  documents: string[];
  ownerId: string;
  createdAt: number;
  updatedAt: number;
}

// In-memory storage
let buyersStore: StoredBuyer[] = [
  {
    id: 'demo_1',
    fullName: 'John Smith',
    email: 'john@example.com',
    phone: '9876543210',
    city: 'Chandigarh',
    propertyType: 'Apartment',
    bhk: '3',
    purpose: 'Buy',
    budgetMin: 1500000,
    budgetMax: 2500000,
    timeline: '3-6m',
    source: 'Website',
    status: 'New',
    notes: 'Looking for 3BHK apartment',
    tags: ['urgent'],
    profileImage: null,
    documents: [],
    ownerId: 'demo-user',
    createdAt: Math.floor(Date.now() / 1000) - 86400,
    updatedAt: Math.floor(Date.now() / 1000) - 86400,
  },
  {
    id: 'demo_2',
    fullName: 'Sarah Wilson',
    email: 'sarah@example.com',
    phone: '9876543211',
    city: 'Mumbai',
    propertyType: 'Villa',
    bhk: '4',
    purpose: 'Buy',
    budgetMin: 5000000,
    budgetMax: 8000000,
    timeline: '6-12m',
    source: 'Referral',
    status: 'Hot',
    notes: 'Premium villa requirement',
    tags: ['premium', 'villa'],
    profileImage: null,
    documents: [],
    ownerId: 'demo-user',
    createdAt: Math.floor(Date.now() / 1000) - 172800,
    updatedAt: Math.floor(Date.now() / 1000) - 172800,
  },
];

export function getAllBuyers(): StoredBuyer[] {
  return buyersStore;
}

export function addBuyer(buyer: StoredBuyer): StoredBuyer {
  buyersStore.unshift(buyer); // Add to beginning of array (newest first)
  return buyer;
}

export function getBuyerById(id: string): StoredBuyer | undefined {
  return buyersStore.find(buyer => buyer.id === id);
}

export function updateBuyer(id: string, updates: Partial<StoredBuyer>): StoredBuyer | null {
  const index = buyersStore.findIndex(buyer => buyer.id === id);
  if (index === -1) return null;
  
  buyersStore[index] = { ...buyersStore[index], ...updates, updatedAt: Math.floor(Date.now() / 1000) };
  return buyersStore[index];
}

export function deleteBuyer(id: string): boolean {
  const index = buyersStore.findIndex(buyer => buyer.id === id);
  if (index === -1) return false;
  
  buyersStore.splice(index, 1);
  return true;
}