import axios from "axios";

// This points to the main user backend API
const API_URL = `${import.meta.env.VITE_MAIN_API_URL}/api/v1/notification`;

export const getUserNotifications = async () => {
    try {
        const response = await axios.get(`${API_URL}/`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const markNotificationRead = async (notificationId) => {
    try {
        const response = await axios.post(`${API_URL}/${notificationId}/read`, {}, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteNotification = async (notificationId) => {
    try {
        const response = await axios.delete(`${API_URL}/${notificationId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
