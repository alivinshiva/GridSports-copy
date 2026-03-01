import axios from 'axios';
import logger from '../utils/logger.js';

const API_URL = `${import.meta.env.VITE_AD_API_URL}/api/v1/submission`;

export const getAllSubmissions = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        logger.error("Error fetching submissions:", error);
        throw error;
    }
};

export const createSubmission = async (submissionData) => {
    try {
        const response = await axios.post(`${API_URL}/add`, submissionData);
        return response.data;
    } catch (error) {
        logger.error("Error creating submission:", error);
        throw error;
    }
};
