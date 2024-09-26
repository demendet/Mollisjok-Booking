// src/components/Header.js

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-text">
          <h1>Mollisjok Lodge AS</h1>
          <p>
            I perioden januar og februar tar vi bestillinger over epost:
            <a href="mailto:piera@mollisjok.com"> piera@mollisjok.com</a>
          </p>
        </div>
        <div className="admin-button">
          <Link to="/admin">
            <Button variant="outlined" color="primary" size="small">
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
