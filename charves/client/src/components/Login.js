// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';  // CSS 파일을 import

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const response = await axios.post('http://localhost:7943/login', {username, password});
        console.log(response);

        if (response.data.result === 'success') {
            onLogin(response.data);
        } else {
            alert('Login failed: ' + response.data.msg);
        }
    }catch(error){
        console.error('Login error', error);
        alert('An error occurred during login.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>니 이름이뭐니?:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>비번은? :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
