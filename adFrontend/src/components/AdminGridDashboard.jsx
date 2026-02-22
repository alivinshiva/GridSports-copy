import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllWeekends } from '../services/weekendService';
import { getAllChallenges } from '../services/challengeService';
import { getAllSubmissions } from '../services/submissionService';
import { Plus, Calendar, Trophy, FileText, User, MapPin } from 'lucide-react';

const AdminGridDashboard = () => {
    const [weekends, setWeekends] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all data in parallel
                const [weekendRes, challengeRes, submissionRes] = await Promise.all([
                    getAllWeekends(),
                    getAllChallenges(),
                    getAllSubmissions()
                ]);

                if (weekendRes.success) setWeekends(weekendRes.data);
                if (challengeRes.success) setChallenges(challengeRes.data);
                if (submissionRes.success) setSubmissions(submissionRes.data);

            } catch (err) {
                console.error("Dashboard fetch error:", err);
                // Even if one fails, we might want to show partial data, 
                // but for now let's set a generic error if everything fails or major network issue
                if (!weekends.length && !challenges.length) {
                    setError("Failed to fetch dashboard data. Ensure backend is running.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'UPCOMING': return 'bg-blue-100 text-blue-800';
            case 'ACTIVE': return 'bg-green-100 text-green-800';
            case 'COMPLETED': return 'bg-gray-100 text-gray-800';
            case 'CLOSED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-12">

            {/* Weekends Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Calendar className="mr-2 text-blue-600" /> Weekends
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Create Weekend Card */}
                    <div
                        onClick={() => navigate('/add')}
                        className="bg-white rounded-xl shadow-md border-2 border-dashed border-blue-300 flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-blue-50 transition-colors duration-200 h-full min-h-[200px]"
                    >
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Plus size={32} className="text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-700">Create New Weekend</h3>
                        <p className="text-sm text-gray-500 mt-1">Add a new race weekend</p>
                    </div>

                    {/* Weekend Cards */}
                    {weekends.map((weekend) => (
                        <div
                            key={weekend._id}
                            onClick={() => navigate(`/weekend/details/${weekend._id}`)}
                            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="h-40 bg-gray-200 relative">
                                {weekend.imageUrl ? (
                                    <img src={weekend.imageUrl} alt={weekend.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(weekend.status)}`}>
                                        {weekend.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{weekend.title}</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <MapPin size={16} className="mr-2 text-gray-400" />
                                        {weekend.location}
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar size={16} className="mr-2 text-gray-400" />
                                        {new Date(weekend.startDate).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Challenges Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Trophy className="mr-2 text-yellow-600" /> Challenges
                    </h2>
                </div>
                {challenges.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500 border border-gray-100">
                        No challenges found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {challenges.map((challenge) => (
                            <div key={challenge._id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <Trophy size={20} className="text-yellow-600" />
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(challenge.status)}`}>
                                        {challenge.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{challenge.name}</h3>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{challenge.description}</p>
                                <div className="text-xs text-gray-400 font-mono">
                                    Type: {challenge.type}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Submissions Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <FileText className="mr-2 text-indigo-600" /> Submissions
                    </h2>
                </div>
                {submissions.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500 border border-gray-100">
                        No submissions found.
                    </div>
                ) : (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Challenge</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {submissions.map((sub) => (
                                    <tr key={sub._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap flex items-center">
                                            <User size={16} className="mr-2 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-900">
                                                {sub.user?.name || 'Unknown User'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {sub.challenge?.name || 'Unknown Challenge'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(sub.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

        </div>
    );
};

export default AdminGridDashboard;
