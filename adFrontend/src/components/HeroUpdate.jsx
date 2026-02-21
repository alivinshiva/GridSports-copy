import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateHero } from '../services/heroService';
import { Save, Upload, X } from 'lucide-react';

const HeroUpdate = () => {
    const locationState = useLocation();
    const navigate = useNavigate();

    // Retrieve hero data from routing state so we don't need to do an API call
    const passedHero = locationState.state?.hero;

    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!passedHero) {
            // If they navigated here directly without state, bounce them back
            navigate('/heroes');
        } else {
            setName(passedHero.name);
            setLocation(passedHero.location);
            setPreviewUrl(passedHero.imageUrl);
        }
    }, [passedHero, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreviewUrl('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        const formData = new FormData();
        formData.append("name", name);
        formData.append("location", location);
        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await updateHero(passedHero._id, formData);
            if (response.success) {
                navigate('/heroes');
            } else {
                setError(response.message || "Failed to update hero.");
            }
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!passedHero) return null; // Wait for redirect check

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Update Hero</h2>
            {error && <div className="text-red-500 mb-4 bg-red-50 p-3 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Hero Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
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
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Update Cover Image (Optional)</label>

                    {!previewUrl ? (
                        <div
                            onClick={() => document.getElementById('fileInputUpdate').click()}
                            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors bg-gray-50"
                        >
                            <Upload className="w-10 h-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 font-medium">Click to upload new image</p>
                            <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                            <input
                                id="fileInputUpdate"
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
                                src={previewUrl}
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
                        className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-colors disabled:opacity-50"
                    >
                        {submitting ? 'Saving...' : <><Save size={18} className="mr-2" /> Update</>}
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

export default HeroUpdate;
