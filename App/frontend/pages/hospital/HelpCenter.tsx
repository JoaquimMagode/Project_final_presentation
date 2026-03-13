import React, { useState } from 'react';
import { 
  HelpCircle, Search, Book, MessageCircle, Phone, Mail, 
  FileText, Video, Users, ChevronRight, ExternalLink 
} from 'lucide-react';

const HelpCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { id: 'All', name: 'All Topics', icon: HelpCircle },
    { id: 'getting-started', name: 'Getting Started', icon: Book },
    { id: 'patients', name: 'Patient Management', icon: Users },
    { id: 'appointments', name: 'Appointments', icon: FileText },
    { id: 'billing', name: 'Billing & Payments', icon: FileText },
    { id: 'technical', name: 'Technical Support', icon: MessageCircle }
  ];

  const helpArticles = [
    {
      id: '1',
      title: 'How to add a new patient to the system',
      category: 'patients',
      description: 'Step-by-step guide to register new patients in the hospital management system.',
      readTime: '3 min read',
      popular: true
    },
    {
      id: '2',
      title: 'Scheduling and managing appointments',
      category: 'appointments',
      description: 'Learn how to create, modify, and cancel patient appointments efficiently.',
      readTime: '5 min read',
      popular: true
    },
    {
      id: '3',
      title: 'Processing payments and generating invoices',
      category: 'billing',
      description: 'Complete guide to handling patient payments and creating billing documents.',
      readTime: '4 min read',
      popular: false
    },
    {
      id: '4',
      title: 'Getting started with the dashboard',
      category: 'getting-started',
      description: 'Overview of the main dashboard features and navigation.',
      readTime: '2 min read',
      popular: true
    },
    {
      id: '5',
      title: 'Troubleshooting common login issues',
      category: 'technical',
      description: 'Solutions for common authentication and access problems.',
      readTime: '3 min read',
      popular: false
    },
    {
      id: '6',
      title: 'Managing employee records and permissions',
      category: 'getting-started',
      description: 'How to add staff members and set their access levels.',
      readTime: '6 min read',
      popular: false
    }
  ];

  const quickActions = [
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: MessageCircle,
      action: 'Chat Now',
      color: 'bg-blue-500'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: Video,
      action: 'Watch Videos',
      color: 'bg-purple-500'
    },
    {
      title: 'System Status',
      description: 'Check current system status',
      icon: Activity,
      action: 'View Status',
      color: 'bg-green-500'
    },
    {
      title: 'Feature Requests',
      description: 'Suggest new features',
      icon: ExternalLink,
      action: 'Submit Idea',
      color: 'bg-orange-500'
    }
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularArticles = helpArticles.filter(article => article.popular);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support Center</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find answers to your questions, browse documentation, and get support for the hospital management system.
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
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
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
            <button className="text-teal-600 font-medium text-sm hover:text-teal-700 flex items-center gap-1">
              {action.action}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-teal-50 text-teal-700 border border-teal-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Need More Help?</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Call Support</div>
                  <div className="text-xs text-gray-600">+1 (555) 123-4567</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Email Support</div>
                  <div className="text-xs text-gray-600">support@hospital.com</div>
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

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Popular Articles */}
          {searchTerm === '' && selectedCategory === 'All' && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularArticles.map((article) => (
                  <div key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{article.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{article.readTime}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Articles */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedCategory === 'All' ? 'All Articles' : `${categories.find(c => c.id === selectedCategory)?.name} Articles`}
            </h2>
            <div className="space-y-4">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No articles found matching your search.</p>
                </div>
              ) : (
                filteredArticles.map((article) => (
                  <div key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                        <p className="text-gray-600 mb-3">{article.description}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500">{article.readTime}</span>
                          {article.popular && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Popular</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;