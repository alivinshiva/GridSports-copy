import React, { useState, useEffect } from 'react';
import { Target, AlertCircle, CheckCircle2, Loader2, Coins, Users } from 'lucide-react';

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
                // Corrected env variable name to match VITE_AD_API_URL used in adFrontend/.env
                const url = import.meta.env.VITE_AD_API_URL || import.meta.env.VITE_MAIN_API_URL || "http://localhost:9000";
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
            const url = import.meta.env.VITE_AD_API_URL || import.meta.env.VITE_MAIN_API_URL || "http://localhost:9000";
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
                    message: result.message || 'Points updated successfully!'
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
                    message: result.message || 'Failed to update points'
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

    // Sort tribes from highest points to lowest for the standings view
    const sortedTribes = [...tribes].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <Target size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Tribe Points</h1>
                    <p className="text-gray-500 mt-1">View current standings and adjust points (add or deduct)</p>
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

            <div className="flex flex-col lg:flex-row gap-8">

                {/* Left Side: All Tribes Overview */}
                <div className="w-full lg:w-1/2 flex flex-col">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Users size={20} className="text-blue-500" />
                                Current Standings
                            </h2>
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                                {tribes.length} Tribes
                            </span>
                        </div>
                        <div className="p-6">
                            {fetchingTribes ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="animate-spin text-blue-500" size={32} />
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {sortedTribes.map((tribe, index) => (
                                        <div key={tribe._id || tribe.name} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-bold text-gray-600 shadow-sm border border-white">
                                                    {index + 1}
                                                </div>
                                                <span className="font-semibold text-gray-800">{tribe.name}</span>
                                            </div>
                                            <span className="font-bold text-blue-600 text-lg">{tribe.totalPoints?.toLocaleString() || 0} pts</span>
                                        </div>
                                    ))}
                                    {sortedTribes.length === 0 && (
                                        <p className="text-gray-500 text-center py-4">No tribes found.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side: Controller */}
                <div className="w-full lg:w-1/2 flex flex-col">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-init">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Coins size={20} className="text-orange-500" />
                                Point Controller
                            </h2>
                        </div>
                        <div className="p-6 sm:p-8">
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
                                        {[
                                            "IRON TRIBE", "ROYAL TRIBE", "INDIGO TRIBE",
                                            "EMERALD TRIBE", "ORANGE TRIBE", "SCARLET TRIBE",
                                            "CRIMSON TRIBE", "PLATINUM TRIBE", "TITANIUM TRIBE",
                                            "AZURE TRIBE", "SILVER TRIBE"
                                        ].map((tribeName) => {
                                            const existingTribe = tribes.find(t => t.name === tribeName);
                                            const currentPoints = existingTribe?.totalPoints || 0;
                                            return (
                                                <option key={tribeName} value={tribeName}>
                                                    {tribeName} (Current: {currentPoints.toLocaleString()})
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                {/* Points to Add/Deduct */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        Points to Add / Deduct
                                    </label>
                                    <input
                                        type="number"
                                        name="points"
                                        value={formData.points}
                                        onChange={handleChange}
                                        placeholder="Enter points (e.g., 50 or -50)"
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Submit a positive number to add points, or a negative number to deduct points.</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin -ml-1 mr-2" size={18} />
                                            Updating Points...
                                        </>
                                    ) : (
                                        'Update Tribe Points'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TribePointsForm;
