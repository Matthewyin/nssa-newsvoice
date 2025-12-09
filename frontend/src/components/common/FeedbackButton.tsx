/**
 * Feedback Button Component
 *
 * Provides a floating button for users to submit feedback
 *
 * Requirements: Task 22.4 - 收集用户反馈
 */

import { useState } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Alert } from './Alert';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { trackFeatureUsage } from '../../utils/analytics';

interface FeedbackData {
  rating: number | null;
  feedback: string;
  page: string;
  timestamp: string;
  userAgent: string;
  screenSize: string;
}

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    trackFeatureUsage('feedback_opened');
  };

  const handleClose = () => {
    setOpen(false);
    // Reset form after a delay if submitted
    if (submitted) {
      setTimeout(() => {
        setSubmitted(false);
        setRating(null);
        setFeedback('');
        setError(null);
      }, 500);
    }
  };

  const handleSubmit = async () => {
    if (!rating && !feedback.trim()) {
      setError('Please provide a rating or feedback');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const db = getFirestore();
      const feedbackData: FeedbackData = {
        rating,
        feedback: feedback.trim(),
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`
      };

      await addDoc(collection(db, 'feedback'), feedbackData);

      trackFeatureUsage('feedback_submitted', { 
        rating: rating || 0,
        has_text: feedback.trim().length > 0
      });

      setSubmitted(true);
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary-hover text-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label="Provide feedback"
      >
        💬 Feedback
      </button>

      {/* Feedback Modal */}
      <Modal
        isOpen={open}
        onClose={handleClose}
        title={submitted ? '🎉 Thank You!' : 'Share Your Feedback'}
      >
        {submitted ? (
          <Alert variant="success">
            Thank you for your feedback! We appreciate your input and will use it to improve the experience.
          </Alert>
        ) : (
          <div className="space-y-4">
            {/* Rating Section */}
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">
                How would you rate your experience?
              </label>

              <div className="flex items-center gap-3">
                {/* Star Rating */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-colors ${
                        rating && star <= rating
                          ? 'text-yellow-400'
                          : 'text-slate-300 dark:text-slate-600 hover:text-yellow-300'
                      }`}
                      aria-label={`Rate ${star} stars`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                {/* Rating Label */}
                {rating && (
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {rating === 5 ? 'Excellent!' :
                     rating === 4 ? 'Good' :
                     rating === 3 ? 'Average' :
                     rating === 2 ? 'Poor' :
                     'Very Poor'}
                  </span>
                )}
              </div>
            </div>

            {/* Feedback Text Area */}
            <div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you think... (optional)"
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            {/* Helper Text */}
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Your feedback helps us improve. Current page: {window.location.pathname}
            </p>

            {/* Error Alert */}
            {error && (
              <Alert variant="error">
                {error}
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={submitting || (!rating && !feedback.trim())}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
