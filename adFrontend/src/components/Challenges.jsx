import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllChallenges } from '../services/challengeService';
import { Trophy, Calendar, MapPin, Plus } from 'lucide-react';

const Challenges = () => {
    const navigate = useNavigate();
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const response = await getAllChallenges();
                if (response.success) {
                    setChallenges(response.data);
                } else {
                    setError("Failed to fetch challenges");
                }
            } catch (err) {
                setError("Error fetching challenges");
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'UPCOMING': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
            case 'ACTIVE': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
            case 'CLOSED': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
            default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading Challenges...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white"></h1>
                <button
                    onClick={() => navigate('/add-challenge')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 flex items-center"
                >
                    <Plus size={18} className="mr-2" />
                    Create Challenge
                </button>
            </div>

            {challenges.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
                    No challenges found. Create one to get started!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challenges.map((challenge) => (
                        <div key={challenge._id} onClick={() => navigate(`/challenge-details/${challenge._id}`)} className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="h-56 bg-gray-200 flex items-center justify-center relative">
                                {challenge.imageUrl ? (
                                    <img src={challenge.imageUrl} alt={challenge.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Trophy size={48} className="text-gray-400 opacity-80" />
                                )}
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(challenge.status)}`}>
                                        {challenge.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="uppercase tracking-wide text-xs text-indigo-500 dark:text-indigo-400 font-bold mb-1">{challenge.type}</div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{challenge.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{challenge.description}</p>

                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <Calendar size={16} className="mr-2 text-gray-400" />
                                        {new Date(challenge.startAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <MapPin size={16} className="mr-2 text-gray-400" />
                                        {challenge.weekend?.location || "N/A"}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <Trophy size={16} className="mr-2 text-gray-400" />
                                        Round: {challenge.round}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Challenges;
