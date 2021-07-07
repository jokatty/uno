import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import http from 'http';
import { Server } from 'socket.io';
import bindRoutes from './routes.mjs';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
bindRoutes(app);
// const PORT = process.env.PORT || 3004;
// app.listen(PORT);
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('player', (playerName) => {
    console.log(`${playerName} has joined the game`);
  });
  socket.broadcast.emit('hi');
  socket.on('welcome message', (msg) => {
    io.emit('welcome message', msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('server is running on  port 3000');
});
