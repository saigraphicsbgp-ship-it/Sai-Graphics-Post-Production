export interface StudioSettings {
  brandName: string;
  businessType: string;
  tagline: string;
  subTagline: string;
  aboutDescription: string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  address: string;
  shortAddress: string;
  instagram: string;
  facebook: string;
  googleMapsUrl: string;
  openingHours: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  imageUrl: string;
  featured: boolean;
  turnaround: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  client?: string;
  year?: string;
  featured?: boolean;
}

export interface BeforeAfterDemo {
  id: string;
  title: string;
  service: string;
  beforeLabel: string;
  afterLabel: string;
  beforeImage: string;
  afterImage: string;
  description: string;
}

export interface Enquiry {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  eventDate?: string;
  budget?: string;
  message?: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Completed';
}

export interface AdminUser {
  name: string;
  studio: string;
  role: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  role: string;
  serviceUsed: string;
  rating: number;
  quote: string;
  avatarUrl: string;
  date: string;
  turnaround?: string;
  verified?: boolean;
}

