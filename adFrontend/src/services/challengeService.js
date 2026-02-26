import axios from 'axios';

const API_URL = `${import.meta.env.VITE_AD_API_URL}/api/v1/challenge`;

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
        console.error("Error creating challenge:", error.response?.data || error.message);
        throw error;
    }
};

export const getChallengeById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/details/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching challenge details:", error);
        throw error;
    }
};

export const updateChallenge = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/update/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating challenge:", error);
        throw error;
    }
};

export const deleteChallenge = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting challenge:", error);
        throw error;
    }
};
