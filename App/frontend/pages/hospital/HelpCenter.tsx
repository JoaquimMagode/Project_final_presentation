import React, { useState } from 'react';
import { HelpCircle, Search, Book, MessageCircle, Phone, Mail, FileText, Video, Users, Settings } from 'lucide-react';

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: Book },
    { id: 'appointments', name: 'Appointments', icon: FileText },
    { id: 'patients', name: 'Patient Management', icon: Users },
    { id: 'payments', name: 'Payments & Billing', icon: FileText },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'technical', name: 'Technical Support', icon: HelpCircle }
  ];

  const faqs = [
    {
      id: 1,
      category: 'appointments',
      question: 'How do I confirm a patient appointment?',
      answer: 'Go to the Appointments page, find the pending appointment, and click the "Confirm" button. The patient will be notified automatically.'
    },
    {
      id: 2,
      category: 'appointments',
      question: 'Can I reschedule appointments?',
      answer: 'Yes, you can reschedule appointments by clicking on the appointment and selecting a new date and time. Make sure to notify the patient about the change.'
    },
    {
      id: 3,
      category: 'patients',
      question: 'How do I view patient medical history?',
      answer: 'Click on any patient name in the Patients section to view their complete medical history, previous appointments, and treatment records.'
    },
    {
      id: 4,
      category: 'payments',
      question: 'How are payments processed?',
      answer: 'Payments are processed automatically through our secure payment gateway. You can view all payment transactions in the Payments section.'
    },
    {
      id: 5,
      category: 'settings',
      question: 'How do I update hospital information?',
      answer: 'Go to Settings > Hospital Profile to update your hospital information, contact details, and specialties.'
    },
    {
      id: 6,
      category: 'technical',
      question: 'What browsers are supported?',
      answer: 'Our platform supports all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience.'
    }
  ];

  const quickActions = [
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: MessageCircle,
      action: 'chat'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: Video,
      action: 'videos'
    },
    {
      title: 'User Manual',
      description: 'Download complete documentation',
      icon: Book,
      action: 'manual'
    },
    {
      title: 'System Status',
      description: 'Check platform status',
      icon: Settings,
      action: 'status'
    }
  ];

  const contactOptions = [
    {
      type: 'Phone',
      value: '+91 1800-123-4567',
      description: '24/7 Support Hotline',
      icon: Phone
    },
    {
      type: 'Email',
      value: 'support@imapsolution.com',
      description: 'Technical Support',
      icon: Mail
    },
    {
      type: 'Chat',
      value: 'Live Chat',
      description: 'Available 9 AM - 6 PM IST',
      icon: MessageCircle
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Help & Support Center</h1>
        <p className="text-gray-600">Find answers to common questions and get support</p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search for help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.action}
              className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Icon className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{action.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-teal-100 text-teal-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Contact Support</h3>
            <div className="space-y-4">
              {contactOptions.map((contact) => {
                const Icon = contact.icon;
                return (
                  <div key={contact.type} className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{contact.value}</div>
                      <div className="text-xs text-gray-500">{contact.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Frequently Asked Questions
                {selectedCategory !== 'all' && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    - {categories.find(c => c.id === selectedCategory)?.name}
                  </span>
                )}
              </h3>
            </div>
            
            <div className="p-6">
              {filteredFaqs.length > 0 ? (
                <div className="space-y-6">
                  {filteredFaqs.map((faq) => (
                    <div key={faq.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-start gap-2">
                        <HelpCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                        {faq.question}
                      </h4>
                      <p className="text-gray-600 ml-7">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No articles found matching your search</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-2 text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Getting Started</h3>
              <div className="space-y-3">
                <a href="#" className="block text-sm text-teal-600 hover:text-teal-700">
                  → Hospital Dashboard Overview
                </a>
                <a href="#" className="block text-sm text-teal-600 hover:text-teal-700">
                  → Managing Patient Appointments
                </a>
                <a href="#" className="block text-sm text-teal-600 hover:text-teal-700">
                  → Payment Processing Guide
                </a>
                <a href="#" className="block text-sm text-teal-600 hover:text-teal-700">
                  → Staff Management Tutorial
                </a>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">System Updates</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Version 2.1.0 Released</div>
                  <div className="text-gray-500">New appointment management features</div>
                  <div className="text-xs text-gray-400">2 days ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Payment Gateway Update</div>
                  <div className="text-gray-500">Enhanced security and new payment methods</div>
                  <div className="text-xs text-gray-400">1 week ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Mobile App Launch</div>
                  <div className="text-gray-500">Hospital management on the go</div>
                  <div className="text-xs text-gray-400">2 weeks ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;