// src/components/BookingSummary.js

import React, { useState } from 'react';
import { TextField, Button, Stepper, Step, StepLabel } from '@mui/material';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import './BookingSummary.css';

const BookingSummary = ({
  checkIn,
  checkOut,
  guests,
  selectedCabin,
  totalPrice,
  extras,
  onBack,
}) => {
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    additionalInfo: '',
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleConfirmBooking = async () => {
    try {
      await addDoc(collection(db, 'bookings'), {
        checkIn: checkIn,
        checkOut: checkOut,
        guests: guests,
        cabinId: selectedCabin.id,
        totalPrice: totalPrice,
        extras: extras,
        userInfo: userInfo,
        timestamp: Timestamp.now(),
      });
      setBookingConfirmed(true);
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('An error occurred while saving your booking. Please try again.');
    }
  };

  if (bookingConfirmed) {
    return (
      <div className="booking-confirmation">
        <h2>Booking Confirmed!</h2>
        <p>Thank you for your booking, {userInfo.fullName}.</p>
        <p>You will receive a confirmation email shortly.</p>
      </div>
    );
  }

  return (
    <div className="booking-summary">
      <Stepper activeStep={1}>
        <Step>
          <StepLabel>Select Details</StepLabel>
        </Step>
        <Step>
          <StepLabel>Booking Summary</StepLabel>
        </Step>
      </Stepper>

      <h2>Review Your Booking</h2>
      <p>
        <strong>Cabin:</strong> {selectedCabin.name}
      </p>
      <p>
        <strong>Check-in:</strong> {checkIn.toLocaleDateString('no-NO')}
      </p>
      <p>
        <strong>Check-out:</strong> {checkOut.toLocaleDateString('no-NO')}
      </p>
      <p>
        <strong>Guests:</strong> {guests}
      </p>
      <p>
        <strong>Total Price:</strong> {totalPrice} kr
      </p>
      <h3>Extras:</h3>
      <ul>
        {extras.halfBoard && <li>Half Board</li>}
        {extras.sauna && <li>Sauna</li>}
      </ul>

      <h3>Your Information</h3>
      <TextField
        label="Full Name"
        name="fullName"
        value={userInfo.fullName}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Email"
        name="email"
        value={userInfo.email}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Phone"
        name="phone"
        value={userInfo.phone}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Additional Information"
        name="additionalInfo"
        value={userInfo.additionalInfo}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />

      <div className="summary-buttons">
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmBooking}
          disabled={
            !userInfo.fullName || !userInfo.email || !userInfo.phone
          }
          style={{ marginLeft: '10px' }}
        >
          Confirm Booking
        </Button>
      </div>
    </div>
  );
};

export default BookingSummary;
