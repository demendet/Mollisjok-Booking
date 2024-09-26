// src/components/Header.js

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <h1>Mollisjok Lodge AS</h1>
      <p>
        I perioden januar og februar tar vi bestillinger over epost:
        piera@mollisjok.com
      </p>
      <Link to="/admin" className="admin-button">
        <Button variant="outlined">Admin Dashboard</Button>
      </Link>
    </header>
  );
};

export default Header;
