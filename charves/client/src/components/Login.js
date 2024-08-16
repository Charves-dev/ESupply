// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import '../Common.css';  // CSS 파일을 import

const Login = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const response = await axios.post('http://localhost:7943/login', {userId, password});
        if (response.data.result === 'success') {
          // onLogin 이란 함수는 Login 컴포넌트의 속성이된다. 
          // 해당 onLogin에 대한 실제 구현부는 해당 컴포넌트를 사용하는곳에서 명시한다.(App.js를 잘 보드라고)
          onLogin(response.data);                 
        } else {
          alert('Login failed: ' + response.data.msg);
        }
    }catch(error){
        // console.log('Login error', error);
        // alert('An error occurred during login.');
        console.log(error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>아이디 :</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div>
          <label>비밀번호 :</label>
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
