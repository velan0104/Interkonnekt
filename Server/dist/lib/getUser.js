import axios from "axios";
import { HOST } from "./constant.js";
export const getUser = async (userId) => {
    if (!userId)
        return;
    try {
        const response = await axios.post(`${HOST}/api/users`, {
            userId: userId,
        });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching user data: ", error);
        return null;
    }
};
export const getFilteredUser = async (query) => {
    try {
        const response = await axios.post(`${HOST}/api/users/query`, {
            query: query,
        });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching user data: ", error);
        return null;
    }
};
