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
    documents: ['ecg_report.pdf', 'blood_test_results.pdf'],
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
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop'
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
  }
];