// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const response = await axios.post('http://localhost:7943/login', {username, password});
        console.log(response);
        //alert(response);

        if (response.data.result === 'success') {
            onLogin(response.data);
        } else {
            alert('Login failed: ' + response.data.msg);
        }
    }catch(error){
        console.error('Login error', error);
        alert('An error occurred during login.');
    }
    // 여기에 실제 로그인 로직을 추가할 수 있습니다.
    // if (username === 'charves' && password === '1234') {
    //   onLogin();
    // } else {
    //   alert('Invalid credentials');
    // }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
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
