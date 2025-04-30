import React, { useState, useContext } from 'react';
import axios from 'axios';
import {jwtDecode } from 'jwt-decode';
import { AuthContext } from '../context/AuthContext';

export interface TokenPayload {
  userId: string;
  userName: string;
  userGroup: string[];
  exp: number;
  iat: number;
}

const Login: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext); // use login from context

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        userName: userName, 
        password,
      });

      const token = response.data.token;
      const decoded: TokenPayload = jwtDecode(token);

      localStorage.setItem('token', token);
      login(token); 

      console.log('Logged in as userId:', decoded.userId);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Login</h2>
        <a href="/">BACK TO ROOT</a>
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button onClick={handleLogin}>Login</button>
      </header>
    </div>
  );
};

export default Login;

