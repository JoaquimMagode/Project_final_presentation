import { mockUsers, mockMedicalCases, mockHospitals, mockAppointments } from './mockData.js';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication Service
export class AuthService {
  static currentUser = null;

  // Login function
  static async login(email, password) {
    await delay(1000); // Simulate API call

    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    this.currentUser = userWithoutPassword;
    
    // Store in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    localStorage.setItem('authToken', 'mock_jwt_token_' + user.id);

    return userWithoutPassword;
  }

  // Register function
  static async register(userData) {
    await delay(1500); // Simulate API call

    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create new user
    const newUser = {
      id: 'user_' + Date.now(),
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      country: userData.country,
      createdAt: new Date().toISOString().split('T')[0],
      isVerified: false,
      profile: {
        dateOfBirth: '',
        gender: '',
        emergencyContact: {
          name: '',
          phone: '',
          relationship: ''
        },
        medicalHistory: []
      }
    };

    // Add to mock database
    mockUsers.push(newUser);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    this.currentUser = userWithoutPassword;

    // Store in localStorage
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    localStorage.setItem('authToken', 'mock_jwt_token_' + newUser.id);

    return userWithoutPassword;
  }

  // Logout function
  static logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  }

  // Check if user is authenticated
  static isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    return !!(token && user);
  }

  // Get current user from localStorage
  static getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }

    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
      return this.currentUser;
    }

    return null;
  }

  // Refresh user data
  static async refreshUser() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    await delay(500);
    
    const updatedUser = mockUsers.find(u => u.id === currentUser.id);
    if (updatedUser) {
      const { password: _, ...userWithoutPassword } = updatedUser;
      this.currentUser = userWithoutPassword;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }

    return null;
  }
}

// Data Service for dashboard
export class DataService {
  // Get user's medical cases
  static async getUserCases(userId) {
    await delay(800);
    return mockMedicalCases.filter(case_ => case_.userId === userId);
  }

  // Get user's appointments
  static async getUserAppointments(userId) {
    await delay(600);
    return mockAppointments.filter(apt => apt.userId === userId);
  }

  // Get hospitals
  static async getHospitals() {
    await delay(700);
    return mockHospitals;
  }

  // Submit new medical case
  static async submitCase(caseData) {
    await delay(1200);
    
    const newCase = {
      id: 'case_' + Date.now(),
      userId: caseData.userId,
      title: caseData.title,
      description: caseData.description,
      specialty: caseData.specialty,
      urgency: caseData.urgency,
      status: 'Submitted',
      submittedDate: new Date().toISOString().split('T')[0],
      documents: caseData.documents || [],
      hospitalResponses: []
    };

    mockMedicalCases.push(newCase);
    return newCase;
  }

  // Book appointment
  static async bookAppointment(appointmentData) {
    await delay(1000);
    
    const newAppointment = {
      id: 'apt_' + Date.now(),
      userId: appointmentData.userId,
      caseId: appointmentData.caseId,
      hospitalId: appointmentData.hospitalId,
      doctorName: appointmentData.doctorName,
      specialty: appointmentData.specialty,
      date: appointmentData.date,
      time: appointmentData.time,
      type: appointmentData.type,
      status: 'Pending',
      notes: appointmentData.notes || ''
    };

    mockAppointments.push(newAppointment);
    return newAppointment;
  }

  // Update user profile
  static async updateProfile(userId, profileData) {
    await delay(800);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...profileData };
      const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
      return userWithoutPassword;
    }
    
    throw new Error('User not found');
  }
}