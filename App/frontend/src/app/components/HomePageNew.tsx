import { ArrowRight, Upload, Search, Calendar, Plane, Shield, CheckCircle, Users, Clock, Lock, Phone, Star, Play, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import TestimonialV2 from './ui/testimonial-v2';
import { useState, useEffect } from 'react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      src: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=700&fit=crop',
      alt: 'Indian Cardiologist',
      caption: 'Dr. Rajesh Sharma - Leading Cardiologist',
      subtitle: 'Apollo Hospital, New Delhi'
    },
    {
      src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=700&fit=crop',
      alt: 'Modern Indian Hospital',
      caption: 'World-Class Medical Facilities',
      subtitle: 'NABH & JCI Accredited Hospitals'
    },
    {
      src: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&h=700&fit=crop',
      alt: 'Advanced Medical Equipment',
      caption: 'State-of-the-Art Technology',
      subtitle: 'Latest Surgical Equipment & MRI'
    },
    {
      src: 'https://images.unsplash.com/photo-1594824475317-d3c0b0e8b5e0?w=600&h=700&fit=crop',
      alt: 'Indian Female Doctor',
      caption: 'Dr. Priya Patel - Oncology Specialist',
      subtitle: 'Fortis Hospital, Mumbai'
    },
    {
      src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=700&fit=crop',
      alt: 'Hospital Operating Room',
      caption: 'Advanced Surgical Suites',
      subtitle: 'Robotic Surgery & Minimally Invasive Procedures'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const features = [
    {
      icon: Upload,
      title: 'Patient Module',
      description: 'Complete registration, profile management, medical report upload, and appointment requests in one centralized platform.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
    },
    {
      icon: Search,
      title: 'Hospital & Doctor Module',
      description: 'Verified hospital profiles, doctor specializations, availability management, and direct response to patient requests.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop'
    },
    {
      icon: Calendar,
      title: 'Search & Filtering',
      description: 'Advanced disease-based and specialization-based hospital and doctor search with intelligent matching.',
      image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop'
    }
  ];

  const services = [
    {
      icon: Shield,
      title: 'Verified Hospitals Only',
      description: 'Centralized platform with only verified Indian hospitals and medical services'
    },
    {
      icon: Phone,
      title: 'Direct Communication',
      description: 'Eliminate intermediaries ensuring transparent and trustworthy communication'
    },
    {
      icon: Calendar,
      title: 'Appointment & Assistance',
      description: 'Complete appointment scheduling, medical travel guidance, and local support'
    },
    {
      icon: Users,
      title: 'Visa Application Support',
      description: 'Effective visa management and reduced e-visa rejection through accurate guidance'
    }
  ];

  const doctors = [
    {
      name: 'Apollo Hospital Delhi',
      specialty: 'Multi-Specialty',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&h=200&fit=crop'
    },
    {
      name: 'Fortis Hospital Mumbai',
      specialty: 'Cardiac & Oncology',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=200&fit=crop'
    },
    {
      name: 'Max Hospital Gurgaon',
      specialty: 'Neurology & Orthopedics',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=200&h=200&fit=crop'
    },
    {
      name: 'AIIMS New Delhi',
      specialty: 'Government Multi-Specialty',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1662414185445-b9a05e26dba0?w=200&h=200&fit=crop'
    }
  ];

  const faqs = [
    {
      question: 'How does this platform help African patients?',
      answer: 'Our platform specifically connects African patients directly with verified Indian hospitals, eliminating intermediaries and ensuring transparent communication for medical tourism.'
    },
    {
      question: 'What Indian hospitals are available on the platform?',
      answer: 'We feature verified Indian hospitals including Apollo, Fortis, Max Healthcare, AIIMS, and other top-rated medical facilities across India.'
    },
    {
      question: 'What support is provided for African patients traveling to India?',
      answer: 'We provide comprehensive visa application support, medical travel guidance, hospital coordination, and local assistance throughout your journey to India.'
    },
    {
      question: 'How are Indian hospitals verified on the platform?',
      answer: 'All Indian hospitals undergo thorough verification processes and are selected based on their NABH/JCI accreditation, specializations, and quality standards.'
    },
    {
      question: 'What countries in Africa does this platform serve?',
      answer: 'We serve patients from Nigeria, Kenya, Ghana, South Africa, Tanzania, Uganda, and other African countries seeking medical treatment in India.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Professional Carousel */}
      <section className="relative bg-gradient-to-br from-teal-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  African Medical Tourism —<br />
                  <span className="text-teal-600">Find Indian Hospitals</span><br />
                  Direct Connection Platform
                </h1>
                <p className="text-lg text-gray-600 max-w-lg">
                  Empowering African patients with direct access to verified Indian hospitals. 
                  Eliminating intermediaries for transparent, efficient, and reliable medical travel to India.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => onNavigate('dashboard')}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg"
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-4 text-lg flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-teal-600" />
                  <span className="text-sm text-gray-600">NABH Accredited</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600" />
                  <span className="text-sm text-gray-600">JCI Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-teal-600" />
                  <span className="text-sm text-gray-600">Secure Platform</span>
                </div>
              </div>
            </div>

            {/* Professional Medical Carousel */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {carouselImages.map((image, index) => (
                    <div key={index} className="w-full flex-shrink-0 relative">
                      <ImageWithFallback
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-[500px] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-xl font-bold mb-1">{image.caption}</h3>
                        <p className="text-sm opacity-90">{image.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentSlide ? 'bg-white scale-110' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute top-8 right-8 bg-white rounded-xl p-4 shadow-lg z-20">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">200+ Indian Hospitals</span>
                </div>
              </div>
              
              <div className="absolute bottom-8 right-8 bg-white rounded-xl p-4 shadow-lg z-20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">98%</div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 mb-6">Trusted by 10,000+ African patients to find the best hospitals in India</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">NABH</div>
              <div className="text-sm text-gray-600">Accredited</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">JCI</div>
              <div className="text-sm text-gray-600">Certified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">ISO</div>
              <div className="text-sm text-gray-600">Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">HIPAA</div>
              <div className="text-sm text-gray-600">Secure</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Platform for African Patients
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience seamless medical tourism with our centralized platform connecting African patients 
              directly with verified Indian hospitals and medical facilities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-video overflow-hidden">
                  <ImageWithFallback
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Consultation Section */}
      <section className="bg-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                African Medical Tourism to India
              </h2>
              <p className="text-xl text-teal-100 mb-8">
                A specialized platform designed for African patients seeking quality medical treatment in India. 
                Direct connection with verified Indian hospitals based on medical needs and specialization.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                {services.map((service, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{service.title}</h3>
                      <p className="text-sm text-teal-100">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                onClick={() => onNavigate('dashboard')}
                className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4"
              >
                Start Consultation
              </Button>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="aspect-video bg-white/20 rounded-xl mb-6 flex items-center justify-center">
                  <Play className="w-16 h-16 text-white/80" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium">Dr. Sarah Johnson</div>
                      <div className="text-xs text-teal-100">Cardiologist</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Eliminating Intermediaries,<br />Ensuring Transparency
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">2M+</div>
              <div className="text-lg text-gray-600 flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-teal-600" />
                Consultations
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">600K</div>
              <div className="text-lg text-gray-600 flex items-center justify-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                Active Users
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">99%</div>
              <div className="text-lg text-gray-600 flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-teal-600" />
                Satisfaction Rate
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"
              alt="Medical consultation"
              className="rounded-xl shadow-lg"
            />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop"
              alt="Hospital facility"
              className="rounded-xl shadow-lg"
            />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop"
              alt="Medical technology"
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-teal-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl font-medium mb-6">
              "As an African patient, this platform eliminated all the confusion and stress of finding reliable hospitals in India. 
              Direct communication with verified Indian hospitals gave me confidence, and the visa guidance ensured 
              my application was approved without any issues."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1494790108755-2616c9c0b8d3?w=60&h=60&fit=crop&crop=face"
                alt="Patient testimonial"
                className="w-12 h-12 rounded-full"
              />
              <div className="text-left">
                <div className="font-semibold">Amara Okafor</div>
                <div className="text-teal-200 text-sm">Patient from Nigeria</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Connect with Top Indian Hospitals
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {doctors.map((hospital, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="relative mb-4">
                  <ImageWithFallback
                    src={hospital.image}
                    alt={hospital.name}
                    className="w-20 h-20 rounded-lg mx-auto object-cover"
                  />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 w-6 h-6 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{hospital.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{hospital.specialty}</p>
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-current text-yellow-400" />
                  <span className="text-sm font-medium">{hospital.rating}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between cursor-pointer">
                  <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-gray-600 mt-3">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Reliable. Transparent.<br />African Medical Tourism to India.
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Start your medical journey to India with Africa's most trusted platform for finding verified Indian hospitals.
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate('dashboard')}
            className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 text-lg"
          >
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
}