import axios from "axios";

const API_URL = "http://localhost:9000/api/v1/hero";

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
