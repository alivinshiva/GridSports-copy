import axios from 'axios';

const API_URL = 'http://localhost:9000/api/v1/challenge';

export const getAllChallenges = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        console.error("Error fetching challenges:", error);
        throw error;
    }
};

export const createChallenge = async (challengeData) => {
    try {
        const response = await axios.post(`${API_URL}/add`, challengeData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating challenge:", error);
        throw error;
    }
};
