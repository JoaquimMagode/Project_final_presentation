
export type Language = 'EN' | 'PT' | 'FR' | 'SW';
export type UserRole = 'PATIENT' | 'HOSPITAL';

export interface Hospital {
  id: string;
  name: string;
  location: string;
  specializations: string[];
  rating: number;
  accreditation: string;
  responseTime: string;
  logo: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospitalId: string;
  experience: string;
  languages: string[];
  photo: string;
  bio: string;
  available?: boolean;
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  hospitalName: string;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

export interface VisaApplication {
  id: string;
  status: 'Draft' | 'Submitted' | 'Processing' | 'Approved' | 'Rejected';
  submissionDate: string;
  documentCount: number;
}

export interface AssistanceService {
  id: string;
  type: 'HOTEL' | 'TRAVEL' | 'LOCAL';
  title: string;
  description: string;
  priceRange: string;
}

export interface Translation {
  heroTitle: string;
  heroSubtext: string;
  ctaSubmit: string;
  ctaFind: string;
  howItWorks: string;
  verifiedBadge: string;
}
