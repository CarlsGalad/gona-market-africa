import React, { useState } from "react";
import { useRouter } from "next/router";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";

const FeedbackPage: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const router = useRouter();

  const handleRatingClick = (index: number) => {
    setRating(index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that a rating has been selected
    if (rating === 0) {
      alert("Please select a rating before submitting!");
      return;
    }

    // Optional: Validate that feedback and suggestions are filled out
    if (!feedback.trim() || !suggestion.trim()) {
      alert("Please fill out both the feedback and suggestions sections.");
      return;
    }

    try {
      // Save feedback to Firestore
      const feedbackDocRef = doc(firestore, "feedback", `${Date.now()}`);
      await setDoc(feedbackDocRef, {
        rating,
        feedback,
        suggestion,
        submittedAt: Timestamp.fromDate(new Date()),
      });

      // Show a success message
      alert("Thanks for your feedback!");

      // Reset form
      setFeedback("");
      setSuggestion("");
      setRating(0);

      // Navigate to home
      router.push("/");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("There was an error submitting your feedback. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Feedback & Suggestions
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Rating Section */}
          <div className="mb-6 text-center text-gray-800">
            <h2 className="text-2xl font-semibold mb-3">Rate Us</h2>
            <div className="flex justify-center space-x-2">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`w-10 h-10 rounded-full ${
                      rating > index ? "bg-gray-300" : "bg-gray-50"
                    }`}
                    onClick={() => handleRatingClick(index + 1)}
                    aria-label={`Rate ${index + 1}`}
                  >
                    ⭐
                  </button>
                ))}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="mb-6">
            <label
              htmlFor="feedback"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              Your Feedback
            </label>
            <textarea
              id="feedback"
              className="w-full px-4 py-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              rows={4}
              placeholder="How was your experience?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              aria-live="polite" // Screen readers will announce updates
            />
          </div>

          {/* Suggestions Section */}
          <div className="mb-6">
            <label
              htmlFor="suggestions"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              Suggestions for Improvement
            </label>
            <textarea
              id="suggestions"
              className="w-full px-4 py-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              rows={4}
              placeholder="What can we do to improve?"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 text-lg font-semibold bg-green-300 shadow-xl text-gray-900 rounded-lg hover:bg-green-400 transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;
