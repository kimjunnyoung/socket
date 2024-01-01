import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './main';
import Room from './room';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/room/:roomName" element={<Room />} />
      </Routes>
    </Router>
  );
}
export default App;
