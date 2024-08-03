//import logo from './logo.svg';
//import './App.css';
import React, { useState } from 'react';
import Login from './components/Login';
import Main from './components/Main';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLogin = (data) => {
    setUserData(data);
    setIsLoggedIn(true);
  };

  return (
    <div>
      {isLoggedIn ? <Main userData={userData}/> : <Login onLogin={handleLogin} />}
    </div>  
  );
}

export default App;
