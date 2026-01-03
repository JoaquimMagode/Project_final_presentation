import { Upload, CheckCircle, Clock, FileText, Camera, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { useState } from 'react';

interface PatientDashboardProps {
  onNavigate?: (page: string) => void;
}

export function PatientDashboard({ onNavigate }: PatientDashboardProps = {}) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const profileCompletion = 75;

  const timelineSteps = [
    { 
      status: 'completed', 
      title: 'Registration Complete', 
      description: 'Profile created successfully',
      date: 'Dec 28, 2025'
    },
    { 
      status: 'completed', 
      title: 'Medical Reports Submitted', 
      description: '3 documents uploaded',
      date: 'Dec 29, 2025'
    },
    { 
      status: 'active', 
      title: 'Hospitals Reviewing', 
      description: '5 hospitals are reviewing your case',
      date: 'In progress'
    },
    { 
      status: 'pending', 
      title: 'Appointment Scheduling', 
      description: 'Waiting for hospital response',
      date: 'Pending'
    },
    { 
      status: 'pending', 
      title: 'Visa Assistance', 
      description: 'Will start after appointment confirmation',
      date: 'Pending'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => file.name);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Track your medical journey to India</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Completion */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl text-gray-900 mb-1">Complete Your Profile</h2>
                  <p className="text-sm text-gray-600">Help hospitals understand your case better</p>
                </div>
                <span className="text-2xl text-blue-600">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="mb-4" />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">Basic information added</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">Medical history completed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">Documents uploaded</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-700">Add emergency contact</span>
                </div>
              </div>
            </Card>

            {/* Journey Timeline */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-6">Your Medical Journey</h2>
              <div className="space-y-6">
                {timelineSteps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.status === 'completed' 
                          ? 'bg-green-100 text-green-600' 
                          : step.status === 'active'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {step.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : step.status === 'active' ? (
                          <Clock className="w-5 h-5" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-gray-300" />
                        )}
                      </div>
                      {index < timelineSteps.length - 1 && (
                        <div className={`w-0.5 h-12 ${
                          step.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <h3 className={`mb-1 ${
                        step.status === 'pending' ? 'text-gray-500' : 'text-gray-900'
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">{step.description}</p>
                      <span className="text-xs text-gray-500">{step.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Upload Documents */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-4">Medical Documents</h2>
              <p className="text-sm text-gray-600 mb-6">
                Upload your medical reports, test results, and prescriptions
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Take Photo</p>
                </label>

                <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upload Files</p>
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm text-gray-700 mb-2">Uploaded Files:</h3>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-700 flex-1">{file}</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700">
                  <Upload className="w-4 h-4" />
                  Upload New Documents
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText className="w-4 h-4" />
                  View My Cases
                </Button>
              </div>
            </Card>

            {/* Active Cases */}
            <Card className="p-6">
              <h3 className="text-lg text-gray-900 mb-4">Active Cases</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-900">Cardiac Consultation</span>
                    <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 mb-2">Case ID: MC-2025-001</p>
                  <p className="text-xs text-blue-600">5 hospitals reviewing</p>
                </div>
              </div>
            </Card>

            {/* Support */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
              <h3 className="text-lg text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is available 24/7
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700 gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Support
              </Button>
            </Card>

            {/* Data Privacy Notice */}
            <Card className="p-4 bg-gray-50">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600">
                    Your medical data is encrypted and only shared with hospitals you choose.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}