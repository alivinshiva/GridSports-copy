import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Search, Loader2, X } from 'lucide-react';
import { getAllTags, createTag, deleteTag } from '../services/tagService';

const Tags = () => {
    const [tags, setTags] = useState([]);
    const [newTagName, setNewTagName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        setLoading(true);
        try {
            const response = await getAllTags();
            if (response.success) {
                setTags(response.data);
            } else {
                setError(response.message || 'Failed to fetch tags');
            }
        } catch (err) {
            setError('Error fetching tags');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTag = async (e) => {
        e.preventDefault();
        if (!newTagName.trim()) return;

        setCreating(true);
        setError('');

        try {
            const response = await createTag({ name: newTagName.trim() });
            if (response.success && response.data) {
                setTags([response.data, ...tags]);
                setNewTagName('');
            } else {
                setError(response.message || 'Failed to create tag');
            }
        } catch (err) {
            setError(err.message || 'Error creating tag');
        } finally {
            setCreating(false);
            // Hide error after a few seconds
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteTag = async (id, name) => {

        try {
            const response = await deleteTag(id);
            if (response.success) {
                setTags(tags.filter(tag => tag._id !== id));
            } else {
                setError(response.message || 'Failed to delete tag');
            }
        } catch (err) {
            setError('Error deleting tag');
        }
    };

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <Tag className="mr-3 text-indigo-600" size={32} />
                        Manage Tags
                    </h1>
                    <p className="text-gray-500 mt-2">Create and manage tags for challenges.</p>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Tag Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Add New Tag</h2>
                        <form onSubmit={handleCreateTag} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tag Name</label>
                                <input
                                    type="text"
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    placeholder="e.g. Action, Speed, Creativity"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    maxLength={30}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={creating || !newTagName.trim()}
                                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {creating ? (
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                ) : (
                                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                                )}
                                Create Tag
                            </button>
                        </form>
                    </div>
                </div>

                {/* Tags List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">All Tags ({tags.length})</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search tags..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="p-12 flex justify-center items-center">
                                <Loader2 className="animate-spin text-indigo-600 h-8 w-8" />
                            </div>
                        ) : filteredTags.length === 0 ? (
                            <div className="p-12 text-center">
                                <Tag className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                <h3 className="text-lg font-medium text-gray-900">No tags found</h3>
                                <p className="mt-1 text-gray-500">
                                    {searchTerm ? 'Try a different search term.' : 'Get started by creating a new tag.'}
                                </p>
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="flex flex-wrap gap-3">
                                    {filteredTags.map((tag) => (
                                        <div
                                            key={tag._id}
                                            className="group flex items-center pl-3 pr-1 py-1.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 shadow-sm transition-all hover:shadow-md"
                                        >
                                            <span className="text-sm font-medium mr-2">{tag.name}</span>
                                            <button
                                                onClick={() => handleDeleteTag(tag._id, tag.name)}
                                                className="p-1 rounded-full text-red-500 bg-white shadow-sm hover:bg-red-50 hover:text-red-700 transition-colors"
                                                title="Delete Tag"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tags;
