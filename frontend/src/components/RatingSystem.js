import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

/**
 * Reusable component for displaying or selecting a star rating.
 * * @param {number} rating - The current rating (e.g., 4.5).
 * @param {number} maxRating - The maximum rating (default 5).
 * @param {boolean} isInteractive - If true, allows user to click to set rating.
 * @param {function} onRatingChange - Callback for interactive mode.
 * @returns {JSX.Element} A set of interactive or display-only stars.
 */
const RatingSystem = ({ rating = 0, maxRating = 5, isInteractive = false, onRatingChange = () => {} }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const effectiveRating = isInteractive ? (hoverRating || rating) : rating;

    const handleStarClick = (index) => {
        if (isInteractive) {
            onRatingChange(index + 1);
        }
    };

    const handleMouseEnter = (index) => {
        if (isInteractive) {
            setHoverRating(index + 1);
        }
    };

    const handleMouseLeave = () => {
        if (isInteractive) {
            setHoverRating(0);
        }
    };

    const starContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        cursor: isInteractive ? 'pointer' : 'default',
    };

    // Generates a list of star icons
    const renderStars = () => {
        const stars = [];
        for (let i = 0; i < maxRating; i++) {
            const starValue = i + 1;
            
            // Determine color based on effective rating
            let color = '#ccc'; // Default grey for unrated
            if (starValue <= effectiveRating) {
                color = '#facc15'; // Yellow for fully rated
            } 
            
            // Note: For simplicity, we are not handling half-stars visually in this iteration, 
            // but the rating state can still be a decimal (e.g., 4.5)

            stars.push(
                <FaStar
                    key={i}
                    style={{ 
                        color: color, 
                        fontSize: '20px', 
                        transition: 'color 0.1s',
                    }}
                    onClick={() => handleStarClick(i)}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={handleMouseLeave}
                />
            );
        }
        return stars;
    };

    return (
        <div style={starContainerStyle}>
            {renderStars()}
            {/* Display the numerical rating next to the stars if not interactive */}
            {!isInteractive && (
                <span style={{ marginLeft: '8px', fontSize: '18px', fontWeight: '600', color: '#4b5563' }}>
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default RatingSystem;