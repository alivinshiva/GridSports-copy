import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createChallenge } from '../services/challengeService';
import { getAllWeekends } from '../services/weekendService';
import { getAllTags } from '../services/tagService';
import { getAllComments } from '../services/commentService';
import { toast } from 'react-hot-toast';
import { Upload, Trophy, Plus, Trash2, X, Check, MessageSquare } from 'lucide-react';

const ChallengeForm = () => {
    const navigate = useNavigate();
    const [weekends, setWeekends] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [availableComments, setAvailableComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        weekend: '',
        season: '',
        name: '',
        description: '',
        startAt: '',
        endAt: '',
        round: '',
        type: 'PHOTO',
        status: 'UPCOMING',
        scoringType: 'SIMPLE',
    });
    const [rules, setRules] = useState([]);
    const [currentRule, setCurrentRule] = useState('');
    const [ruleError, setRuleError] = useState('');
    const [simpleParams, setSimpleParams] = useState(['', '', '']);
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');
    const [tagError, setTagError] = useState('');

    // Comments Management for Detailed Scoring
    const [selectedComments, setSelectedComments] = useState([]);

    const [parameters, setParameters] = useState([]);
    const [currentParamName, setCurrentParamName] = useState('');
    const [currentParamWeightage, setCurrentParamWeightage] = useState(10);
    const [paramError, setParamError] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [weekendRes, tagsRes, commentsRes] = await Promise.all([
                    getAllWeekends(),
                    getAllTags().catch(() => ({ success: false })), // fail gracefully
                    getAllComments().catch(() => ({ success: false }))
                ]);

                if (weekendRes.success) {
                    setWeekends(weekendRes.data);
                }
                if (tagsRes.success) {
                    setAvailableTags(tagsRes.data);
                }
                if (commentsRes.success) {
                    setAvailableComments(commentsRes.data);
                }
            } catch (error) {
                // Silently handle error
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        if (e.target.name === 'weekend') {
            const selectedWeekend = weekends.find(w => w._id === e.target.value);
            setFormData({
                ...formData,
                weekend: e.target.value,
                season: selectedWeekend ? selectedWeekend.season : ''
            });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreview(null);
    };

    // Rules Management
    const handleAddRule = () => {
        if (currentRule.trim() !== "") {
            setRules([...rules, currentRule.trim()]);
            setCurrentRule("");
            setRuleError("");
        } else {
            setRuleError("Rule cannot be empty");
            setTimeout(() => setRuleError(""), 3000);
        }
    };

    const handleRemoveRule = (index) => {
        setRules(rules.filter((_, i) => i !== index));
    };

    // Simple Parameters Management
    const handleSimpleParamChange = (index, value) => {
        const newParams = [...simpleParams];
        newParams[index] = value;
        setSimpleParams(newParams);
    };

    // Tags Management
    const handleToggleTag = (tagName) => {
        if (tags.includes(tagName)) {
            setTags(tags.filter(t => t !== tagName));
        } else {
            setTags([...tags, tagName]);
        }
    };

    // Pre-defined Comments Management
    const handleToggleComment = (commentText) => {
        if (selectedComments.includes(commentText)) {
            setSelectedComments(selectedComments.filter(c => c !== commentText));
        } else {
            setSelectedComments([...selectedComments, commentText]);
        }
    };

    // Parameters Management
    const handleAddParameter = () => {
        if (currentParamName.trim() !== "") {
            setParameters([...parameters, { name: currentParamName.trim(), maxPoints: parseInt(currentParamWeightage) }]);
            setCurrentParamName("");
            setCurrentParamWeightage(10);
            setParamError("");
        } else {
            setParamError("Parameter name cannot be empty");
            setTimeout(() => setParamError(""), 3000);
        }
    };

    const handleRemoveParameter = (index) => {
        setParameters(parameters.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        // Append Rules
        rules.forEach(rule => data.append('rules', rule));

        // Append Tags
        tags.forEach(tag => data.append('tags', tag));

        // Append Comments (Only if Detailed Scoring is selected)
        if (formData.scoringType === 'DETAILED') {
            selectedComments.forEach(comment => data.append('comments', comment));
        }

        // Append Parameters based on scoring type
        if (formData.scoringType === 'DETAILED') {
            const totalWeightage = parameters.reduce((sum, param) => sum + parseInt(param.maxPoints), 0);
            if (parameters.length > 0 && totalWeightage !== 100) {
                toast(`Warning: Parameter weightages sum to ${totalWeightage}%, but must equal exactly 100%`, {
                    duration: 3000,
                    icon: '⚠️',
                });
                setLoading(false);
                return;
            }
            data.append('parameters', JSON.stringify(parameters));
        } else if (formData.scoringType === 'SIMPLE') {
            // For simple, ensure exactly 3 are provided and not empty
            if (simpleParams.some(p => p.trim() === '')) {
                alert("Please provide all 3 simple parameters.");
                setLoading(false);
                return;
            }
            // Format them same way as detailed for consistency, but maybe fixed maxPoints isn't needed or is fixed.
            // Based on user request, point system doesn't change, they are just labels/emojis.
            // We'll save them as objects with name property to match existing expected structure if needed,
            // or just strings if the backend accepts it. The backend seems to accept JSON stringified array.
            const formattedSimpleParams = simpleParams.map(p => ({ name: p.trim(), maxPoints: 0 }));
            data.append('parameters', JSON.stringify(formattedSimpleParams));
        }

        if (image) {
            data.append('image', image);
        }

        try {
            const response = await createChallenge(data);
            if (response.success) {
                navigate('/challenges'); // Redirect to Challenges list
            } else {
                alert("Failed to create challenge: " + response.message);
            }
        } catch (error) {
            // Silently handle error
            alert(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <Trophy className="mr-2 text-yellow-600" /> Create New Challenge
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Image Upload */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Challenge Image</label>

                    {!preview ? (
                        <div
                            onClick={() => document.getElementById('fileInput').click()}
                            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors bg-gray-50"
                        >
                            <Upload className="w-10 h-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 font-medium">Click to upload image</p>
                            <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                            <input
                                id="fileInput"
                                type="file"
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                                required
                            />
                        </div>
                    ) : (
                        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg transform hover:scale-110"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Weekend Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Select Weekend</label>
                    <select
                        name="weekend"
                        value={formData.weekend}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                        required
                    >
                        <option value="">-- Select a Weekend --</option>
                        {weekends.map(w => (
                            <option key={w._id} value={w._id}>{w.title}</option>
                        ))}
                    </select>
                </div>

                {/* Season (Read-Only) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Season</label>
                    <input
                        type="text"
                        name="season"
                        value={formData.season}
                        readOnly
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm p-2 border text-gray-500 cursor-not-allowed"
                    />
                </div>

                {/* Name & Round */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Challenge Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Round No.</label>
                        <input type="number" name="round" value={formData.round} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" required />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" required></textarea>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
                        <input type="datetime-local" name="startAt" value={formData.startAt} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Date & Time</label>
                        <input type="datetime-local" name="endAt" value={formData.endAt} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" required />
                    </div>
                </div>

                {/* Type & Status & Scoring */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border">
                            <option value="PHOTO">PHOTO</option>
                            <option value="VIDEO">VIDEO</option>
                            <option value="TEXT">TEXT</option>
                            <option value="MIXED">MIXED</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border">
                            <option value="UPCOMING">UPCOMING</option>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="CLOSED">CLOSED</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Scoring Algorithm</label>
                        <select name="scoringType" value={formData.scoringType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border">
                            <option value="SIMPLE">SIMPLE (Love/Like/Share)</option>
                            <option value="DETAILED">DETAILED (AI Rating & Params)</option>
                        </select>
                    </div>
                </div>

                {/* Dynamic Rules Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rules</label>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={currentRule}
                            onChange={(e) => setCurrentRule(e.target.value)}
                            placeholder="Add a new rule..."
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddRule();
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleAddRule}
                            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    {ruleError && <p className="text-red-500 text-sm mb-2">{ruleError}</p>}

                    {rules.length > 0 && (
                        <ul className="space-y-2 bg-gray-50 p-4 rounded-md border border-gray-200">
                            {rules.map((rule, index) => (
                                <li key={index} className="flex items-center justify-between text-gray-700 text-sm bg-white p-2 rounded border border-gray-100 shadow-sm">
                                    <span className="flex items-start">
                                        <span className="font-bold mr-2 text-blue-500">{index + 1}.</span>
                                        {rule}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveRule(index)}
                                        className="text-red-500 hover:text-red-700 ml-2"
                                        title="Remove Rule"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Selectable Tags */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Tags</label>
                    <p className="text-xs text-gray-500 mb-3">Choose tags to categorize this challenge. You can create new tags in the Manage Tags page.</p>

                    {availableTags.length === 0 ? (
                        <div className="text-sm text-gray-500 italic p-3 bg-gray-50 border border-gray-200 rounded">
                            No tags available. Go to "Manage Tags" to create some first.
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {availableTags.map((tag) => {
                                const isSelected = tags.includes(tag.name);
                                return (
                                    <button
                                        key={tag._id}
                                        type="button"
                                        onClick={() => handleToggleTag(tag.name)}
                                        className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${isSelected
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {isSelected && <Check size={14} className="mr-1.5" />}
                                        {tag.name}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Simple Parameters Input (Visible only if SIMPLE scoring) */}
                {formData.scoringType === 'SIMPLE' && (
                    <div className="border-t border-gray-200 pt-6 mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Simple Reaction Parameters</label>
                        <p className="text-xs text-gray-500 mb-4">Define exactly 3 reactions (text or emojis) users can choose from. They all award the same fixed points.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[0, 1, 2].map((index) => (
                                <div key={index}>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Reaction {index + 1}</label>
                                    <input
                                        type="text"
                                        value={simpleParams[index]}
                                        onChange={(e) => handleSimpleParamChange(index, e.target.value)}
                                        placeholder={["e.g. 🔥 Fire", "e.g. 🧊 Ice", "e.g. ⚡ Zap"][index]}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                        required
                                        maxLength={15}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Dynamic Parameters Input (Visible only if DETAILED scoring) */}
                {formData.scoringType === 'DETAILED' && (
                    <div className="border-t border-gray-200 pt-6 mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Scoring Parameters</label>
                        <p className="text-xs text-gray-500 mb-3">Add criteria for the AI to grade the user on, along with a weightage (1-100%). The total weightage must equal exactly 100%.</p>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={currentParamName}
                                onChange={(e) => setCurrentParamName(e.target.value)}
                                placeholder="Parameter (e.g., Audio Quality)"
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddParameter();
                                    }
                                }}
                            />
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={currentParamWeightage}
                                onChange={(e) => setCurrentParamWeightage(e.target.value)}
                                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                placeholder="%"
                            />
                            <button
                                type="button"
                                onClick={handleAddParameter}
                                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        {paramError && <p className="text-red-500 text-sm mb-2">{paramError}</p>}

                        {parameters.length > 0 && (
                            <ul className="space-y-2 bg-gray-50 p-4 rounded-md border border-gray-200">
                                {parameters.map((param, index) => (
                                    <li key={index} className="flex items-center justify-between text-gray-700 text-sm bg-white p-2 rounded border border-gray-100 shadow-sm">
                                        <div className="flex items-center w-full pr-4">
                                            <span className="font-bold mr-2 text-blue-500">{index + 1}.</span>
                                            <span className="flex-1">{param.name}</span>
                                            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Weightage: {param.maxPoints}%</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveParameter(index)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Remove Parameter"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Pre-defined Comments Selection */}
                        <div className="mt-8 border-t border-gray-100 pt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pre-defined Comments / Quick Feedback</label>
                            <p className="text-xs text-gray-500 mb-4">Select comments that voters can quickly tap to leave detailed feedback on a submission.</p>

                            {availableComments.length === 0 ? (
                                <div className="text-sm text-gray-500 italic p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-center">
                                    No pre-defined comments available. Create some in the Comments Management page.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {availableComments.map((comment) => {
                                        const isSelected = selectedComments.includes(comment.text);
                                        return (
                                            <div
                                                key={comment._id}
                                                onClick={() => handleToggleComment(comment.text)}
                                                className={`cursor-pointer p-3 rounded-lg border text-sm flex items-start transition-all ${isSelected
                                                    ? 'bg-emerald-50 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                                                    : 'bg-white border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center mr-3 ${isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300'}`}>
                                                    {isSelected && <Check size={12} strokeWidth={3} />}
                                                </div>
                                                <span className={`${isSelected ? 'text-emerald-900 font-medium' : 'text-gray-700'}`}>{comment.text}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-4 border-t border-gray-200 mt-6">
                    <button type="button" onClick={() => navigate('/')} className="mr-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded">Cancel</button>
                    <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow-lg transform active:scale-95 transition-transform">
                        {loading ? 'Creating...' : 'Create Challenge'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChallengeForm;
