import React, { useState } from 'react';

function TicketReply({ ticket, onSubmitReply, onCancelReply }) {
  const [replyText, setReplyText] = useState('');

  if (!ticket) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      onSubmitReply(ticket.id, replyText);
      setReplyText('');
    }
  };

  return (
    <div className="ticket-reply-container">
      <h3>Reply to: {ticket.subject}</h3>
      <form onSubmit={handleSubmit} className="reply-form">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your reply..."
          rows="5"
          required
          className="reply-textarea"
        />
        <div className="reply-actions">
          <button type="submit" className="submit-reply-button">Send Reply</button>
          <button type="button" onClick={onCancelReply} className="cancel-reply-button">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default TicketReply;
