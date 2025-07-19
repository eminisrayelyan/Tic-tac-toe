const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, { 
    cors: {
        origin: '*'
    }
 });

io.on("connection", (socket) => {
    console.log('Connected')

    socket.on("updateBoard", (data) => {
      socket.broadcast.emit("updateBoard", data); 
    });
});

httpServer.listen(3000);