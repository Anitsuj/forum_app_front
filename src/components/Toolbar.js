import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/myStore';

function Toolbar() {
  const { setUser } = useStore((state) => state);
  const { unreadMessages } = useStore((state) => state);
  const navigate = useNavigate();

  function logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('autoLogin');
    setUser(null);
    navigate('/');
  }

  return (
    <div className='toolbar-wrapper'>
      <div className='toolbar'>
        <div className='toolbar-links-container'>
          <Link to='/profile'>Profile</Link>
          <Link to='/forum'>Forum</Link>
          <Link to='/messages'>
            Messages(
            <span
              className={
                unreadMessages === 0
                  ? 'unread-messages-number-green'
                  : 'unread-messages-number-pink'
              }
            >
              {unreadMessages}
            </span>
            )
          </Link>
        </div>
        <button className='logout-btn' onClick={logOut}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
