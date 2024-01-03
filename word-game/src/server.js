const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  }
});

const PORT = process.env.PORT || 3001;

const rooms = {};

const updateRoomList = () => {
  io.emit('roomList', Object.keys(rooms));
};

const startGame = (roomName) => {
  rooms[roomName].gameStarted = true;
  io.to(roomName).emit('gameStarted', true);
};

io.on('connection', (socket) => {
  console.log(`connected : ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`disconnected: ${socket.id}`);
  });

  socket.on('getRoomList', () => {
    updateRoomList();
  });

  const updateRoomList = () => {
    io.emit('roomList', Object.keys(rooms));
  };

  const removeEmptyRooms = () => {
    Object.keys(rooms).forEach((roomName) => {
      if (Object.keys(rooms[roomName].users).length === 0) {
        delete rooms[roomName];
      }
    });
    updateRoomList();
  };

  socket.on('createRoom', (roomName) => {
    console.log(`room: ${roomName}`);
    if (!rooms[roomName]) {
      rooms[roomName] = { users: {}, maxPlayers: 2, gameStarted: false };
      updateRoomList();
    }
  });

  socket.on('joinRoom', ({ roomName, userNickname }) => {
    if (rooms[roomName] && Object.keys(rooms[roomName].users).length < rooms[roomName].maxPlayers) {
      rooms[roomName].users[socket.id] = { userNickname };
      socket.join(roomName);
      io.to(roomName).emit('updatePlayers', Object.values(rooms[roomName].users));
      updateRoomList();

      if (Object.keys(rooms[roomName].users).length === rooms[roomName].maxPlayers) {
        startGame(roomName);
      }
    } else {
      socket.emit('roomFull', `Room ${roomName} is full.`);
    }
  });

  socket.on('submitWord', ({ roomName, word, userNickname }) => {
    io.to(roomName).emit('updateCurrentWord', word);
  });

  socket.on('leaveRoom', ({ roomName }) => {
    if (rooms[roomName] && rooms[roomName].users[socket.id]) {
      delete rooms[roomName].users[socket.id];
      io.to(roomName).emit('updatePlayers', Object.values(rooms[roomName].users));
      removeEmptyRooms();
    }
  });

  socket.on('sendChatMessage', ({ roomName, message, userNickname }) => {
    io.to(roomName).emit('chatMessage', { userNickname, message });
  });

  socket.on('submitWord', ({ roomName, word, userNickname }) => {
    io.to(roomName).emit('updateCurrentWord', word);
  });
});

updateRoomList();

server.listen(PORT, () => {
  console.log(`Server ${PORT}`);
});
