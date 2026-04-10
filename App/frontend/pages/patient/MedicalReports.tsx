import React, { useState } from 'react';
import {
  HiOutlineCloudArrowUp, HiOutlineDocumentText, HiOutlineArrowDownTray,
  HiOutlineEye, HiOutlineTrash, HiOutlineMagnifyingGlass, HiOutlineCalendarDays,
  HiOutlineUser, HiOutlineCheckCircle, HiOutlineClock, HiOutlineExclamationCircle,
  HiOutlineXMark, HiOutlineHeart, HiOutlinePhoto, HiOutlineDocument, HiOutlineBuildingOffice,
} from 'react-icons/hi2';

interface Report { id: string; title: string; type: string; date: string; doctor: string; hospital: string; status: string; fileSize: string; fileType: string; description: string; }

const reports: Report[] = [
  { id: '1', title: 'Complete Blood Count (CBC)', type: 'lab', date: '2024-01-15', doctor: 'Dr. Emily Davis', hospital: 'City Medical Center', status: 'available', fileSize: '2.4 MB', fileType: 'PDF', description: 'Routine blood work — normal values' },
  { id: '2', title: 'Chest X-Ray Report', type: 'imaging', date: '2024-01-10', doctor: 'Dr. Michael Brown', hospital: 'General Hospital', status: 'available', fileSize: '8.1 MB', fileType: 'PDF', description: 'No abnormalities detected' },
  { id: '3', title: 'Cardiology Consultation', type: 'consultation', date: '2024-01-08', doctor: 'Dr. Sarah Wilson', hospital: 'Heart Care Clinic', status: 'available', fileSize: '1.8 MB', fileType: 'PDF', description: 'Follow-up for hypertension' },
  { id: '4', title: 'Prescription – Lisinopril', type: 'prescription', date: '2024-01-08', doctor: 'Dr. Sarah Wilson', hospital: 'Heart Care Clinic', status: 'available', fileSize: '0.5 MB', fileType: 'PDF', description: 'Blood pressure medication' },
  { id: '5', title: 'MRI Brain Scan', type: 'imaging', date: '2024-01-05', doctor: 'Dr. James Miller', hospital: 'Neurological Institute', status: 'processing', fileSize: '15.2 MB', fileType: 'DICOM', description: 'Pending radiologist review' },
];

const typeIcon: Record<string, any> = { lab: HiOutlineHeart, imaging: HiOutlinePhoto, prescription: HiOutlineDocumentText, consultation: HiOutlineUser, other: HiOutlineDocument };
const typeColor: Record<string, string> = { lab: 'bg-red-50 text-red-600', imaging: 'bg-blue-50 text-blue-600', prescription: 'bg-green-50 text-green-600', consultation: 'bg-violet-50 text-violet-600', other: 'bg-gray-100 text-gray-600' };
const statusColor: Record<string, string> = { available: 'bg-green-50 text-green-700', pending: 'bg-yellow-50 text-yellow-700', processing: 'bg-blue-50 text-blue-700' };
const statusIcon: Record<string, any> = { available: HiOutlineCheckCircle, pending: HiOutlineClock, processing: HiOutlineExclamationCircle };

