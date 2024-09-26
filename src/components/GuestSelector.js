// src/components/GuestSelector.js

import React, { useState } from 'react';
import './GuestSelector.css';
import { Typography, IconButton, Button } from '@mui/material';
import { Remove, Add } from '@mui/icons-material';

const GuestSelector = ({ guests, setGuests, maxGuests, onClose }) => {
  const [localGuests, setLocalGuests] = useState(guests);

  const handleDecrement = () => {
    if (localGuests > 1) {
      setLocalGuests(localGuests - 1);
    }
  };

  const handleIncrement = () => {
    if (localGuests < maxGuests) {
      setLocalGuests(localGuests + 1);
    }
  };

  const handleDone = () => {
    setGuests(localGuests);
    onClose();
  };

  return (
    <div className="guest-selector-overlay-content">
      <Typography variant="h6">Select Guests</Typography>
      <div className="guest-controls">
        <IconButton
          onClick={handleDecrement}
          disabled={localGuests <= 1}
          aria-label="decrease guests"
          size="small"
        >
          <Remove />
        </IconButton>
        <Typography variant="body1" className="guest-count">
          {localGuests}
        </Typography>
        <IconButton
          onClick={handleIncrement}
          disabled={localGuests >= maxGuests}
          aria-label="increase guests"
          size="small"
        >
          <Add />
        </IconButton>
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDone}
        fullWidth
        style={{ marginTop: '10px' }}
      >
        Done
      </Button>
    </div>
  );
};

export default GuestSelector;
