import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Search, Loader2, X } from 'lucide-react';
import { getAllComments, createComment, deleteComment } from '../services/commentService';

const Comments = () => {
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const response = await getAllComments();
            if (response.success) {
                setComments(response.data);
            } else {
                setError(response.message || 'Failed to fetch comments');
            }
        } catch (err) {
            setError('Error fetching comments');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateComment = async (e) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        setCreating(true);
        setError('');

        try {
            const response = await createComment(newCommentText.trim());
            if (response.success && response.data) {
                setComments([response.data, ...comments]);
                setNewCommentText('');
            } else {
                setError(response.message || 'Failed to create comment');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error creating comment');
        } finally {
            setCreating(false);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteComment = async (id) => {
        try {
            const response = await deleteComment(id);
            if (response.success) {
                setComments(comments.filter(c => c._id !== id));
            } else {
                setError(response.message || 'Failed to delete comment');
            }
        } catch (err) {
            setError('Error deleting comment');
        }
    };

    const filteredComments = comments.filter(c =>
        c.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <MessageSquare className="mr-3 text-emerald-600" size={32} />
                        Manage Pre-defined Comments
                    </h1>
                    <p className="text-gray-500 mt-2">Create standard comments for Detailed Scoring challenges.</p>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Comment Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Add New Comment</h2>
                        <form onSubmit={handleCreateComment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Comment Text</label>
                                <textarea
                                    value={newCommentText}
                                    onChange={(e) => setNewCommentText(e.target.value)}
                                    placeholder="e.g. Great lighting and execution!"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                                    rows={3}
                                    maxLength={150}
                                />
                                <div className="text-right text-xs text-gray-400 mt-1">
                                    {newCommentText.length}/150
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={creating || !newCommentText.trim()}
                                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {creating ? (
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                ) : (
                                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                                )}
                                Add Comment
                            </button>
                        </form>
                    </div>
                </div>

                {/* Comments List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">All Comments ({comments.length})</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search comments..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-64"
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="p-12 flex justify-center items-center">
                                <Loader2 className="animate-spin text-emerald-600 h-8 w-8" />
                            </div>
                        ) : filteredComments.length === 0 ? (
                            <div className="p-12 text-center">
                                <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                <h3 className="text-lg font-medium text-gray-900">No comments found</h3>
                                <p className="mt-1 text-gray-500">
                                    {searchTerm ? 'Try a different search.' : 'Get started by creating a new predefined comment.'}
                                </p>
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="space-y-3">
                                    {filteredComments.map((comment) => (
                                        <div
                                            key={comment._id}
                                            className="group flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm transition-all hover:shadow-md"
                                        >
                                            <span className="text-sm font-medium text-emerald-800 leading-relaxed pr-4">
                                                "{comment.text}"
                                            </span>
                                            <button
                                                onClick={() => handleDeleteComment(comment._id)}
                                                className="p-1.5 rounded-full text-red-500 bg-white shadow-sm hover:bg-red-50 hover:text-red-700 transition-colors flex-shrink-0"
                                                title="Delete Comment"
                                            >
                                                <X size={16} />
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

export default Comments;
