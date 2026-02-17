import React, { useState } from 'react';
import { createWeekend } from '../services/weekendService';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const WeekendForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        season: '',
        location: '',
        startDate: '',
        endDate: '',
        status: 'UPCOMING',
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
        setLoading(true);
        setError(null);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (image) {
                data.append('image', image);
            }

            const response = await createWeekend(data);
            if (response.success) {
                navigate('/');
            } else {
                setError(response.message || "Failed to create weekend");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Weekend</h2>
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Season</label>
                        <input type="number" name="season" value={formData.season} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">End Date</label>
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="UPCOMING">Upcoming</option>
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>

                {/* Enhanced Image Upload */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Weekend Image</label>

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

                <div className="flex items-center justify-between">
                    <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        {loading ? 'Creating...' : 'Create Weekend'}
                    </button>
                    <button type="button" onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-800">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default WeekendForm;
