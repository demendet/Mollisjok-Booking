// src/components/AdminLogin.js

import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { TextField, Button } from '@mui/material';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        onLogin();
      })
      .catch((error) => {
        console.error('Admin login failed:', error);
        alert('Login failed. Please check your credentials.');
      });
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        type="password"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        fullWidth
        style={{ marginTop: '20px' }}
      >
        Login
      </Button>
    </div>
  );
};

export default AdminLogin;
