import React, { useState } from 'react';
import RatingSystem from './RatingSystem'; // Import the new component
import { FaUserCircle, FaPaperPlane } from 'react-icons/fa';

// Mock review data
const MOCK_REVIEWS = [
    { id: 1, user: 'EcoShopper88', rating: 5, date: '2025-10-15', comment: 'Great seller! The jacket was exactly as described and shipped fast. Highly recommend for sustainable fashion.', title: 'Excellent Transaction' },
    { id: 2, user: 'GreenGuru', rating: 4, date: '2025-10-01', comment: 'Jeans were in good condition, although shipping took one extra day than estimated. Good value overall.', title: 'Good Value' },
    { id: 3, user: 'SustainStyle', rating: 5, date: '2025-09-20', comment: 'A smooth and reliable transaction. Item was packaged securely using recycled materials. A true sustainability champion!', title: 'Best Packaging' },
];

/**
 * Component to display user reviews and allow new review submission.
 * * @param {string} sellerId - The ID of the seller (mocked).
 * @returns {JSX.Element} Review section with submission form.
 */
const UserReviews = ({ sellerId = "mock-seller-123" }) => {
    const [reviews, setReviews] = useState(MOCK_REVIEWS);
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [newTitle, setNewTitle] = useState('');

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length)
        : 0;

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (newRating === 0 || newComment.length < 10) {
            // In a real app, show a proper error message (not alert)
            console.error("Please provide a rating and a comment longer than 10 characters.");
            return;
        }

        const newReview = {
            id: Date.now(),
            user: 'CurrentUser', // Mocked current user
            rating: newRating,
            date: new Date().toISOString().slice(0, 10),
            comment: newComment,
            title: newTitle || 'User Review'
        };

        // In a real app:
        // 1. Post to API
        // 2. Refresh data from server

        // For demo: prepend the new review to the list
        setReviews([newReview, ...reviews]);
        
        // Clear form fields
        setNewRating(0);
        setNewComment('');
        setNewTitle('');
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Seller Reviews ({reviews.length})</h2>

            {/* Average Rating Summary */}
            <div className="flex items-center space-x-4 mb-8 p-4 bg-green-50 rounded-xl border border-green-200">
                <RatingSystem rating={averageRating} isInteractive={false} />
                <p className="text-xl font-medium text-gray-700">
                    {averageRating.toFixed(1)} out of 5 stars
                </p>
            </div>

            {/* Review Submission Form */}
            <div className="mb-10 p-6 bg-white shadow-lg rounded-xl border-t-4 border-green-500">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Write a Review</h3>
                <form onSubmit={handleSubmitReview}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Your Rating:</label>
                        <RatingSystem 
                            rating={newRating} 
                            isInteractive={true} 
                            onRatingChange={setNewRating} 
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Review Title (Optional)"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                    
                    <textarea
                        placeholder="Share your experience (10 characters minimum)"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                        minLength={10}
                        rows="4"
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-green-500 focus:border-green-500"
                    />
                    <button
                        type="submit"
                        disabled={newRating === 0}
                        className={`mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-semibold transition duration-150 ${
                            newRating > 0 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <FaPaperPlane /> Submit Review
                    </button>
                </form>
            </div>

            {/* List of Existing Reviews */}
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="p-5 bg-white shadow-md rounded-lg border border-gray-100">
                        <div className="flex items-start space-x-4 mb-3">
                            <FaUserCircle className="text-4xl text-green-600 flex-shrink-0" />
                            <div>
                                <p className="text-lg font-bold text-gray-800">{review.title}</p>
                                <div className="flex items-center space-x-3 text-sm text-gray-500">
                                    <span>{review.user}</span>
                                    <span>&bull;</span>
                                    <span>{review.date}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <RatingSystem rating={review.rating} isInteractive={false} />
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserReviews;