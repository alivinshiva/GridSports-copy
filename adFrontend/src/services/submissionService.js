import axios from 'axios';

const API_URL = 'http://localhost:9000/api/v1/submission';

export const getAllSubmissions = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        console.error("Error fetching submissions:", error);
        throw error;
    }
};

export const createSubmission = async (submissionData) => {
    try {
        const response = await axios.post(`${API_URL}/add`, submissionData);
        return response.data;
    } catch (error) {
        console.error("Error creating submission:", error);
        throw error;
    }
};
