import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Lock, ArrowRight, ArrowLeft, KeyRound, CheckCircle2, Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.svg";

export function ForgotPasswordPage() {
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP & New Password, 3: Success
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (phone.length < 10) {
            setIsLoading(false);
            return setError("Enter a valid phone number");
        }

        try {
            const response = await fetch("http://localhost:7001/api/v1/user/forgot-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber: `+91${phone}` }),
            });

            const data = await response.json();

            if (data.success) {
                setStep(2);
            } else {
                setError(data.message || "Failed to send OTP");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!otp || !newPassword) {
            setIsLoading(false);
            return setError("Please fill in all fields");
        }

        try {
            const response = await fetch("http://localhost:7001/api/v1/user/reset-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: otp, password: newPassword }),
            });

            const data = await response.json();

            if (data.success) {
                setStep(3);
            } else {
                setError(data.message || "Failed to reset password");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
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
                <div className="text-center mb-10 flex flex-col items-center">
                    <img src={logo} alt="GridSports Logo" className="w-24 h-24 mb-4 drop-shadow-[0_0_15px_rgba(255,87,34,0.3)]" />
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                        Grid<span className="text-racing-orange">Sports</span>
                    </h1>
                    <p className="text-gray-400">
                        {step === 1 && "Recover your account"}
                        {step === 2 && "Reset your password"}
                        {step === 3 && "All set!"}
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleSendOTP}
                                className="space-y-5"
                            >
                                <div>
                                    <label className="text-sm font-medium text-gray-300 block mb-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <span className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-400 font-medium border-r border-white/10 pr-3 h-5 flex items-center">
                                            +91
                                        </span>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                            placeholder="9876543210"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-[5.5rem] pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-racing-orange/50 focus:border-racing-orange/50 transition-all"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-racing-orange text-white py-4 rounded-xl font-bold text-base hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-racing-orange/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Sending..." : "Send OTP"} <ArrowRight size={18} />
                                </button>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleResetPassword}
                                className="space-y-5"
                            >
                                <div>
                                    <label className="text-sm font-medium text-gray-300 block mb-2">Enter OTP</label>
                                    <div className="relative">
                                        <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="Enter 4-digit OTP"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-racing-orange/50 focus:border-racing-orange/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-300 block mb-2">New Password</label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
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

                                {error && (
                                    <div className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-racing-orange text-white py-4 rounded-xl font-bold text-base hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-racing-orange/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Resetting..." : "Reset Password"} <ArrowRight size={18} />
                                </button>
                            </motion.form>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 size={40} className="text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Password Reset!</h3>
                                <p className="text-gray-400 mb-8">
                                    Your password has been successfully updated. You can now login with your new credentials.
                                </p>
                                <Link
                                    to="/login"
                                    className="block w-full bg-racing-orange text-white py-4 rounded-xl font-bold text-base hover:bg-amber-600 transition-colors shadow-lg shadow-racing-orange/20"
                                >
                                    Back to Login
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Back to Login (only show on step 1 & 2) */}
                    {step < 3 && (
                        <div className="mt-6 text-center">
                            <Link to="/login" className="text-gray-400 text-sm hover:text-white flex items-center justify-center gap-2 transition-colors">
                                <ArrowLeft size={16} /> Back to Login
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
