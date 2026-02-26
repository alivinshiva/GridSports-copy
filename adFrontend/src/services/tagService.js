import axios from 'axios';

const API_URL = `${import.meta.env.VITE_AD_API_URL}/api/v1/tag`;

export const createTag = async (tagData) => {
    try {
        const response = await axios.post(`${API_URL}/create`, tagData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to create tag' };
    }
};

export const getAllTags = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to fetch tags' };
    }
};

export const deleteTag = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${id}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to delete tag' };
    }
};
