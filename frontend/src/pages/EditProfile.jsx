import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo1.svg";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Lock, Save, LayoutGrid, Loader2, Trash2, LogOut } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function EditProfile() {
    const { user, fetchProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name || "");
    const [avatar, setAvatar] = useState(user?.profile?.imageUrl || null);
    const [tribe, setTribe] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Update state when user data loads/changes
    useEffect(() => {
        if (user) {
            setName(user.name);
            // Fetch profile details if not already available in user object or recent fetch
            fetchProfile().then(data => {
                if (data) {
                    if (data.imageUrl) setAvatar(data.imageUrl);
                    if (data.tribe) setTribe(data.tribe);
                }
            });
        }
    }, [user, fetchProfile]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!selectedFile) {
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            const response = await fetch(`${import.meta.env.VITE_MAIN_API_URL}/api/v1/profile/upload-image`, {
                method: "PUT",
                body: formData,
                credentials: "include", // Important for cookies
            });

            const data = await response.json();

            if (data.success) {
                await fetchProfile(); // Refresh profile context
                navigate("/profile");
            } else {
                alert(data.message || "Failed to upload image");
            }
        } catch (error) {
            // Silently handle error
            alert("An error occurred while uploading. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteImage = async () => {
        if (!window.confirm("Are you sure you want to delete your profile image?")) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_MAIN_API_URL}/api/v1/profile/delete-image`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await response.json();
            if (data.success) {
                // Reset to default or update from backend
                await fetchProfile();
                setAvatar(null); // Fallback
                setSelectedFile(null); // Clear any selected file
            } else {
                alert(data.message || "Failed to delete image");
            }
        } catch (error) {
            // Silently handle error
            alert("Error deleting image.");
        }
    };

    return (
        <AuthenticatedLayout>
            <Helmet>
                <title>Edit Profile | SHOWGRID</title>
                <meta name="description" content="Edit your SHOWGRID profile settings." />
            </Helmet>
            <div className="flex flex-col min-h-screen items-center py-6 md:py-10">
                <div className="flex flex-col max-w-[600px] w-full px-4 sm:px-6">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6 md:mb-8">
                        <button
                            onClick={() => navigate("/profile")}
                            className="p-2 rounded-xl bg-[#111118] hover:bg-white/10 transition-colors border border-white/5"
                        >
                            <ArrowLeft size={24} className="text-white" />
                        </button>
                        <h1 className="text-white text-2xl md:text-3xl font-black tracking-widest uppercase" style={{ fontFamily: "'Sora-SemiBold', sans-serif" }}>
                            Edit Profile
                        </h1>
                    </div>

                    <div className="bg-[#111118] rounded-2xl p-6 md:p-8 border border-white/5 shadow-2xl flex flex-col gap-8">

                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group">
                                <label className="cursor-pointer block relative rounded-full p-[3px] bg-gradient-to-r from-[#70b1ff] to-[#59d5e0] shadow-[0_0_16px_rgba(112,177,255,0.4)] hover:opacity-90 transition-opacity">
                                    <div
                                        className="size-32 rounded-full bg-cover bg-center bg-[#181920]"
                                        style={{ backgroundImage: avatar ? `url("${avatar}")` : "none" }}
                                    >
                                        {!avatar && <div className="h-full w-full flex items-center justify-center text-white/40 text-sm font-medium">Upload Image</div>}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                </label>
                                <button
                                    onClick={handleDeleteImage}
                                    className="absolute bottom-0 right-0 bg-red-600 text-white p-2.5 rounded-full shadow-lg hover:bg-red-500 transition-colors z-10 border-2 border-[#111118]"
                                    title="Delete Profile Image"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <p className="text-gray-400 text-sm font-medium tracking-wide">Tap image to change</p>
                        </div>

                        {/* Name Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-300 text-sm font-bold tracking-wider uppercase ml-1">Display Name</label>
                            <input
                                type="text"
                                value={name}
                                readOnly
                                className="w-full px-5 py-4 rounded-xl bg-[#0B0B0F] border border-white/10 text-white font-medium cursor-not-allowed select-none focus:outline-none"
                            />
                        </div>

                        {/* Locked Tribe Section */}
                        <div className="flex flex-col gap-2 opacity-80">
                            <label className="text-gray-300 text-sm font-bold flex items-center justify-between tracking-wider uppercase ml-1">
                                <span>Tribe</span>
                            </label>
                            <div className="w-full px-5 py-4 rounded-xl bg-[#0B0B0F]/50 border border-dashed border-white/20 flex items-center justify-between cursor-not-allowed">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                                        <LayoutGrid size={18} />
                                    </div>
                                    <span className="text-white font-bold tracking-wide">{tribe || "Loading..."}</span>
                                </div>
                                <span className="sr-only">Locked</span>
                            </div>
                        </div>

                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate("/profile")}
                            className="flex-1 py-4 rounded-xl font-bold text-gray-400 bg-[#111118] border border-white/10 hover:bg-white/5 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className={`flex-1 py-4 rounded-xl font-bold text-[#101117] shadow-lg transition-all flex items-center justify-center gap-2 ${!selectedFile || isUploading
                                ? "cursor-not-allowed opacity-50"
                                : "hover:opacity-90"
                                }`}
                            style={{
                                background: "linear-gradient(to right, #70b1ff, #59d5e0)",
                                boxShadow: "0 0 16px rgba(112, 177, 255, 0.4)"
                            }}
                            disabled={!selectedFile || isUploading}
                        >
                            {isUploading ? (
                                <Loader2 size={18} className="animate-spin text-[#101117]" />
                            ) : !selectedFile ? (
                                <Lock size={18} className="text-[#101117]" />
                            ) : (
                                <Save size={18} className="text-[#101117]" />
                            )}
                            <span className="text-[#101117]">{isUploading ? "Uploading..." : "Save Changes"}</span>
                        </button>
                    </div>

                    {/* Logout Button */}
                    <div className="mt-10 pt-8 border-t border-white/10 flex justify-center">
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 text-white hover:text-white/60 font-medium tracking-widest text-sm transition-colors py-2 px-4 rounded-lg hover:bg-white/5"
                        >
                            <LogOut size={16} />
                            LOG OUT
                        </button>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
