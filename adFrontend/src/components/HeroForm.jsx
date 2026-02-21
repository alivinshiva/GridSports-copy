import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHero } from '../services/heroService';
import { Save, Upload, X } from 'lucide-react';

const HeroForm = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !location || !image) {
            setError("Name, Location, and Image are required.");
            return;
        }

        setSubmitting(true);
        setError('');

        const formData = new FormData();
        formData.append("name", name);
        formData.append("location", location);
        formData.append("image", image);

        try {
            const response = await createHero(formData);
            if (response.success) {
                navigate('/heroes');
            } else {
                setError(response.message || "Failed to create hero.");
            }
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Create New Hero</h2>
            {error && <div className="text-red-500 mb-4 bg-red-50 p-3 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Hero Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                        placeholder="e.g. F1 Silverstone 2026"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                        placeholder="e.g. Silverstone, UK"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Cover Image</label>

                    {!imagePreview ? (
                        <div
                            onClick={() => document.getElementById('fileInput').click()}
                            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors bg-gray-50"
                        >
                            <Upload className="w-10 h-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 font-medium">Click to upload image</p>
                            <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                            <input
                                id="fileInput"
                                type="file"
                                name="image"
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    ) : (
                        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg transform hover:scale-110"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-between pt-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-colors disabled:opacity-50"
                    >
                        {submitting ? 'Creating...' : <><Save size={18} className="mr-2" /> Create</>}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/heroes')}
                        className="text-gray-600 hover:text-gray-800 px-4 py-2"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HeroForm;
