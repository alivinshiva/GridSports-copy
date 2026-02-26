import axios from 'axios';

const API_URL = `${import.meta.env.VITE_MAIN_API_URL}/api/v1/leaderboard`;

export const getCreatorLeaderboard = async (page = 1, limit = 15) => {
    try {
        const response = await axios.get(`${API_URL}/creators?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching creator leaderboard:", error);
        throw error;
    }
};

export const getRankerLeaderboard = async (page = 1, limit = 15) => {
    try {
        const response = await axios.get(`${API_URL}/rankers?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching ranker leaderboard:", error);
        throw error;
    }
};

export const getTribeLeaderboard = async (page = 1, limit = 15) => {
    try {
        const response = await axios.get(`${API_URL}/tribes?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching tribe leaderboard:", error);
        throw error;
    }
};

export const getCurrentUserRank = async () => {
    try {
        const response = await axios.get(`${API_URL}/me`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching current user rank:", error);
        throw error;
    }
};
