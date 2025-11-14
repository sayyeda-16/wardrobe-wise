// src/components/ImageGallery.js
import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/**
 * A reusable component for displaying a gallery of images with a main viewer and thumbnails.
 * @param {string[]} imageUrls - An array of image URLs to display.
 * @param {string} [altText='Item image'] - Base alt text for images.
 */
const ImageGallery = ({ imageUrls = [], altText = 'Item image' }) => {
    const [mainImageIndex, setMainImageIndex] = useState(0);

    // Reset to first image if imageUrls change
    useEffect(() => {
        setMainImageIndex(0);
    }, [imageUrls]);

    if (!imageUrls || imageUrls.length === 0) {
        return (
            <div className="w-full bg-gray-200 rounded-lg flex items-center justify-center h-64 text-gray-500 text-lg border border-gray-300">
                No images available.
            </div>
        );
    }

    const goToNextImage = () => {
        setMainImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    };

    const goToPreviousImage = () => {
        setMainImageIndex((prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
    };

    const currentMainImage = imageUrls[mainImageIndex];

    return (
        <div className="space-y-4">
            {/* Main Image Display */}
            <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
                <img
                    src={currentMainImage}
                    alt={`${altText} ${mainImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain" // Use object-contain to ensure image fits without cropping
                />
                
                {/* Navigation Arrows */}
                {imageUrls.length > 1 && (
                    <>
                        <button
                            onClick={goToPreviousImage}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                            aria-label="Previous image"
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            onClick={goToNextImage}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                            aria-label="Next image"
                        >
                            <FaChevronRight />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {imageUrls.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3">
                    {imageUrls.map((url, index) => (
                        <div
                            key={url + index} // Use index in key as URLs might be the same
                            className={`w-full h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                                index === mainImageIndex ? 'border-green-500 shadow-md' : 'border-gray-200 hover:border-gray-400'
                            }`}
                            onClick={() => setMainImageIndex(index)}
                        >
                            <img
                                src={url}
                                alt={`${altText} thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageGallery;