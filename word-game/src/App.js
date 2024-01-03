import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import {
  Button,
  TextField,
  List,
  ListItem,
  Typography,
  Container,
  Paper,
  IconButton,
  Avatar,
} from '@mui/material';
import { Send as SendIcon, Add as AddIcon, ExitToApp as ExitIcon, Delete as DeleteIcon } from '@mui/icons-material';
import './App.css';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [roomList, setRoomList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [roomTitle, setRoomTitle] = useState('');
  const [players, setPlayers] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:3001', { withCredentials: true });
    setSocket(socket);

    socket.emit('getRoomList');

    socket.on('roomList', (rooms) => {
      setRoomList(rooms);
    });

    socket.on('updatePlayers', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on('updateCurrentWord', (word) => {
      setCurrentWord(word);
    });

    socket.on('gameStarted', (isGameStarted) => {
      setGameStarted(isGameStarted);
    });

    socket.on('chatMessage', (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLeaveRoom = () => {
    socket.emit('leaveRoom', { roomName: selectedRoom });
    setSelectedRoom('');
  };

  const handleCreateRoom = () => {
    socket.emit('createRoom', roomTitle);
    socket.once('roomList', (rooms) => {
      setRoomList(rooms);
      const createdRoomName = roomTitle;
      setSelectedRoom(createdRoomName);
      socket.emit('joinRoom', { roomName: createdRoomName, userNickname });
    });
  };

  const handleJoinRoom = (roomName) => {
    if (!userNickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    socket.emit('joinRoom', { roomName, userNickname });
    setSelectedRoom(roomName);
  };

  const handleWordSubmit = (word) => {
    socket.emit('submitWord', { roomName: selectedRoom, word, userNickname });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      socket.emit('sendChatMessage', { roomName: selectedRoom, message: newMessage, userNickname });
      setNewMessage('');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        {!selectedRoom ? (
          <div>
            <Typography variant="h4">진짜 하기싫다</Typography>
            <TextField
              label="제목"
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="닉네임"
              value={userNickname}
              onChange={(e) => setUserNickname(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleCreateRoom} startIcon={<AddIcon />}>
              방 생성
            </Button>
            <Typography variant="h5">방 목록</Typography>
            <List>
              {roomList.map((roomName) => (
                <ListItem key={roomName}>
                  <Button variant="outlined" onClick={() => handleJoinRoom(roomName)}>
                    {roomName}
                  </Button>
                </ListItem>
              ))}
            </List>
          </div>
        ) : (
          <div>
            <Typography variant="h5">방: {selectedRoom}</Typography>
            <Typography variant="body1">
              닉: {players.map((player) => player.userNickname).join(', ')}
            </Typography>
            <div style={{ marginTop: '20px' }}>
              <Typography variant="h6">채팅</Typography>
              <div style={{ border: '1px solid #ccc', padding: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                {chatMessages.map((message, index) => (
                  <div key={index} className={message.userNickname === userNickname ? 'my-message' : 'other-message'}>
                    <Typography variant="body1">
                      <strong>{message.userNickname}:</strong> {message.message}
                    </Typography>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '10px' }}>
                <TextField
                  label="Type a message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendMessage}
                  endIcon={<SendIcon />}
                >
                  전송
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleLeaveRoom}
                  endIcon={<ExitIcon />}
                >
                  나가기
                </Button>
              </div>
            </div>
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default App;
