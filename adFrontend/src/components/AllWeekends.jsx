import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllWeekends } from '../services/weekendService';
import { Plus, MapPin, Calendar } from 'lucide-react';

const AllWeekends = () => {
    const [weekends, setWeekends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWeekends = async () => {
            try {
                const response = await getAllWeekends();
                if (response.success) {
                    setWeekends(response.data);
                } else {
                    setError("Failed to fetch weekends");
                }
            } catch (err) {
                setError("Error fetching weekend data");
            } finally {
                setLoading(false);
            }
        };

        fetchWeekends();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'UPCOMING': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'COMPLETED': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading Weekends...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
                    {/* <Calendar className="mr-3 text-blue-600" /> All Weekends */}
                </h1>
                <button
                    onClick={() => navigate('/add')}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors duration-200"
                >
                    <Plus size={20} className="mr-2" />
                    Create Weekend
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {weekends.map((weekend) => (
                    <div
                        key={weekend._id}
                        onClick={() => navigate(`/details/${weekend._id}`)}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                            {weekend.imageUrl ? (
                                <img src={weekend.imageUrl} alt={weekend.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">No Image</div>
                            )}
                            <div className="absolute top-4 right-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(weekend.status)}`}>
                                    {weekend.status}
                                </span>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 truncate">{weekend.title}</h3>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                <p className="flex items-center">
                                    <MapPin size={16} className="mr-2 text-gray-400" /> {weekend.location}
                                </p>
                                <p className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(weekend.startDate).toLocaleDateString()} - {new Date(weekend.endDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllWeekends;
