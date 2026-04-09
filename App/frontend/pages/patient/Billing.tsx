import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, Building2, Calendar, DollarSign } from 'lucide-react';
import { quoteStore, BillingRecord } from '../../services/quoteStore';

const Billing: React.FC = () => {
  const [records, setRecords] = useState<BillingRecord[]>([]);

  useEffect(() => {
    setRecords(quoteStore.getBilling());
  }, []);

  const handleMarkPaid = (id: string) => {
    quoteStore.markPaid(id);
    setRecords(quoteStore.getBilling());
  };

  const totalUnpaid = records.filter(r => r.paymentStatus === 'unpaid').reduce((s, r) => s + r.amount, 0);
  const totalPaid = records.filter(r => r.paymentStatus === 'paid').reduce((s, r) => s + r.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Records & Billing</h1>
        <p className="text-gray-600">Billing records from accepted hospital quotes</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Records</p>
          <p className="text-3xl font-bold text-gray-900">{records.length}</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-amber-700">Outstanding</p>
          <p className="text-3xl font-bold text-amber-700">
            {records[0]?.currency ?? 'INR'} {totalUnpaid.toLocaleString()}
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-emerald-700">Paid</p>
          <p className="text-3xl font-bold text-emerald-700">
            {records[0]?.currency ?? 'INR'} {totalPaid.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Records */}
      {records.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No billing records yet</h3>
          <p className="text-sm text-gray-400 mt-1">
            Accept a quote from a hospital to create your first billing record.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map(record => (
            <div key={record.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900">{record.hospitalName}</span>
                    {record.hospitalCity && (
                      <span className="text-sm text-gray-400">· {record.hospitalCity}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{record.reason}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(record.appointmentDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Accepted {new Date(record.acceptedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {record.notes && <p className="text-sm text-gray-400 italic">{record.notes}</p>}
                  <p className="text-2xl font-bold text-gray-900">
                    {record.currency} {record.amount.toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    record.paymentStatus === 'paid'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {record.paymentStatus === 'paid' ? '✓ Paid' : 'Unpaid'}
                  </span>
                  {record.paymentStatus === 'unpaid' && (
                    <button
                      onClick={() => handleMarkPaid(record.id)}
                      className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700"
                    >
                      <DollarSign className="w-4 h-4" /> Mark as Paid
                    </button>
                  )}
                  {record.paymentStatus === 'paid' && (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Billing;
