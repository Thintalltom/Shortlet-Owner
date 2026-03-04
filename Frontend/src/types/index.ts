export type UserRole = 'owner' | 'agent' | 'guest';
export type TrustedStatus = 'none' | 'pending' | 'active';
export type ManageType = 'owner' | 'agent';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  trustedStatus: TrustedStatus;
  bio?: string;
  profileImage?: string;
  whatsapp?: string;
  createdAt: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  ownerPrice?: number; // What owner charges agent
  publicPrice?: number; // What agent charges guests (markup)
  location: string;
  city: string;
  bedrooms: number;
  amenities: string[];
  images: string[];
  manageType: ManageType;
  ownerId: string;
  agentId?: string;
  status: 'active' | 'inactive';
  // Monetization
  isFeatured: boolean;
  featuredUntil?: string;
  boostedUntil?: string;
  viewsCount: number;
  isReported: boolean;
  createdAt: string;
}

export interface Application {
  id: string;
  propertyId: string;
  agentId: string;
  message: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface SavedProperty {
  userId: string;
  propertyId: string;
  savedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: string;
}