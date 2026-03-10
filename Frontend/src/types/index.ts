export type UserRole = "owner" | "agent" | "user" | "admin";
export type TrustedStatus = "none" | "pending" | "active";
export type ManageType = "owner" | "agent";
export type ApplicationStatus = "pending" | "approved" | "rejected";

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
  isBlocked?: boolean;
  createdAt: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  ownerPrice?: number;
  publicPrice?: number;
  location: string;
  city: string;
  bedrooms: number;
  amenities: string[];
  images: string[];
  manageType: ManageType;
  ownerId: string;
  agentId?: string;
  status: "active" | "inactive";

  // Booking & Availability
  availableFrom?: string;
  availableTo?: string;
  bookingStatus: "available" | "booked" | "unavailable";
  commissionPaid?: boolean;

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
  id: string;
  userId: string;
  propertyId: string;
  role: UserRole;
  savedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  ownerId: string;
  agentId?: string;
  status: "confirmed" | "completed" | "cancelled";
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  commissionAmount: number;
  commissionPaid: boolean;
  createdAt: string;
}

export interface Commission {
  id: string;
  bookingId: string;
  propertyId: string;
  payerId: string;
  amount: number;
  status: "pending" | "paid";
  createdAt: string;
}
