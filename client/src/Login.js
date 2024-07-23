import React, {useState} from 'react';
import './styles/Common.css'
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('testID');
  const [password, setPassword] = useState('1234');
  const navigate = useNavigate();

  const goMain = () => {
    // 아이디를 세션에 저장
    sessionStorage.setItem('username', username);
    navigate('/main');
  };

  return (
    <div className='loginWrap'>
      <div className='box'>
        <div>ESupply Login</div>
        <div className='mt25'>
          <div className='mr10 mb5'>ID </div>
          <input type='text' value={username} onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div className='mt15'>
          <div className='mr10 mb5'>PW </div>
          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <button onClick={goMain} className='loginBtn'>Login</button>
      </div>
    </div>
  );
}

export default Login;
