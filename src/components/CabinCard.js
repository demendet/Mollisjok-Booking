// src/components/CabinCard.js

import React, { useState, useEffect } from 'react';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Kitchen, SmokeFree, Person } from '@mui/icons-material';
import './CabinCard.css';

const CabinCard = ({ cabin, onSelect, isSelected, isUnavailable }) => {
  const [availability, setAvailability] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef, where('cabinId', '==', cabin.id));
        const querySnapshot = await getDocs(q);
        const bookings = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          bookings.push({
            checkIn: data.checkIn.toDate(),
            checkOut: data.checkOut.toDate(),
          });
        });
        setAvailability(bookings);
      } catch (error) {
        console.error('Error fetching availability:', error);
      }
    };

    fetchAvailability();
  }, [cabin.id]);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  return (
    <div
    className={`cabin-card ${isSelected ? 'selected-cabin' : ''} ${
      isUnavailable ? 'unavailable' : ''
    }`}
    onClick={!isUnavailable ? onSelect : null}
  >
      {cabin.imageUrl && <img src={cabin.imageUrl} alt={cabin.name} />}
      <div className="cabin-details">
        <h3>{cabin.name}</h3>
        <div className="cabin-info">
          <div className="icon-background">
            <Person className="icon" />
            <span>{cabin.maxGuests}</span>
          </div>
          {cabin.refrigerator && (
            <div className="icon-background">
              <Kitchen className="icon" />
            </div>
          )}
          {cabin.nonSmoking && (
            <div className="icon-background">
              <SmokeFree className="icon" />
            </div>
          )}
        </div>
        <p>{cabin.description}</p>
        <p>Price per night per person: {cabin.basePrice} kr</p>
        {isUnavailable && (
        <p className="unavailable-text">Unavailable for selected dates</p>
      )}
        
      </div>
    </div>
  );
};

const AvailabilityCalendar = ({ bookings }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  const prevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };

  const isDateBooked = (date) => {
    return bookings.some(
      (booking) =>
        date >= booking.checkIn.setHours(0, 0, 0, 0) &&
        date < booking.checkOut.setHours(0, 0, 0, 0)
    );
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();

    const firstDayIndex = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();

    // Adjust for Monday as the first day of the week
    const emptyCells = (firstDayIndex + 6) % 7;

    const days = [];

    for (let i = 0; i < emptyCells; i++) {
      days.push(<div key={`empty-${i}`} className="date-cell empty-cell"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        i
      );

      const isBooked = isDateBooked(currentDate);

      days.push(
        <div
          key={currentDate.getTime()}
          className={`date-cell ${isBooked ? 'booked' : 'available'}`}
        >
          {i}
        </div>
      );
    }

    return (
      <div className="availability-calendar">
        <div className="calendar-header">
          <Button onClick={prevMonth}>&#10094;</Button>
          <Typography variant="h6">
            {currentMonth.toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </Typography>
          <Button onClick={nextMonth}>&#10095;</Button>
        </div>
        <div className="dates-grid">{days}</div>
        <div className="calendar-legend">
          <div>
            <span className="legend-color booked"></span> Booked
          </div>
          <div>
            <span className="legend-color available"></span> Available
          </div>
        </div>
      </div>
    );
  };

  return renderCalendar();
};

export default CabinCard;
