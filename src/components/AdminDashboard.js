// src/components/AdminDashboard.js

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { Button } from '@mui/material';
import './AdminDashboard.css';
import cabinsData from '../data/cabinsData';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const bookingsData = [];
      querySnapshot.forEach((doc) => {
        bookingsData.push({ id: doc.id, ...doc.data() });
      });
      setBookings(bookingsData);
    };

    fetchBookings();
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      window.location.reload();
    });
  };

  const cabinIdToName = {};
  cabinsData.forEach((cabin) => {
    cabinIdToName[cabin.id] = cabin.name;
  });
  

  return (
  <div className="admin-dashboard">
    <h2>Admin Dashboard</h2>
    <Button variant="contained" color="secondary" onClick={handleLogout}>
      Logout
    </Button>
    <table className="bookings-table">
      <thead>
        <tr>
          <th>Booking ID</th>
          <th>Cabin ID</th>
          <th>Cabin Name</th>
          <th>Check-in</th>
          <th>Check-out</th>
          <th>Guests</th>
          <th>Total Price</th>
          <th>User Info</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((booking) => {
          const formattedCheckIn = booking.checkIn.toDate
            ? booking.checkIn.toDate().toLocaleDateString('no-NO')
            : booking.checkIn.toLocaleDateString('no-NO');
          const formattedCheckOut = booking.checkOut.toDate
            ? booking.checkOut.toDate().toLocaleDateString('no-NO')
            : booking.checkOut.toLocaleDateString('no-NO');
          const cabinName = cabinIdToName[booking.cabinId] || 'Unknown Cabin';

          return (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.cabinId}</td>
              <td>{cabinName}</td>
              <td>{formattedCheckIn}</td>
              <td>{formattedCheckOut}</td>
              <td>{booking.guests}</td>
              <td>{booking.totalPrice} kr</td>
              <td>
                {booking.userInfo
                  ? `${booking.userInfo.fullName}, ${booking.userInfo.email}`
                  : 'N/A'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
};

export default AdminDashboard;
