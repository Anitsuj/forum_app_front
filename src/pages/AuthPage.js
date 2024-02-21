import React from 'react';
import { useNavigate } from 'react-router-dom';

function AuthPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className='auth-page'>
      <div className='background-image' />
      <div className='auth-page-welcome'>
        <h1>Welcome to the Forum!</h1>
        <h2>
          In here you would be able to create topics and discuss them. Get your
          answer about anything!
        </h2>
      </div>
      <div className='login-register-btns-container'>
        <button onClick={handleLogin} className='primary-btn'>
          Login
        </button>
        <button onClick={handleRegister} className='primary-btn'>
          Register
        </button>
      </div>
    </div>
  );
}

export default AuthPage;
