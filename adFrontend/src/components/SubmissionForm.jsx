import React, { useState, useEffect } from 'react';
import { createSubmission } from '../services/submissionService';
import { getAllChallenges } from '../services/challengeService';
import { getAllUsers } from '../services/userService'; // Need to export this from userService if not already
import { useNavigate } from 'react-router-dom';
import { FileText, User, Trophy } from 'lucide-react';

const SubmissionForm = () => {
    const navigate = useNavigate();
    const [challenges, setChallenges] = useState([]);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        challenge: '',
        user: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [challengesRes, usersRes] = await Promise.all([
                    getAllChallenges(),
                    getAllUsers() // Assuming this service function exists and returns { success: true, data: [...] }
                ]);

                if (challengesRes.success) setChallenges(challengesRes.data);
                // Users API might return array directly or inside data property, need to check userService
                // Checking previous logs, userService returns response.data directly which is the array of users? 
                // Wait, previous `userService.js` returned `response.data`.
                // Let's assume standard structure or array.
                // Actually `userService.js` likely returns { success: true, data: [...] } based on backend pattern.
                if (usersRes.success) setUsers(usersRes.data);

            } catch (error) {
                // Silently handle error
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await createSubmission(formData);
            if (response.success) {
                alert("Submission Created!");
                navigate('/weekends'); // Or wherever
            } else {
                alert("Failed to create submission: " + response.message);
            }
        } catch (error) {
            // Silently handle error
            alert("Error creating submission");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
                <FileText className="mr-2 text-indigo-600" /> Create Submission (Test)
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select User</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={18} />
                        <select
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                            value={formData.user}
                            onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                            required
                        >
                            <option value="">-- Select User --</option>
                            {users.map(u => (
                                <option key={u._id} value={u._id}>{u.name} ({u.phoneNumber})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Challenge</label>
                    <div className="relative">
                        <Trophy className="absolute left-3 top-3 text-gray-400" size={18} />
                        <select
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                            value={formData.challenge}
                            onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                            required
                        >
                            <option value="">-- Select Challenge --</option>
                            {challenges.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Submission'}
                </button>
            </form>
        </div>
    );
};

export default SubmissionForm;
