import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, RotateCcw } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function OTPPage() {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyOTP } = useAuth();

    const userData = location.state || {};

    useEffect(() => {
        // Auto-focus first input
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError("");

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
        const newOtp = [...otp];
        pastedData.split("").forEach((char, i) => {
            if (i < 4) newOtp[i] = char;
        });
        setOtp(newOtp);
        if (pastedData.length > 0) {
            const focusIndex = Math.min(pastedData.length, 3);
            inputRefs.current[focusIndex]?.focus();
        }
    };

    const handleVerify = () => {
        const otpString = otp.join("");
        if (otpString.length < 4) {
            setError("Please enter all 4 digits");
            return;
        }

        const isValid = verifyOTP(otpString, userData);
        if (isValid) {
            setSuccess(true);
            setTimeout(() => navigate("/tribe", { state: { from: userData.redirectTo || "/" } }), 1500);
        } else {
            setError("Invalid OTP. Demo code is 0000");
            setOtp(["", "", "", ""]);
            inputRefs.current[0]?.focus();
        }
    };

    const handleResend = () => {
        setOtp(["", "", "", ""]);
        setError("");
        inputRefs.current[0]?.focus();
    };

    // Auto-submit when all 4 digits are entered
    useEffect(() => {
        if (otp.every((d) => d !== "")) {
            handleVerify();
        }
    }, [otp]);

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
                {/* Icon */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-racing-orange/10 flex items-center justify-center mx-auto mb-6 border border-racing-orange/20">
                        <ShieldCheck size={40} className="text-racing-orange" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">Verify OTP</h1>
                    <p className="text-gray-400 text-sm">
                        Enter the 4-digit code sent to{" "}
                        <span className="text-white font-semibold">{userData.phone || "your phone"}</span>
                    </p>
                </div>

                {/* OTP Inputs */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <div className="flex justify-center gap-4 mb-8">
                        {otp.map((digit, index) => (
                            <motion.input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                whileFocus={{ borderColor: "var(--racing-orange)" }}
                                className={`w-16 h-16 text-center text-3xl font-black rounded-2xl border-2 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-racing-orange/50 transition-all ${error
                                    ? "border-red-500/50"
                                    : digit
                                        ? "border-racing-orange/50"
                                        : "border-white/10"
                                    } ${success ? "border-green-500 bg-green-500/10 text-green-400" : ""}`}
                            />
                        ))}
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg mb-4">
                            {error}
                        </motion.p>
                    )}

                    {/* Success */}
                    {success && (
                        <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-green-400 text-sm text-center bg-green-400/10 py-2 rounded-lg mb-4 font-bold">
                            ✅ Verified! Redirecting...
                        </motion.p>
                    )}

                    {/* Verify Button */}
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleVerify}
                        disabled={success}
                        className="w-full bg-racing-orange text-white py-4 rounded-xl font-bold text-base hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-racing-orange/20 disabled:opacity-50"
                    >
                        {success ? "Verified ✓" : <>Verify <ArrowRight size={18} /></>}
                    </motion.button>

                    {/* Resend */}
                    <button
                        onClick={handleResend}
                        className="w-full text-gray-400 text-sm mt-4 flex items-center justify-center gap-2 hover:text-white transition-colors"
                    >
                        <RotateCcw size={14} /> Resend Code
                    </button>
                </div>

                {/* Demo Hint */}
                <p className="text-center text-gray-600 text-xs mt-6">
                    Demo OTP: <span className="text-gray-400 font-mono font-bold">0000</span>
                </p>
            </motion.div>
        </div>
    );
}
