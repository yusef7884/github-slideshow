import React from 'react';

function TicketView({ ticket, onReply }) {
  if (!ticket) {
    return <div className="ticket-view-container no-ticket-selected"><p>Select a ticket to view details.</p></div>;
  }

  return (
    <div className="ticket-view-container">
      <h2>{ticket.subject}</h2>
      <div className={`ticket-status-view status-${ticket.status.toLowerCase()}`}>{ticket.status}</div>
      <div className="ticket-messages">
        {ticket.messages.map((message, index) => (
          <div key={index} className={`message message-${message.sender.toLowerCase()}`}>
            <p><strong>{message.sender}:</strong> {message.text}</p>
            <span className="message-timestamp">{new Date(message.timestamp).toLocaleString()}</span>
          </div>
        ))}
      </div>
      {ticket.status.toLowerCase() !== 'closed' && (
        <button onClick={() => onReply(ticket)} className="reply-button">
          Reply
        </button>
      )}
    </div>
  );
}

export default TicketView;
