import { mockUsers, mockMedicalCases, mockHospitals, mockAppointments } from './mockData.js';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication Service
export class AuthService {
  static currentUser = null;

  // Login function
  static async login(email, password) {
    await delay(1000);

    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    this.currentUser = userWithoutPassword;
    
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    localStorage.setItem('authToken', 'mock_jwt_token_' + user.id);

    return userWithoutPassword;
  }

  // Register function
  static async register(userData) {
    await delay(1500);

    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

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
        emergencyContact: { name: '', phone: '', relationship: '' },
        medicalHistory: []
      }
    };

    mockUsers.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    this.currentUser = userWithoutPassword;

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
}

// Data Service for dashboard
export class DataService {
  static async getUserCases(userId) {
    await delay(800);
    return mockMedicalCases.filter(case_ => case_.userId === userId);
  }

  static async getUserAppointments(userId) {
    await delay(600);
    return mockAppointments.filter(apt => apt.userId === userId);
  }

  static async getHospitals() {
    await delay(700);
    return mockHospitals;
  }
}