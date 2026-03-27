const API_BASE_URL = 'http://localhost:5000/api';

// API utility functions
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: string;
  }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/me');
  },

  updateProfile: async (profileData: { name: string; phone: string }) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },
};

// Appointments API
export const appointmentsAPI = {
  getAppointments: async () => {
    return apiRequest('/appointments');
  },

  createAppointment: async (appointmentData: {
    hospital_id: number;
    doctor_name: string;
    appointment_date: string;
    appointment_time: string;
    reason: string;
  }) => {
    return apiRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },

  updateAppointment: async (id: number, status: string) => {
    return apiRequest(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Hospitals API
export const hospitalsAPI = {
  getHospitals: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    city?: string;
    state?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    
    const endpoint = queryParams.toString() ? `/hospitals?${queryParams.toString()}` : '/hospitals';
    return apiRequest(endpoint);
  },

  getHospitalById: async (id: string) => {
    return apiRequest(`/hospitals/${id}`);
  },

  searchHospitals: async (params: {
    location?: string;
    specialization?: string;
    name?: string;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiRequest(`/hospitals/search?${queryParams.toString()}`);
  },
};

// Patients API
export const patientsAPI = {
  getPatientProfile: async () => {
    return apiRequest('/patients/profile');
  },

  updatePatientProfile: async (profileData: {
    date_of_birth?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    emergency_contact?: string;
    medical_history?: string;
    blood_group?: string;
    allergies?: string;
    insurance_provider?: string;
    insurance_policy_number?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
  }) => {
    return apiRequest('/patients/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  getPatientAppointments: async () => {
    return apiRequest('/patients/appointments');
  },

  getPatientMedicalHistory: async () => {
    return apiRequest('/patients/medical-history');
  },

  createAppointment: async (appointmentData: {
    hospital_id: number;
    doctor_name: string;
    appointment_date: string;
    appointment_time: string;
    reason: string;
  }) => {
    return apiRequest('/patients/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },

  getPatientDocuments: async () => {
    return apiRequest('/patients/documents');
  },

  getPatientRegistration: async () => {
    return apiRequest('/patients/registration');
  },

  updatePatientRegistration: async (registrationData: {
    date_of_birth?: string;
    gender?: string;
    blood_group?: string;
    medical_history?: string;
    allergies?: string;
    current_medications?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
  }) => {
    return apiRequest('/patients/registration', {
      method: 'PUT',
      body: JSON.stringify(registrationData),
    });
  },

  createPatientRegistration: async (registrationData: {
    date_of_birth: string;
    gender: string;
    blood_group: string;
    medical_history?: string;
    allergies?: string;
    current_medications?: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
  }) => {
    return apiRequest('/patients/registration', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  },
};

// Upload API
export const uploadAPI = {
  uploadDocuments: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('documents', file);
    });

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/upload/documents`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    return data;
  },

  uploadProfile: async (file: File) => {
    const formData = new FormData();
    formData.append('profile', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/upload/profile`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    return data;
  },

  deleteFile: async (filename: string) => {
    return apiRequest(`/upload/file/${filename}`, {
      method: 'DELETE',
    });
  },
};

export default {
  authAPI,
  appointmentsAPI,
  hospitalsAPI,
  patientsAPI,
  uploadAPI,
};