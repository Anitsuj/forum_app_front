import React, { useState } from 'react';
import http from '../plugins/http';
import { useStore } from '../store/myStore';
import { useNavigate } from 'react-router';

function LogInForm() {
  const { setUser } = useStore((state) => state);
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const username = event.target.elements.username.value;
    const password1 = event.target.elements.password1.value;
    const loginCheckbox = event.target.elements.loginCheckbox.checked;
    const user = { username, password1 };

    try {
      const response = await http.postWithToken('login', user);
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('autoLogin', loginCheckbox);
        setUser({
          username: response.data.username,
          image: response.data.image,
          role: response.data.role,
        });
        navigate('/profile');
      } else {
        setError(response.message || 'Login error. Try again.');
      }
    } catch (error) {
      setError('Error. Try again.');
    }
  };

  return (
    <>
      <form onSubmit={handleLogin} className='login-form'>
        <div className='background-image' />
        <h1>Login</h1>
        <input type='text' name='username' placeholder='Username' required />
        <input
          type='password'
          name='password1'
          placeholder='Password'
          required
        />
        <div className='checkbox-container'>
          <input type='checkbox' name='loginCheckbox' className='auto-login' />
          <label htmlFor='auto-login'>Stay signed in</label>
        </div>
        <div className='error'>{error}</div>
        <button type='submit' className='primary-btn'>
          Login
        </button>
      </form>
    </>
  );
}

export default LogInForm;
