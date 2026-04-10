import React, { useState, useEffect } from 'react';
import {
  HiOutlineDocumentText, HiOutlineCheckCircle, HiOutlineClock,
  HiOutlineBuildingOffice2, HiOutlineCalendarDays, HiOutlineCurrencyDollar,
} from 'react-icons/hi2';
import { quoteStore, BillingRecord } from '../../services/quoteStore';

const Billing: React.FC = () => {
  const [records, setRecords] = useState<BillingRecord[]>([]);
  useEffect(() => { setRecords(quoteStore.getBilling()); }, []);
  const handlePaid = (id: string) => { quoteStore.markPaid(id); setRecords(quoteStore.getBilling()); };

  const unpaid = records.filter(r => r.paymentStatus === 'unpaid').reduce((s, r) => s + r.amount, 0);
  const paid = records.filter(r => r.paymentStatus === 'paid').reduce((s, r) => s + r.amount, 0);
  const cur = records[0]?.currency ?? 'INR';

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      <div><h1 className="text-lg font-bold text-gray-900">Records & Billing</h1><p className="text-xs text-gray-500">Billing records from accepted hospital quotes</p></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {([
          { label: 'Total Records', value: String(records.length), icon: HiOutlineDocumentText, accent: 'bg-blue-500' },
          { label: 'Outstanding', value: `${cur} ${unpaid.toLocaleString()}`, icon: HiOutlineClock, accent: 'bg-amber-500' },
          { label: 'Paid', value: `${cur} ${paid.toLocaleString()}`, icon: HiOutlineCheckCircle, accent: 'bg-emerald-500' },
        ] as const).map(s => (
          <div key={s.label} className="bg-white rounded-lg px-4 py-3.5 border border-gray-200 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${s.accent}`}>
              <s.icon className="w-[18px] h-[18px] text-white" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 leading-none">{s.label}</p>
              <p className="text-lg font-bold text-gray-900 leading-tight mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {records.length === 0 ? (
        <div className="text-center py-16"><HiOutlineDocumentText className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-sm text-gray-400">No billing records yet</p><p className="text-xs text-gray-400 mt-0.5">Accept a quote to create your first record.</p></div>
      ) : (
        <div className="space-y-2.5">
          {records.map(r => (
            <div key={r.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <HiOutlineBuildingOffice2 className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{r.hospitalName}</span>
                    {r.hospitalCity && <span className="text-[11px] text-gray-400">· {r.hospitalCity}</span>}
                  </div>
                  <p className="text-xs text-gray-600">{r.reason}</p>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1"><HiOutlineCalendarDays className="w-3 h-3" />{new Date(r.appointmentDate).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><HiOutlineClock className="w-3 h-3" />Accepted {new Date(r.acceptedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{r.currency} {r.amount.toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${r.paymentStatus === 'paid' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                    {r.paymentStatus === 'paid' ? '✓ Paid' : 'Unpaid'}
                  </span>
                  {r.paymentStatus === 'unpaid' && (
                    <button onClick={() => handlePaid(r.id)} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700">
                      <HiOutlineCurrencyDollar className="w-3.5 h-3.5" /> Mark Paid
                    </button>
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
