import React, { useState } from 'react';
import http from '../plugins/http';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.elements.username.value;
    const password1 = event.target.elements.password1.value;
    const password2 = event.target.elements.password2.value;
    const role = event.target.elements.userType.value;

    const user = { username, password1, password2, role };
    try {
      const response = await http.postWithToken('register', user);
      if (response.success) {
        setError('Registration is successful.');
        setSuccess(true);
      } else {
        setError(response.message);
        setSuccess(false);
      }
    } catch (error) {
      setError('Error on registration.');
      setSuccess(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className='register-form'>
      <div className='background-image' />
      <h1>Register</h1>
      <input type='text' name='username' placeholder='Username' required />
      <input type='password' name='password1' placeholder='Password' required />
      <input
        type='password'
        name='password2'
        placeholder='Repeat password'
        required
      />
      <p>Please choose your role:</p>
      <select name='userType'>
        <option value='admin'>Admin</option>
        <option value='user'>User</option>
      </select>
      {error && <div className='error'>{error}</div>}
      {!success ? (
        <button type='submit' className='primary-btn'>
          Register
        </button>
      ) : (
        <button onClick={() => navigate('/login')} className='primary-btn'>
          Login
        </button>
      )}
    </form>
  );
}

export default RegisterForm;
