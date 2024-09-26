// src/components/CurrentSelectionSummary.js

import React from 'react';
import { Alert, Button, FormControlLabel, Switch } from '@mui/material';
import {
  CalendarToday,
  Person,
  Home,
  AttachMoney,
} from '@mui/icons-material';
import { differenceInCalendarDays } from 'date-fns'; // Import the function
import './CurrentSelectionSummary.css';

const CurrentSelectionSummary = ({
  checkIn,
  checkOut,
  guests,
  selectedCabin,
  totalPrice,
  errorMessage,
  onSubmit,
  isSubmitDisabled,
  extras,
  onExtraChange,
  unavailableCabins,
}) => {
  const nights =
    checkIn && checkOut ? differenceInCalendarDays(checkOut, checkIn) : 0;

  const isHuntingSeason = (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    const seasonStart = new Date(startDate.getFullYear(), 8, 10); // September 10th
    const seasonEnd = new Date(endDate.getFullYear(), 8, 30); // September 30th
    return startDate <= seasonEnd && endDate >= seasonStart;
  };

  const isMandatoryHalfBoardPeriod = () => {
    if (!checkIn || !checkOut) return false;

    // Check if any date in the range falls in March or April
    const datesInRange = [];
    let currentDate = new Date(checkIn);
    while (currentDate <= checkOut) {
      datesInRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const mandatory = datesInRange.some((date) => {
      const month = date.getMonth();
      return (
        month === 2 || // March (0-indexed)
        month === 3 || // April
        (month === 8 && date.getDate() >= 10) || // September from 10th onwards
        (month === 8 && date.getDate() <= 30) // September up to 30th
      );
    });

    return mandatory;
  };

  const mandatoryHalfBoard = isMandatoryHalfBoardPeriod();
  const isCabinUnavailable = unavailableCabins.includes(selectedCabin?.id);

  return (
    <div className="current-selection-summary">
      <h3>Current Selection</h3>
      <div className="selection-item">
        <CalendarToday className="icon" />
        <span>
          {checkIn && checkOut
            ? `${checkIn.toLocaleDateString('no-NO')} - ${checkOut.toLocaleDateString(
                'no-NO'
              )} (${nights} nights)`
            : 'No dates selected'}
        </span>
      </div>
      <div className="selection-item">
        <Person className="icon" />
        <span>Guests: {guests}</span>
      </div>
      {selectedCabin && (
        <div className="selection-item">
          <Home className="icon" />
          <span>Cabin: {selectedCabin.name}</span>
        </div>
      )}
      <div className="selection-item">
        <AttachMoney className="icon" />
        <span>Total Price: {totalPrice} kr</span>
      </div>

      {/* Extras Section */}
      <div className="extras-section">
        <h4>Extras</h4>
        <FormControlLabel
          control={
            <Switch
              checked={extras.halfBoard || mandatoryHalfBoard}
              onChange={(e) => onExtraChange('halfBoard', e.target.checked)}
              color="primary"
              disabled={mandatoryHalfBoard}
            />
          }
          label={
            mandatoryHalfBoard
              ? 'Half Board (Mandatory during this period)'
              : 'Half Board (450 kr per person per night)'
          }
        />
        <FormControlLabel
          control={
            <Switch
              checked={extras.sauna}
              onChange={(e) => onExtraChange('sauna', e.target.checked)}
              color="primary"
            />
          }
          label="Sauna (200 kr per night)"
        />
      </div>

      {errorMessage && (
        <Alert severity="error" className="error-message">
          {errorMessage}
        </Alert>
      )}

      {isCabinUnavailable && (
        <Alert severity="warning" className="error-message">
          The selected cabin is unavailable for the selected dates.
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        fullWidth
        style={{ marginTop: '20px' }}
      >
        Proceed with Booking
      </Button>
    </div>
  );
};

export default CurrentSelectionSummary;
