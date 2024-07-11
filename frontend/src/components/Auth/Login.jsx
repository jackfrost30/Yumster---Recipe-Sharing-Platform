import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';
import api from '../../api';
import '../../styles/login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    event.preventDefault();
    try {
      const response = await api.post('/api/token/', {
        username,
        password,
      });
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.access);
      navigate('/recipes');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  //   return (
  //     <div>
  //       <h2> Login </h2>
  //       <form onSubmit={handleLogin}>
  //         <input
  //           type='text'
  //           placeholder='Username'
  //           value={username}
  //           onChange={(e) => setUsername(e.target.value)}
  //         />
  //         <input
  //           type='password'
  //           placeholder='Password'
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //         />
  //         <button type='submit'>Login</button>
  //       </form>
  //     </div>
  //   );
  return (
    <div className='login-container'>
      <div className='login-box'>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type='submit'>Login</button>
        </form>
        <div className='signup-link'>
          <span>New here? </span>
          <button onClick={handleRegister} className='link-button'>
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
