import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWeekendById, deleteWeekend } from '../services/weekendService';
import { getAllChallenges } from '../services/challengeService';
import { Trophy, Calendar, MapPin } from 'lucide-react';

const WeekendDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [weekend, setWeekend] = useState(null);
    const [challenges, setChallenges] = useState([]);
    const [activeTab, setActiveTab] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [weekendRes, challengeRes] = await Promise.all([
                    getWeekendById(id),
                    getAllChallenges()
                ]);

                if (weekendRes.success) {
                    setWeekend(weekendRes.data);
                } else {
                    setError(weekendRes.message || "Failed to fetch details");
                    return;
                }

                if (challengeRes.success && challengeRes.data) {
                    const weekendChallenges = challengeRes.data.filter(c =>
                        c.weekend && (c.weekend._id === id || c.weekend === id)
                    );
                    setChallenges(weekendChallenges);
                }
            } catch (err) {
                setError("An error occurred while fetching details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this weekend?")) {
            try {
                const response = await deleteWeekend(id);
                if (response.success) {
                    navigate('/weekends'); // Redirect to dashboard after delete
                } else {
                    alert("Failed to delete weekend: " + response.message);
                }
            } catch (err) {
                alert("An error occurred while deleting.");
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'UPCOMING': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
            case 'ACTIVE': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
            case 'CLOSED': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
            default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const filteredChallenges = activeTab === 'ALL'
        ? challenges
        : challenges.filter(c => c.status === activeTab);

    if (loading) return <div className="text-center mt-10">Loading Details...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
    if (!weekend) return <div className="text-center mt-10">Weekend not found</div>;

    return (
        <div className="max-w-6xl mx-auto mt-10 space-y-8 pb-10">
            {/* Weekend Details Section */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden md:flex">
                <div className="md:flex-shrink-0">
                    {weekend.imageUrl && (
                        <img className="h-48 w-full object-cover md:h-full md:w-96" src={weekend.imageUrl} alt={weekend.title} />
                    )}
                </div>
                <div className="p-8 w-full">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{weekend.status}</div>
                    <h1 className="block mt-1 text-lg leading-tight font-medium text-black">{weekend.title}</h1>
                    <p className="mt-2 text-gray-500">Season: {weekend.season}</p>
                    <p className="mt-2 text-gray-500">Location: {weekend.location}</p>
                    <p className="mt-2 text-gray-500">
                        Date: {new Date(weekend.startDate).toLocaleDateString()} - {new Date(weekend.endDate).toLocaleDateString()}
                    </p>
                    <div className="mt-4 text-xs text-gray-400">
                        <p>Created At: {new Date(weekend.createdAt).toLocaleString()}</p>
                        <p>Updated At: {new Date(weekend.updatedAt).toLocaleString()}</p>
                    </div>

                    <div className="mt-6 flex space-x-4">
                        <button
                            onClick={() => navigate(`/update/${weekend._id}`)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Update Status
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Delete Weekend
                        </button>
                        <button
                            onClick={() => navigate('/weekends')}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                        >
                            Back to Weekends
                        </button>
                    </div>
                </div>
            </div>

            {/* Challenges Section */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center mb-4 md:mb-0">
                        <Trophy className="mr-3 text-blue-600" /> Weekend Challenges
                    </h2>

                    {/* Tabs */}
                    <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                        {['ALL', 'ACTIVE', 'UPCOMING', 'CLOSED'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {challenges.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 bg-gray-50 dark:bg-gray-900 rounded-lg">No challenges found for this weekend.</div>
                ) : filteredChallenges.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 bg-gray-50 dark:bg-gray-900 rounded-lg">No challenges found with status: {activeTab}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredChallenges.map((challenge) => (
                            <div
                                key={challenge._id}
                                onClick={() => navigate(`/challenge-details/${challenge._id}`)}
                                className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="h-40 bg-gray-200 flex items-center justify-center relative">
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
                                <div className="p-5">
                                    <div className="uppercase tracking-wide text-xs text-indigo-500 font-bold mb-1">{challenge.type}</div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{challenge.name}</h3>

                                    <div className="space-y-2 mt-3">
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                            <Calendar size={16} className="mr-2 text-gray-400" />
                                            {new Date(challenge.startAt).toLocaleDateString()}
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
        </div>
    );
};

export default WeekendDetails;
