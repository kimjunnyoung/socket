// server.js

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());

const PORT = process.env.PORT || 3001;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'game',
});

db.connect((err) => {
  if (err) {
    console.error('error:', err);
  } else {
    console.log('MySQL');
  }
});

const rooms = {};

const updateRoomList = () => {
  io.emit('roomList', Object.keys(rooms));
};

const loadRoomsFromDB = () => {
  const sql = 'SELECT * FROM rooms';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('query error:', err);
      setTimeout(loadRoomsFromDB, 2000);
    } else {
      results.forEach((row) => {
        rooms[row.name] = { users: {}, maxPlayers: row.max_players };
      });
      updateRoomList();
    }
  });
};

loadRoomsFromDB();

const startGame = (roomName) => {
  rooms[roomName].gameStarted = true;
  updateRoomInfo(roomName);

  io.to(roomName).emit('gameStarted', true);
};

const validateWord = (word) => {
  return true;
};

const updateRoomInfo = (roomName) => {
  io.to(roomName).emit('roomInfo', {
    currentWord: rooms[roomName].currentWord || '',
    gameStarted: rooms[roomName].gameStarted || false,
    players: Object.values(rooms[roomName].users),
    currentPlayerId: rooms[roomName].currentPlayerId || null,
  });
};

io.on('connection', (socket) => {
  console.log(`connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`disconnected: ${socket.id}`);
  });

  socket.on('createAndJoinRoom', ({ roomName, userNickname, maxPlayers }) => {
    if (!rooms[roomName]) {
      const sql = 'INSERT INTO rooms (name, max_players) VALUES (?, ?)';
      db.query(sql, [roomName, maxPlayers], (err, result) => {
        if (err) {
          console.error('query error:', err);
        }
      });
      rooms[roomName] = { users: {}, maxPlayers };
      updateRoomList();
    } else {
      socket.emit('roomFull', `Room ${roomName} is already full.`);
    }
  });

  socket.on('submitWord', ({ roomName, word, userNickname }) => {
    const isValidWord = validateWord(word);
    if (isValidWord) {
      rooms[roomName].currentWord = word;
      updateRoomInfo(roomName);
      io.to(roomName).emit('updateCurrentWord', word);
    } else {
      socket.to(roomName).emit('invalidWord', '유효하지 않은 단어입니다.');
    }
    if (Object.keys(rooms[roomName].users).length >= rooms[roomName].maxPlayers) {
      startGame(roomName);
    }
  });

  socket.on('leaveRoom', ({ roomName, userNickname }) => {
    delete rooms[roomName].users[socket.id];
    if (Object.keys(rooms[roomName].users).length === 0) {
      delete rooms[roomName];
    }
    io.emit('roomList', Object.keys(rooms));
    console.log(`User ${userNickname} left room ${roomName}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server ${PORT}`);
});
