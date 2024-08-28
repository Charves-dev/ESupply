import React from "react";
import './styles/Common.css';
import { useNavigate } from 'react-router-dom';

const AppHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 로그아웃 시 세션에서 아이디를 제거하고 상태 초기화
    sessionStorage.removeItem('username');
    navigate('/login');
  };

  const goOrderList = () => {
    navigate('/orderList');
  }

  const goDeliveryView = () => {
    navigate('/deliveryView', { state: { type: 'PD', sourcePage: 'main'}});
  };

  const goAdminView = () => {
    navigate('/admin');
  };

  const goMain = () => {
    navigate('/main');
  };

  const goMyPage = () => {
    navigate('/myPage');
  };

  return(
    <header className='w100'>
      <div className='menuBox w100 flex a_i_center j_c_between'>
        <div className='logo cursor' onClick={goMain}>Esupply</div>
        <ul className='flex'>
          <li className='mr6' onClick={goAdminView}>관리자</li>            
          <li className='ml6 mr6' onClick={goDeliveryView}>배송조회</li>
          <li onClick={goOrderList}>주문목록</li>
        </ul>          
        <button className="logOut cursor" onClick={handleLogout}>로그아웃</button>          
        <button className="myPage cursor" onClick={goMyPage}>마이페이지</button>
      </div>
    </header>
  )
}

export default AppHeader;