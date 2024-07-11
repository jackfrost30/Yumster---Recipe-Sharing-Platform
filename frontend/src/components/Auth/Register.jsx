import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../styles/register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/user/register/', {
        username,
        password,
      });
      if (response.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      setError(
        'Failed to register. Please check your credentials and try again.'
      );
    }
  };

  //   return (
  //     <div className='register-container'>
  //       <h2>Register</h2>
  //       <form onSubmit={handleRegister}>
  //         <div>
  //           <label htmlFor='username'>Username:</label>
  //           <input
  //             type='text'
  //             id='username'
  //             value={username}
  //             onChange={(e) => setUsername(e.target.value)}
  //             required
  //           />
  //         </div>
  //         <div>
  //           <label htmlFor='password'>Password:</label>
  //           <input
  //             type='password'
  //             id='password'
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
  //             required
  //           />
  //         </div>
  //         {error && <p className='error'>{error}</p>}
  //         <button type='submit'>Register</button>
  //       </form>
  //     </div>
  //   );

  return (
    <div className='register-container'>
      <form onSubmit={handleRegister}>
        <div className='form-group'>
          <h2>Register</h2>
          <input
            type='text'
            placeholder='Username'
            id='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className='error'>{error}</p>}
        <button type='submit'>Register</button>
      </form>
    </div>
  );
};

export default Register;
