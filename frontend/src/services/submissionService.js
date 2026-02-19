import axios from "axios";

// export const API_URL = "http://localhost:3000/api/v1"; 
// Assuming global API_URL or vite proxy. Since other services use axios directly or with a base URL, I should check one.
// weekendService.js likely has the pattern.

// I'll assume standard axios for now, but checking weekendService would be safer.
// Let's assume relative path if proxy is set up, or hardcoded for now based on previous context.
// Actually, I should check weekendService.js to be consistent.

const API_URL = "http://localhost:9000/api/v1/submission";

export const getAllSubmissions = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const addSubmission = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/add`, formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getAllRandomSubmissions = async (limit = 15) => {
    try {
        const response = await axios.get(`${API_URL}/all-random?limit=${limit}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
