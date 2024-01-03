// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import io from 'socket.io-client';

// const Room = ({ userNickname }) => {
//   const { roomName } = useParams();
//   // const startGameBtnRef = useRef(null);
//   const [currentWord, setCurrentWord] = useState('');
//   const [message, setMessage] = useState('');
//   const [chat, setChat] = useState([]);
//   const [gameStarted, setGameStarted] = useState(false);
//   const [players, setPlayers] = useState([]);
//   const [isMyTurn, setIsMyTurn] = useState(false);
//   const [roomInfo, setRoomInfo] = useState(null);
//   const chatRef = useRef();

//   const socket = io('http://localhost:3001', {
//     transports: ['websocket', 'polling'],
//     withCredentials: true,
//   });

//   useEffect(() => {
//     socket.emit('createAndJoinRoom', { roomName, userNickname });
//     socket.on('roomInfo', (roomInfo) => {
//       console.log('Received roomInfo:', roomInfo);
//       setRoomInfo(roomInfo);
//       setCurrentWord(roomInfo.currentWord);
//       setGameStarted(roomInfo.gameStarted);
//       setPlayers(roomInfo.players);
//       setIsMyTurn(roomInfo.currentPlayerId === socket.id);
//     });

//     socket.on('chatMessage', (messageObj) => {
//       setChat((prevChat) => [...prevChat, messageObj]);
//       scrollToBottom();
//     });

//     socket.on('updateCurrentWord', (word) => {
//       setCurrentWord(word);
//     });

//     return () => {
//       socket.off('roomInfo');
//       socket.off('chatMessage');
//       socket.off('updateCurrentWord');
//     };
//   }, [roomName, userNickname]);

//   const handleSendMessage = () => {
//     if (message.trim() !== '') {
//       socket.emit('sendMessage', { roomName, message, userNickname });
//       console.log(message);
//       setMessage('');
//     }
//   };

//   // const handleStartGame = () => {
//   //   socket.emit('startGame', roomName);
 
//   // socket.on('gameStarted', () => {
//   //   setGameStarted(true);
//   // });

//   // document.querySelector('#startGameBtn').disabled = true;
//   // };

//   const handleWordSubmit = () => {
//     // console.log('word:', currentWord);
//     if (currentWord.trim() !== '') {
//       // setCurrentWord(currentWord);
//       // console.log('word:', currentWord);
//       // socket.emit('submitWord', { roomName, word: currentWord });
//       // const chatElement = document.querySelector('#chat');
//       // chatElement.innerHTML += `<div key={chat.length}>
//       //   <strong>{userNickname}:</strong> {currentWord}
//       // </div>`;
//       setChat((prevChat) => [...prevChat, { userNickname, message: currentWord }]);
//       // socket.emit('submitWord', { roomName, word: currentWord });
//       // } else {
//       // console.log('d.');
//     }
//   };

//   const handleWordChange = (e) => {
//     setCurrentWord(e.target.value);
//   };

//   const scrollToBottom = () => {
//     chatRef.current.scrollTop = chatRef.current.scrollHeight;
//   };

//   return (
//     <div>
//       <h1>끝말잇기 방: {roomName}</h1>
//       <p>현재 단어: {gameStarted ? currentWord : message}</p>
//       {gameStarted && (
//         <div>
//           <input
//             type="text"
//             placeholder="단어 입력"
//             value={currentWord}
//             onChange={handleWordChange}
//           />
//           <button onClick={handleWordSubmit}>단어 제출</button>
//           {isMyTurn && <p>당신의 차례입니다.</p>}
//         </div>
//       )}
//       <div
//         id='chat'
//         style={{
//           height: '200px',
//           overflowY: 'auto',
//           border: '1px solid #ccc',
//           padding: '10px',
//           marginBottom: '10px',
//         }}
//         ref={chatRef}
//       >
//         {chat.map((messageObj, index) => (
//           <div key={index}>
//             <strong>{messageObj.userNickname}:</strong> {messageObj.message}
//           </div>
//         ))}
//       </div>
//       <div>
//         <input
//           type="text"
//           placeholder="메시지 입력"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button onClick={handleSendMessage}>전송</button>
//       </div>
//       <div>
//         <h2>참여자</h2>
//         <ul>
//           {players && players.map((player) => (
//             <li key={player.id}>{player.nickname}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Room;
