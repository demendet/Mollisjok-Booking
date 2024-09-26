// src/components/BookingForm.js

import React, { useState, useEffect } from 'react';
import CabinCard from './CabinCard';
import CustomDatePicker from './CustomDatePicker';
import CurrentSelectionSummary from './CurrentSelectionSummary';
import GuestSelector from './GuestSelector';
import BookingSummary from './BookingSummary'; // Import BookingSummary
import { Stepper, Step, StepLabel } from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { differenceInCalendarDays } from 'date-fns';
import './BookingForm.css';
import AvailabilityGrid from './AvailabilityGrid';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
  } from '@mui/material';
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const BookingForm = ({ cabins }) => {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [extras, setExtras] = useState({ halfBoard: false, sauna: false });
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [unavailableCabins, setUnavailableCabins] = useState([]);
  const [filteredCabins, setFilteredCabins] = useState(cabins);
  const [step, setStep] = useState(0);

  // Hunting season dates and minimum stay
  const HUNTING_SEASON_START = { month: 9, day: 10 }; // September 10th
  const HUNTING_SEASON_END = { month: 9, day: 30 }; // September 30th
  const HUNTING_SEASON_MIN_STAY = 5; // Minimum 5 nights during hunting season

  // Function to check if dates fall within hunting season
  const isHuntingSeason = (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    const seasonStart = new Date(startDate.getFullYear(), 8, 10); // September 10th
    const seasonEnd = new Date(endDate.getFullYear(), 8, 30); // September 30th
    return startDate <= seasonEnd && endDate >= seasonStart;
  };
  
  const isMandatoryHalfBoardPeriod = (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    // March and April (months 2 and 3)
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
    return (
      (startMonth === 2 || startMonth === 3) ||
      (endMonth === 2 || endMonth === 3) ||
      isHuntingSeason(startDate, endDate)
    );
  };

  // Fetch unavailable cabins based on selected dates
  useEffect(() => {
    const fetchUnavailableCabins = async () => {
      if (!checkIn || !checkOut) {
        setUnavailableCabins([]);
        return;
      }
  
      // Fetch bookings that overlap with the selected dates
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('checkIn', '<', checkOut),
        where('checkOut', '>', checkIn)
      );
      const querySnapshot = await getDocs(q);
      const bookedCabinIds = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        bookedCabinIds.push(data.cabinId);
      });
      setUnavailableCabins(bookedCabinIds);
    };
  
    fetchUnavailableCabins();
  }, [checkIn, checkOut]);

  useEffect(() => {
    const availableCabins = cabins.filter((cabin) => {
      const isAvailable = !unavailableCabins.includes(cabin.id);
      const canAccommodateGuests = cabin.maxGuests >= guests;
      return isAvailable && canAccommodateGuests;
    });
    setFilteredCabins(availableCabins);
  }, [unavailableCabins, cabins, guests]);
  
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(1); // Move to BookingSummary step
  };


  const handleBack = () => {
    setStep(0); // Go back to BookingForm step
  };

  const handleExtraChange = (name, value) => {
    setExtras({ ...extras, [name]: value });
  };

  const handleDateChange = ({ checkIn, checkOut }) => {
    setCheckIn(checkIn);
    setCheckOut(checkOut);
    setSelectedCabin(null); // Reset selected cabin when dates change
  };

  const handleCabinSelect = (cabin) => {
    setSelectedCabin(cabin);
  };

  // Helper functions
  const isDateInRange = (
    startDate,
    endDate,
    startMonth,
    startDay,
    endMonth,
    endDay
  ) => {
    if (!startDate || !endDate) {
      return false;
    }
    const start = new Date(
      startDate.getFullYear(),
      startMonth - 1,
      startDay
    );
    const end = new Date(endDate.getFullYear(), endMonth - 1, endDay);
    return startDate <= end && endDate >= start;
  };

  const isPeakSeason = (startDate, endDate) => {
    if (!startDate || !endDate) {
      return false;
    }
    // Check if any of the dates fall in April weekends
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (
        currentDate.getMonth() === 3 && // April (0-indexed)
        (currentDate.getDay() === 5 || currentDate.getDay() === 6) // Friday or Saturday
      ) {
        return true;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return false;
  };

  // Check if booking meets minimum stay requirement
  const meetsMinimumStay = () => {
    if (!selectedCabin || !checkIn || !checkOut) return true;
    const days = differenceInCalendarDays(checkOut, checkIn);

    // Check for hunting season minimum stay
    if (isHuntingSeason(checkIn, checkOut)) {
      return days >= HUNTING_SEASON_MIN_STAY;
    }

    // Use cabin's minimum stay otherwise
    return days >= selectedCabin.policies.minimumStay;
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!selectedCabin || !checkIn || !checkOut) return 0;
    const days = differenceInCalendarDays(checkOut, checkIn); // Number of nights
  
    let total = selectedCabin.basePrice * days * guests;
  
    // Check if mandatory half-board applies
    const mandatoryHalfBoard = isMandatoryHalfBoardPeriod();
  
    if (mandatoryHalfBoard) {
      total += 450 * guests * days;
    } else if (extras.halfBoard) {
      total += 450 * guests * days;
    }
  
    if (extras.sauna) total += 200 * days;
  
    // Apply peak season surcharge during April weekends (if any)
    if (isPeakSeason(checkIn, checkOut)) {
      total *= 1.2; // 20% surcharge
    }
  
    return Math.round(total);
  };

  // Error message for capacity
  const capacityErrorMessage = () => {
    if (!selectedCabin) return null;
    if (selectedCabin.maxGuests < guests) {
      return `The selected cabin cannot accommodate ${guests} guests. Maximum capacity is ${selectedCabin.maxGuests}. Please select a different cabin or reduce the number of guests.`;
    }
    return null;
  };
  if (step === 1) {
    // Render BookingSummary component
    return (
      <BookingSummary
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
        selectedCabin={selectedCabin}
        totalPrice={calculateTotalPrice()}
        extras={extras}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="booking-form">
      <Stepper activeStep={0}>
        <Step>
          <StepLabel>Select Details</StepLabel>
        </Step>
        <Step>
          <StepLabel>Booking Summary</StepLabel>
        </Step>
      </Stepper>

      <div className="selection-container">
      <CustomDatePicker
  checkInDate={checkIn}
  checkOutDate={checkOut}
  onChange={handleDateChange}
/>

        <GuestSelector
  guests={guests}
  setGuests={setGuests}
  maxGuests={Math.max(...cabins.map((cabin) => cabin.maxGuests))}
/>

      </div>

      <Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="h6">Check Availability</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <AvailabilityGrid startDate={checkIn} />
  </AccordionDetails>
</Accordion>

      <div className="main-content">
        <div className="cabin-section">
          <h2>Select Cabin</h2>
          {filteredCabins.length === 0 && (
            <p>No cabins available for the selected dates and guest count.</p>
          )}
          <div className="cabin-list">
  {cabins.map((cabin) => (
    <CabinCard
      key={cabin.id}
      cabin={cabin}
      onSelect={() => handleCabinSelect(cabin)}
      isSelected={selectedCabin?.id === cabin.id}
      isUnavailable={unavailableCabins.includes(cabin.id)}
    />
  ))}
</div>
        </div>

        <div className="current-selection">
        <CurrentSelectionSummary
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          selectedCabin={selectedCabin}
          totalPrice={calculateTotalPrice()}
          unavailableCabins={unavailableCabins}
          errorMessage={
            capacityErrorMessage() ||
            (checkIn && checkOut && !meetsMinimumStay()
              ? isHuntingSeason(checkIn, checkOut)
                ? `Minimum stay of ${HUNTING_SEASON_MIN_STAY} nights is required during the hunting season.`
                : `Minimum stay of ${selectedCabin.policies.minimumStay} nights is required for this cabin.`
              : null)
          }
          onSubmit={handleSubmit}
          isSubmitDisabled={
            !selectedCabin ||
            !checkIn ||
            !checkOut ||
            !meetsMinimumStay() ||
            capacityErrorMessage() ||
            unavailableCabins.includes(selectedCabin?.id)
          }
          extras={extras}
          onExtraChange={handleExtraChange}
        />
      </div>
      </div>
    </div>
  );
};

export default BookingForm;
