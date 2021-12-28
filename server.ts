import http from 'http';
import express, { Express, Request, Response } from 'express';
import socketio from 'socket.io';
import path from 'path';
import log4js from 'log4js';
import config from './loggerConfig';

const app: Express = express();
const PORT: number = parseInt( process.env.PORT || "5000", 10 );
const server = http.createServer(app);
const io: socketio.Server = new socketio.Server();
io.attach(server);

// Express
app.use(express.static(path.join(__dirname, 'frontend')));
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'frontend/src/html/index.html'));
});

log4js.configure(config);
const globalLogger = log4js.getLogger();
globalLogger.addContext('context', 'GLOBAL');
const roomLogger = log4js.getLogger()

// Socket.IO routing
let rooms: string[] = [];
let usernames: string[] = [];

io.on('connection', function(socket: any){

    function time() {
        return new Date().toLocaleString();
    }

    // on join event
    socket.on("join", function(room: string, username: string){
      if (username != ""){
        rooms[socket.id] = room;
        usernames[socket.id] = username;
        socket.leaveAll();
        socket.join(room);
  
        io.in(room).emit("recieve", `<span style=color:red>[${time()}] [Server] ${username} has entered the chat.</span>`);
  
        if (username != null) {
          globalLogger.info(`${username} has joined chatroom ${room}`);
        }
  
        socket.emit("join", room);
      }
    });
  
    socket.on("send", function(message: string){
      io.in(rooms[socket.id]).emit("recieve", `[${time()}] [${usernames[socket.id]}] ${message}`);
  
      if (usernames[socket.id] != null) {
        roomLogger.addContext('context', rooms[socket.id]);
        roomLogger.info(`${usernames[socket.id]}: ${message}`);
      }
    });
  
    socket.on("disconnect", () => {
      io.in(rooms[socket.id]).emit("recieve", `<span style=color:red>[${time()}] [Server] ${usernames[socket.id]} has left the chat.</span>`);
  
      if (usernames[socket.id] != null)
        globalLogger.info(`${usernames[socket.id]} has left the chat.`);
    });
  
    socket.on("recieve", function(message: string){
      socket.emit("recieve", message);
    });
});
  
server.listen(PORT, () => {
    globalLogger.info(`Server started. Listening on port ${PORT}`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== "listen") {
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            globalLogger.error(`Cannot start webserver. port ${PORT} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            globalLogger.error(`Cannot start webserver. port ${PORT} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});
  