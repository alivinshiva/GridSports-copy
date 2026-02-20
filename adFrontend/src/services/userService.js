import axios from 'axios';

const API_URL = 'http://localhost:7001/api/v1/admin';

export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
