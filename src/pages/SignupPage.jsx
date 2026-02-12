import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Phone, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function SignupPage() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { signup } = useAuth();
    const redirectTo = location.state?.from || "/";

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!name.trim()) return setError("Name is required");
        if (phone.length < 10) return setError("Enter a valid phone number");
        if (password.length < 6) return setError("Password must be at least 6 characters");

        const result = signup(name, phone, password);
        if (result.success) {
            navigate("/otp", { state: { phone: result.phone, name, from: "signup", redirectTo } });
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-racing-black flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-racing-orange/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo / Title */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                        Grid<span className="text-racing-orange">Sports</span>
                    </h1>
                    <p className="text-gray-400">Create your racing account</p>
                </div>

                {/* Form Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="text-sm font-medium text-gray-300 block mb-2">Full Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-racing-orange/50 focus:border-racing-orange/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="text-sm font-medium text-gray-300 block mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                    placeholder="9876543210"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-racing-orange/50 focus:border-racing-orange/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-sm font-medium text-gray-300 block mb-2">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min 6 characters"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-racing-orange/50 focus:border-racing-orange/50 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">
                                {error}
                            </motion.p>
                        )}

                        {/* Submit */}
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            className="w-full bg-racing-orange text-white py-4 rounded-xl font-bold text-base hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-racing-orange/20"
                        >
                            Create Account <ArrowRight size={18} />
                        </motion.button>
                    </form>

                    {/* Link to Login */}
                    <p className="text-center text-gray-400 text-sm mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-racing-orange font-semibold hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>

                {/* Demo Hint */}
                <p className="text-center text-gray-600 text-xs mt-6">
                    Demo OTP: <span className="text-gray-400 font-mono font-bold">0000</span>
                </p>
            </motion.div>
        </div>
    );
}
