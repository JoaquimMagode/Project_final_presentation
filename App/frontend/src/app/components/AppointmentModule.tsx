import { Calendar, CheckCircle, Clock, MapPin, Plane, Home, FileText, Video, Phone, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useState } from 'react';

export function AppointmentModule() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const hospitalResponses = [
    {
      hospital: 'Apollo Hospitals, Chennai',
      logo: '🏥',
      status: 'confirmed',
      doctor: 'Dr. Rajesh Kumar',
      specialty: 'Cardiology',
      date: 'Jan 25, 2026',
      time: '10:00 AM',
      estimatedCost: '$8,500 - $12,000',
      responseTime: '18 hours'
    },
    {
      hospital: 'Fortis Healthcare, Delhi',
      logo: '🏥',
      status: 'pending',
      doctor: 'Dr. Priya Sharma',
      specialty: 'Cardiology',
      date: 'Jan 28, 2026',
      time: '2:00 PM',
      estimatedCost: '$7,800 - $11,500',
      responseTime: '24 hours'
    },
    {
      hospital: 'Medanta Hospital, Gurugram',
      logo: '🏥',
      status: 'reviewing',
      doctor: 'Dr. Anil Patel',
      specialty: 'Cardiology',
      date: 'Pending confirmation',
      time: '',
      estimatedCost: '$9,200 - $13,000',
      responseTime: '12 hours'
    }
  ];

  const travelSupport = [
    {
      icon: FileText,
      title: 'Visa Assistance',
      status: 'ready',
      description: 'Get your medical visa documents',
      action: 'Start Application'
    },
    {
      icon: Home,
      title: 'Accommodation',
      status: 'available',
      description: 'Hotels near Apollo Hospital',
      action: 'View Options'
    },
    {
      icon: Plane,
      title: 'Airport Pickup',
      status: 'available',
      description: 'Chennai International Airport',
      action: 'Book Service'
    },
    {
      icon: User,
      title: 'Travel Companion',
      status: 'available',
      description: 'Medical attendant visa support',
      action: 'Add Companion'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Appointments & Travel</h1>
          <p className="text-gray-600">Manage your appointments and plan your medical journey</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hospital Responses */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-6">Hospital Responses</h2>
              <div className="space-y-4">
                {hospitalResponses.map((response, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-lg border-2 ${
                      response.status === 'confirmed'
                        ? 'border-green-200 bg-green-50'
                        : response.status === 'pending'
                        ? 'border-orange-200 bg-orange-50'
                        : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
                          {response.logo}
                        </div>
                        <div>
                          <h3 className="text-lg text-gray-900">{response.hospital}</h3>
                          <p className="text-sm text-gray-600">
                            {response.doctor} • {response.specialty}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          response.status === 'confirmed'
                            ? 'bg-green-200 text-green-800'
                            : response.status === 'pending'
                            ? 'bg-orange-200 text-orange-800'
                            : 'bg-blue-200 text-blue-800'
                        }`}
                      >
                        {response.status.charAt(0).toUpperCase() + response.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Appointment</p>
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Calendar className="w-4 h-4" />
                          <span>{response.date}</span>
                        </div>
                        {response.time && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Clock className="w-4 h-4" />
                            <span>{response.time}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Estimated Cost</p>
                        <p className="text-sm text-gray-900">{response.estimatedCost}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Response Time</p>
                        <p className="text-sm text-gray-900">{response.responseTime}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {response.status === 'confirmed' ? (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Confirmed
                          </Button>
                          <Button size="sm" variant="outline" className="gap-2">
                            <Video className="w-4 h-4" />
                            Video Consult
                          </Button>
                          <Button size="sm" variant="outline" className="gap-2">
                            <Phone className="w-4 h-4" />
                            Call Hospital
                          </Button>
                        </>
                      ) : response.status === 'pending' ? (
                        <>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Confirm Appointment
                          </Button>
                          <Button size="sm" variant="outline">
                            Decline
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          Waiting for Response
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Pre-Departure Checklist */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-6">Pre-Departure Checklist</h2>
              <div className="space-y-3">
                {[
                  { task: 'Visa approved and printed', completed: true },
                  { task: 'Flight tickets booked', completed: true },
                  { task: 'Hotel accommodation confirmed', completed: true },
                  { task: 'Travel insurance purchased', completed: false },
                  { task: 'Medical reports organized', completed: true },
                  { task: 'Airport pickup scheduled', completed: false },
                  { task: 'Emergency contacts shared', completed: false }
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 flex items-center gap-3 ${
                      item.completed
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.completed ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      {item.completed && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span className={`flex-1 ${item.completed ? 'text-gray-700' : 'text-gray-900'}`}>
                      {item.task}
                    </span>
                    {!item.completed && (
                      <Button size="sm" variant="outline">
                        Complete
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Appointment */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-teal-50 border-blue-200">
              <h3 className="text-lg text-gray-900 mb-4">Next Appointment</h3>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-900">January 25, 2026</p>
                    <p className="text-xs text-gray-600">10:00 AM IST</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-900">Apollo Hospitals</p>
                    <p className="text-xs text-gray-600">Chennai, India</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-600 mb-1">Days until appointment</p>
                <p className="text-2xl text-blue-600">22 days</p>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
                <Calendar className="w-4 h-4" />
                Add to Calendar
              </Button>
            </Card>

            {/* Travel Support */}
            <Card className="p-6">
              <h3 className="text-lg text-gray-900 mb-4">Travel Support</h3>
              <div className="space-y-3">
                {travelSupport.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <item.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      {item.action}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Contact Card */}
            <Card className="p-6">
              <h3 className="text-lg text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700 gap-2">
                  <Phone className="w-4 h-4" />
                  Call Support
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Video className="w-4 h-4" />
                  Video Call
                </Button>
              </div>
            </Card>

            {/* Important Info */}
            <Card className="p-4 bg-orange-50 border-orange-200">
              <h3 className="text-sm text-gray-900 mb-2">Important Reminder</h3>
              <p className="text-xs text-gray-600 mb-3">
                Arrive at the hospital 30 minutes before your appointment with all original documents.
              </p>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Original passport & visa</li>
                <li>• Medical reports (hard copy)</li>
                <li>• Appointment confirmation</li>
                <li>• Insurance documents</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
