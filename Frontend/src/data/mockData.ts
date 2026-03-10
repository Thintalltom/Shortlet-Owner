import { User, Property, Application, Booking, Commission } from '../types';

export const mockUsers: User[] = [
{
  id: 'owner-1',
  name: 'Chidi Okonkwo',
  email: 'chidi@example.com',
  phone: '+2348012345678',
  role: 'owner',
  trustedStatus: 'none',
  bio: 'Property investor with 10+ years experience in Lagos real estate.',
  profileImage: 'https://i.pravatar.cc/150?img=11',
  createdAt: '2024-01-15T10:00:00Z'
},
{
  id: 'owner-2',
  name: 'Amaka Eze',
  email: 'amaka@example.com',
  phone: '+2348023456789',
  role: 'owner',
  trustedStatus: 'none',
  bio: 'Real estate developer based in Abuja with premium shortlet properties.',
  profileImage: 'https://i.pravatar.cc/150?img=5',
  createdAt: '2024-02-10T10:00:00Z'
},
{
  id: 'agent-1',
  name: 'Emeka Nwosu',
  email: 'emeka@example.com',
  phone: '+2348034567890',
  role: 'agent',
  trustedStatus: 'none',
  bio: 'Professional shortlet manager with 5+ years experience. Specializing in Lekki and Victoria Island properties. I ensure seamless guest experiences.',
  profileImage: 'https://i.pravatar.cc/150?img=3',
  whatsapp: '+2348034567890',
  createdAt: '2024-01-20T10:00:00Z'
},
{
  id: 'agent-2',
  name: 'Fatima Aliyu',
  email: 'fatima@example.com',
  phone: '+2348045678901',
  role: 'agent',
  trustedStatus: 'none',
  bio: 'Abuja-based shortlet specialist. I manage premium properties in Maitama and Wuse. Trusted by over 20 property owners.',
  profileImage: 'https://i.pravatar.cc/150?img=9',
  whatsapp: '+2348045678901',
  createdAt: '2024-01-25T10:00:00Z'
},
{
  id: 'agent-3',
  name: 'Tunde Adeyemi',
  email: 'tunde@example.com',
  phone: '+2348056789012',
  role: 'agent',
  trustedStatus: 'none',
  bio: 'New to shortlet management but very dedicated. Looking to build a strong portfolio in Lagos.',
  profileImage: 'https://i.pravatar.cc/150?img=7',
  whatsapp: '+2348056789012',
  createdAt: '2024-03-01T10:00:00Z'
},
{
  id: 'agent-4',
  name: 'Blessing Okafor',
  email: 'blessing@example.com',
  phone: '+2348067890123',
  role: 'agent',
  trustedStatus: 'none',
  bio: 'Passionate about connecting guests with beautiful shortlet properties. Based in Lagos.',
  profileImage: 'https://i.pravatar.cc/150?img=8',
  whatsapp: '+2348067890123',
  createdAt: '2024-03-05T10:00:00Z'
},
{
  id: 'user-1',
  name: 'Ngozi Ibe',
  email: 'ngozi@example.com',
  phone: '+2348078901234',
  role: 'user',
  trustedStatus: 'none',
  bio: 'Frequent traveler',
  profileImage: 'https://i.pravatar.cc/150?img=20',
  createdAt: '2024-03-10T10:00:00Z'
},
{
  id: 'user-2',
  name: 'Yusuf Bello',
  email: 'yusuf@example.com',
  phone: '+2348089012345',
  role: 'user',
  trustedStatus: 'none',
  bio: 'Business traveler',
  profileImage: 'https://i.pravatar.cc/150?img=12',
  createdAt: '2024-03-15T10:00:00Z'
},
{
  id: 'admin-1',
  name: 'Admin',
  email: 'admin@shortletconnect.ng',
  phone: '+2340000000000',
  role: 'admin',
  trustedStatus: 'none',
  createdAt: '2024-01-01T10:00:00Z'
}];


