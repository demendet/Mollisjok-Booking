// src/components/AvailabilityGrid.js

import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import cabinsData from '../data/cabinsData';
import './AvailabilityGrid.css';

const AvailabilityGrid = ({ startDate: propsStartDate }) => {
  const [startDate, setStartDate] = useState(propsStartDate || new Date());
  const [bookings, setBookings] = useState([]);
  const [dates, setDates] = useState([]);

  // Update startDate when propsStartDate changes
  useEffect(() => {
    if (propsStartDate) {
      setStartDate(propsStartDate);
    }
  }, [propsStartDate]);

  useEffect(() => {
    const fetchBookings = async () => {
      const bookingsRef = collection(db, 'bookings');
      const querySnapshot = await getDocs(bookingsRef);
      const bookingsData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Ensure that checkIn and checkOut are valid Timestamps
        if (data.checkIn && data.checkOut) {
          bookingsData.push({
            cabinId: data.cabinId,
            checkIn: data.checkIn.toDate(),
            checkOut: data.checkOut.toDate(),
          });
        } else {
          console.warn(`Booking ${doc.id} has invalid checkIn/checkOut dates.`);
        }
      });
      setBookings(bookingsData);
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    // Generate an array of dates starting from startDate
    const numDaysToShow = 15; // Adjust as needed
    const datesArray = [];
    const date = new Date(startDate);
    for (let i = 0; i < numDaysToShow; i++) {
      datesArray.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    setDates(datesArray);
  }, [startDate]);

  const isCabinBookedOnDate = (cabinId, date) => {
    const currentDate = new Date(date).setHours(0, 0, 0, 0);
    return bookings.some((booking) => {
      const checkInDate = booking.checkIn.setHours(0, 0, 0, 0);
      const checkOutDate = booking.checkOut.setHours(0, 0, 0, 0);
      return (
        booking.cabinId === cabinId &&
        currentDate >= checkInDate &&
        currentDate < checkOutDate
      );
    });
  };

  const prevDates = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() - 7);
    setStartDate(newStartDate);
  };

  const nextDates = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() + 7);
    setStartDate(newStartDate);
  };

  return (
    <div className="availability-grid">
      <div className="grid-header">
        <div className="arrow-buttons">
          <button onClick={prevDates}>&#10094;</button>
          <span>Availability</span>
          <button onClick={nextDates}>&#10095;</button>
        </div>
      </div>
      <div className="grid-container">
        {/* Adjust the grid to be more responsive */}
        <div className="grid-row header-row">
          <div className="grid-cell cabin-cell">Cabin</div>
          {dates.map((date) => (
            <div key={date.toISOString()} className="grid-cell date-cell">
              {date.toLocaleDateString('no-NO', { day: 'numeric', month: 'short' })}
            </div>
          ))}
        </div>
        {cabinsData.map((cabin) => (
          <div key={cabin.id} className="grid-row">
            <div className="grid-cell cabin-cell">
              {cabin.name} (Max {cabin.maxGuests})
            </div>
            {dates.map((date) => {
              const isBooked = isCabinBookedOnDate(cabin.id, date);
              const statusText = isBooked ? 'Booked' : 'Available';
              return (
                <div
                  key={`${cabin.id}-${date.toISOString()}`}
                  className={`grid-cell date-cell ${isBooked ? 'booked' : 'available'}`}
                  data-status={statusText}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="legend">
        <div>
          <span className="legend-color available"></span> Available
        </div>
        <div>
          <span className="legend-color booked"></span> Booked
        </div>
      </div>
    </div>
  );
};

export default AvailabilityGrid;
