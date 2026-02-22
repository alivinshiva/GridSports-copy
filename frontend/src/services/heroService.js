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
