import { CheckCircle, FileText, AlertCircle, Download, ExternalLink, Calendar, Plane, Home, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useState } from 'react';

export function VisaGuidance() {
  const [completedSteps, setCompletedSteps] = useState<string[]>(['passport']);

  const visaSteps = [
    {
      id: 'passport',
      title: 'Valid Passport',
      description: 'Ensure your passport is valid for at least 6 months from travel date',
      required: true
    },
    {
      id: 'medical-letter',
      title: 'Hospital Medical Letter',
      description: 'Letter from the Indian hospital confirming your appointment and treatment',
      required: true
    },
    {
      id: 'medical-reports',
      title: 'Medical Reports',
      description: 'Recent medical reports and diagnosis documents',
      required: true
    },
    {
      id: 'photos',
      title: 'Passport Photos',
      description: '2 recent passport-size photographs (white background)',
      required: true
    },
    {
      id: 'financial',
      title: 'Financial Documents',
      description: 'Bank statements or proof of funds for medical treatment',
      required: true
    },
    {
      id: 'travel-insurance',
      title: 'Travel Insurance',
      description: 'Medical travel insurance (recommended)',
      required: false
    }
  ];

  const visaTypes = [
    {
      name: 'Medical Visa',
      duration: 'Up to 60 days',
      entries: 'Triple entry',
      processing: '3-5 days',
      description: 'For patients seeking medical treatment in India',
      color: 'bg-blue-50 border-blue-200 text-blue-900'
    },
    {
      name: 'Medical Attendant Visa',
      duration: 'Same as patient',
      entries: 'Triple entry',
      processing: '3-5 days',
      description: 'For family members accompanying the patient (max 2 people)',
      color: 'bg-teal-50 border-teal-200 text-teal-900'
    }
  ];

  const commonMistakes = [
    {
      icon: AlertCircle,
      mistake: 'Incomplete medical documentation',
      solution: 'Ensure all medical reports are recent (within 3 months) and clearly show diagnosis'
    },
    {
      icon: AlertCircle,
      mistake: 'Wrong photo specifications',
      solution: 'Use white background, recent photo (not older than 6 months), 51mm x 51mm size'
    },
    {
      icon: AlertCircle,
      mistake: 'Insufficient financial proof',
      solution: 'Bank statements should show sufficient funds to cover treatment and stay'
    },
    {
      icon: AlertCircle,
      mistake: 'Missing hospital appointment letter',
      solution: 'Hospital letter must be on official letterhead with doctor details and appointment date'
    }
  ];

  const faqs = [
    {
      question: 'How long does medical visa processing take?',
      answer: 'Typically 3-5 working days after submitting complete documents'
    },
    {
      question: 'Can I extend my medical visa in India?',
      answer: 'Yes, medical visas can be extended by contacting FRRO in India with valid reasons'
    },
    {
      question: 'How many attendants can accompany me?',
      answer: 'Maximum 2 attendants can get Medical Attendant Visa linked to your Medical Visa'
    },
    {
      question: 'Do I need to book return tickets before applying?',
      answer: 'Not mandatory, but having tentative travel plans helps in the application'
    }
  ];

  const applicationProcess = [
    {
      step: 1,
      title: 'Get Hospital Letter',
      description: 'Request appointment confirmation letter from the hospital',
      icon: FileText
    },
    {
      step: 2,
      title: 'Gather Documents',
      description: 'Collect all required documents as per the checklist',
      icon: CheckCircle
    },
    {
      step: 3,
      title: 'Fill Online Form',
      description: 'Complete Indian e-Visa application form online',
      icon: FileText
    },
    {
      step: 4,
      title: 'Upload Documents',
      description: 'Upload scanned copies of all documents',
      icon: FileText
    },
    {
      step: 5,
      title: 'Pay Visa Fee',
      description: 'Pay application fee online (varies by country)',
      icon: FileText
    },
    {
      step: 6,
      title: 'Track Application',
      description: 'Monitor application status online',
      icon: FileText
    }
  ];

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev =>
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Indian Medical Visa Guide</h1>
          <p className="text-gray-600">Complete step-by-step guide for African patients</p>
        </div>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <ExternalLink className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="text-sm text-gray-900 mb-1">Official Portal</h3>
            <p className="text-xs text-gray-600">indianvisaonline.gov.in</p>
          </Card>
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <Download className="w-6 h-6 text-teal-600 mb-2" />
            <h3 className="text-sm text-gray-900 mb-1">Document Templates</h3>
            <p className="text-xs text-gray-600">Download sample forms</p>
          </Card>
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <Calendar className="w-6 h-6 text-orange-600 mb-2" />
            <h3 className="text-sm text-gray-900 mb-1">Track Status</h3>
            <p className="text-xs text-gray-600">Check application status</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Visa Types */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-4">Types of Medical Visa</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {visaTypes.map((visa, index) => (
                  <div key={index} className={`p-4 border-2 rounded-lg ${visa.color}`}>
                    <h3 className="text-lg mb-3">{visa.name}</h3>
                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span>{visa.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Entries:</span>
                        <span>{visa.entries}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing:</span>
                        <span>{visa.processing}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{visa.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Application Process */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-6">Application Process</h2>
              <div className="space-y-4">
                {applicationProcess.map((step) => (
                  <div key={step.step} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1 pb-4 border-b border-gray-200 last:border-0">
                      <h3 className="text-lg mb-1 text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Document Checklist */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-4">Document Checklist</h2>
              <p className="text-sm text-gray-600 mb-6">
                Track your visa document preparation
              </p>
              <div className="space-y-3">
                {visaSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      completedSteps.includes(step.id)
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-blue-200'
                    }`}
                    onClick={() => toggleStep(step.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {completedSteps.includes(step.id) ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm text-gray-900">{step.title}</h3>
                          {step.required && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Common Mistakes */}
            <Card className="p-6 bg-orange-50 border-orange-200">
              <h2 className="text-xl text-gray-900 mb-4">Common Mistakes to Avoid</h2>
              <div className="space-y-4">
                {commonMistakes.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <item.icon className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-sm text-gray-900 mb-1">{item.mistake}</h3>
                      <p className="text-xs text-gray-700">{item.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* FAQs */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="pb-4 border-b border-gray-200 last:border-0">
                    <div className="flex gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm text-gray-900 mb-2">{faq.question}</h3>
                        <p className="text-sm text-gray-600">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-teal-50 border-blue-200">
              <h3 className="text-lg text-gray-900 mb-4">Your Progress</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Documents Ready</span>
                  <span className="text-sm text-gray-900">
                    {completedSteps.length}/{visaSteps.length}
                  </span>
                </div>
                <div className="w-full bg-white rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-teal-600 h-3 rounded-full transition-all"
                    style={{ width: `${(completedSteps.length / visaSteps.length) * 100}%` }}
                  />
                </div>
              </div>
              {completedSteps.length === visaSteps.length ? (
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Ready to Apply
                </Button>
              ) : (
                <p className="text-sm text-gray-600">
                  Complete all documents to proceed with application
                </p>
              )}
            </Card>

            {/* Support Services */}
            <Card className="p-6">
              <h3 className="text-lg text-gray-900 mb-4">Support Services</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm text-gray-900">Document Review</h4>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Expert review of your documents before submission
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Request Review
                  </Button>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm text-gray-900">Visa Consultation</h4>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    One-on-one guidance from visa experts
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Book Call
                  </Button>
                </div>
              </div>
            </Card>

            {/* Travel Assistance */}
            <Card className="p-6">
              <h3 className="text-lg text-gray-900 mb-4">After Visa Approval</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Plane className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-900 mb-1">Flight Booking</p>
                    <p className="text-xs text-gray-600">Best fares to Indian cities</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Home className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-900 mb-1">Accommodation</p>
                    <p className="text-xs text-gray-600">Near hospital stays</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <FileText className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-900 mb-1">Airport Pickup</p>
                    <p className="text-xs text-gray-600">Direct to hospital service</p>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                View Services
              </Button>
            </Card>

            {/* Emergency Contact */}
            <Card className="p-4 bg-red-50 border-red-200">
              <h3 className="text-sm text-gray-900 mb-2">Emergency Support</h3>
              <p className="text-xs text-gray-600 mb-3">
                Need urgent visa help? Contact our 24/7 support team
              </p>
              <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
                Emergency Contact
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
