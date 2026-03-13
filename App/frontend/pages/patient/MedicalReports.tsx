import React, { useState } from 'react';
import { 
  Upload, FileText, Download, Eye, Trash2, Plus, Search, 
  Filter, Calendar, User, AlertCircle, CheckCircle, Clock,
  X, Image, File, Heart
} from 'lucide-react';

interface MedicalReport {
  id: string;
  title: string;
  type: 'lab' | 'imaging' | 'prescription' | 'consultation' | 'other';
  date: string;
  doctor: string;
  hospital: string;
  status: 'available' | 'pending' | 'processing';
  fileSize: string;
  fileType: string;
  description: string;
}

const MedicalReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  const [reports] = useState<MedicalReport[]>([
    {
      id: '1',
      title: 'Complete Blood Count (CBC)',
      type: 'lab',
      date: '2024-01-15',
      doctor: 'Dr. Emily Davis',
      hospital: 'City Medical Center',
      status: 'available',
      fileSize: '2.4 MB',
      fileType: 'PDF',
      description: 'Routine blood work showing normal values across all parameters'
    },
    {
      id: '2',
      title: 'Chest X-Ray Report',
      type: 'imaging',
      date: '2024-01-10',
      doctor: 'Dr. Michael Brown',
      hospital: 'General Hospital',
      status: 'available',
      fileSize: '8.1 MB',
      fileType: 'PDF',
      description: 'Chest X-ray examination - no abnormalities detected'
    },
    {
      id: '3',
      title: 'Cardiology Consultation',
      type: 'consultation',
      date: '2024-01-08',
      doctor: 'Dr. Sarah Wilson',
      hospital: 'Heart Care Clinic',
      status: 'available',
      fileSize: '1.8 MB',
      fileType: 'PDF',
      description: 'Follow-up consultation for hypertension management'
    },
    {
      id: '4',
      title: 'Prescription - Lisinopril',
      type: 'prescription',
      date: '2024-01-08',
      doctor: 'Dr. Sarah Wilson',
      hospital: 'Heart Care Clinic',
      status: 'available',
      fileSize: '0.5 MB',
      fileType: 'PDF',
      description: 'Prescription for blood pressure medication'
    },
    {
      id: '5',
      title: 'MRI Brain Scan',
      type: 'imaging',
      date: '2024-01-05',
      doctor: 'Dr. James Miller',
      hospital: 'Neurological Institute',
      status: 'processing',
      fileSize: '15.2 MB',
      fileType: 'DICOM',
      description: 'Brain MRI scan - results pending radiologist review'
    }
  ]);

  const reportTypes = [
    { value: 'all', label: 'All Reports', count: reports.length },
    { value: 'lab', label: 'Lab Results', count: reports.filter(r => r.type === 'lab').length },
    { value: 'imaging', label: 'Imaging', count: reports.filter(r => r.type === 'imaging').length },
    { value: 'prescription', label: 'Prescriptions', count: reports.filter(r => r.type === 'prescription').length },
    { value: 'consultation', label: 'Consultations', count: reports.filter(r => r.type === 'consultation').length },
    { value: 'other', label: 'Other', count: reports.filter(r => r.type === 'other').length }
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lab': return <Heart className="w-4 h-4" />;
      case 'imaging': return <Image className="w-4 h-4" />;
      case 'prescription': return <FileText className="w-4 h-4" />;
      case 'consultation': return <User className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lab': return 'bg-red-100 text-red-800';
      case 'imaging': return 'bg-blue-100 text-blue-800';
      case 'prescription': return 'bg-green-100 text-green-800';
      case 'consultation': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setUploadFiles(prev => [...prev, ...files]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    console.log('Uploading files:', uploadFiles);
    // Handle file upload logic here
    setUploadFiles([]);
    setShowUploadModal(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Reports</h1>
          <p className="text-gray-600">View and manage your medical documents</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {reportTypes.slice(0, 4).map((type) => (
          <div key={type.value} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">{type.count}</div>
            <div className="text-sm text-gray-600">{type.label}</div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label} ({type.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg ${getTypeColor(report.type)}`}>
                {getTypeIcon(report.type)}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(report.status)}`}>
                  {getStatusIcon(report.status)}
                  {report.status}
                </span>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{report.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{report.doctor}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date(report.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span>{report.fileType} • {report.fileSize}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
              <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                View
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Upload Medical Report</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Drop files here or click to upload
                </h4>
                <p className="text-gray-600 mb-4">
                  Support for PDF, JPG, PNG files up to 10MB
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Choose Files
                </label>
              </div>

              {/* Selected Files */}
              {uploadFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Selected Files</h4>
                  <div className="space-y-2">
                    {uploadFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-600" />
                          <div>
                            <div className="font-medium text-gray-900">{file.name}</div>
                            <div className="text-sm text-gray-600">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Report Details Form */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter report title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select type</option>
                    <option value="lab">Lab Results</option>
                    <option value="imaging">Imaging</option>
                    <option value="prescription">Prescription</option>
                    <option value="consultation">Consultation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Doctor's name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of the report"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploadFiles.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Upload Reports
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalReports;