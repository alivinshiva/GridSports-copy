import axios from 'axios';

const API_URL = 'http://localhost:7001/api/v1/leaderboard';

export const getCreatorLeaderboard = async () => {
    try {
        const response = await axios.get(`${API_URL}/creators`);
        return response.data;
    } catch (error) {
        console.error("Error fetching creator leaderboard:", error);
        throw error;
    }
};

export const getRankerLeaderboard = async () => {
    try {
        const response = await axios.get(`${API_URL}/rankers`);
        return response.data;
    } catch (error) {
        console.error("Error fetching ranker leaderboard:", error);
        throw error;
    }
};

export const getTribeLeaderboard = async () => {
    try {
        const response = await axios.get(`${API_URL}/tribes`);
        return response.data;
    } catch (error) {
        console.error("Error fetching tribe leaderboard:", error);
        throw error;
    }
};
