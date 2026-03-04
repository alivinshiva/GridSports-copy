import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { getUserNotifications, markNotificationRead, deleteNotification } from "@/services/notificationService";
import { Bell, Trash2, ArrowRight, Trophy, Flag, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

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
            // Silently handle error
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
            // Silently handle error
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
            // Silently handle error
        }
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'CHALLENGE_LIVE':
                return <Trophy size={20} style={{ color: '#2ED1B8' }} />;
            case 'WEEKEND_LIVE':
                return <Flag size={20} style={{ color: '#2ED1B8' }} />;
            default:
                return <AlertCircle size={20} style={{ color: '#2ED1B8' }} />;
        }
    };

    return (
        <AuthenticatedLayout>
            <Helmet>
                <title>Notifications | SHOWGRID</title>
                <meta name="description" content="View your SHOWGRID alerts and updates." />
            </Helmet>
            <div className="flex flex-col min-h-screen">
                <div className="max-w-3xl mx-auto w-full py-4 md:py-8 px-3 sm:px-4 flex flex-col gap-4 md:gap-6">
                    <div className="flex items-center gap-2 md:gap-3 border-b border-white/10 pb-3 md:pb-4">
                        <div style={{ color: '#3b82f6' }}>
                            <Bell className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <h1 className="text-xl md:text-2xl font-black tracking-widest uppercase" style={{ fontFamily: "'Sora-SemiBold', sans-serif", color: '#3b82f6' }}>
                            Notifications
                        </h1>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-10 md:py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#2ED1B8' }}></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 md:py-20 text-center gap-3 md:gap-4 opacity-60">
                            <Bell className="w-10 h-10 md:w-12 md:h-12" style={{ color: '#2ED1B8' }} />
                            <p className="text-base md:text-lg font-bold text-white tracking-wide">You're all caught up!</p>
                            <p className="text-xs md:text-sm" style={{ color: '#2ED1B8' }}>No new notifications right now.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2.5 md:gap-3">
                            {notifications.map((notif, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={notif._id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className="group relative bg-[#111118] p-3.5 sm:p-5 rounded-2xl border transition-all cursor-pointer flex gap-3 sm:gap-4 overflow-hidden hover:bg-white/5" style={{ borderColor: '#2ED1B840' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#2ED1B8'} onMouseLeave={e => e.currentTarget.style.borderColor = '#2ED1B840'}
                                >
                                    {/* Indicator line */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 transition-colors" style={{ backgroundColor: '#2ED1B820' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2ED1B8'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2ED1B820'}></div>

                                    <div className="flex items-center justify-center p-1.5 md:p-2 rounded-xl mr-0 shrink-0 h-8 w-8 md:h-10 md:w-10 self-start mt-0.5 md:mt-1" style={{ backgroundColor: '#2ED1B815' }}>
                                        <div className="scale-75 md:scale-100 flex items-center justify-center">
                                            {getIconForType(notif.type)}
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-center min-w-0 pr-1 md:pr-0">
                                        <div className="flex justify-between items-start mb-0.5 md:mb-1 gap-2">
                                            <h3 className="font-bold text-white text-[14px] sm:text-base leading-tight tracking-wide truncate">
                                                {notif.title}
                                            </h3>
                                            <span className="text-[10px] sm:text-xs font-medium whitespace-nowrap ml-2 md:ml-4 shrink-0 mt-0.5 text-white">
                                                {new Date(notif.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className="text-[12px] sm:text-sm leading-snug md:pr-8 mt-0.5 md:mt-1 line-clamp-2 md:line-clamp-none text-white">
                                            {notif.message}
                                        </p>

                                        {(notif.type === 'CHALLENGE_LIVE' || notif.type === 'WEEKEND_LIVE') && (
                                            <div className="flex items-center gap-1 text-white text-[10px] sm:text-xs font-bold mt-2 md:mt-3 uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                                                <span>View Details</span>
                                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform w-3 h-3 md:w-3.5 md:h-3.5" />
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={(e) => handleDelete(e, notif._id)}
                                        className="h-8 w-8 md:h-10 md:w-10 shrink-0 flex items-center justify-center rounded-xl bg-white/5 hover:text-red-400 hover:bg-red-500/10 transition-colors self-center opacity-100 md:opacity-0 md:group-hover:opacity-100" style={{ color: '#2ED1B8' }}
                                    >
                                        <Trash2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
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
