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
export const searchContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchTerm } = req.body;
        console.log("SEARCH CONTACTS");
        const contacts = axios.post("http://localhost:3000/api/user/query", {
            searchTerm,
            userId: req.user.id,
        });
        return res.status(200).json({ contacts });
    }
    catch (error) {
        return res.status(500).send("Internal server error");
    }
});
