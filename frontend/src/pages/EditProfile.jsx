import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { ArrowLeft, Camera, Lock, Save, LayoutGrid } from "lucide-react";

export default function EditProfile() {
    const navigate = useNavigate();
    const [name, setName] = useState("Racing User");
    const [avatar, setAvatar] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuARfjDdlsL5nnhugURpNI_ONjt8HvlFRzHIjof85Au2Jm5CYSFu5JCyPTCnaNrJr4qYtkfEbaSxPGnIbX4QG6dZnzB9rkyAACcs1ePO5A6Ea4f6fx6HpF5GBCzDIpULkSXmLZd4fFCsA2DiVSWZg9ndMbKhTUiIkIkh_HH4OYT7Q9Em5JNjZ91LE9HDknQe70cTDHZgb4SiuoStAcFNnE-KlBeYnNLUXTIuL0h4DY-pI9pNcZHRs_IgZ2zPywZ9KnjhG-wjK74sijs");

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        // Here you would typically save to backend
        console.log("Saving profile...", { name, avatar });
        navigate("/profile");
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
                            <div className="relative group cursor-pointer">
                                <div
                                    className="size-32 rounded-full bg-cover bg-center border-4 border-primary shadow-xl"
                                    style={{ backgroundImage: `url("${avatar}")` }}
                                ></div>
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera className="text-white" size={32} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                </label>
                                <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg pointer-events-none">
                                    <Camera size={16} />
                                </div>
                            </div>
                            <p className="text-[#9c7349] dark:text-[#c4a17d] text-sm font-medium">Tap to change profile photo</p>
                        </div>

                        {/* Name Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#1c140d] dark:text-white text-sm font-bold">Display Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-[#f4ede7] dark:bg-white/10 border-transparent focus:border-primary focus:ring-0 text-[#1c140d] dark:text-white font-medium transition-all"
                                placeholder="Enter your display name"
                            />
                        </div>

                        {/* Locked Tribe Section */}
                        <div className="flex flex-col gap-2 opacity-80">
                            <label className="text-[#1c140d] dark:text-white text-sm font-bold flex items-center justify-between">
                                <span>Tribe</span>
                                <span className="flex items-center gap-1 text-xs font-normal text-[#9c7349] dark:text-[#c4a17d]">
                                    <Lock size={12} />
                                    Locked for 284 days
                                </span>
                            </label>
                            <div className="w-full px-4 py-3 rounded-xl bg-[#f4ede7]/50 dark:bg-white/5 border border-dashed border-[#9c7349]/30 dark:border-white/20 flex items-center justify-between cursor-not-allowed">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                        <LayoutGrid size={18} />
                                    </div>
                                    <span className="text-[#1c140d] dark:text-white font-bold">Red Grid</span>
                                </div>
                                <span className="sr-only">Locked</span>
                            </div>
                            <p className="text-xs text-[#9c7349] dark:text-[#c4a17d] px-1">
                                You can switch tribes once per season (every 365 days).
                            </p>
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
                            className="flex-1 py-3.5 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
