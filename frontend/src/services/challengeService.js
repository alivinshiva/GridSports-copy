import axios from 'axios';
import logger from '../utils/logger.js';

const API_URL = `${import.meta.env.VITE_AD_API_URL}/api/v1/challenge`;

export const getAllChallenges = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        logger.error("Error fetching challenges:", error);
        throw error;
    }
};

export const deleteChallenge = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${id}`);
        return response.data;
    } catch (error) {
        logger.error("Error deleting challenge:", error);
        throw error;
    }
};

export const getChallengesByWeekendId = async (weekendId) => {
    try {
        const response = await axios.get(`${API_URL}/weekend/${weekendId}`);
        return response.data;
    } catch (error) {
        logger.error("Error fetching challenges by weekend:", error);
        throw error;
    }
};

export const getChallengeById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/details/${id}`);
        return response.data;
    } catch (error) {
        logger.error("Error fetching challenge details:", error);
        throw error;
    }
};

export const getChallengesByStatus = async (status) => {
    try {
        const response = await axios.get(`${API_URL}/${status}`);
        return response.data;
    } catch (error) {
        logger.error(`Error fetching ${status} challenges:`, error);
        throw error;
    }
};
