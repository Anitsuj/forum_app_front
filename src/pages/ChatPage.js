import React, { useEffect, useState } from 'react';
import MessagesSidebar from '../components/MessagesSidebar';
import { useStore } from '../store/myStore';
import http from '../plugins/http';
import { useParams } from 'react-router-dom';

function ChatPage() {
  const { user } = useStore((state) => state);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { username } = useParams();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await http.postWithToken(`messages/${username}`, {
          loggedInUser: user.username,
        });
        if (response.success) {
          setMessages(response.data);
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError('Error fetching chat.');
      }
    };

    if (user && user.username) {
      fetchMessages();
    }
  }, [user, username]);

  async function sendMessage() {
    const inputMessageValue = message.trim();

    if (!inputMessageValue) {
      setError('Message field is required.');
      return;
    }

    const data = {
      usernameWhoSends: user.username,
      usernameWhoGets: username,
      message: inputMessageValue,
    };

    try {
      const response = await http.postWithToken('sendMessage', data);
      if (response.success) {
        setMessages([...messages, response.data]);
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
    <div className='chat-page-wrapper'>
      <div className='chat-page'>
        <MessagesSidebar />
        <div className='chat-container'>
          <div className='chat-messages-container'>
            {messages.map((message, index) => {
              const createdAtDate = new Date(message.created_at);
              const formattedDate = createdAtDate.toLocaleDateString();
              const formattedTime = createdAtDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={index}
                  className={`chat-message ${
                    message.usernameWhoSends === user.username
                      ? 'own-message'
                      : 'other-message'
                  }`}
                >
                  <h4 className='message-sender'>{message.usernameWhoSends}</h4>
                  <p className='message-content'>{message.message}</p>
                  <p className='message-time'>
                    {formattedDate} {formattedTime}
                  </p>
                </div>
              );
            })}
          </div>
          <div className='chat-send-message'>
            <input
              type='text'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Message'
            />
            {error && <div className='error'>{error}</div>}
            <button className='primary-btn' onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
