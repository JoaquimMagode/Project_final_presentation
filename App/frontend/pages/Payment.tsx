import React, { useState } from 'react';
import { CheckCircle, CreditCard, Smartphone, Building, ArrowLeft, Shield, Clock } from 'lucide-react';

const Payment: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const costBreakdown = {
    consultation: 150,
    medicalReports: 75,
    translation: 25,
    platformFee: 10,
    total: 260
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5" />, desc: 'Visa, Mastercard, Amex' },
    { id: 'mobile', name: 'Mobile Money', icon: <Smartphone className="w-5 h-5" />, desc: 'M-Pesa, MTN Mobile Money' },
    { id: 'bank', name: 'Bank Transfer', icon: <Building className="w-5 h-5" />, desc: 'Direct bank transfer' }
  ];

  const handlePayment = () => {
    if (selectedPayment && (selectedPayment !== 'card' || (cardNumber && expiryDate && cvv))) {
      setShowSuccess(true);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
          <p className="text-slate-600 mb-6">Your consultation has been booked and payment confirmed.</p>
          
          <div className="bg-emerald-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-700">Transaction ID:</span>
              <span className="font-bold text-emerald-900">#TXN-2024-001</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-emerald-700">Amount Paid:</span>
              <span className="font-bold text-emerald-900">${costBreakdown.total}</span>
            </div>
          </div>
          
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Consultation scheduled for tomorrow 10:00 AM</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Meeting link sent to your email</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Receipt emailed to you</span>
            </div>
          </div>
          
          <button 
            onClick={() => window.history.back()}
            className="w-full mt-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => window.history.back()} className="p-2 hover:bg-slate-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Complete Payment</h1>
      </div>

      {/* Cost Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Cost Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-slate-600">
            <span>Medical Consultation</span>
            <span>${costBreakdown.consultation}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Medical Reports Review</span>
            <span>${costBreakdown.medicalReports}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Translation Services</span>
            <span>${costBreakdown.translation}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Platform Fee</span>
            <span>${costBreakdown.platformFee}</span>
          </div>
          <hr className="border-slate-200" />
          <div className="flex justify-between text-lg font-bold text-slate-900">
            <span>Total Amount</span>
            <span>${costBreakdown.total}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Payment Method</h2>
        <div className="space-y-3">
          {paymentMethods.map(method => (
            <label key={method.id} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-colors">
              <input 
                type="radio" 
                name="payment" 
                value={method.id}
                checked={selectedPayment === method.id}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="text-emerald-600"
              />
              <div className="text-emerald-600">{method.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">{method.name}</div>
                <div className="text-sm text-slate-500">{method.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Card Details */}
      {selectedPayment === 'card' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Card Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Card Number</label>
              <input 
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Expiry Date</label>
                <input 
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">CVV</label>
                <input 
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
        <div className="text-sm">
          <div className="font-semibold text-blue-900 mb-1">Secure Payment</div>
          <div className="text-blue-700">Your payment information is encrypted and secure. We never store your card details.</div>
        </div>
      </div>

      {/* Pay Button */}
      <button 
        onClick={handlePayment}
        disabled={!selectedPayment || (selectedPayment === 'card' && (!cardNumber || !expiryDate || !cvv))}
        className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        <Clock className="w-5 h-5" />
        Pay ${costBreakdown.total} Now
      </button>
    </div>
  );
};

export default Payment;