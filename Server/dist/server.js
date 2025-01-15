var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import SocketService from "./services/socket.js";
import http from "http";
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const socketService = new SocketService();
        const app = express();
        const server = http.createServer(app);
        const PORT = process.env.PORT || 8000;
        socketService.io.attach(server);
        app.get("/", (req, res) => {
            return res.json({ message: "Hello world" });
        });
        server.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
        socketService.initListeners();
    });
}
init();
