import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [roomList, setRoomList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [players, setPlayers] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:3001", { withCredentials: true });
    setSocket(socket);

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

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleCreateRoom = (roomName) => {
    socket.emit('createRoom', roomName);
  };

  const handleJoinRoom = (roomName) => {
    socket.emit('joinRoom', { roomName, userNickname });
    setSelectedRoom(roomName);
  };

  const handleWordSubmit = (word) => {
    socket.emit('submitWord', { roomName: selectedRoom, word, userNickname });
  };

  return (
    <div>
      {!selectedRoom ? (
        <div>
          <h1>진짜 하기싫다</h1>
          <input
            type="text"
            placeholder="닉네임"
            value={userNickname}
            onChange={(e) => setUserNickname(e.target.value)}
          />
          <button onClick={() => handleCreateRoom('room1')}> 1</button>
          <button onClick={() => handleCreateRoom('room2')}> 2</button>
          <h2>방</h2>
          <ul>
            {roomList.map((roomName) => (
              <li key={roomName}>
                <button onClick={() => handleJoinRoom(roomName)}>{roomName}</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h2>방: {selectedRoom}</h2>
          <p>닉: {players.map((player) => player.userNickname).join(', ')}</p>
          <p>단어: {currentWord}</p>
          <input
            type="text"
            placeholder="Enter a word"
            onChange={(e) => handleWordSubmit(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default App;
