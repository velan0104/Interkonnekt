var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import { HOST } from "./constant.js";
export const getUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId)
        return;
    try {
        const response = yield axios.post(`${HOST}/api/users`, {
            userId: userId,
        });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching user data: ", error);
        return null;
    }
});
export const getFilteredUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios.post(`${HOST}/api/users/query`, {
            query: query,
        });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching user data: ", error);
        return null;
    }
});
