import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Clock, ShieldCheck, Phone, Mail, Users, Award, Camera, X, Calendar } from 'lucide-react';

const HospitalDetail: React.FC = () => {
  const { id } = useParams();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const handleBookConsultation = () => {
    if (selectedDate && selectedTime) {
      alert(`Consultation booked for ${selectedDate} at ${selectedTime}`);
      setShowBookingModal(false);
    }
  };

  // Mock hospital data with detailed information
  const hospitalData = {
    'h1': {
      id: 'h1',
      name: 'Fortis Memorial Research Institute',
      location: 'Gurgaon, India',
      specializations: ['Oncology', 'Cardiology', 'Neurology', 'Orthopedics'],
      rating: 4.8,
      accreditation: 'JCI Accredited',
      responseTime: '< 4 hours',
      logo: 'https://picsum.photos/seed/fortis/100/100',
      description: 'Leading multi-specialty hospital with state-of-the-art facilities and world-class medical care.',
      established: '2001',
      beds: '1000+',
      doctors: '200+',
      phone: '+91-124-496-2200',
      email: 'info@fortishealthcare.com',
      about: 'Fortis Memorial Research Institute is a premier healthcare destination offering world-class medical services with cutting-edge technology and internationally trained specialists. The hospital provides comprehensive treatment across multiple specialties with a focus on patient safety and comfort.',
      services: [
        'Emergency Care', 'ICU Services', 'Surgical Procedures', 'Diagnostic Imaging',
        'Laboratory Services', 'Pharmacy', 'Blood Bank', 'Rehabilitation'
      ],
      facilities: [
        'Modern Operation Theaters', 'Advanced ICU Units', 'Digital Radiology',
        'Cardiac Catheterization Lab', 'Robotic Surgery', 'Transplant Center'
      ]
    },
    'h2': {
      id: 'h2',
      name: 'Apollo Hospitals',
      location: 'Chennai, India',
      specializations: ['Transplants', 'Orthopedics', 'Gastroenterology', 'Cardiology'],
      rating: 4.9,
      accreditation: 'NABH Verified',
      responseTime: '< 2 hours',
      logo: 'https://picsum.photos/seed/apollo/100/100',
      description: 'Asia\'s largest healthcare group with pioneering medical treatments and advanced technology.',
      established: '1983',
      beds: '1200+',
      doctors: '300+',
      phone: '+91-44-2829-3333',
      email: 'info@apollohospitals.com',
      about: 'Apollo Hospitals is Asia\'s foremost integrated healthcare provider with a legacy of clinical excellence and patient care. Known for pioneering organ transplants and advanced cardiac procedures, Apollo combines cutting-edge technology with compassionate care.',
      services: [
        '24/7 Emergency', 'Organ Transplants', 'Robotic Surgery', 'Nuclear Medicine',
        'Preventive Health', 'International Patient Care', 'Telemedicine', 'Home Healthcare'
      ],
      facilities: [
        'Transplant Centers', 'Robotic Surgery Suites', 'PET-CT Scanners',
        'Cardiac Cath Labs', 'Proton Therapy Center', 'Stem Cell Research'
      ]
    }
  };

  const hospital = hospitalData[id as keyof typeof hospitalData] || hospitalData['h1'];

  const patientReviews = id === 'h2' ? [
    {
      id: 1,
      name: 'Grace Adebayo',
      country: 'Nigeria',
      treatment: 'Liver Transplant',
      rating: 5,
      review: 'Apollo saved my life with their world-class transplant program. The coordination was seamless and the doctors were exceptional.',
      date: '2023-11-05',
      photo: 'https://picsum.photos/seed/apollo1/50/50'
    },
    {
      id: 2,
      name: 'Carlos Fernandes',
      country: 'Mozambique',
      treatment: 'Robotic Surgery',
      rating: 5,
      review: 'The robotic surgery at Apollo was incredible. Minimal scarring and quick recovery. Staff spoke Portuguese which helped a lot.',
      date: '2023-10-18',
      photo: 'https://picsum.photos/seed/apollo2/50/50'
    },
    {
      id: 3,
      name: 'Fatima Hassan',
      country: 'Kenya',
      treatment: 'Gastroenterology',
      rating: 4,
      review: 'Excellent gastroenterology department with advanced diagnostic equipment. The treatment plan was very effective.',
      date: '2023-09-30',
      photo: 'https://picsum.photos/seed/apollo3/50/50'
    }
  ] : [
    {
      id: 1,
      name: 'Samuel Okafor',
      country: 'Nigeria',
      treatment: 'Cardiac Surgery',
      rating: 5,
      review: 'Excellent care and professional staff. The doctors explained everything clearly and the treatment was successful.',
      date: '2023-10-15',
      photo: 'https://picsum.photos/seed/patient1/50/50'
    },
    {
      id: 2,
      name: 'Maria Santos',
      country: 'Mozambique',
      treatment: 'Orthopedic Surgery',
      rating: 5,
      review: 'Outstanding hospital with modern facilities. The Portuguese translator helped me communicate effectively.',
      date: '2023-09-22',
      photo: 'https://picsum.photos/seed/patient2/50/50'
    },
    {
      id: 3,
      name: 'John Mwangi',
      country: 'Kenya',
      treatment: 'Cancer Treatment',
      rating: 4,
      review: 'Professional treatment and caring staff. The hospital environment was very clean and comfortable.',
      date: '2023-08-10',
      photo: 'https://picsum.photos/seed/patient3/50/50'
    }
  ];

  const hospitalPhotos = [
    { id: 1, url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400', caption: 'Modern Hospital Lobby' },
    { id: 2, url: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400', caption: 'Advanced Operation Theater' },
    { id: 3, url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', caption: 'Patient Room' },
    { id: 4, url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400', caption: 'ICU Unit' },
    { id: 5, url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400', caption: 'Doctor Consultation' },
    { id: 6, url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400', caption: 'Medical Equipment' }
  ];

  return (
    <div className="space-y-8">
      {/* Hospital Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <img src={hospital.logo} alt={hospital.name} className="w-24 h-24 rounded-xl object-cover border border-slate-100" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                {hospital.accreditation}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-slate-900">{hospital.rating}</span>
              </div>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">{hospital.name}</h1>
            <p className="text-slate-600 flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4" /> {hospital.location}
            </p>
            <p className="text-slate-600 mb-4">{hospital.description}</p>
            
            {/* Brief Hospital Explanation */}
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <h3 className="font-bold text-slate-900 mb-2">About This Hospital</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {hospital.about}
              </p>
            </div>
            
            <button 
              onClick={() => setShowBookingModal(true)}
              className="mb-4 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Book a Consultation
            </button>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{hospital.beds}</div>
                <div className="text-xs text-slate-500">Beds</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{hospital.doctors}</div>
                <div className="text-xs text-slate-500">Doctors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{hospital.established}</div>
                <div className="text-xs text-slate-500">Established</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 flex items-center justify-center gap-1">
                  <Clock className="w-5 h-5" />
                  {hospital.responseTime}
                </div>
                <div className="text-xs text-slate-500">Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services & Specializations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Specializations</h2>
          <div className="flex flex-wrap gap-2">
            {hospital.specializations.map(spec => (
              <span key={spec} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-sm font-semibold">
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Services</h2>
          <div className="grid grid-cols-2 gap-2">
            {hospital.services.map(service => (
              <div key={service} className="text-sm text-slate-600 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                {service}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hospital Photos */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Hospital Gallery
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {hospitalPhotos.map(photo => (
            <div key={photo.id} className="relative group">
              <img 
                src={photo.url} 
                alt={photo.caption}
                className="w-full h-48 object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-xl flex items-end">
                <div className="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-sm font-semibold">{photo.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Reviews */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Patient Reviews
        </h2>
        <div className="space-y-6">
          {patientReviews.map(review => (
            <div key={review.id} className="border-b border-slate-100 pb-6 last:border-b-0">
              <div className="flex items-start gap-4">
                <img src={review.photo} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-slate-900">{review.name}</h3>
                    <span className="text-sm text-slate-500">from {review.country}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-emerald-600 font-semibold mb-2">{review.treatment}</p>
                  <p className="text-slate-600 mb-2">{review.review}</p>
                  <p className="text-xs text-slate-400">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact & Request Opinion */}
      <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Ready to Get Started?</h2>
            <p className="text-slate-600">Request a medical opinion from our expert doctors</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {hospital.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {hospital.email}
              </span>
            </div>
          </div>
          <button className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors">
            Request Medical Opinion
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Book Consultation
              </h3>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Date</label>
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Time</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableTimes.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 text-sm font-semibold rounded-lg border transition-colors ${
                        selectedTime === time 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-slate-700 border-slate-300 hover:border-blue-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-2">Consultation Details</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 30-minute video consultation</li>
                  <li>• Direct access to hospital specialists</li>
                  <li>• Medical report review included</li>
                  <li>• Treatment plan discussion</li>
                </ul>
              </div>
              
              <button 
                onClick={handleBookConsultation}
                disabled={!selectedDate || !selectedTime}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalDetail;