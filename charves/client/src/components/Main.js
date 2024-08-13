// src/components/Main.js
import React, { useState } from 'react';
import axios from 'axios';
import CompanyList from './CustomerList';
//import { useEffect } from 'react';
import './Main.css';  // CSS 파일을 import

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
    <div className="main-container">
      <h2>(주)차베스전기</h2>
      <table>
        <colgroup>
          <col width="35%"></col>
          <col width="*"></col>
        </colgroup>
        <thead>
          <tr>
            <th colspan="2">Welcome, {userData.user_nm}!</th>
          </tr>
        </thead>
        <tbody>
          <tr><th>회사아이디</th><td>{userData.company_id}</td></tr>
          <tr><th>회사명</th><td>{userData.company_nm}</td></tr>
          <tr><th>사용자명</th><td>{userData.user_nm}</td></tr>
          <tr><th>사용자아이디</th><td>{userData.user_id}</td></tr>
        </tbody>
      </table>
      <br></br>
      <label class="centerText">메뉴</label> 
      <ul>
        <li onClick={goCustomerList} class="cursorHand">
          고객사관리
        </li>
      </ul>
    </div>
  );
};

export default Main;
