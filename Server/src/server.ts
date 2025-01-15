import express from "express";
import SocketService from "./services/socket.js";
import http from "http";

async function init() {
  const socketService = new SocketService();

  const app = express();
  const server = http.createServer(app);
  const PORT = process.env.PORT || 8000;

  socketService.io.attach(server);

  app.get("/", (req: any, res: any) => {
    return res.json({ message: "Hello world" });
  });

  server.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
  socketService.initListeners();
}

init();
