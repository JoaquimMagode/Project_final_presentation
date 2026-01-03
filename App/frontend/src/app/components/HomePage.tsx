import { ArrowRight, Upload, Search, Calendar, Plane, Shield, CheckCircle, Users, Clock, Lock, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const countries = [
    { name: 'Nigeria', flag: '🇳🇬' },
    { name: 'Kenya', flag: '🇰🇪' },
    { name: 'Ghana', flag: '🇬🇭' },
    { name: 'South Africa', flag: '🇿🇦' },
    { name: 'Mozambique', flag: '🇲🇿' }
  ];

  const howItWorks = [
    {
      icon: Upload,
      title: 'Submit Your Case',
      description: 'Upload medical reports and describe your condition',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Search,
      title: 'Hospitals Review',
      description: 'Verified hospitals review your case directly',
      color: 'bg-teal-100 text-teal-600'
    },
    {
      icon: Calendar,
      title: 'Book Appointment',
      description: 'Get confirmed appointments and treatment plans',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Plane,
      title: 'Travel Support',
      description: 'Visa guidance, accommodation & airport pickup',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const trustBadges = [
    { icon: Shield, text: 'Verified Hospitals Only' },
    { icon: Lock, text: 'Secure & Private' },
    { icon: Users, text: 'No Intermediaries' },
    { icon: CheckCircle, text: 'Transparent Pricing' }
  ];

  const testimonials = [
    {
      name: 'Amara O.',
      country: 'Nigeria',
      flag: '🇳🇬',
      text: 'I got direct contact with Apollo Hospital. The process was clear and no hidden charges. Best decision!',
      treatment: 'Cardiac Surgery'
    },
    {
      name: 'Kwame A.',
      country: 'Ghana',
      flag: '🇬🇭',
      text: 'Within 48 hours, three hospitals reviewed my case. The visa guidance was very helpful.',
      treatment: 'Orthopedic Treatment'
    },
    {
      name: 'Fatima M.',
      country: 'Kenya',
      flag: '🇰🇪',
      text: 'No agents, no extra fees. I spoke directly to the doctors. Saved money and got better care.',
      treatment: 'Oncology Treatment'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm mb-4">
                Trusted by 10,000+ African Patients
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">
                Get Trusted Medical Treatment in India
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-blue-50">
                Directly from Hospitals
              </p>
              <p className="text-lg mb-8 text-blue-100">
                No agents. No hidden fees. Verified hospitals only.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  onClick={() => onNavigate('dashboard')}
                  className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
                >
                  Submit Medical Case
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('hospitals')}
                  className="bg-white text-blue-600 hover:bg-blue-50 border-white"
                >
                  Find Hospitals
                </Button>
              </div>

              {/* Country Selector */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-blue-100">Popular from:</span>
                {countries.map(country => (
                  <div
                    key={country.name}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm flex items-center gap-1 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:block">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1632054229795-4097870879b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZG9jdG9yJTIwcGF0aWVudHxlbnwxfHx8fDE3Njc0MzcwMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="African doctor with patient"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-3 justify-center">
                <badge.icon className="w-5 h-5 text-teal-600" />
                <span className="text-sm text-gray-700">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with India's top hospitals in 4 simple steps
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 text-sm">
                  {index + 1}
                </div>
                <h3 className="text-lg mb-2 text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl mb-6 text-gray-900">
                Why Choose MediConnect Africa?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-lg mb-2 text-gray-900">NABH & JCI Accredited Hospitals</h3>
                    <p className="text-gray-600">
                      Every hospital is verified and internationally accredited. No fake clinics.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg mb-2 text-gray-900">Direct Hospital Contact</h3>
                    <p className="text-gray-600">
                      Talk directly to doctors and hospital staff. No middlemen taking your money.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg mb-2 text-gray-900">Quick Response Time</h3>
                    <p className="text-gray-600">
                      Get hospital responses within 24-48 hours. Start treatment planning faster.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Plane className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg mb-2 text-gray-900">Complete Travel Support</h3>
                    <p className="text-gray-600">
                      Visa guidance, accommodation booking, and airport pickup assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1662414185445-b9a05e26dba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3NwaXRhbCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc2NzM1MjgzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern hospital building"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
              Real Stories from African Patients
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands who found quality healthcare in India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{testimonial.name}</span>
                      <span className="text-xl">{testimonial.flag}</span>
                    </div>
                    <p className="text-sm text-gray-500">{testimonial.country}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3 italic">"{testimonial.text}"</p>
                <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                  {testimonial.treatment}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">
            Ready to Start Your Medical Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            Submit your medical case today and get responses from verified hospitals within 48 hours
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => onNavigate('dashboard')}
              className="bg-orange-500 hover:bg-orange-600 gap-2"
            >
              Submit Medical Case
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-blue-600 hover:bg-blue-50 border-white"
            >
              <Phone className="w-5 h-5" />
              Contact Support
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}