export const mockProperties: Property[] = [
{
  id: 'prop-1',
  title: 'Luxury 3-Bedroom Apartment in Lekki Phase 1',
  description:
  'Experience the pinnacle of Lagos living in this stunning 3-bedroom apartment. Fully furnished with modern amenities, 24/7 power supply, and breathtaking views. Located in the heart of Lekki Phase 1, minutes from the best restaurants and shopping centers. Perfect for business travelers and families.',
  price: 65000,
  ownerPrice: 60000,
  publicPrice: 65000,
  location: 'Lekki Phase 1, Lagos',
  city: 'Lagos',
  bedrooms: 3,
  amenities: [
  'WiFi',
  'Air Conditioning',
  '24/7 Power',
  'Security',
  'Parking',
  'Swimming Pool',
  'Gym',
  'Smart TV'],

  images: [
  'https://images.unsplash.com/photo-1522708323902-d4b7e7b7b7b7?w=800&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'],

  manageType: 'agent',
  ownerId: 'owner-1',
  agentId: 'agent-1',
  status: 'active',
  availableFrom: '2024-03-01T00:00:00Z',
  availableTo: '2024-12-31T00:00:00Z',
  bookingStatus: 'booked',
  commissionPaid: false,
  isFeatured: true,
  featuredUntil: '2025-12-31T00:00:00Z',
  boostedUntil: '2025-04-30T00:00:00Z',
  viewsCount: 342,
  isReported: false,
  createdAt: '2024-02-01T10:00:00Z'
},
{
  id: 'prop-2',
  title: 'Modern 2-Bedroom Flat in Victoria Island',
  description:
  'Stylish and contemporary 2-bedroom flat in the prestigious Victoria Island. Fully equipped kitchen, high-speed internet, and premium furnishings. Walking distance to major banks, restaurants, and the beach. Ideal for corporate guests and short-term stays.',
  price: 55000,
  ownerPrice: 55000,
  location: 'Victoria Island, Lagos',
  city: 'Lagos',
  bedrooms: 2,
  amenities: [
  'WiFi',
  'Air Conditioning',
  '24/7 Power',
  'Security',
  'Parking',
  'Smart TV'],

  images: [
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80'],

  manageType: 'owner',
  ownerId: 'owner-1',
  status: 'active',
  availableFrom: '2024-03-01T00:00:00Z',
  availableTo: '2024-12-31T00:00:00Z',
  bookingStatus: 'available',
  commissionPaid: true,
  isFeatured: true,
  featuredUntil: '2025-12-31T00:00:00Z',
  viewsCount: 218,
  isReported: false,
  createdAt: '2024-02-05T10:00:00Z'
},
{
  id: 'prop-3',
  title: 'Cozy 1-Bedroom Studio in Ikeja GRA',
  description:
  'Perfect starter shortlet in the serene Ikeja GRA. This cozy studio apartment is ideal for solo travelers and business visitors. Close to the airport and major business districts. Clean, comfortable, and well-maintained.',
  price: 25000,
  ownerPrice: 25000,
  location: 'Ikeja GRA, Lagos',
  city: 'Lagos',
  bedrooms: 1,
  amenities: [
  'WiFi',
  'Air Conditioning',
  'Power Backup',
  'Security',
  'Smart TV'],

  images: [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'],

  manageType: 'agent',
  ownerId: 'owner-1',
  agentId: 'agent-3',
  status: 'active',
  availableFrom: '2024-03-01T00:00:00Z',
  availableTo: '2024-12-31T00:00:00Z',
  bookingStatus: 'available',
  commissionPaid: true,
  isFeatured: false,
  boostedUntil: '2025-04-20T00:00:00Z',
  viewsCount: 89,
  isReported: false,
  createdAt: '2024-02-10T10:00:00Z'
},
{
  id: 'prop-4',
  title: 'Executive 4-Bedroom Duplex in Ajah',
  description:
  'Spacious executive duplex perfect for families and large groups. Features 4 bedrooms, a large living area, fully equipped kitchen, and a private garden. Located in a gated estate in Ajah with 24/7 security and power supply.',
  price: 85000,
  ownerPrice: 85000,
  location: 'Ajah, Lagos',
  city: 'Lagos',
  bedrooms: 4,
  amenities: [
  'WiFi',
  'Air Conditioning',
  '24/7 Power',
  'Security',
  'Parking',
  'Smart TV'],

  images: [
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'],

  manageType: 'owner',
  ownerId: 'owner-1',
  status: 'active',
  availableFrom: '2024-03-01T00:00:00Z',
  availableTo: '2024-12-31T00:00:00Z',
  bookingStatus: 'available',
  commissionPaid: true,
  isFeatured: false,
  viewsCount: 156,
  isReported: false,
  createdAt: '2024-02-15T10:00:00Z'
},
{
  id: 'prop-5',
  title: 'Premium 3-Bedroom Apartment in Maitama',
  description:
  'Elegant 3-bedroom apartment in the exclusive Maitama district of Abuja. Tastefully furnished with high-end finishes, panoramic city views, and top-notch security. Perfect for diplomats, executives, and discerning travelers.',
  price: 75000,
  ownerPrice: 70000,
  publicPrice: 75000,
  location: 'Maitama, Abuja',
  city: 'Abuja',
  bedrooms: 3,
  amenities: [
  'WiFi',
  'Air Conditioning',
  '24/7 Power',
  'Security',
  'Parking',
  'Swimming Pool',
  'Smart TV',
  'Gym'],

  images: [
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'],

  manageType: 'agent',
  ownerId: 'owner-2',
  agentId: 'agent-2',
  status: 'active',
  availableFrom: '2024-03-01T00:00:00Z',
  availableTo: '2024-12-31T00:00:00Z',
  bookingStatus: 'booked',
  commissionPaid: true,
  isFeatured: true,
  featuredUntil: '2025-12-31T00:00:00Z',
  viewsCount: 287,
  isReported: false,
  createdAt: '2024-02-20T10:00:00Z'
},
{
  id: 'prop-6',
  title: 'Stylish 2-Bedroom Flat in Wuse 2',
  description:
  'Contemporary 2-bedroom flat in the vibrant Wuse 2 area. Close to embassies, shopping malls, and fine dining. Fully furnished with modern appliances and reliable internet connection. Great for extended stays.',
  price: 45000,
  ownerPrice: 45000,
  location: 'Wuse 2, Abuja',
  city: 'Abuja',
  bedrooms: 2,
  amenities: [
  'WiFi',
  'Air Conditioning',
  'Power Backup',
  'Security',
  'Parking',
  'Smart TV'],

  images: [
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  'https://images.unsplash.com/photo-1522771739844-6a9f6a868522?w=800&q=80'],

  manageType: 'owner',
  ownerId: 'owner-2',
  status: 'active',
  availableFrom: '2024-03-01T00:00:00Z',
  availableTo: '2024-12-31T00:00:00Z',
  bookingStatus: 'available',
  commissionPaid: true,
  isFeatured: false,
  viewsCount: 74,
  isReported: false,
  createdAt: '2024-02-25T10:00:00Z'
},
{
  id: 'prop-7',
  title: 'Affordable 1-Bedroom Apartment in Garki',
  description:
  'Budget-friendly yet comfortable 1-bedroom apartment in Garki, Abuja. Ideal for solo travelers and business visitors on a budget. Clean, secure, and well-located near government offices and transport links.',
  price: 15000,
  ownerPrice: 15000,
  location: 'Garki, Abuja',
  city: 'Abuja',
  bedrooms: 1,
  amenities: ['WiFi', 'Air Conditioning', 'Security', 'Smart TV'],
  images: [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  'https://images.unsplash.com/photo-1522771739844-6a9f6a868522?w=800&q=80',
  'https://images.unsplash.com/photo-1522708323902-d4b7e7b7b7b7?w=800&q=80'],

  manageType: 'agent',
  ownerId: 'owner-2',
  agentId: 'agent-2',
  status: 'active',
  availableFrom: '2024-03-01T00:00:00Z',
  availableTo: '2024-12-31T00:00:00Z',
  bookingStatus: 'available',
  commissionPaid: true,
  isFeatured: false,
  viewsCount: 43,
  isReported: false,
  createdAt: '2024-03-01T10:00:00Z'
},
{
  id: 'prop-8',
  title: 'Penthouse Suite in Victoria Island',
  description:
  'Breathtaking penthouse suite with panoramic ocean views in Victoria Island. The ultimate luxury shortlet experience in Lagos. Features a private terrace, jacuzzi, and premium furnishings. Perfect for special occasions and VIP guests.',
  price: 120000,
  ownerPrice: 120000,
  location: 'Victoria Island, Lagos',
  city: 'Lagos',
  bedrooms: 2,
  amenities: [
  'WiFi',
  'Air Conditioning',
  '24/7 Power',
  'Security',
  'Parking',
  'Smart TV'],

  images: [
  'https://images.unsplash.com/photo-1522771739844-6a9f6a868522?w=800&q=80',
  'https://images.unsplash.com/photo-1522708323902-d4b7e7b7b7b7?w=800&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],

  manageType: 'owner',
  ownerId: 'owner-1',
  status: 'active',
  availableFrom: '2024-03-01T00:00:00Z',
  availableTo: '2024-12-31T00:00:00Z',
  bookingStatus: 'available',
  commissionPaid: true,
  isFeatured: false,
  viewsCount: 198,
  isReported: false,
  createdAt: '2024-03-05T10:00:00Z'
}];


export const mockApplications: Application[] = [
{
  id: 'app-1',
  propertyId: 'prop-1',
  agentId: 'agent-1',
  message:
  'I have extensive experience managing luxury properties in Lekki. I can guarantee high occupancy rates and excellent guest reviews.',
  status: 'approved',
  createdAt: '2024-02-02T10:00:00Z'
},
{
  id: 'app-2',
  propertyId: 'prop-1',
  agentId: 'agent-3',
  message:
  'I would love to manage this property. I am dedicated and will ensure the best guest experience.',
  status: 'rejected',
  createdAt: '2024-02-03T10:00:00Z'
},
{
  id: 'app-3',
  propertyId: 'prop-3',
  agentId: 'agent-3',
  message:
  'This property is in my area and I can manage it effectively. I have local knowledge of Ikeja GRA.',
  status: 'approved',
  createdAt: '2024-02-11T10:00:00Z'
},
{
  id: 'app-4',
  propertyId: 'prop-5',
  agentId: 'agent-2',
  message:
  'As an Abuja specialist, I am perfectly positioned to manage this premium Maitama property. My track record speaks for itself.',
  status: 'approved',
  createdAt: '2024-02-21T10:00:00Z'
},
{
  id: 'app-5',
  propertyId: 'prop-7',
  agentId: 'agent-2',
  message:
  'I can manage this Garki property alongside my other Abuja listings for maximum efficiency.',
  status: 'approved',
  createdAt: '2024-03-02T10:00:00Z'
},
{
  id: 'app-6',
  propertyId: 'prop-2',
  agentId: 'agent-1',
  message:
  'Victoria Island is my specialty. I would love to add this property to my portfolio.',
  status: 'pending',
  createdAt: '2024-03-10T10:00:00Z'
},
{
  id: 'app-7',
  propertyId: 'prop-4',
  agentId: 'agent-4',
  message:
  'I am very interested in managing this duplex. I have connections with corporate clients who need family-sized accommodations.',
  status: 'pending',
  createdAt: '2024-03-12T10:00:00Z'
}];


export const mockBookings: Booking[] = [
{
  id: 'book-1',
  propertyId: 'prop-1',
  userId: 'user-1',
  ownerId: 'owner-1',
  agentId: 'agent-1',
  status: 'confirmed',
  checkIn: '2024-04-10',
  checkOut: '2024-04-15',
  totalPrice: 325000,
  commissionAmount: 9750,
  commissionPaid: false,
  createdAt: '2024-03-20T10:00:00Z'
},
{
  id: 'book-2',
  propertyId: 'prop-5',
  userId: 'user-2',
  ownerId: 'owner-2',
  agentId: 'agent-2',
  status: 'completed',
  checkIn: '2024-03-01',
  checkOut: '2024-03-05',
  totalPrice: 300000,
  commissionAmount: 9000,
  commissionPaid: true,
  createdAt: '2024-02-25T10:00:00Z'
}];


export const mockCommissions: Commission[] = [
{
  id: 'comm-1',
  bookingId: 'book-1',
  propertyId: 'prop-1',
  payerId: 'agent-1',
  amount: 9750,
  status: 'pending',
  createdAt: '2024-03-20T10:00:00Z'
},
{
  id: 'comm-2',
  bookingId: 'book-2',
  propertyId: 'prop-5',
  payerId: 'agent-2',
  amount: 9000,
  status: 'paid',
  createdAt: '2024-02-25T10:00:00Z'
}];