import React, { useRef } from 'react';
import { X, Download, Eye } from 'lucide-react';
import { Quote } from '../services/quoteStore';

interface Props {
  quote: Quote;
  onClose: () => void;
}

const QuotePDF: React.FC<Props> = ({ quote, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Quote - ${quote.hospitalName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1a1a1a; }
            .page { max-width: 700px; margin: 0 auto; padding: 48px 40px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 2px solid #0d9488; }
            .brand { font-size: 22px; font-weight: 700; color: #0d9488; letter-spacing: -0.5px; }
            .brand span { display: block; font-size: 11px; font-weight: 400; color: #6b7280; margin-top: 2px; letter-spacing: 0; }
            .quote-label { text-align: right; }
            .quote-label h2 { font-size: 28px; font-weight: 700; color: #111827; }
            .quote-label p { font-size: 12px; color: #6b7280; margin-top: 4px; }
            .section { margin-bottom: 28px; }
            .section-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; margin-bottom: 12px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
            .info-item label { font-size: 11px; color: #9ca3af; display: block; margin-bottom: 3px; }
            .info-item p { font-size: 14px; font-weight: 500; color: #111827; }
            .amount-box { background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 24px; display: flex; justify-content: space-between; align-items: center; margin: 28px 0; }
            .amount-box .label { font-size: 13px; color: #0f766e; font-weight: 500; }
            .amount-box .value { font-size: 32px; font-weight: 700; color: #0d9488; }
            .notes-box { background: #f9fafb; border-radius: 8px; padding: 16px; font-size: 13px; color: #374151; line-height: 1.6; }
            .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-accepted { background: #d1fae5; color: #065f46; }
            .status-declined { background: #fee2e2; color: #991b1b; }
            .footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 11px; color: #9ca3af; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header">
              <div class="brand">
                IMAP Solution
                <span>Medical Tourism Platform</span>
              </div>
              <div class="quote-label">
                <h2>QUOTE</h2>
                <p>Ref: ${quote.id.toUpperCase()}</p>
                <p>Issued: ${new Date(quote.sentAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-title">From Hospital</div>
              <div class="info-grid">
                <div class="info-item">
                  <label>Hospital Name</label>
                  <p>${quote.hospitalName}</p>
                </div>
                <div class="info-item">
                  <label>City</label>
                  <p>${quote.hospitalCity || '—'}</p>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Patient Details</div>
              <div class="info-grid">
                <div class="info-item">
                  <label>Patient Name</label>
                  <p>${quote.patientName}</p>
                </div>
                <div class="info-item">
                  <label>Status</label>
                  <p><span class="status-badge status-${quote.status}">${quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}</span></p>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Appointment Details</div>
              <div class="info-grid">
                <div class="info-item">
                  <label>Reason</label>
                  <p>${quote.reason}</p>
                </div>
                <div class="info-item">
                  <label>Type</label>
                  <p>Medical Consultation</p>
                </div>
                <div class="info-item">
                  <label>Date</label>
                  <p>${new Date(quote.appointmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div class="info-item">
                  <label>Time</label>
                  <p>${quote.appointmentTime}</p>
                </div>
              </div>
            </div>

            <div class="amount-box">
              <div class="label">Total Quoted Amount</div>
              <div class="value">${quote.currency} ${quote.amount.toLocaleString('en-IN')}</div>
            </div>

            ${quote.notes ? `
            <div class="section">
              <div class="section-title">Notes & Terms</div>
              <div class="notes-box">${quote.notes}</div>
            </div>` : ''}

            <div class="footer">
              <span>IMAP Solution — Medical Tourism Platform</span>
              <span>Generated on ${new Date().toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Quote Document</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Quote Preview */}
        <div className="overflow-y-auto flex-1 p-6">
          <div ref={printRef} className="bg-white border border-gray-200 rounded-xl p-8 font-sans">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-teal-600">
              <div>
                <p className="text-xl font-bold text-teal-600">IMAP Solution</p>
                <p className="text-xs text-gray-500 mt-0.5">Medical Tourism Platform</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">QUOTE</p>
                <p className="text-xs text-gray-500 mt-1">Ref: {quote.id.toUpperCase()}</p>
                <p className="text-xs text-gray-500">
                  Issued: {new Date(quote.sentAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* From / To */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">From Hospital</p>
                <p className="font-semibold text-gray-900">{quote.hospitalName}</p>
                {quote.hospitalCity && <p className="text-sm text-gray-500">{quote.hospitalCity}</p>}
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Patient</p>
                <p className="font-semibold text-gray-900">{quote.patientName}</p>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                  quote.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  quote.status === 'accepted' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="mb-6">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Appointment Details</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Reason', value: quote.reason },
                  { label: 'Date', value: new Date(quote.appointmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { label: 'Time', value: quote.appointmentTime },
                  { label: 'Reference', value: `APT-${quote.appointmentId}` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 flex justify-between items-center mb-6">
              <p className="text-sm font-semibold text-teal-700">Total Quoted Amount</p>
              <p className="text-3xl font-bold text-teal-600">
                {quote.currency} {quote.amount.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Notes */}
            {quote.notes && (
              <div className="mb-6">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Notes & Terms</p>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 leading-relaxed">{quote.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-gray-100 flex justify-between text-[10px] text-gray-400">
              <span>IMAP Solution — Medical Tourism Platform</span>
              <span>Generated on {new Date().toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePDF;
