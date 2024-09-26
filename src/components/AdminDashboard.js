// src/components/AdminDashboard.js

import React, { useState, useEffect, useMemo } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Modal,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import './AdminDashboard.css';
import cabinsData from '../data/cabinsData';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'timestamp',
    direction: 'desc',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize cabinIdToName to prevent re-creation on each render
  const cabinIdToName = useMemo(() => {
    const mapping = {};
    cabinsData.forEach((cabin) => {
      mapping[cabin.id] = cabin.name;
    });
    return mapping;
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const bookingsData = [];
        querySnapshot.forEach((doc) => {
          bookingsData.push({ id: doc.id, ...doc.data() });
        });
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to fetch bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error signing out:', error);
        setError('Failed to logout. Please try again.');
      });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setPage(0); // Reset to first page on new search
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Compute filtered and sorted bookings
  const filteredAndSortedBookings = useMemo(() => {
    let filtered = bookings;

    if (searchQuery) {
      filtered = bookings.filter((booking) => {
        const cabinName = cabinIdToName[booking.cabinId]?.toLowerCase() || '';
        const userName = booking.userInfo?.fullName?.toLowerCase() || '';
        return cabinName.includes(searchQuery) || userName.includes(searchQuery);
      });
    }

    if (sortConfig !== null) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested objects
        if (sortConfig.key === 'cabinId') {
          aValue = cabinIdToName[a.cabinId] || '';
          bValue = cabinIdToName[b.cabinId] || '';
        } else if (sortConfig.key === 'userInfo') {
          aValue = a.userInfo?.fullName || '';
          bValue = b.userInfo?.fullName || '';
        }

        // If the key is 'checkIn' or 'checkOut', ensure they're Date objects
        if (sortConfig.key === 'checkIn' || sortConfig.key === 'checkOut') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [bookings, searchQuery, sortConfig, cabinIdToName]);

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteDoc(doc(db, 'bookings', bookingId));
        setBookings(bookings.filter((booking) => booking.id !== bookingId));
      } catch (error) {
        console.error('Error deleting booking:', error);
        setError('Failed to delete booking. Please try again.');
      }
    }
  };

  // Summary statistics
  const totalRevenue = filteredAndSortedBookings.reduce(
    (acc, booking) => acc + booking.totalPrice,
    0
  );
  const totalBookings = filteredAndSortedBookings.length;
  const totalGuests = filteredAndSortedBookings.reduce(
    (acc, booking) => acc + booking.guests,
    0
  );

  // Styles for the modal
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 500,
    bgcolor: 'background.paper',
    border: '2px solid #1976d2',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h2>Admin Dashboard</h2>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </header>

      {/* Display Error Message */}
      {error && (
        <div className="error-message">
          <Typography color="error">{error}</Typography>
        </div>
      )}

      {/* Display Loading Spinner */}
      {loading ? (
        <div className="loading-container">
          <CircularProgress />
        </div>
      ) : (
        <>
          {/* Summary Statistics */}
          <div className="summary-stats">
            <div className="stat">
              <strong>Total Bookings:</strong> {totalBookings}
            </div>
            <div className="stat">
              <strong>Total Guests:</strong> {totalGuests}
            </div>
            <div className="stat">
              <strong>Total Revenue:</strong> {totalRevenue} kr
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <TextField
              label="Search by Cabin or User"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearch}
              fullWidth
            />
          </div>

          {/* Bookings Table */}
          <TableContainer component={Paper} className="table-container">
            <Table aria-label="bookings table">
              <TableHead>
                <TableRow>
                  <TableCell
                    onClick={() => handleSort('id')}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>Booking ID</strong>
                    {sortConfig.key === 'id' ? (
                      sortConfig.direction === 'asc' ? ' ▲' : ' ▼'
                    ) : null}
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('cabinId')}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>Cabin Name</strong>
                    {sortConfig.key === 'cabinId' ? (
                      sortConfig.direction === 'asc' ? ' ▲' : ' ▼'
                    ) : null}
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('checkIn')}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>Check-in</strong>
                    {sortConfig.key === 'checkIn' ? (
                      sortConfig.direction === 'asc' ? ' ▲' : ' ▼'
                    ) : null}
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('checkOut')}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>Check-out</strong>
                    {sortConfig.key === 'checkOut' ? (
                      sortConfig.direction === 'asc' ? ' ▲' : ' ▼'
                    ) : null}
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('guests')}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>Guests</strong>
                    {sortConfig.key === 'guests' ? (
                      sortConfig.direction === 'asc' ? ' ▲' : ' ▼'
                    ) : null}
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('totalPrice')}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>Total Price</strong>
                    {sortConfig.key === 'totalPrice' ? (
                      sortConfig.direction === 'asc' ? ' ▲' : ' ▼'
                    ) : null}
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('userInfo')}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>User Info</strong>
                    {sortConfig.key === 'userInfo' ? (
                      sortConfig.direction === 'asc' ? ' ▲' : ' ▼'
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedBookings
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((booking) => {
                    const formattedCheckIn = booking.checkIn.toDate
                      ? booking.checkIn.toDate().toLocaleDateString('no-NO')
                      : new Date(booking.checkIn).toLocaleDateString('no-NO');
                    const formattedCheckOut = booking.checkOut.toDate
                      ? booking.checkOut.toDate().toLocaleDateString('no-NO')
                      : new Date(booking.checkOut).toLocaleDateString('no-NO');
                    const cabinName =
                      cabinIdToName[booking.cabinId] || 'Unknown Cabin';

                    return (
                      <TableRow
                        key={booking.id}
                        hover
                        onClick={() => openModal(booking)}
                        className="table-row"
                        style={{ cursor: 'pointer' }}
                      >
                        <TableCell>{booking.id}</TableCell>
                        <TableCell>{cabinName}</TableCell>
                        <TableCell>{formattedCheckIn}</TableCell>
                        <TableCell>{formattedCheckOut}</TableCell>
                        <TableCell>{booking.guests}</TableCell>
                        <TableCell>{booking.totalPrice} kr</TableCell>
                        <TableCell>
                          {booking.userInfo
                            ? `${booking.userInfo.fullName}, ${booking.userInfo.email}`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering the modal
                              handleDelete(booking.id);
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredAndSortedBookings.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />

          {/* Booking Details Modal */}
          {selectedBooking && (
            <Modal
              open={Boolean(selectedBooking)}
              onClose={closeModal}
              aria-labelledby="booking-details-title"
              aria-describedby="booking-details-description"
            >
              <Box sx={modalStyle}>
                <Typography
                  id="booking-details-title"
                  variant="h6"
                  component="h2"
                >
                  Booking Details
                </Typography>
                <Typography id="booking-details-description" sx={{ mt: 2 }}>
                  <strong>Booking ID:</strong> {selectedBooking.id}
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  <strong>Cabin:</strong>{' '}
                  {cabinIdToName[selectedBooking.cabinId] || 'Unknown Cabin'}
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  <strong>Check-in:</strong>{' '}
                  {selectedBooking.checkIn.toDate
                    ? selectedBooking.checkIn.toDate().toLocaleDateString('no-NO')
                    : new Date(selectedBooking.checkIn).toLocaleDateString('no-NO')}
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  <strong>Check-out:</strong>{' '}
                  {selectedBooking.checkOut.toDate
                    ? selectedBooking.checkOut.toDate().toLocaleDateString('no-NO')
                    : new Date(selectedBooking.checkOut).toLocaleDateString('no-NO')}
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  <strong>Guests:</strong> {selectedBooking.guests}
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  <strong>Total Price:</strong> {selectedBooking.totalPrice} kr
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  <strong>User Information:</strong>{' '}
                  {selectedBooking.userInfo
                    ? `${selectedBooking.userInfo.fullName}, ${selectedBooking.userInfo.email}, ${selectedBooking.userInfo.phone}`
                    : 'N/A'}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={closeModal}
                  sx={{ mt: 3 }}
                >
                  Close
                </Button>
              </Box>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
