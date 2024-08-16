import React from 'react';

const CustomerList = ({ customerDatas }) => {
  // console.log("$$$$$$$$$$$$$$$$$$$$$ customerDatas ");
  // console.log(customerDatas);
  // console.log("Type of customerDatas:", typeof customerDatas);
  // console.log("customerDatas is an Array:", Array.isArray(customerDatas));
  // console.log("customerDatas:", customerDatas);
  // console.log(customerDatas[0]);
  return(
    <div className = 'centerContainer'> 
      <h2>고객사목록 화면</h2>
      <table className="centerTable">
        <colgroup>
          <col width="15%"></col>
          <col width="25%"></col>
          <col width="15%"></col>
          <col width="15%"></col>
          <col width="30%"></col>
        </colgroup>
        <thead>
          <tr>
            <th>ID</th>
            <th>회사명</th>
            <th>담당자명</th>
            <th>전화번호</th>
            <th>회사소재지</th>
          </tr>
        </thead>
        <tbody>
          {customerDatas.data.map((customer, index) => (
            <tr key={index}>
              <td className="centerTd">{customer.COMPANY_ID}</td>
              <td className="centerTd">{customer.COMPANY_NM}</td>
              <td className="centerTd">{customer.MANAGER_NM}</td>
              <td className="centerTd">{customer.MANAGER_TEL}</td>
              <td className="leftTd">{customer.ADDRESS}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
