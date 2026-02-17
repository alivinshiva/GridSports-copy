import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Lock, Save, LayoutGrid, Loader2, Trash2, LogOut } from "lucide-react";

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
            // No new file selected, just navigate back (or show message)
            navigate("/profile");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            const response = await fetch("http://localhost:7000/api/v1/profile/upload-image", {
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
            console.error("Upload error:", error);
            alert("An error occurred while uploading. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteImage = async () => {
        if (!window.confirm("Are you sure you want to delete your profile image?")) return;

        try {
            const response = await fetch("http://localhost:7000/api/v1/profile/delete-image", {
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
            console.error("Delete error:", error);
            alert("Error deleting image.");
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="flex flex-1 justify-center py-8">
                <div className="layout-content-container flex flex-col max-w-[600px] flex-1 px-4 w-full">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => navigate("/profile")}
                            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft size={24} className="text-[#1c140d] dark:text-white" />
                        </button>
                        <h1 className="text-[#1c140d] dark:text-white text-2xl font-bold tracking-tight">Edit Profile</h1>
                    </div>

                    <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-[#e8dbce] dark:border-white/10 shadow-sm flex flex-col gap-8">

                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group">
                                <label className="cursor-pointer block relative">
                                    <div
                                        className="size-32 rounded-full bg-cover bg-center border-4 border-primary shadow-xl hover:opacity-90 transition-opacity bg-gray-200 dark:bg-gray-800"
                                        style={{ backgroundImage: avatar ? `url("${avatar}")` : "none" }}
                                    >
                                        {!avatar && <div className="h-full w-full flex items-center justify-center text-gray-400">No Image</div>}
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
                                    className="absolute bottom-0 right-0 bg-red-500 text-white p-2.5 rounded-full shadow-lg hover:bg-red-600 transition-colors z-10"
                                    title="Delete Profile Image"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <p className="text-[#9c7349] dark:text-[#c4a17d] text-sm font-medium">Tap image to change</p>
                        </div>

                        {/* Name Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#1c140d] dark:text-white text-sm font-bold">Display Name</label>
                            <input
                                type="text"
                                value={name}
                                readOnly
                                className="w-full px-4 py-3 rounded-xl bg-[#f4ede7]/50 dark:bg-white/5 border border-transparent text-[#1c140d]/70 dark:text-white/70 font-medium cursor-not-allowed select-none focus:outline-none"
                            />
                        </div>

                        {/* Locked Tribe Section */}
                        <div className="flex flex-col gap-2 opacity-80">
                            <label className="text-[#1c140d] dark:text-white text-sm font-bold flex items-center justify-between">
                                <span>Tribe</span>
                            </label>
                            <div className="w-full px-4 py-3 rounded-xl bg-[#f4ede7]/50 dark:bg-white/5 border border-dashed border-[#9c7349]/30 dark:border-white/20 flex items-center justify-between cursor-not-allowed">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                        <LayoutGrid size={18} />
                                    </div>
                                    <span className="text-[#1c140d] dark:text-white font-bold">{tribe || "Loading..."}</span>
                                </div>
                                <span className="sr-only">Locked</span>
                            </div>
                        </div>

                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={() => navigate("/profile")}
                            className="flex-1 py-3.5 rounded-xl font-bold text-[#9c7349] dark:text-[#c4a17d] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 py-3.5 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={isUploading}
                        >
                            {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {isUploading ? "Uploading..." : "Save Changes"}
                        </button>
                    </div>

                    {/* Logout Button */}
                    <div className="mt-8 pt-8 border-t border-[#e8dbce] dark:border-white/10 flex justify-center">
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 text-red-500 hover:text-red-600 font-bold transition-colors"
                        >
                            <LogOut size={18} />
                            Log Out
                        </button>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