const MedicalReports: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const filtered = reports.filter(r => {
    const s = r.title.toLowerCase().includes(search.toLowerCase()) || r.doctor.toLowerCase().includes(search.toLowerCase());
    return s && (filterType === 'all' || r.type === filterType);
  });

  const handleDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === 'dragenter' || e.type === 'dragover'); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) setFiles(p => [...p, ...Array.from(e.dataTransfer.files)]); };
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) setFiles(p => [...p, ...Array.from(e.target.files!)]); };
  const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500";

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-lg font-bold text-gray-900">Medical Reports</h1><p className="text-xs text-gray-500">View and manage your medical documents</p></div>
        <button onClick={() => setShowUpload(true)} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700">
          <HiOutlineCloudArrowUp className="w-3.5 h-3.5" /> Upload Report
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <HiOutlineMagnifyingGlass className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Search reports..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full" />
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5">
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-transparent text-xs font-medium text-gray-600 outline-none cursor-pointer">
            <option value="all">All Types</option><option value="lab">Lab</option><option value="imaging">Imaging</option>
            <option value="prescription">Prescription</option><option value="consultation">Consultation</option>
          </select>
        </div>
      </div>

      {/* Reports */}
      <div className="space-y-3">
        {filtered.map((r, idx) => {
          const TIcon = typeIcon[r.type] || HiOutlineDocument;
          const SIcon = statusIcon[r.status] || HiOutlineClock;
          const accentMap: Record<string, string> = { lab: 'bg-red-500', imaging: 'bg-blue-500', prescription: 'bg-green-500', consultation: 'bg-violet-500', other: 'bg-gray-400' };
          return (
            <div key={r.id} className="flex items-stretch gap-3">
              {/* Number */}
              <div className="w-7 shrink-0 flex flex-col items-center pt-5">
                <span className="text-[11px] font-bold text-gray-300">{String(idx + 1).padStart(2, '0')}</span>
              </div>

              {/* Card */}
              <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors">
              <div className="flex items-stretch">
                {/* Content */}
                <div className="flex-1 p-4 flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${typeColor[r.type] || typeColor.other}`}>
                    <TIcon className="w-5 h-5" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{r.title}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium shrink-0 ${statusColor[r.status] || statusColor.pending}`}>
                        <SIcon className="w-3 h-3" />{r.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mb-2 line-clamp-1">{r.description}</p>
                    <div className="flex items-center gap-4 text-[11px] text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1"><HiOutlineUser className="w-3 h-3" />{r.doctor}</span>
                      <span className="flex items-center gap-1"><HiOutlineBuildingOffice className="w-3 h-3" />{r.hospital}</span>
                      <span className="flex items-center gap-1"><HiOutlineCalendarDays className="w-3 h-3" />{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-500">{r.fileType} · {r.fileSize}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 self-center">
                    <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-md text-[11px] font-medium hover:bg-emerald-100 transition-colors flex items-center gap-1">
                      <HiOutlineEye className="w-3.5 h-3.5" /> View
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors" title="Download">
                      <HiOutlineArrowDownTray className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && <div className="text-center py-10"><HiOutlineDocumentText className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-sm text-gray-400">No reports found</p></div>}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900">Upload Medical Report</h3>
              <button onClick={() => setShowUpload(false)} className="p-1.5 hover:bg-gray-100 rounded-md"><HiOutlineXMark className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                <HiOutlineCloudArrowUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-600 mb-2">Drop files here or click to upload</p>
                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleSelect} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700 cursor-pointer">Choose Files</label>
              </div>
              {files.length > 0 && (
                <div className="space-y-1.5">{files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-md text-xs">
                    <div><p className="font-medium text-gray-900">{f.name}</p><p className="text-[10px] text-gray-400">{(f.size / 1024 / 1024).toFixed(2)} MB</p></div>
                    <button onClick={() => setFiles(p => p.filter((_, j) => j !== i))} className="p-1 hover:bg-gray-200 rounded-md"><HiOutlineXMark className="w-3 h-3 text-gray-500" /></button>
                  </div>
                ))}</div>
              )}
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Title</label><input type="text" className={inputCls} placeholder="Report title" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                  <select className={inputCls}><option value="">Select</option><option value="lab">Lab</option><option value="imaging">Imaging</option><option value="prescription">Prescription</option><option value="consultation">Consultation</option></select></div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Date</label><input type="date" className={inputCls} /></div>
              </div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Doctor</label><input type="text" className={inputCls} placeholder="Doctor name" /></div>
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex gap-2">
              <button onClick={() => setShowUpload(false)} className="flex-1 px-4 py-2 text-xs border border-gray-200 rounded-md hover:bg-gray-50">Cancel</button>
              <button onClick={() => { setFiles([]); setShowUpload(false); }} disabled={files.length === 0} className="flex-1 px-4 py-2 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50">Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalReports;
