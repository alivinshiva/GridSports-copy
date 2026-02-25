import axios from 'axios';

const API_URL = `${import.meta.env.VITE_AD_API_URL}/api/v1/weekend`;

export const getAllWeekends = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        console.error("Error fetching weekends:", error);
        throw error;
    }
};

export const getWeekendById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/details/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching weekend details:", error);
        throw error;
    }
};

export const getAllActiveWeekends = async () => {
    try {
        const response = await axios.get(`${API_URL}/active`);
        return response.data;
    } catch (error) {
        console.error("Error fetching active weekends:", error);
        throw error;
    }
};

export const getAllUpcomingWeekends = async () => {
    try {
        const response = await axios.get(`${API_URL}/upcoming`);
        return response.data;
    } catch (error) {
        console.error("Error fetching upcoming weekends:", error);
        throw error;
    }
};
