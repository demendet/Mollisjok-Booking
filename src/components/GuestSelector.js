// src/components/GuestSelector.js

import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const GuestSelector = ({ guests, setGuests, maxGuests }) => {
  return (
    <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
      <InputLabel id="guest-label">Guests</InputLabel>
      <Select
        labelId="guest-label"
        value={guests}
        onChange={(e) => setGuests(parseInt(e.target.value))}
        label="Guests"
      >
        {[...Array(maxGuests).keys()].map((num) => (
          <MenuItem key={num + 1} value={num + 1}>
            {num + 1}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GuestSelector;
