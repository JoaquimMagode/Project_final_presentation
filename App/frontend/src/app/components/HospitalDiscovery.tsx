import { Search, MapPin, Filter, Star, Clock, CheckCircle, ArrowRight, Award, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function HospitalDiscovery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');

  const specializations = [
    { id: 'all', name: 'All Specializations' },
    { id: 'cardiology', name: 'Cardiology' },
    { id: 'oncology', name: 'Oncology' },
    { id: 'orthopedics', name: 'Orthopedics' },
    { id: 'neurology', name: 'Neurology' },
    { id: 'transplant', name: 'Organ Transplant' }
  ];

  const cities = [
    { id: 'all', name: 'All Cities' },
    { id: 'delhi', name: 'Delhi' },
    { id: 'mumbai', name: 'Mumbai' },
    { id: 'chennai', name: 'Chennai' },
    { id: 'bangalore', name: 'Bangalore' },
    { id: 'hyderabad', name: 'Hyderabad' }
  ];

  const budgetRanges = [
    { id: 'all', name: 'All Budgets' },
    { id: 'low', name: 'Under $5,000' },
    { id: 'medium', name: '$5,000 - $15,000' },
    { id: 'high', name: 'Above $15,000' }
  ];

  const hospitals = [
    {
      id: 1,
      name: 'Apollo Hospitals',
      city: 'Chennai',
      logo: '🏥',
      image: 'https://images.unsplash.com/photo-1662414185445-b9a05e26dba0',
      accreditation: ['JCI', 'NABH'],
      specializations: ['Cardiology', 'Oncology', 'Neurology'],
      responseTime: '24 hours',
      rating: 4.8,
      reviews: 2840,
      verified: true,
      languages: ['English', 'Hindi', 'Tamil'],
      description: 'Leading multi-specialty hospital with 70+ years of excellence'
    },
    {
      id: 2,
      name: 'Fortis Healthcare',
      city: 'Delhi',
      logo: '🏥',
      image: 'https://images.unsplash.com/photo-1739285388427-d6f85d12a8fc',
      accreditation: ['NABH'],
      specializations: ['Orthopedics', 'Cardiology', 'Transplant'],
      responseTime: '48 hours',
      rating: 4.6,
      reviews: 1950,
      verified: true,
      languages: ['English', 'Hindi'],
      description: 'Trusted name in healthcare with state-of-the-art facilities'
    },
    {
      id: 3,
      name: 'Medanta Hospital',
      city: 'Gurugram',
      logo: '🏥',
      image: 'https://images.unsplash.com/photo-1597058712635-3182d1eacc1e',
      accreditation: ['JCI', 'NABH'],
      specializations: ['Neurology', 'Cardiology', 'Oncology'],
      responseTime: '24 hours',
      rating: 4.7,
      reviews: 3120,
      verified: true,
      languages: ['English', 'Hindi', 'Punjabi'],
      description: 'Multi-super specialty hospital known for complex procedures'
    },
    {
      id: 4,
      name: 'Max Healthcare',
      city: 'Delhi',
      logo: '🏥',
      image: 'https://images.unsplash.com/photo-1632054229795-4097870879b4',
      accreditation: ['NABH'],
      specializations: ['Oncology', 'Orthopedics', 'Cardiology'],
      responseTime: '36 hours',
      rating: 4.5,
      reviews: 1680,
      verified: true,
      languages: ['English', 'Hindi'],
      description: 'Premium healthcare provider with international standards'
    },
    {
      id: 5,
      name: 'Manipal Hospitals',
      city: 'Bangalore',
      logo: '🏥',
      image: 'https://images.unsplash.com/photo-1662414185445-b9a05e26dba0',
      accreditation: ['JCI', 'NABH'],
      specializations: ['Transplant', 'Neurology', 'Cardiology'],
      responseTime: '48 hours',
      rating: 4.6,
      reviews: 2240,
      verified: true,
      languages: ['English', 'Hindi', 'Kannada'],
      description: 'Pan-India network of multi-specialty hospitals'
    },
    {
      id: 6,
      name: 'Narayana Health',
      city: 'Bangalore',
      logo: '🏥',
      image: 'https://images.unsplash.com/photo-1739285388427-d6f85d12a8fc',
      accreditation: ['NABH'],
      specializations: ['Cardiology', 'Oncology', 'Orthopedics'],
      responseTime: '24 hours',
      rating: 4.7,
      reviews: 2890,
      verified: true,
      languages: ['English', 'Hindi', 'Kannada', 'Tamil'],
      description: 'Affordable quality healthcare with experienced doctors'
    }
  ];

  const topDoctors = [
    {
      name: 'Dr. Rajesh Kumar',
      specialty: 'Cardiology',
      hospital: 'Apollo Hospitals, Chennai',
      experience: '25+ years',
      languages: ['English', 'Hindi', 'Tamil'],
      avatar: '👨‍⚕️'
    },
    {
      name: 'Dr. Priya Sharma',
      specialty: 'Oncology',
      hospital: 'Fortis Healthcare, Delhi',
      experience: '18+ years',
      languages: ['English', 'Hindi'],
      avatar: '👩‍⚕️'
    },
    {
      name: 'Dr. Anil Patel',
      specialty: 'Neurology',
      hospital: 'Medanta Hospital, Gurugram',
      experience: '22+ years',
      languages: ['English', 'Hindi', 'Gujarati'],
      avatar: '👨‍⚕️'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Find Verified Hospitals</h1>
          <p className="text-gray-600">Connect directly with India's top hospitals</p>
        </div>

        {/* Search Bar */}
        <Card className="p-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by disease, condition, or treatment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </Card>

        {/* Filters */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Specialization</label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {specializations.map(spec => (
                <option key={spec.id} value={spec.id}>{spec.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">City in India</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Budget Range</label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {budgetRanges.map(budget => (
                <option key={budget.id} value={budget.id}>{budget.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Hospital Listings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing {hospitals.length} verified hospitals
              </p>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
            </div>

            {hospitals.map(hospital => (
              <Card key={hospital.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="sm:w-48 h-48 flex-shrink-0">
                    <ImageWithFallback
                      src={hospital.image}
                      alt={hospital.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl text-gray-900">{hospital.name}</h3>
                          {hospital.verified && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{hospital.city}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{hospital.description}</p>

                    {/* Accreditation Badges */}
                    <div className="flex items-center gap-2 mb-3">
                      {hospital.accreditation.map(acc => (
                        <span
                          key={acc}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                        >
                          <Award className="w-3 h-3" />
                          {acc}
                        </span>
                      ))}
                    </div>

                    {/* Specializations */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hospital.specializations.map(spec => (
                        <span
                          key={spec}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-gray-900">{hospital.rating}</span>
                          <span className="text-gray-500">({hospital.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{hospital.responseTime}</span>
                        </div>
                      </div>

                      <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                        Request Appointment
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Languages */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Languages: {hospital.languages.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Doctors */}
            <Card className="p-6">
              <h3 className="text-lg text-gray-900 mb-4">Top Doctors Available</h3>
              <div className="space-y-4">
                {topDoctors.map((doctor, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-2xl">
                        {doctor.avatar}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm text-gray-900 mb-1">{doctor.name}</h4>
                        <p className="text-xs text-gray-600">{doctor.specialty}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{doctor.hospital}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{doctor.experience}</span>
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Help Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-teal-50 border-blue-200">
              <h3 className="text-lg text-gray-900 mb-2">Need Help Choosing?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our medical advisors can help you find the right hospital for your condition
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
                <Users className="w-4 h-4" />
                Talk to Advisor
              </Button>
            </Card>

            {/* Trust Info */}
            <Card className="p-6">
              <h3 className="text-lg text-gray-900 mb-4">Why Trust Us?</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-900 mb-1">100% Verified</p>
                    <p className="text-xs text-gray-600">All hospitals are verified and accredited</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-900 mb-1">No Hidden Fees</p>
                    <p className="text-xs text-gray-600">Transparent pricing from hospitals directly</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-900 mb-1">Direct Contact</p>
                    <p className="text-xs text-gray-600">No agents or intermediaries involved</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
