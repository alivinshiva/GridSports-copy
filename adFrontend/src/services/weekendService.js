import axios from 'axios';
import logger from '../utils/logger.js';

const API_URL = `${import.meta.env.VITE_AD_API_URL}/api/v1/weekend`;

export const getAllWeekends = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        logger.error("Error fetching weekends:", error);
        throw error;
    }
};

export const createWeekend = async (weekendData) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
        const response = await axios.post(`${API_URL}/add`, weekendData, config);
        return response.data;
    } catch (error) {
        logger.error("Error creating weekend:", error);
        throw error;
    }
};

export const getWeekendById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/details/${id}`);
        return response.data;
    } catch (error) {
        logger.error("Error fetching weekend details:", error);
        throw error;
    }
};

export const updateWeekendStatus = async (id, status) => {
    try {
        const response = await axios.put(`${API_URL}/update/${id}`, { status });
        return response.data;
    } catch (error) {
        logger.error("Error updating weekend status:", error);
        throw error;
    }
};

export const deleteWeekend = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${id}`);
        return response.data;
    } catch (error) {
        logger.error("Error deleting weekend:", error);
        throw error;
    }
};
