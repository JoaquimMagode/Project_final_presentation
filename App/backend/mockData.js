// Mock user database
export const mockUsers = [
  {
    id: '1',
    email: 'patient@demo.com',
    password: 'demo123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+234 801 234 5678',
    country: 'Nigeria',
    createdAt: '2024-01-15',
    isVerified: true,
    profile: {
      dateOfBirth: '1985-06-15',
      gender: 'Male',
      emergencyContact: {
        name: 'Jane Doe',
        phone: '+234 802 345 6789',
        relationship: 'Spouse'
      },
      medicalHistory: [
        {
          condition: 'Hypertension',
          diagnosedDate: '2020-03-10',
          status: 'Ongoing'
        }
      ]
    }
  },
  {
    id: '2',
    email: 'sarah.johnson@email.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '+254 701 234 567',
    country: 'Kenya',
    createdAt: '2024-02-20',
    isVerified: true,
    profile: {
      dateOfBirth: '1990-09-22',
      gender: 'Female',
      emergencyContact: {
        name: 'Michael Johnson',
        phone: '+254 702 345 678',
        relationship: 'Brother'
      },
      medicalHistory: []
    }
  },
  {
    id: '3',
    email: 'kwame.asante@email.com',
    password: 'secure456',
    firstName: 'Kwame',
    lastName: 'Asante',
    phone: '+233 24 123 4567',
    country: 'Ghana',
    createdAt: '2024-01-30',
    isVerified: false,
    profile: {
      dateOfBirth: '1978-12-05',
      gender: 'Male',
      emergencyContact: {
        name: 'Ama Asante',
        phone: '+233 24 234 5678',
        relationship: 'Wife'
      },
      medicalHistory: [
        {
          condition: 'Diabetes Type 2',
          diagnosedDate: '2019-08-15',
          status: 'Managed'
        }
      ]
    }
  }
];

// Mock medical cases
export const mockMedicalCases = [
  {
    id: 'case_001',
    userId: '1',
    title: 'Cardiac Consultation',
    description: 'Experiencing chest pain and shortness of breath',
    specialty: 'Cardiology',
    urgency: 'High',
    status: 'Under Review',
    submittedDate: '2024-01-20',
    documents: [
      'ecg_report.pdf',
      'blood_test_results.pdf'
    ],
    hospitalResponses: [
      {
        hospitalId: 'hosp_001',
        hospitalName: 'Apollo Hospital Delhi',
        doctorName: 'Dr. Rajesh Sharma',
        estimatedCost: '$2,500 - $3,500',
        treatmentPlan: 'Comprehensive cardiac evaluation including angiography',
        responseDate: '2024-01-22'
      }
    ]
  },
  {
    id: 'case_002',
    userId: '2',
    title: 'Orthopedic Surgery Consultation',
    description: 'Knee replacement surgery required',
    specialty: 'Orthopedics',
    urgency: 'Medium',
    status: 'Appointment Scheduled',
    submittedDate: '2024-02-25',
    documents: [
      'xray_knee.pdf',
      'mri_report.pdf'
    ],
    hospitalResponses: [
      {
        hospitalId: 'hosp_002',
        hospitalName: 'Fortis Hospital Mumbai',
        doctorName: 'Dr. Sunita Reddy',
        estimatedCost: '$4,000 - $5,500',
        treatmentPlan: 'Total knee replacement with 7-day hospital stay',
        responseDate: '2024-02-27'
      }
    ]
  }
];

// Mock hospitals
export const mockHospitals = [
  {
    id: 'hosp_001',
    name: 'Apollo Hospital Delhi',
    location: 'New Delhi, India',
    accreditation: ['NABH', 'JCI'],
    specialties: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics'],
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop',
    contact: {
      phone: '+91 11 2692 5858',
      email: 'international@apollodelhi.com'
    }
  },
  {
    id: 'hosp_002',
    name: 'Fortis Hospital Mumbai',
    location: 'Mumbai, India',
    accreditation: ['NABH', 'JCI'],
    specialties: ['Orthopedics', 'Cardiology', 'Gastroenterology'],
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
    contact: {
      phone: '+91 22 6754 4444',
      email: 'international@fortismumbai.com'
    }
  },
  {
    id: 'hosp_003',
    name: 'Max Super Speciality Hospital',
    location: 'Gurgaon, India',
    accreditation: ['NABH', 'NABL'],
    specialties: ['Oncology', 'Neurology', 'Transplant'],
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop',
    contact: {
      phone: '+91 124 662 2222',
      email: 'international@maxhealthcare.com'
    }
  }
];

// Mock appointments
export const mockAppointments = [
  {
    id: 'apt_001',
    userId: '1',
    caseId: 'case_001',
    hospitalId: 'hosp_001',
    doctorName: 'Dr. Rajesh Sharma',
    specialty: 'Cardiology',
    date: '2024-03-15',
    time: '10:00 AM',
    type: 'In-person',
    status: 'Confirmed',
    notes: 'Please bring all previous medical reports'
  },
  {
    id: 'apt_002',
    userId: '2',
    caseId: 'case_002',
    hospitalId: 'hosp_002',
    doctorName: 'Dr. Sunita Reddy',
    specialty: 'Orthopedics',
    date: '2024-03-20',
    time: '2:00 PM',
    type: 'Video Call',
    status: 'Pending',
    notes: 'Pre-surgery consultation'
  }
];