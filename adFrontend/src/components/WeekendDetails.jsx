import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWeekendById, deleteWeekend } from '../services/weekendService';

const WeekendDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [weekend, setWeekend] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await getWeekendById(id);
                if (response.success) {
                    setWeekend(response.data);
                } else {
                    setError(response.message || "Failed to fetch details");
                }
            } catch (err) {
                setError("An error occurred while fetching details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDetails();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this weekend?")) {
            try {
                const response = await deleteWeekend(id);
                if (response.success) {
                    navigate('/'); // Redirect to dashboard after delete
                } else {
                    alert("Failed to delete weekend: " + response.message);
                }
            } catch (err) {
                alert("An error occurred while deleting.");
            }
        }
    };

    if (loading) return <div className="text-center mt-10">Loading Details...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
    if (!weekend) return <div className="text-center mt-10">Weekend not found</div>;

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="md:flex">
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
                            onClick={() => navigate('/')}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeekendDetails;
