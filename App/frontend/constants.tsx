import React from 'react';
import { Hospital, Doctor, Language, Appointment, VisaApplication, AssistanceService } from './types';
import { 
  HeartPulse, 
  Stethoscope, 
  Building2, 
  ShieldCheck, 
  Calendar, 
  Search, 
  User, 
  LayoutDashboard, 
  Plane,
  Hotel,
  MapPin,
  FileText,
  Clock
} from 'lucide-react';

export const LANGUAGES: { label: string; code: Language }[] = [
  { label: 'English', code: 'EN' },
  { label: 'Português', code: 'PT' },
  { label: 'Français', code: 'FR' },
  { label: 'Kiswahili', code: 'SW' },
];

export const MOCK_HOSPITALS: Hospital[] = [
  // Mumbai Hospitals
  {
    id: 'h1',
    name: 'Apollo Hospitals Mumbai',
    location: 'Mumbai',
    specializations: ['Cardiology', 'Oncology', 'Orthopedics', 'Neurology'],
    rating: 4.9,
    accreditation: 'JCI Accredited',
    responseTime: '< 2 hours',
    logo: 'https://picsum.photos/seed/apollo1/100/100',
  },
  {
    id: 'h2',
    name: 'Fortis Hospital Mumbai',
    location: 'Mumbai',
    specializations: ['Transplants', 'Cardiac Surgery', 'Gastroenterology'],
    rating: 4.8,
    accreditation: 'NABH Verified',
    responseTime: '< 3 hours',
    logo: 'https://picsum.photos/seed/fortis1/100/100',
  },
  {
    id: 'h3',
    name: 'Lilavati Hospital Mumbai',
    location: 'Mumbai',
    specializations: ['Pediatrics', 'Orthopedics', 'Urology', 'ENT'],
    rating: 4.7,
    accreditation: 'ISO Certified',
    responseTime: '< 4 hours',
    logo: 'https://picsum.photos/seed/lilavati/100/100',
  },
  // Delhi Hospitals
  {
    id: 'h4',
    name: 'Max Healthcare Delhi',
    location: 'Delhi',
    specializations: ['Cardiology', 'Neurosurgery', 'Oncology', 'Orthopedics'],
    rating: 4.8,
    accreditation: 'JCI Accredited',
    responseTime: '< 2 hours',
    logo: 'https://picsum.photos/seed/max1/100/100',
  },
  {
    id: 'h5',
    name: 'Fortis Memorial Research Institute Delhi',
    location: 'Delhi',
    specializations: ['Oncology', 'Cardiology', 'Neurology', 'Transplants'],
    rating: 4.9,
    accreditation: 'NABH Verified',
    responseTime: '< 2 hours',
    logo: 'https://picsum.photos/seed/fortis2/100/100',
  },
  {
    id: 'h6',
    name: 'Apollo Hospitals Delhi',
    location: 'Delhi',
    specializations: ['Gastroenterology', 'Urology', 'Pediatrics', 'ENT'],
    rating: 4.7,
    accreditation: 'ISO Certified',
    responseTime: '< 3 hours',
    logo: 'https://picsum.photos/seed/apollo2/100/100',
  },
  // Bangalore Hospitals
  {
    id: 'h7',
    name: 'Apollo Hospitals Bangalore',
    location: 'Bangalore',
    specializations: ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology'],
    rating: 4.8,
    accreditation: 'JCI Accredited',
    responseTime: '< 2 hours',
    logo: 'https://picsum.photos/seed/apollo3/100/100',
  },
  {
    id: 'h8',
    name: 'Manipal Hospital Bangalore',
    location: 'Bangalore',
    specializations: ['Transplants', 'Cardiac Surgery', 'Neurosurgery', 'Oncology'],
    rating: 4.9,
    accreditation: 'NABH Verified',
    responseTime: '< 2 hours',
    logo: 'https://picsum.photos/seed/manipal/100/100',
  },
  {
    id: 'h9',
    name: 'Fortis Hospital Bangalore',
    location: 'Bangalore',
    specializations: ['Pediatrics', 'Orthopedics', 'Gastroenterology', 'Urology'],
    rating: 4.7,
    accreditation: 'ISO Certified',
    responseTime: '< 3 hours',
    logo: 'https://picsum.photos/seed/fortis3/100/100',
  },
  // Chennai Hospitals
  {
    id: 'h10',
    name: 'Apollo Hospitals Chennai',
    location: 'Chennai',
    specializations: ['Cardiology', 'Orthopedics', 'Neurology', 'Transplants'],
    rating: 4.9,
    accreditation: 'JCI Accredited',
    responseTime: '< 2 hours',
    logo: 'https://picsum.photos/seed/apollo4/100/100',
  },
  {
    id: 'h11',
    name: 'Fortis Malar Hospital Chennai',
    location: 'Chennai',
    specializations: ['Oncology', 'Cardiac Surgery', 'Neurosurgery', 'Gastroenterology'],
    rating: 4.8,
    accreditation: 'NABH Verified',
    responseTime: '< 2 hours',
    logo: 'https://picsum.photos/seed/fortis4/100/100',
  },
  {
    id: 'h12',
    name: 'Gleneagles Global Hospital Chennai',
    location: 'Chennai',
    specializations: ['Pediatrics', 'Orthopedics', 'Urology', 'ENT'],
    rating: 4.7,
    accreditation: 'ISO Certified',
    responseTime: '< 3 hours',
    logo: 'https://picsum.photos/seed/gleneagles/100/100',
  },
  // Hyderabad Hospitals
  {
    id: 'h13',
    name: 'Apollo Hospitals Hyderabad',
    location: 'Hyderabad',
    specializations: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics'],
    rating: 4.8,
    accreditation: 'JCI Accredited',
    responseTime: '< 2 hours',
    logo: 'https://picsum.photos/seed/apollo5/100/100',
  },
  {
    id: 'h14',
    name: 'Fortis Hospital Hyderabad',
    location: 'Hyderabad',
    specializations: ['Transplants', 'Cardiac Surgery', 'Neurosurgery', 'Gastroenterology'],
    rating: 4.8,
    accreditation: 'NABH Verified',
    responseTime: '< 2 hours',
    logo: 'https://picsum.photos/seed/fortis5/100/100',
  },
  {
    id: 'h15',
    name: 'Care Hospital Hyderabad',
    location: 'Hyderabad',
    specializations: ['Pediatrics', 'Orthopedics', 'Urology', 'ENT'],
    rating: 4.7,
    accreditation: 'ISO Certified',
    responseTime: '< 3 hours',
    logo: 'https://picsum.photos/seed/care/100/100',
  },
  // Pune Hospitals
  {
    id: 'h16',
    name: 'Apollo Hospitals Pune',
    location: 'Pune',
    specializations: ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology'],
    rating: 4.7,
    accreditation: 'JCI Accredited',
    responseTime: '< 3 hours',
    logo: 'https://picsum.photos/seed/apollo6/100/100',
  },
  {
    id: 'h17',
    name: 'Deenanath Mangeshkar Hospital Pune',
    location: 'Pune',
    specializations: ['Transplants', 'Cardiac Surgery', 'Neurosurgery', 'Gastroenterology'],
    rating: 4.7,
    accreditation: 'NABH Verified',
    responseTime: '< 3 hours',
    logo: 'https://picsum.photos/seed/deenanath/100/100',
  },
  {
    id: 'h18',
    name: 'Inamdar Hospital Pune',
    location: 'Pune',
    specializations: ['Pediatrics', 'Orthopedics', 'Urology', 'ENT'],
    rating: 4.6,
    accreditation: 'ISO Certified',
    responseTime: '< 4 hours',
    logo: 'https://picsum.photos/seed/inamdar/100/100',
  },
  // Kolkata Hospitals
  {
    id: 'h19',
    name: 'Apollo Hospitals Kolkata',
    location: 'Kolkata',
    specializations: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics'],
    rating: 4.7,
    accreditation: 'JCI Accredited',
    responseTime: '< 3 hours',
    logo: 'https://picsum.photos/seed/apollo7/100/100',
  },
  {
    id: 'h20',
    name: 'Fortis Hospital Kolkata',
    location: 'Kolkata',
    specializations: ['Transplants', 'Cardiac Surgery', 'Neurosurgery', 'Gastroenterology'],
    rating: 4.7,
    accreditation: 'NABH Verified',
    responseTime: '< 3 hours',
    logo: 'https://picsum.photos/seed/fortis6/100/100',
  },
  {
    id: 'h21',
    name: 'Peerless Hospital Kolkata',
    location: 'Kolkata',
    specializations: ['Pediatrics', 'Orthopedics', 'Urology', 'ENT'],
    rating: 4.6,
    accreditation: 'ISO Certified',
    responseTime: '< 4 hours',
    logo: 'https://picsum.photos/seed/peerless/100/100',
  },
  // Ahmedabad Hospitals
  {
    id: 'h22',
    name: 'Apollo Hospitals Ahmedabad',
    location: 'Ahmedabad',
    specializations: ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology'],
    rating: 4.7,
    accreditation: 'JCI Accredited',
    responseTime: '< 3 hours',
    logo: 'https://picsum.photos/seed/apollo8/100/100',
  },
  {
    id: 'h23',
    name: 'Shardaben Hospital Ahmedabad',
    location: 'Ahmedabad',
    specializations: ['Transplants', 'Cardiac Surgery', 'Neurosurgery', 'Gastroenterology'],
    rating: 4.6,
    accreditation: 'NABH Verified',
    responseTime: '< 3 hours',
    logo: 'https://picsum.photos/seed/shardaben/100/100',
  },
  {
    id: 'h24',
    name: 'Shalby Hospital Ahmedabad',
    location: 'Ahmedabad',
    specializations: ['Pediatrics', 'Orthopedics', 'Urology', 'ENT'],
    rating: 4.6,
    accreditation: 'ISO Certified',
    responseTime: '< 4 hours',
    logo: 'https://picsum.photos/seed/shalby/100/100',
  }
];

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Sandeep Vaishya',
    specialization: 'Neurosurgeon',
    hospitalId: 'h1',
    experience: '25+ Years',
    languages: ['English', 'Hindi'],
    photo: 'https://picsum.photos/seed/doc1/300/300',
    bio: 'One of the top Neurosurgeons in India with extensive experience in Gamma Knife Surgery.',
    available: true
  },
  {
    id: 'd2',
    name: 'Dr. Robert Coelho',
    specialization: 'Cardiac Surgeon',
    hospitalId: 'h2',
    experience: '20+ Years',
    languages: ['English', 'Spanish'],
    photo: 'https://picsum.photos/seed/doc2/300/300',
    bio: 'Pioneer in minimally invasive robotic heart surgery with over 6000 successful procedures.',
    available: false
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'app1', patientName: 'Samuel Mensah', doctorName: 'Dr. Sandeep Vaishya', hospitalName: 'Fortis Memorial', date: '2023-11-15', status: 'Confirmed' },
  { id: 'app2', patientName: 'Samuel Mensah', doctorName: 'Dr. Robert Coelho', hospitalName: 'Apollo Hospitals', date: '2023-12-01', status: 'Pending' }
];

