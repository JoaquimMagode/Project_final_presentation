import React, { useState } from 'react';
import { 
  HelpCircle, Search, Book, MessageCircle, Phone, Mail, 
  FileText, Video, Users, ChevronRight, ExternalLink, 
  Clock, CheckCircle, AlertCircle
} from 'lucide-react';

const PatientHelp: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const categories = [
    { id: 'All', name: 'All Topics', icon: HelpCircle },
    { id: 'appointments', name: 'Appointments', icon: Calendar },
    { id: 'reports', name: 'Medical Reports', icon: FileText },
    { id: 'account', name: 'Account & Profile', icon: Users },
    { id: 'billing', name: 'Billing & Insurance', icon: CreditCard },
    { id: 'technical', name: 'Technical Support', icon: MessageCircle }
  ];

  const faqs = [
    {
      id: '1',
      question: 'How do I book an appointment?',
      answer: 'You can book an appointment by going to the Appointments section, clicking "Book New Appointment", selecting your preferred doctor, date, and time. You can choose between in-person visits or telemedicine consultations.',
      category: 'appointments',
      popular: true
    },
    {
      id: '2',
      question: 'How do I upload my medical reports?',
      answer: 'Navigate to the Medical Reports section and click "Upload Report". You can drag and drop files or click to select them. Supported formats include PDF, JPG, and PNG files up to 10MB.',
      category: 'reports',
      popular: true
    },
    {
      id: '3',
      question: 'Can I cancel or reschedule my appointment?',
      answer: 'Yes, you can cancel or reschedule appointments up to 24 hours before the scheduled time. Go to your appointments list and click the edit button next to the appointment you want to modify.',
      category: 'appointments',
      popular: true
    },
    {
      id: '4',
      question: 'How do I update my profile information?',
      answer: 'Go to "My Profile" section and click "Edit Profile". You can update your personal information, contact details, medical information, and emergency contacts.',
      category: 'account',
      popular: false
    },
    {
      id: '5',
      question: 'What should I do if I forgot my password?',
      answer: 'Click on "Forgot Password" on the login page. Enter your email address and we\'ll send you instructions to reset your password.',
      category: 'technical',
      popular: false
    },
    {
      id: '6',
      question: 'How do I add my insurance information?',
      answer: 'You can add insurance information during registration or later in your profile settings. Go to the Insurance tab in your profile and enter your provider details and policy number.',
      category: 'billing',
      popular: false
    }
  ];

  const quickActions = [
    {
      title: 'Live Chat Support',
      description: 'Get instant help from our support team',
      icon: MessageCircle,
      action: 'Start Chat',
      color: 'bg-blue-500',
      available: true
    },
    {
      title: 'Call Support',
      description: 'Speak directly with our support team',
      icon: Phone,
      action: 'Call Now',
      color: 'bg-green-500',
      available: true
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: Video,
      action: 'Watch Videos',
      color: 'bg-purple-500',
      available: true
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: Mail,
      action: 'Send Email',
      color: 'bg-orange-500',
      available: true
    }
  ];

  const supportHours = [
    { day: 'Monday - Friday', hours: '8:00 AM - 8:00 PM EST' },
    { day: 'Saturday', hours: '9:00 AM - 5:00 PM EST' },
    { day: 'Sunday', hours: '10:00 AM - 4:00 PM EST' }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularFaqs = faqs.filter(faq => faq.popular);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find answers to your questions, get support, and learn how to make the most of your patient portal.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search for help articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{action.description}</p>
            <button className="text-blue-600 font-medium text-sm hover:text-blue-700 flex items-center gap-1">
              {action.action}
              <ChevronRight className="w-4 h-4" />
            </button>
            {action.available && (
              <div className="flex items-center gap-1 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600">Available now</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Support Hours */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Support Hours</h3>
            <div className="space-y-3">
              {supportHours.map((schedule, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm text-gray-600">{schedule.day}</span>
                  <span className="text-sm font-medium text-gray-900">{schedule.hours}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">Currently Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Popular FAQs */}
          {searchTerm === '' && selectedCategory === 'All' && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Questions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularFaqs.map((faq) => (
                  <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{faq.answer}</p>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1">
                      Read More
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All FAQs */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedCategory === 'All' ? 'Frequently Asked Questions' : `${categories.find(c => c.id === selectedCategory)?.name} Questions`}
            </h2>
            
            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No questions found matching your search.</p>
                </div>
              ) : (
                filteredFaqs.map((faq) => (
                  <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-100">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                        {faq.popular && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Popular</span>
                        )}
                      </div>
                      <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedFaq === faq.id ? 'rotate-90' : ''
                      }`} />
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-6 pb-6">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Still need help?</h3>
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for? Our support team is here to help you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Call Us</div>
                  <div className="text-xs text-gray-600">1-800-HEALTH-1</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Email Us</div>
                  <div className="text-xs text-gray-600">support@healthcare.com</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Live Chat</div>
                  <div className="text-xs text-gray-600">Available 24/7</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHelp;