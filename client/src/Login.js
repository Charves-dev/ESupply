import React from 'react';
import './styles/Common.css'
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const goMain = () => {
    navigate('/main');
  };

  return (
    <div className='loginWrap'>
      <div className='box'>
        <div>ESupply Login</div>
        <div className='mt25'>
          <div className='mr10 mb5'>ID </div>
          <input type='text' value={'testID'}/>
        </div>
        <div className='mt15'>
          <div className='mr10 mb5'>PW </div>
          <input type='password' value={1234}/>
        </div>
        <button onClick={goMain} className='loginBtn'>Login</button>
      </div>
    </div>
  );
}

export default Login;
