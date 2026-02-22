import axios from 'axios';

const API_URL = `${import.meta.env.VITE_MAIN_API_URL}/api/v1/admin`;

export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
