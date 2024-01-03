// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3001', {
//   transports: ['websocket', 'polling'],
//   withCredentials: true,
// });

// const Main = () => {
//   const [rooms, setRooms] = useState([]);
//   const [newRoomName, setNewRoomName] = useState('');
//   const [nickname, setNickname] = useState('');
//   const [maxPlayers, setMaxPlayers] = useState(2);

//   useEffect(() => {
//     const storedRoomList = JSON.parse(localStorage.getItem('roomList')) || [];
//     setRooms(storedRoomList);

//     socket.emit('requestInitialData');
//     socket.on('initialData', ({ rooms }) => {
//       setRooms(rooms);
//       localStorage.setItem('roomList', JSON.stringify(rooms));
//     });

//     socket.on('roomList', (rooms) => {
//       setRooms(rooms);
//       localStorage.setItem('roomList', JSON.stringify(rooms));
//     });

//     return () => {
//       socket.off('initialData');
//       socket.off('roomList');
//     };
//   }, []);

//   const handleCreateRoom = () => {
//     if (!nickname.trim()) {
//       alert('방에 참여하려면 닉네임을 입력해야 합니다.');
//       return;
//     }

//     socket.emit('createAndJoinRoom', { roomName: newRoomName, userNickname: nickname, maxPlayers });

//     window.location.href = `/room/${newRoomName}`;
//   };

//   const handleJoinRoom = (roomName) => {
//     if (!nickname.trim()) {
//       alert('방에 참여하려면 닉네임을 입력해야 합니다.');
//       return;
//     }

//     window.location.href = `/room/${roomName}`;
//   };

//   return (
//     <div>
//       <h1>끝말잇기 방 목록</h1>
//       <ul>
//         {rooms.map((roomName) => (
//           <li key={roomName} onClick={() => handleJoinRoom(roomName)}>
//             {roomName}
//           </li>
//         ))}
//       </ul>

//       <div>
//         <h2>새로운 방 생성</h2>
//         <input
//           type="text"
//           placeholder="방 이름"
//           value={newRoomName}
//           onChange={(e) => setNewRoomName(e.target.value)}
//         />
//         <br />
//         <input
//           type="text"
//           placeholder="닉네임"
//           value={nickname}
//           onChange={(e) => setNickname(e.target.value)}
//         />
//         <br />
//         <input
//           type="number"
//           placeholder="최대 인원 수"
//           value={maxPlayers}
//           onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
//         />
//         <br />
//         <button onClick={handleCreateRoom}>방 생성</button>
//       </div>
//     </div>
//   );
// };

// export default Main;
