import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { getUserNotifications, markNotificationRead, deleteNotification } from "@/services/notificationService";
import { Bell, Trash2, ArrowRight, Trophy, Flag, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await getUserNotifications();
            if (response.success) {
                setNotifications(response.data);
            }
        } catch (error) {
            console.error("Error fetching notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = async (notif) => {
        // Optimistically remove from list
        setNotifications(prev => prev.filter(n => n._id !== notif._id));

        try {
            await markNotificationRead(notif._id);
        } catch (error) {
            console.error("Failed to mark as read/delete", error);
        }

        // Navigate depending on type optionally. For now, challenges go to details.
        if (notif.entityId && notif.type === 'CHALLENGE_LIVE') {
            navigate(`/challenge-details/${notif.entityId}`);
        } else if (notif.entityId && notif.type === 'WEEKEND_LIVE') {
            navigate(`/weekend/${notif.entityId}`);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // don't trigger the click link
        setNotifications(prev => prev.filter(n => n._id !== id));
        try {
            await deleteNotification(id);
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'CHALLENGE_LIVE':
                return <Trophy size={20} className="text-yellow-400" />;
            case 'WEEKEND_LIVE':
                return <Flag size={20} className="text-green-400" />;
            default:
                return <AlertCircle size={20} className="text-blue-400" />;
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="flex flex-col min-h-screen">
                <div className="max-w-3xl mx-auto w-full py-8 px-4 flex flex-col gap-6">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <div className="text-white">
                            <Bell size={24} />
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-widest uppercase" style={{ fontFamily: "'Sora-SemiBold', sans-serif" }}>
                            Notifications
                        </h1>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center gap-4 opacity-60">
                            <Bell size={48} className="text-gray-500" />
                            <p className="text-lg font-bold text-white tracking-wide">You're all caught up!</p>
                            <p className="text-sm text-gray-400">No new notifications right now.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {notifications.map((notif, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={notif._id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className="group relative bg-[#111118] p-5 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer flex gap-4 overflow-hidden"
                                >
                                    {/* Indicator line */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20 group-hover:bg-white/50 transition-colors"></div>

                                    <div className="flex items-center justify-center p-2 rounded-xl bg-white/5 mr-1 shrink-0 h-10 w-10 self-start mt-1">
                                        {getIconForType(notif.type)}
                                    </div>

                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-white text-base leading-tight tracking-wide">
                                                {notif.title}
                                            </h3>
                                            <span className="text-xs font-medium text-gray-500 whitespace-nowrap ml-4">
                                                {new Date(notif.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 leading-snug pr-8 mt-1">
                                            {notif.message}
                                        </p>

                                        {(notif.type === 'CHALLENGE_LIVE' || notif.type === 'WEEKEND_LIVE') && (
                                            <div className="flex items-center gap-1 text-white text-xs font-bold mt-3 uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                                                <span>View Details</span>
                                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={(e) => handleDelete(e, notif._id)}
                                        className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors self-center opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
