// src/components/ImageUpload.js
import React, { useState, useCallback } from 'react';
import { FaCloudUploadAlt, FaTimesCircle, FaCheckCircle, FaTrashAlt } from 'react-icons/fa';
// NOTE: In a real application, you would import { useDropzone } from 'react-dropzone';

/**
 * A reusable component for drag-and-drop image uploads.
 * NOTE: This component simulates the logic of a drag-and-drop library (like react-dropzone).
 * * @param {function} onImagesChange - Callback function when images are added/removed.
 * @param {number} maxFiles - Maximum number of files allowed (default 5).
 */
const ImageUpload = ({ onImagesChange, maxFiles = 5 }) => {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    
    // Helper function to convert a File object into a preview URL
    const getFilePreview = (file) => URL.createObjectURL(file);

    // Simulated Dropzone logic
    const handleDrop = useCallback((acceptedFiles) => {
        setIsDragging(false);
        const newFiles = acceptedFiles.slice(0, maxFiles - files.length);

        if (newFiles.length > 0) {
            const updatedFiles = [...files, ...newFiles];
            setFiles(updatedFiles);
            // Notify parent component of the change
            if (onImagesChange) {
                onImagesChange(updatedFiles);
            }
        }
    }, [files, maxFiles, onImagesChange]);

    const handleRemoveFile = (fileName) => {
        const updatedFiles = files.filter(file => file.name !== fileName);
        setFiles(updatedFiles);
        if (onImagesChange) {
            onImagesChange(updatedFiles);
        }
    };
    
    // Simulated Event Handlers (mimicking react-dropzone props)
    const getRootProps = () => ({
        onDragEnter: () => setIsDragging(true),
        onDragLeave: () => setIsDragging(false),
        onDrop: (e) => {
            e.preventDefault();
            const acceptedFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
            handleDrop(acceptedFiles);
        },
        onClick: () => document.getElementById('fileInput').click(),
        style: { cursor: files.length < maxFiles ? 'pointer' : 'not-allowed' }
    });
    
    const getInputProps = () => ({
        type: 'file',
        id: 'fileInput',
        accept: 'image/*',
        multiple: true,
        onChange: (e) => {
            handleDrop(Array.from(e.target.files).filter(file => file.type.startsWith('image/')));
            e.target.value = null; // Reset input so same file can be uploaded again
        },
        disabled: files.length >= maxFiles,
        style: { display: 'none' }
    });

    const isMaxFilesReached = files.length >= maxFiles;
    
    return (
        <div className="space-y-6">
            <div 
                {...getRootProps()}
                className={`p-10 border-4 border-dashed rounded-xl transition-colors duration-300 ${
                    isMaxFilesReached ? 'border-gray-300 bg-gray-50' : 
                    isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                } flex flex-col items-center justify-center text-center`}
            >
                <input {...getInputProps()} />
                
                <FaCloudUploadAlt className={`w-10 h-10 mb-3 ${isDragging ? 'text-green-600' : 'text-gray-400'}`} />
                
                {isMaxFilesReached ? (
                    <p className="text-red-500 font-semibold flex items-center">
                        <FaTimesCircle className='mr-2' /> Maximum of {maxFiles} images reached.
                    </p>
                ) : (
                    <>
                        <p className="text-lg font-semibold text-gray-700">
                            {isDragging ? "Drop the images here..." : "Drag 'n' drop images here, or click to select files"}
                        </p>
                        <em className="text-sm text-gray-500 mt-1">(Up to {maxFiles} files, images only)</em>
                    </>
                )}
            </div>

            {/* File Previews */}
            {files.length > 0 && (
                <div className="mt-4 border p-4 rounded-xl bg-white shadow-inner">
                    <h3 className="text-lg font-bold mb-3 flex items-center text-gray-800">
                        <FaCheckCircle className="text-green-500 mr-2" /> Uploaded Images ({files.length}/{maxFiles})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {files.map((file, index) => (
                            <div key={file.name} className="relative group w-full h-32 rounded-lg overflow-hidden shadow-md">
                                <img
                                    src={getFilePreview(file)}
                                    alt={`Preview ${index}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleRemoveFile(file.name); }}
                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl"
                                    aria-label={`Remove ${file.name}`}
                                >
                                    <FaTrashAlt className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                                    {file.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;