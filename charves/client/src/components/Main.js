// src/components/Main.js
import React from 'react';

const Main = ({userData}) => {
  return (
    <div>
      <h2>(주)차베스전기</h2>
      <p>Welcome, {userData.user_nm}!</p>
      <p>Company_id : {userData.company_id}</p>
      <p>Company_nm : {userData.company_nm}</p>
      <p>User_nm    : {userData.user_nm}</p>
      <p>User_id    : {userData.user_id}</p>
      <p>password   : {userData.password}</p>
      
      <table>
        <tr>
          <td>이제 차베스전기는 DB연동만 하면 환경은 거의 다 끝나는구만....</td>
        </tr>
      </table>
    </div>
    
  );
};

export default Main;
