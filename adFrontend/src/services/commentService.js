import axios from 'axios';
import logger from '../utils/logger.js';

const API_URL = `${import.meta.env.VITE_AD_API_URL}/api/v1/comment`;

export const getAllComments = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`, { withCredentials: true });
        return response.data;
    } catch (error) {
        logger.error("Error fetching comments:", error);
        throw error;
    }
};

export const createComment = async (text) => {
    try {
        const response = await axios.post(`${API_URL}/add`, { text }, { withCredentials: true });
        return response.data;
    } catch (error) {
        logger.error("Error creating comment:", error);
        throw error;
    }
};

export const deleteComment = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${id}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        logger.error("Error deleting comment:", error);
        throw error;
    }
};
