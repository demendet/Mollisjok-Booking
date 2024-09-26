// src/components/ExtrasSection.js
import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';

const ExtrasSection = ({ extras, onChange }) => {
  return (
    <div className="extras-section">
      <h2>Extras</h2>
      <FormControlLabel
        control={
          <Switch
            checked={extras.halfBoard}
            onChange={(e) => onChange('halfBoard', e.target.checked)}
            color="primary"
          />
        }
        label="Half Board (450 kr per person per night)"
      />
      <FormControlLabel
        control={
          <Switch
            checked={extras.sauna}
            onChange={(e) => onChange('sauna', e.target.checked)}
            color="primary"
          />
        }
        label="Sauna (200 kr per night)"
      />
    </div>
  );
};

export default ExtrasSection;