export const MOCK_VISA_APPS: VisaApplication[] = [
  { id: 'v1', status: 'Processing', submissionDate: '2023-10-25', documentCount: 5 }
];

export const MOCK_ASSISTANCE: AssistanceService[] = [
  { id: 'a1', type: 'HOTEL', title: 'Radisson Blu Gurgaon', description: '5-star hotel located 2km from Fortis Memorial. Special patient rates available.', priceRange: '$$' },
  { id: 'a2', type: 'TRAVEL', title: 'Airport Pickup & Drop', description: 'Dedicated medical ambulance or private car from IGI Airport Delhi.', priceRange: '$' },
  { id: 'a3', type: 'LOCAL', title: 'Language Translator', description: 'English to Swahili/Portuguese translators for hospital visits.', priceRange: '$' }
];

export const APP_ICONS = {
  Health: <HeartPulse className="w-5 h-5" />,
  Doctor: <Stethoscope className="w-5 h-5" />,
  Hospital: <Building2 className="w-5 h-5" />,
  Verified: <ShieldCheck className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  Search: <Search className="w-5 h-5" />,
  User: <User className="w-5 h-5" />,
  Dashboard: <LayoutDashboard className="w-5 h-5" />,
  Visa: <Plane className="w-5 h-5" />,
  Hotel: <Hotel className="w-5 h-5" />,
  Local: <MapPin className="w-5 h-5" />,
  Report: <FileText className="w-5 h-5" />,
  History: <Clock className="w-5 h-5" />
};

