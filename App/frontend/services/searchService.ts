import { Hospital, Doctor } from '../types';

export interface SearchFilters {
  specialization?: string;
  disease?: string;
  location?: string;
  minRating?: number;
  maxResponseTime?: number;
  searchTerm?: string;
  sortBy?: 'rating' | 'responseTime' | 'name';
}

export interface DiseaseMapping {
  [key: string]: string[];
}

// Map diseases to relevant specializations
const DISEASE_TO_SPECIALIZATION: DiseaseMapping = {
  'heart disease': ['Cardiology', 'Cardiac Surgery'],
  'diabetes': ['Endocrinology', 'Internal Medicine'],
  'cancer': ['Oncology', 'Surgical Oncology'],
  'arthritis': ['Rheumatology', 'Orthopedics'],
  'asthma': ['Pulmonology', 'Respiratory Medicine'],
  'kidney disease': ['Nephrology', 'Urology'],
  'liver disease': ['Hepatology', 'Gastroenterology'],
  'thyroid': ['Endocrinology', 'Internal Medicine'],
  'mental health': ['Psychiatry', 'Psychology'],
  'pregnancy': ['Obstetrics & Gynecology', 'Maternal Medicine'],
  'bone': ['Orthopedics', 'Rheumatology'],
  'lung': ['Pulmonology', 'Thoracic Surgery'],
  'stomach': ['Gastroenterology', 'General Surgery'],
  'brain': ['Neurology', 'Neurosurgery'],
  'eye': ['Ophthalmology', 'Optometry'],
  'ear': ['Otolaryngology', 'ENT'],
  'skin': ['Dermatology'],
  'tooth': ['Dentistry', 'Oral Surgery'],
  'blood': ['Hematology', 'Oncology'],
  'infection': ['Infectious Disease', 'Internal Medicine'],
};

export const searchService = {
  /**
   * Get specializations for a given disease
   */
  getSpecializationsForDisease(disease: string): string[] {
    const normalized = disease.toLowerCase().trim();
    for (const [key, specs] of Object.entries(DISEASE_TO_SPECIALIZATION)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return specs;
      }
    }
    return [];
  },

  /**
   * Filter hospitals based on search criteria
   */
  filterHospitals(hospitals: Hospital[], filters: SearchFilters): Hospital[] {
    return hospitals.filter(hospital => {
      // Filter by specialization
      if (filters.specialization) {
        const hasSpecialization = hospital.specializations.some(spec =>
          spec.toLowerCase().includes(filters.specialization!.toLowerCase())
        );
        if (!hasSpecialization) return false;
      }

      // Filter by disease (convert to specialization)
      if (filters.disease) {
        const requiredSpecs = this.getSpecializationsForDisease(filters.disease);
        if (requiredSpecs.length > 0) {
          const hasRequiredSpec = hospital.specializations.some(spec =>
            requiredSpecs.some(req => req.toLowerCase() === spec.toLowerCase())
          );
          if (!hasRequiredSpec) return false;
        }
      }

      // Filter by location
      if (filters.location) {
        if (!hospital.location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // Filter by minimum rating
      if (filters.minRating !== undefined) {
        if (hospital.rating < filters.minRating) return false;
      }

      // Filter by response time
      if (filters.maxResponseTime !== undefined) {
        const responseTimeMinutes = parseInt(hospital.responseTime);
        if (responseTimeMinutes > filters.maxResponseTime) return false;
      }

      // Filter by search term (name or specialization)
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const matchesName = hospital.name.toLowerCase().includes(term);
        const matchesSpec = hospital.specializations.some(s => s.toLowerCase().includes(term));
        if (!matchesName && !matchesSpec) return false;
      }

      return true;
    });
  },

  /**
   * Sort hospitals based on criteria
   */
  sortHospitals(hospitals: Hospital[], sortBy: 'rating' | 'responseTime' | 'name' = 'rating'): Hospital[] {
    const sorted = [...hospitals];
    
    switch (sortBy) {
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'responseTime':
        return sorted.sort((a, b) => {
          const timeA = parseInt(a.responseTime);
          const timeB = parseInt(b.responseTime);
          return timeA - timeB;
        });
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  },

  /**
   * Filter doctors based on search criteria
   */
  filterDoctors(doctors: Doctor[], filters: SearchFilters): Doctor[] {
    return doctors.filter(doctor => {
      // Filter by specialization
      if (filters.specialization) {
        if (!doctor.specialization.toLowerCase().includes(filters.specialization.toLowerCase())) {
          return false;
        }
      }

      // Filter by disease (convert to specialization)
      if (filters.disease) {
        const requiredSpecs = this.getSpecializationsForDisease(filters.disease);
        if (requiredSpecs.length > 0) {
          const hasRequiredSpec = requiredSpecs.some(req =>
            req.toLowerCase() === doctor.specialization.toLowerCase()
          );
          if (!hasRequiredSpec) return false;
        }
      }

      // Filter by search term (name or specialization)
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const matchesName = doctor.name.toLowerCase().includes(term);
        const matchesSpec = doctor.specialization.toLowerCase().includes(term);
        if (!matchesName && !matchesSpec) return false;
      }

      // Filter by availability
      if (filters.searchTerm === 'available' && !doctor.available) {
        return false;
      }

      return true;
    });
  },

  /**
   * Get all unique specializations from hospitals
   */
  getAllSpecializations(hospitals: Hospital[]): string[] {
    const specs = new Set<string>();
    hospitals.forEach(h => {
      h.specializations.forEach(s => specs.add(s));
    });
    return Array.from(specs).sort();
  },

  /**
   * Get all unique locations from hospitals
   */
  getAllLocations(hospitals: Hospital[]): string[] {
    const locations = new Set<string>();
    hospitals.forEach(h => {
      locations.add(h.location);
    });
    return Array.from(locations).sort();
  },

  /**
   * Get disease suggestions based on input
   */
  getDiseaseSuggestions(input: string): string[] {
    const normalized = input.toLowerCase();
    return Object.keys(DISEASE_TO_SPECIALIZATION)
      .filter(disease => disease.includes(normalized))
      .slice(0, 5);
  },
};
