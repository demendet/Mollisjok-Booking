// src/components/CustomDatePicker.js

import React, { useState, useEffect, useRef } from 'react';
import './CustomDatePicker.css';

const CustomDatePicker = ({ checkInDate, checkOutDate, onChange }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(checkInDate);
  const [selectedEndDate, setSelectedEndDate] = useState(checkOutDate);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);
  const calendarRef = useRef(null);

  const handleDateClick = (date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
      onChange({ checkIn: date, checkOut: null });
    } else if (selectedStartDate && !selectedEndDate) {
      if (date < selectedStartDate) {
        setSelectedStartDate(date);
        onChange({ checkIn: date, checkOut: null });
      } else {
        setSelectedEndDate(date);
        onChange({ checkIn: selectedStartDate, checkOut: date });
      }
    }
  };

  const handleMouseEnter = (date) => {
    if (selectedStartDate && !selectedEndDate) {
      setHoveredDate(date);
    }
  };

  const getDatesInRange = () => {
    if (!selectedStartDate || (!selectedEndDate && !hoveredDate)) return [];
    const start = selectedStartDate;
    const end = selectedEndDate || hoveredDate || start;
    const dates = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const toggleCalendar = () => setShowCalendar(!showCalendar);

  const nextMonth = (e) => {
    e.stopPropagation();
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  const prevMonth = (e) => {
    e.stopPropagation();
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };

  const daysInMonth = (month) => {
    const date = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    return date.getDate();
  };

  // Function to check if date is disabled
  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    // Disable past dates
    if (date < today) {
      return true;
    }

    // Disable dates in January and February
    if (date.getMonth() === 0 || date.getMonth() === 1) {
      return true;
    }

    // Example: Disable dates from December 1st to December 31st (if needed)
    // const disabledStart = new Date(date.getFullYear(), 11, 1); // December 1st
    // const disabledEnd = new Date(date.getFullYear(), 11, 31);  // December 31st
    // if (date >= disabledStart && date <= disabledEnd) {
    //   return true;
    // }

    return false;
  };

  const renderCalendar = () => {
    const months = [
      new Date(currentMonth.getFullYear(), currentMonth.getMonth()),
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    ];

    const dateElements = months.map((month) => {
      const days = [];
      const firstDayIndex = new Date(
        month.getFullYear(),
        month.getMonth(),
        1
      ).getDay();

      // Adjust for Sunday as the first day of the week
      const emptyCells = (firstDayIndex + 6) % 7;

      for (let i = 0; i < emptyCells; i++) {
        days.push(<div key={`empty-${i}`} className="date-cell empty-cell"></div>);
      }

      for (let i = 1; i <= daysInMonth(month); i++) {
        const currentDate = new Date(month.getFullYear(), month.getMonth(), i);
        const isSelected = getDatesInRange().some(
          (date) => date.toDateString() === currentDate.toDateString()
        );
        const isStartDate =
          selectedStartDate &&
          currentDate.toDateString() === selectedStartDate.toDateString();
        const isEndDate =
          selectedEndDate &&
          currentDate.toDateString() === selectedEndDate.toDateString();

        const isDisabled = isDateDisabled(currentDate);

        days.push(
          <div
            key={currentDate.getTime()}
            className={`date-cell ${isSelected ? 'selected' : ''} ${
              isDisabled ? 'disabled' : ''
            } ${isStartDate ? 'start' : ''} ${isEndDate ? 'end' : ''}`}
            onClick={!isDisabled ? () => handleDateClick(currentDate) : null}
            onMouseEnter={!isDisabled ? () => handleMouseEnter(currentDate) : null}
          >
            {i}
          </div>
        );
      }

      return (
        <div className="month" key={month.getTime()}>
          <h3>
            {month.toLocaleString('no-NO', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="dates-grid">{days}</div>
        </div>
      );
    });

    return (
      <div className="calendar" ref={calendarRef}>
        <div className="calendar-header">
          <button type="button" className="arrow-button" onClick={prevMonth}>
            &#10094;
          </button>
          <div className="months-container">{dateElements}</div>
          <button type="button" className="arrow-button" onClick={nextMonth}>
            &#10095;
          </button>
          <button type="button" className="close-button" onClick={toggleCalendar}>
            &times;
          </button>
        </div>
      </div>
    );
  };

  const selectedDateRange =
    selectedStartDate && selectedEndDate
      ? `${selectedStartDate.toLocaleDateString('no-NO')} - ${selectedEndDate.toLocaleDateString(
          'no-NO'
        )}`
      : 'Select Dates';

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  // Update selected dates when props change
  useEffect(() => {
    setSelectedStartDate(checkInDate);
    setSelectedEndDate(checkOutDate);
  }, [checkInDate, checkOutDate]);

  return (
    <div className="date-picker-container">
      <div className="date-selection" onClick={toggleCalendar}>
        {selectedDateRange}
      </div>
      {showCalendar && renderCalendar()}
    </div>
  );
};

export default CustomDatePicker;
