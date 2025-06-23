import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from './firebaseConfig'; // Ensure this path is correct

import Login from './components/Login';
import TicketList from './components/TicketList';
import TicketView from './components/TicketView';
import TicketReply from './components/TicketReply';
import './App.css'; // We'll create this for basic styling

// Mock ticket data (replace with actual data fetching later)
const initialTickets = [
  {
    id: '1',
    subject: 'Issue with course content',
    status: 'Open',
    messages: [
      { sender: 'Learner', text: 'I am having trouble understanding module 3.', timestamp: new Date().setDate(new Date().getDate() - 2) },
      { sender: 'Instructor', text: 'Could you please specify which part of module 3?', timestamp: new Date().setDate(new Date().getDate() - 1) },
    ],
    lastUpdated: new Date().setDate(new Date().getDate() - 1)
  },
  {
    id: '2',
    subject: 'Question about assignment deadline',
    status: 'Closed',
    messages: [
      { sender: 'Learner', text: 'When is the assignment due?', timestamp: new Date().setDate(new Date().getDate() - 5) },
      { sender: 'Instructor', text: 'The deadline is this Friday.', timestamp: new Date().setDate(new Date().getDate() - 4) },
      { sender: 'Learner', text: 'Thank you!', timestamp: new Date().setDate(new Date().getDate() - 4) },
    ],
    lastUpdated: new Date().setDate(new Date().getDate() - 4)
  },
];

function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyingToTicket, setReplyingToTicket] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
      if (currentUser) {
        // Here you would typically fetch user-specific tickets
        // For now, we'll just use the initialTickets
        setTickets(initialTickets.sort((a,b) => b.lastUpdated - a.lastUpdated));
      } else {
        setTickets([]);
        setSelectedTicket(null);
        setReplyingToTicket(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (loggedInUser) => {
    // User state is already handled by onAuthStateChanged
    // console.log("Login success in App.js", loggedInUser);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // User state will be set to null by onAuthStateChanged
      console.log("User logged out");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setReplyingToTicket(null); // Close reply form if open
  };

  const handleShowReplyForm = (ticket) => {
    setSelectedTicket(ticket); // Ensure the correct ticket is selected
    setReplyingToTicket(ticket);
  };

  const handleCancelReply = () => {
    setReplyingToTicket(null);
  };

  const handleSubmitReply = (ticketId, replyText) => {
    // This is a mock submission. In a real app, you'd send this to a backend.
    setTickets(prevTickets =>
      prevTickets.map(t =>
        t.id === ticketId
          ? {
              ...t,
              messages: [...t.messages, { sender: 'Learner', text: replyText, timestamp: new Date().toISOString() }],
              status: 'Open', // Or 'Pending Learner' etc. depending on your flow
              lastUpdated: new Date().toISOString()
            }
          : t
      ).sort((a,b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)) // Re-sort after update
    );
    // Update selected ticket view if it's the one being replied to
    setSelectedTicket(prevSelected =>
      prevSelected && prevSelected.id === ticketId
      ? tickets.find(t => t.id === ticketId) // Get the updated ticket
      : prevSelected
    );
    setReplyingToTicket(null); // Close reply form
    console.log(`Replying to ticket ${ticketId} with: ${replyText}`);
  };

  if (loadingAuth) {
    return <div className="loading-container"><p>Loading...</p></div>; // Or a spinner component
  }

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>Learner Support Panel</h1>
          {user && (
            <div className="user-info">
              <span>Welcome, {user.displayName || user.email}</span>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          )}
        </header>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/" element={
            user ? (
              <div className="main-panel-layout">
                <div className="ticket-list-section">
                  <TicketList tickets={tickets} onSelectTicket={handleSelectTicket} />
                </div>
                <div className="ticket-details-section">
                  {replyingToTicket ? (
                    <TicketReply
                      ticket={replyingToTicket}
                      onSubmitReply={handleSubmitReply}
                      onCancelReply={handleCancelReply}
                    />
                  ) : (
                    <TicketView ticket={selectedTicket} onReply={handleShowReplyForm} />
                  )}
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
