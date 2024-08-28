import React, {useEffect, useState} from "react";
import AppHeader from "./AppHeader";
import { useNavigate } from 'react-router-dom';

const MyPage = () =>{
  const navigate = useNavigate();
  const [username, setUsername]   = useState(null);  
  const [curAddr, setCurAddr] = useState(1);

  useEffect(() => {
    // 세션에서 사용자 아이디를 가져와서 username에 설정
    const savedUsername = sessionStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    };  
  },[])

  const reloadPage = () =>{
    navigate('/main');
  }

  return (
    <div className="MainWrap myPageWrap">
      <AppHeader/> 
      <div className="myPageTit">My_Page</div>  
      <div className="formWrap w100 flex f_d_column a_i_center j_c_center">   
        <ul className="inputList ml5 flex f_d_column a_icenter j_c_center">
          <li className="relative flex mt68">
            <span className="inputLabel">아이디 </span>
            <input className="w277" type='text' value={username} placeholder="아이디" readOnly/>
          </li>
          <li className="relative flex mt20">
            <span className="inputLabel">비밀번호 </span>
            <input className="w277" type='text' value={''} placeholder="비밀번호" readOnly/>
          </li>
          <li className="relative flex mt20">
            <span className="inputLabel">주문자 </span>
            <input className="w277" type='text' value={username} placeholder="주문자성명"/>
          </li>
          <li className="relative flex mt20">
            <span className="inputLabel">전화번호 </span>
            <input className="w277" type='text' value={''} placeholder="전화번호"/>
          </li>
          <>            
            <li className="relative flex mt20">
              <span className="inputLabel">주소1 </span>
              <input className="w277" type='text' value={''} placeholder="주소1"/>
              <div className={curAddr === 1 ? "curAddr" : "addrBox"} onClick={(e) => setCurAddr(1)}>
                {curAddr === 1 ? '현재 기본 배송지' : '기본 배송지로 설정'}
              </div>
            </li>            
            <li className="relative flex mt20">
              <span className="inputLabel">주소2 </span>
              <input className="w277" type='text' value={''} placeholder="주소2"/>
              <div className={curAddr === 2 ? "curAddr" : "addrBox"} onClick={(e) => setCurAddr(2)}>
                {curAddr === 2 ? '현재 기본 배송지' : '기본 배송지로 설정'}
              </div>
            </li>
            <li className="relative flex mt20">
              <span className="inputLabel">주소3 </span>
              <input className="w277" type='text' value={''} placeholder="주소3"/>
              <div className={curAddr === 3 ? "curAddr" : "addrBox"} onClick={(e) => setCurAddr(3)}>
                {curAddr === 3 ? '현재 기본 배송지' : '기본 배송지로 설정'}
              </div>
            </li>
          </>
        </ul>      
        <div className='w100 flex a_i_center j_c_center mb19 mt125'>
          <button type="button" className='w168 h40 mt46 mr25 bgSlate100 fs14 cursor'>저장</button>
          <button type="button" className='w168 h40 mt46 cursor fs14 cancle' onClick={reloadPage}>취소</button>
        </div>      
      </div>
    </div>
  )
}

export default MyPage;