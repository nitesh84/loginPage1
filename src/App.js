import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Welcome } from './Welcome';
import Register from './Register';
import { NotFound } from './NotFound';
import { Login } from './Login';
import PrivateRoute from './routes'; // Import PrivateRoute component

export const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);


  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route
        path="/welcome/:username"
        element={<PrivateRoute isAuthenticated={isAuthenticated} element={<Welcome />} />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

