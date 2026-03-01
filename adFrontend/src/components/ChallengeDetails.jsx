import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChallengeById, updateChallenge, deleteChallenge } from '../services/challengeService';
import { Trophy, Calendar, MapPin, Trash2, ArrowLeft, CheckCircle, Clock, XCircle, MessageSquare, Star } from 'lucide-react';

const ChallengeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusUpdating, setStatusUpdating] = useState(false);

    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await getChallengeById(id);
                if (response.success) {
                    setChallenge(response.data);
                    setSelectedStatus(response.data.status);
                } else {
                    setError("Failed to fetch challenge details");
                }
            } catch (err) {
                setError("Error fetching challenge details");
            } finally {
                setLoading(false);
            }
        };

        fetchChallenge();
    }, [id]);

    const handleSaveChanges = async () => {
        setStatusUpdating(true);
        try {
            const response = await updateChallenge(id, { status: selectedStatus });
            if (response.success) {
                setChallenge({ ...challenge, status: selectedStatus });
                // alert("Status updated successfully!"); 
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            // Silently handle error
            alert("Error updating status");
        } finally {
            setStatusUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this challenge? This action cannot be undone.")) {
            try {
                const response = await deleteChallenge(id);
                if (response.success) {
                    navigate('/challenges');
                } else {
                    alert("Failed to delete challenge");
                }
            } catch (error) {
                // Silently handle error
                alert("Error deleting challenge");
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'UPCOMING': return 'text-blue-600 bg-blue-100 border-blue-200';
            case 'ACTIVE': return 'text-green-600 bg-green-100 border-green-200';
            case 'CLOSED': return 'text-red-600 bg-red-100 border-red-200';
            default: return 'text-gray-600 bg-gray-100 border-gray-200';
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg mx-auto max-w-2xl mt-10">{error}</div>;
    if (!challenge) return <div className="p-8 text-center text-gray-500">Challenge not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <button
                onClick={() => navigate('/challenges')}
                className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" /> Back to Challenges
            </button>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {/* Header Image */}
                <div className="h-64 md:h-80 bg-gray-200 relative">
                    {challenge.imageUrl ? (
                        <img src={challenge.imageUrl} alt={challenge.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
                            <Trophy size={64} className="text-white opacity-50" />
                        </div>
                    )}
                    <div className="absolute top-4 right-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(challenge.status)} shadow-sm`}>
                            {challenge.status}
                        </span>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-3">
                                <span className="uppercase tracking-wider text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100">{challenge.type}</span>
                                <span className="text-gray-400 text-lg">•</span>
                                <span className="text-gray-600 text-base font-medium">Round {challenge.round}</span>
                            </div>
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">{challenge.name}</h1>
                            <div className="flex items-center text-gray-500 text-sm">
                                <MapPin size={16} className="mr-1" />
                                {challenge.weekend?.location || "Location N/A"}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 md:mt-0 flex items-center space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Status</label>
                                <div className="flex items-center space-x-2">
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        disabled={statusUpdating}
                                        className="block w-36 pl-3 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border bg-white"
                                    >
                                        <option value="UPCOMING">Upcoming</option>
                                        <option value="ACTIVE">Active</option>
                                        <option value="CLOSED">Closed</option>
                                    </select>
                                    <button
                                        onClick={handleSaveChanges}
                                        disabled={statusUpdating || selectedStatus === challenge.status}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusUpdating || selectedStatus === challenge.status
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                                            }`}
                                    >
                                        {statusUpdating ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 mt-6 md:mt-0">
                            <button
                                onClick={handleDelete}
                                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                                title="Delete Challenge"
                            >
                                <Trash2 size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div className="md:col-span-2">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Description</h3>
                            <p className="text-gray-700 text-lg leading-relaxed mb-8">{challenge.description}</p>

                            {challenge.rules && challenge.rules.length > 0 && (
                                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                                    <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center">
                                        <CheckCircle size={20} className="mr-2" /> Rules
                                    </h3>
                                    <ul className="space-y-3">
                                        {challenge.rules.map((rule, index) => (
                                            <li key={index} className="flex items-start text-gray-700 font-medium">
                                                <span className="font-bold text-indigo-500 mr-3 text-lg">{index + 1}.</span>
                                                {rule}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {challenge.tags && challenge.tags.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {challenge.tags.map((tag, index) => (
                                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Scoring Type & Parameters */}
                            <div className="mt-6">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                    <Star size={16} className="mr-2" />
                                    Scoring Configuration
                                </h3>
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-500">Type:</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${challenge.scoringType === 'DETAILED'
                                            ? 'bg-purple-100 text-purple-700 border-purple-200'
                                            : 'bg-blue-100 text-blue-700 border-blue-200'
                                            }`}>
                                            {challenge.scoringType || 'SIMPLE'}
                                        </span>
                                    </div>

                                    {challenge.parameters && challenge.parameters.length > 0 && (
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Parameters</p>
                                            <div className="space-y-2">
                                                {challenge.parameters.map((param, idx) => (
                                                    <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                                        <span className="text-sm font-medium text-gray-800">
                                                            <span className="text-blue-500 font-bold mr-2">{idx + 1}.</span>
                                                            {param.name}
                                                        </span>
                                                        {challenge.scoringType === 'DETAILED' && (
                                                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                                                                Max: {param.maxPoints} pts
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pre-defined Comments */}
                            {challenge.comments && challenge.comments.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                        <MessageSquare size={16} className="mr-2" />
                                        Pre-defined Comments ({challenge.comments.length})
                                    </h3>
                                    <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                                        <div className="space-y-2">
                                            {challenge.comments.map((comment, index) => (
                                                <div key={index} className="flex items-center bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                                                    <span className="text-emerald-600 font-bold mr-3 text-sm">{index + 1}.</span>
                                                    <span className="text-sm font-medium text-gray-800">"{comment}"</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-1 space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                                    <Calendar size={16} className="mr-2" /> Weekend Timeline
                                </h4>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Starts</p>
                                        <p className="text-base font-bold text-gray-800">
                                            {challenge.weekend?.startDate ? new Date(challenge.weekend.startDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {challenge.weekend?.startDate ? new Date(challenge.weekend.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                        </p>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4">
                                        <p className="text-xs text-gray-500 font-medium mb-1">Ends</p>
                                        <p className="text-base font-bold text-gray-800">
                                            {challenge.weekend?.endDate ? new Date(challenge.weekend.endDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {challenge.weekend?.endDate ? new Date(challenge.weekend.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                                    <Calendar size={16} className="mr-2" /> Challenge Schedule
                                </h4>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Starts</p>
                                        <p className="text-base font-bold text-gray-800">
                                            {new Date(challenge.startAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(challenge.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4">
                                        <p className="text-xs text-gray-500 font-medium mb-1">Ends</p>
                                        <p className="text-base font-bold text-gray-800">
                                            {new Date(challenge.endAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(challenge.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Challenge Info</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                        <span className="text-gray-500 text-sm">Season</span>
                                        <span className="font-bold text-gray-800">{challenge.season}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                        <span className="text-gray-500 text-sm">Weekend</span>
                                        <span className="font-semibold text-gray-800 text-sm text-right truncate w-32" title={challenge.weekend?.title}>{challenge.weekend?.title || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-500 text-sm">Location</span>
                                        <span className="font-semibold text-gray-800 text-sm">{challenge.weekend?.location || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChallengeDetails;
