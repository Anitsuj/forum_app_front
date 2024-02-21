import React, { useEffect, useState } from 'react';
import { useStore } from '../store/myStore';
import { useNavigate } from 'react-router-dom';
import http from '../plugins/http';

function MessagesSidebar() {
  const { user } = useStore((state) => state);
  const { setUnreadMessages } = useStore((state) => state);
  const { allUsers } = useStore((state) => state);
  const { message, setMessage } = useStore((state) => state);
  const [uniqueUsers, setUniqueUsers] = useState([]);
  const [error, setError] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (message && user) {
      const uniqueUsernames = Array.from(
        new Set(
          message
            .filter((msg) => msg.usernameWhoGets === user.username)
            .map((msg) => msg.usernameWhoSends)
        )
      );
      setUniqueUsers(uniqueUsernames);
    }
  }, [message, user]);

  useEffect(() => {
    if (user?.username) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const response = await http.get('getAllMessages');
      if (response.success) {
        setMessage(response.data);
        updateUnreadMessages(response.data);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Error fetching messages.');
    }
  };

  const updateUnreadMessages = (messages) => {
    if (messages && messages.length > 0) {
      const unreadCount = messages.filter(
        (msg) => msg.usernameWhoGets === user.username && msg.unreadMessage
      ).length;
      setUnreadMessages(unreadCount);
    }
  };

  const handleUserClick = async (username) => {
    navigate(`/messages/${username}`);
    await fetchMessages();
  };

  if (uniqueUsers.length === 0 || !allUsers) {
    return null;
  }

  return (
    <div className='messages-sidebar'>
      <h3>Messages</h3>
      {uniqueUsers.map((username, index) => {
        const sender = allUsers.find((u) => u.username === username);
        const hasUnreadMessages = message.some(
          (msg) =>
            msg.usernameWhoSends === username &&
            msg.usernameWhoGets === user.username &&
            msg.unreadMessage
        );
        return (
          <div
            className={`messages-sidebar-user ${
              hasUnreadMessages ? 'unread-messages' : ''
            }`}
            key={index}
            onClick={() => handleUserClick(username)}
          >
            <img src={sender?.image} alt='User profile image' />
            <h3>{username}</h3>
          </div>
        );
      })}
      {error && <div className='error'>{error}</div>}
    </div>
  );
}

export default MessagesSidebar;
