// src/App.js

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import BookingForm from './components/BookingForm';
import BookingSummary from './components/BookingSummary';
import cabinsData from './data/cabinsData';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<BookingForm cabins={cabinsData} />} />
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <AdminDashboard />
            ) : (
              <AdminLogin onLogin={() => navigate('/admin')} />
            )
          }
        />
        {/* Add other routes as needed */}
      </Routes>
    </div>
  );
};

export default App;