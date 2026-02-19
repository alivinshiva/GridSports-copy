import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for existing session
        const savedUser = localStorage.getItem("gridsports_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            fetchProfile();
        }
        setIsLoading(false);
    }, []);

    const signup = async (name, phone, password) => {
        try {
            const response = await fetch("http://localhost:7000/api/v1/user/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phoneNumber: phone, password }),
            });
            const data = await response.json();

            if (data.success) {
                return { success: true, phone, name };
            }
            return { success: false, message: data.message };
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    };

    const fetchProfile = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:7000/api/v1/profile/profile-details", {
                credentials: "include",
            });
            const data = await response.json();
            if (data.success && data.data) {
                if (data.data.tribe) {
                    localStorage.setItem("gridsports_tribe", data.data.tribe);
                }
                // Update user state with isAdmin and imageUrl if present
                if (data.data.user) {
                    setUser(prev => {
                        // Prevent unnecessary state updates if critical data hasn't changed
                        if (prev?.isAdmin === data.data.user.isAdmin && prev?.imageUrl === data.data.imageUrl) return prev;

                        const updated = {
                            ...prev,
                            isAdmin: data.data.user.isAdmin,
                            imageUrl: data.data.imageUrl
                        };
                        localStorage.setItem("gridsports_user", JSON.stringify(updated));
                        return updated;
                    });
                }
                return data.data;
            }
        } catch (error) {
            console.error("Fetch Profile Error:", error);
        }
        return null; // Return null on error/no-data
    }, []);

    const login = async (phone, password) => {
        try {
            const response = await fetch("http://localhost:7000/api/v1/user/login-phone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber: phone, password }),
                credentials: "include",
            });
            const data = await response.json();

            if (data.success) {
                const userObj = { name: data.name, phone: phone, isAdmin: data.role };
                setUser(userObj);
                localStorage.setItem("gridsports_user", JSON.stringify(userObj));

                // Check if user has a tribe
                await fetchProfile();

                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    };

    const verifyOTP = async (otp, userData) => {
        try {
            const response = await fetch("http://localhost:7000/api/v1/user/verify-phone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: otp }),
                credentials: "include",
            });
            const data = await response.json();

            if (data.success) {
                const userObj = { name: userData.name, phone: userData.phone };
                // Fetch profile to get role and other details
                setUser(userObj);
                localStorage.setItem("gridsports_user", JSON.stringify(userObj));

                // Check if user has a tribe
                await fetchProfile();

                return true;
            }
            return false;
        } catch (error) {
            console.error("OTP Verification Error:", error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await fetch("http://localhost:7000/api/v1/user/logout", {
                method: "POST",
                credentials: "include"
            });
        } catch (error) {
            console.error("Logout failed", error);
        }
        setUser(null);
        localStorage.removeItem("gridsports_user");
        localStorage.removeItem("gridsports_tribe");
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signup, login, verifyOTP, logout, fetchProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
