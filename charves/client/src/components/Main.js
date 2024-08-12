// src/components/Main.js
import React, { useState } from 'react';
import axios from 'axios';
import CompanyList from './CustomerList';
import { useEffect } from 'react';


const Main = ({userData}) => {
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [customerData, setCustomerData] = useState([]);

  // const fetchCustomerData = async () => {
    // const response = await axios.post('http://localhost:7943/customer/list');
    // setCustomerData(response);
    // const response = await fetch('http://localhost:7943/customer/list');
    // const data = await response.json();
    // setCustomerData(data);
  // }

  //useEffect(() => {  fetchCustomerData(); }, []);

  const goCustomerList = async() => {
    const response = await axios.post('http://localhost:7943/customer/list');
    setCustomerData(response);
    setShowCustomerList(true);
  }

  if(showCustomerList){
    return <CompanyList customerDatas={customerData}/>
  }

  return (
    <div>
      <h2>(주)차베스전기</h2>
      <p>Welcome, {userData.user_nm}!</p>
      <p>Company_id : {userData.company_id}</p>
      <p>Company_nm : {userData.company_nm}</p>
      <p>User_nm    : {userData.user_nm}</p>
      <p>User_id    : {userData.user_id}</p>
      <p>password   : {userData.password}</p>
      
      <label>메뉴</label> 
      <ul>
        <li onClick={goCustomerList}>
          고객사관리
        </li>
      </ul>
    </div>
    
  );
};

export default Main;
