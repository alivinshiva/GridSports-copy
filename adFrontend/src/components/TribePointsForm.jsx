import React, { useState, useEffect } from 'react';
import { Target, AlertCircle, CheckCircle2, Loader2, Coins } from 'lucide-react';

const TribePointsForm = () => {
    const [tribes, setTribes] = useState([]);
    const [formData, setFormData] = useState({
        tribeName: '',
        points: '',
    });
    const [loading, setLoading] = useState(false);
    const [fetchingTribes, setFetchingTribes] = useState(true);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchTribes = async () => {
            try {
                const url = import.meta.env.VITE_ADBACKEND_URL || "http://localhost:5000";
                const response = await fetch(`${url}/api/v1/tribe/all`);
                const result = await response.json();

                if (result.success) {
                    setTribes(result.data);
                } else {
                    console.error("Failed to fetch tribes:", result.message);
                }
            } catch (error) {
                console.error("Error fetching tribes:", error);
            } finally {
                setFetchingTribes(false);
            }
        };

        fetchTribes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const url = import.meta.env.VITE_ADBACKEND_URL || "http://localhost:5000";
            const response = await fetch(`${url}/api/v1/tribe/add-points`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tribeName: formData.tribeName,
                    points: formData.points
                }),
            });

            const result = await response.json();

            if (result.success) {
                setStatus({
                    type: 'success',
                    message: result.message || 'Points added successfully!'
                });
                setFormData(prev => ({ ...prev, points: '' })); // Reset points field

                // Update local tribes array with new points
                if (result.data) {
                    setTribes(prev => prev.map(t =>
                        t.name === result.data.name ? { ...t, totalPoints: result.data.totalPoints } : t
                    ));
                }
            } else {
                setStatus({
                    type: 'error',
                    message: result.message || 'Failed to add points'
                });
            }
        } catch (error) {
            console.error('Error adding points:', error);
            setStatus({
                type: 'error',
                message: 'A network error occurred while adding points. Please check if the server is running.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <Target size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Tribe Points</h1>
                    <p className="text-gray-500 mt-1">Manually add points to a specific tribe</p>
                </div>
            </div>

            {status.message && (
                <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${status.type === 'success'
                        ? 'bg-green-50 text-green-800 border-l-4 border-green-500'
                        : 'bg-red-50 text-red-800 border-l-4 border-red-500'
                    }`}>
                    {status.type === 'success' ? (
                        <CheckCircle2 className="shrink-0 mt-0.5" size={20} />
                    ) : (
                        <AlertCircle className="shrink-0 mt-0.5" size={20} />
                    )}
                    <p className="font-medium text-sm leading-relaxed">{status.message}</p>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 sm:p-8">
                    {fetchingTribes ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-blue-500" size={32} />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Tribe Selection */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Select Tribe
                                </label>
                                <select
                                    name="tribeName"
                                    value={formData.tribeName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900"
                                >
                                    <option value="" disabled>-- Select a Tribe --</option>
                                    {tribes.map((tribe) => (
                                        <option key={tribe._id || tribe.name} value={tribe.name}>
                                            {tribe.name} (Current Points: {tribe.totalPoints})
                                        </option>
                                    ))}
                                    {/* Fallback if DB fetch is empty but we know the enums */}
                                    {tribes.length === 0 && (
                                        <>
                                            <option value="IRON TRIBE">IRON TRIBE</option>
                                            <option value="ROYAL TRIBE">ROYAL TRIBE</option>
                                            <option value="INDIGO TRIBE">INDIGO TRIBE</option>
                                            <option value="EMERALD TRIBE">EMERALD TRIBE</option>
                                            <option value="ORANGE TRIBE">ORANGE TRIBE</option>
                                            <option value="SCARLET TRIBE">SCARLET TRIBE</option>
                                            <option value="CRIMSON TRIBE">CRIMSON TRIBE</option>
                                            <option value="PLATINUM TRIBE">PLATINUM TRIBE</option>
                                            <option value="TITANIUM TRIBE">TITANIUM TRIBE</option>
                                            <option value="AZURE TRIBE">AZURE TRIBE</option>
                                            <option value="SILVER TRIBE">SILVER TRIBE</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            {/* Points to Add */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Coins size={16} className="text-gray-400" />
                                    Points to Add
                                </label>
                                <input
                                    type="number"
                                    name="points"
                                    value={formData.points}
                                    onChange={handleChange}
                                    placeholder="Enter points (e.g., 50)"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900"
                                />
                                <p className="text-xs text-gray-500 mt-1">Use a negative number to deduct points if needed.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2" size={18} />
                                        Adding Points...
                                    </>
                                ) : (
                                    'Add Points to Tribe'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TribePointsForm;