export const TRANSLATIONS: Record<Language, any> = {
  EN: {
    heroTitle: 'Get Trusted Medical Treatment in India',
    heroSubtext: 'Connect directly with top hospitals. No agents. No hidden fees.',
    ctaSubmit: 'Submit Medical Case',
    ctaFind: 'Find Hospitals',
    steps: [
      { title: 'Upload Reports', desc: 'Securely share your medical history' },
      { title: 'Book Consultation', desc: 'Direct responses from verified doctors' },
      { title: 'Plan Trip', desc: 'Visa & travel assistance provided' },
      { title: 'Treatment', desc: 'Safe and guided medical journey' }
    ]
  },
  PT: {
    heroTitle: 'Tratamento Médico Confiável na Índia',
    heroSubtext: 'Conecte-se diretamente com os melhores hospitais. Sem agentes.',
    ctaSubmit: 'Enviar Caso Médico',
    ctaFind: 'Encontrar Hospitais',
    steps: [
      { title: 'Upload Relatórios', desc: 'Compartilhe seu histórico médico com segurança' },
      { title: 'Marcar Consulta', desc: 'Respostas diretas de médicos verificados' },
      { title: 'Planejar Viagem', desc: 'Assistência de visto e viagem fornecida' },
      { title: 'Tratamento', desc: 'Jornada médica segura e guiada' }
    ]
  },
  FR: {
    heroTitle: 'Traitement Médical de Confiance en Inde',
    heroSubtext: 'Connectez-vous directement aux meilleurs hôpitaux. Pas d\'intermédiaires.',
    ctaSubmit: 'Soumettre Cas Médical',
    ctaFind: 'Trouver des Hôpitaux',
    steps: [
      { title: 'Rapports', desc: 'Partagez votre dossier en toute sécurité' },
      { title: 'Réserver Consultation', desc: 'Réponses des médecins vérifiés' },
      { title: 'Voyage', desc: 'Assistance visa et voyage incluse' },
      { title: 'Soin', desc: 'Un parcours médical sécurisé' }
    ]
  },
  SW: {
    heroTitle: 'Pata Matibabu ya Kuaminika nchini India',
    heroSubtext: 'Unganishwa moja kwa moja na hospitali kuu. Hakuna madalali.',
    ctaSubmit: 'Tuma Kesi ya Matibabu',
    ctaFind: 'Tafuta Hospitali',
    steps: [
      { title: 'Pakia Ripoti', desc: 'Shiriki historia yako kwa usalama' },
      { title: 'Weka Mazungumzo', desc: 'Majibu kutoka kwa madaktari walioidhinishwa' },
      { title: 'Panga Safari', desc: 'Msaada wa visa na safari unapatikana' },
      { title: 'Matibabu', desc: 'Safari ya matibabu salama' }
    ]
  }
};
