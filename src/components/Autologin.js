import React, { useEffect } from 'react';
import http from '../plugins/http';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/myStore';

function Autologin() {
  const { user, setUser } = useStore((state) => state);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const autoLogin = localStorage.getItem('autoLogin');

  useEffect(() => {
    if (autoLogin !== 'true') {
      localStorage.removeItem('token');
      navigate('/');
    } else {
      if (token && !user?.username) {
        http
          .postWithToken('autoLogin', { token })
          .then((response) => {
            setUser({
              username: response.data.username,
              image: response.data.image,
              role: response.data.role,
            });
            navigate('/profile');
          })
          .catch((error) => {});
      }
    }
  }, []);

  return null;
}

export default Autologin;
