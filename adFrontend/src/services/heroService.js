import axios from "axios";

const API_URL = `${import.meta.env.VITE_AD_API_URL}/api/v1/hero`;

export const getAllHeroes = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createHero = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/add`, formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateHero = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}/update/${id}`, formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteHero = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${id}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
