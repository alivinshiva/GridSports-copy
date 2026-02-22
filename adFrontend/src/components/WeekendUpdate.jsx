import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWeekendById, updateWeekendStatus } from '../services/weekendService';

const WeekendUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeekend = async () => {
            try {
                const response = await getWeekendById(id);
                if (response.success) {
                    setStatus(response.data.status);
                } else {
                    setError("Failed to load weekend data");
                }
            } catch (err) {
                setError("Error loading data");
            } finally {
                setLoading(false);
            }
        };
        fetchWeekend();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateWeekendStatus(id, status);
            if (response.success) {
                navigate(`/weekend/details/${id}`);
            } else {
                setError(response.message || "Update failed");
            }
        } catch (err) {
            setError("Update failed");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Update Weekend Status</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="UPCOMING">Upcoming</option>
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>
                <div className="flex justify-between">
                    <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Update
                    </button>
                    <button type="button" onClick={() => navigate(`/weekend/details/${id}`)} className="text-gray-600">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WeekendUpdate;
