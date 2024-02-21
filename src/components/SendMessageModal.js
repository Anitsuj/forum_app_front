import React, { useState } from 'react';
import { useStore } from '../store/myStore';
import http from '../plugins/http';

function SendMessageModal({ isOpen, onClose, recipient }) {
  const { user } = useStore((state) => state);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function sendMessage() {
    const inputMessageValue = message.trim();

    if (!inputMessageValue) {
      setError('Message field is required.');
      return;
    }

    const data = {
      usernameWhoSends: user.username,
      usernameWhoGets: recipient,
      message: inputMessageValue,
    };

    try {
      const response = await http.postWithToken('sendMessage', data);
      if (response.success) {
        setMessage('');
        setError('Your message has been sent.');
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Error on sending message.');
    }
  }

  return (
    <div className='send-message-modal-overlay'>
      <div className='send-message-modal'>
        <h2>Message to: {recipient}</h2>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Message'
        />
        {error && <div className='error'>{error}</div>}
        <div className='send-message-modal-buttons-container'>
          <button className='primary-btn' onClick={sendMessage}>
            Send message
          </button>
          <button className='primary-btn' onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SendMessageModal;
