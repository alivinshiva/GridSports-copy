import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllHeroes, deleteHero } from '../services/heroService';
import { Plus, MapPin, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

const AllHeroes = () => {
    const [heroes, setHeroes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHeroes = async () => {
            try {
                const response = await getAllHeroes();
                if (response.success) {
                    setHeroes(response.data);
                } else {
                    setError("Failed to fetch heroes");
                }
            } catch (err) {
                setError("Error fetching hero data");
            } finally {
                setLoading(false);
            }
        };

        fetchHeroes();
    }, []);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this hero?")) return;

        try {
            await deleteHero(id);
            setHeroes(prev => prev.filter(h => h._id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete hero.");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Heroes...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    All Heroes
                </h1>
                <button
                    onClick={() => navigate('/add-hero')}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors duration-200"
                >
                    <Plus size={20} className="mr-2" />
                    Create Hero
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {heroes.map((hero) => (
                    <div
                        key={hero._id}
                        onClick={() => navigate(`/update-hero`, { state: { hero } })}
                        className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 group"
                    >
                        <div className="h-48 bg-gray-200 relative overflow-hidden">
                            {hero.imageUrl ? (
                                <img src={hero.imageUrl} alt={hero.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/update-hero`, { state: { hero } });
                                    }}
                                    className="p-2 bg-white/80 hover:bg-white text-gray-700 rounded-full shadow transition-colors backdrop-blur-sm"
                                    title="Edit Hero"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, hero._id)}
                                    className="p-2 bg-white/80 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-full shadow transition-colors backdrop-blur-sm"
                                    title="Delete Hero"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{hero.name}</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p className="flex items-center">
                                    <MapPin size={16} className="mr-2 text-gray-400" /> {hero.location}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {heroes.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 rounded-3xl">
                        <ImageIcon size={48} className="mb-4 opacity-50" />
                        <p className="text-xl font-bold text-gray-400">No heroes found</p>
                        <p>Create one to display it on the main app.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllHeroes;
