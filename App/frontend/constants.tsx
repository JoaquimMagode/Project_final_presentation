
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
  {
    id: 'h1',
    name: 'Fortis Memorial Research Institute',
    location: 'Gurgaon, India',
    specializations: ['Oncology', 'Cardiology', 'Neurology'],
    rating: 4.8,
    accreditation: 'JCI Accredited',
    responseTime: '< 4 hours',
    logo: 'https://picsum.photos/seed/fortis/100/100',
  },
  {
    id: 'h2',
    name: 'Apollo Hospitals',
    location: 'Chennai, India',
    specializations: ['Transplants', 'Orthopedics', 'Gastroenterology'],
    rating: 4.9,
    accreditation: 'NABH Verified',
    responseTime: '< 2 hours',
    logo: 'https://picsum.photos/seed/apollo/100/100',
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
      { title: 'Get Opinions', desc: 'Direct responses from verified doctors' },
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
      { title: 'Receber Opiniões', desc: 'Respostas diretas de médicos verificados' },
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
      { title: 'Avis Directs', desc: 'Réponses des médecins vérifiés' },
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
      { title: 'Pata Maoni', desc: 'Majibu kutoka kwa madaktari walioidhinishwa' },
      { title: 'Panga Safari', desc: 'Msaada wa visa na safari unapatikana' },
      { title: 'Matibabu', desc: 'Safari ya matibabu salama' }
    ]
  }
};
