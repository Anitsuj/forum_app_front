import React, { useEffect, useState } from 'react';
import MessagesSidebar from '../components/MessagesSidebar';
import http from '../plugins/http';
import ChatPage from './ChatPage';
import { Routes, Route } from 'react-router-dom';
import { useStore } from '../store/myStore';

function MessagesPage() {
  const { setAllUsers } = useStore((state) => state);
  const [error, setError] = useState('');

  async function fetchAllUsers() {
    try {
      const response = await http.get(`getAllUsers`);
      if (response.success) {
        setAllUsers(response.data);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Error fetching discussions.');
    }
  }

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className='messages-page-wrapper'>
      <div className='messages-page'>
        <MessagesSidebar />
        <Routes>
          <Route path='/:username' element={<ChatPage />} />
        </Routes>
        {error && <div className='error'>{error}</div>}
      </div>
    </div>
  );
}

export default MessagesPage;
