import React, { useState } from 'react';
import { Star, Send, CheckCircle, ArrowLeft } from 'lucide-react';

const Feedback: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleSubmit = () => {
    if (rating > 0) {
      console.log('Feedback submitted:', { rating, comment });
      setSubmitted(true);
    }
  };

  const getRatingText = (stars: number) => {
    switch (stars) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Rate your experience';
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h1>
          <p className="text-slate-600 mb-6">Your feedback has been submitted successfully.</p>
          
          <div className="bg-emerald-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                />
              ))}
            </div>
            <p className="text-emerald-700 font-semibold">{getRatingText(rating)}</p>
          </div>
          
          <button 
            onClick={() => window.history.back()}
            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors"
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
        <h1 className="text-2xl font-bold text-slate-900">Rate Your Experience</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        {/* Hospital Info */}
        <div className="text-center mb-8">
          <img 
            src="https://picsum.photos/seed/hospital/80/80" 
            alt="Hospital" 
            className="w-16 h-16 rounded-xl mx-auto mb-4"
          />
          <h2 className="text-lg font-bold text-slate-900">Fortis Memorial Research Institute</h2>
          <p className="text-slate-600">Consultation completed on Nov 15, 2023</p>
        </div>

        {/* Star Rating */}
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">How was your experience?</h3>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-slate-300 hover:text-yellow-300'
                  }`}
                />
              </button>
            ))}
          </div>
          
          <p className="text-lg font-semibold text-slate-700">
            {getRatingText(hoverRating || rating)}
          </p>
        </div>

        {/* Comment Section */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Additional Comments (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us more about your experience..."
            rows={4}
            className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
          />
          <p className="text-xs text-slate-500 mt-2">
            Your feedback helps us improve our services
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          Send Evaluation
        </button>
        
        {rating === 0 && (
          <p className="text-center text-sm text-slate-500 mt-3">
            Please select a star rating to submit your feedback
          </p>
        )}
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Your Privacy</h4>
        <p className="text-sm text-blue-700">
          Your feedback is anonymous and will be used to improve our services. 
          We may contact you for follow-up if you've provided contact information.
        </p>
      </div>
    </div>
  );
};

export default Feedback;