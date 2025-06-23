import React from 'react';

function TicketList({ tickets, onSelectTicket }) {
  return (
    <div className="ticket-list-container">
      <h2>Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets yet.</p>
      ) : (
        <ul className="ticket-list">
          {tickets.map((ticket) => (
            <li key={ticket.id} onClick={() => onSelectTicket(ticket)} className="ticket-item">
              <div className="ticket-subject">{ticket.subject}</div>
              <div className={`ticket-status status-${ticket.status.toLowerCase()}`}>{ticket.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TicketList;
