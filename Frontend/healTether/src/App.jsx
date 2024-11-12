import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Register.jsx';
import Login from './Login';
import Home from './Home.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/" element={<Navigate replace to="/register" />} />
      </Routes>
    </Router>
  );
}

export default App;
