import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for existing session
        const savedUser = localStorage.getItem("gridsports_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const signup = (name, phone, password) => {
        // Demo: save user to localStorage
        const users = JSON.parse(localStorage.getItem("gridsports_users") || "[]");
        const existing = users.find((u) => u.phone === phone);
        if (existing) {
            return { success: false, message: "Phone number already registered" };
        }
        users.push({ name, phone, password });
        localStorage.setItem("gridsports_users", JSON.stringify(users));
        return { success: true, phone };
    };

    const login = (phone, password) => {
        const users = JSON.parse(localStorage.getItem("gridsports_users") || "[]");
        const found = users.find((u) => u.phone === phone && u.password === password);
        if (found) {
            // Direct login — set user session immediately (no OTP)
            const userObj = { name: found.name, phone: found.phone };
            setUser(userObj);
            localStorage.setItem("gridsports_user", JSON.stringify(userObj));
            return { success: true };
        }
        return { success: false, message: "Invalid phone number or password" };
    };

    const verifyOTP = (otp, userData) => {
        // Demo OTP: 0000
        if (otp === "0000") {
            const userObj = { name: userData.name, phone: userData.phone };
            setUser(userObj);
            localStorage.setItem("gridsports_user", JSON.stringify(userObj));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("gridsports_user");
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signup, login, verifyOTP, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
