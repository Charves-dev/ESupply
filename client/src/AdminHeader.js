import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ currentView, setCurrentView }) => {
  // const [isLiHovered, setIsLiHovered] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  // const [isGoodsLiHovered, setIsGoodsLiHovered] = useState(false);
  const [isGoodsMenuHovered, setIsGoodsMenuHovered] = useState(false);
  const [isDeliveryHovered, setIsDeliveryHovered] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    // 로그아웃 시 세션에서 아이디를 제거하고 상태 초기화
    sessionStorage.removeItem('username');
    navigate('/login');
  };

  const menuItems = [
    { label: '상품재고목록', view: 'productList' },
    { label: '부품목록', view: 'partList' },
    { label: '상품관리', view: 'g_drop_down' },
    { label: '제품관리', view: 'p_drop_down' },
    { label: '배송조회', view: 'd_drop_down' },
  ];

  const viewMap = {
    'g_drop_down': ['goodsForm', 'goodsTable'],
    'p_drop_down': ['productForm'],
    'd_drop_down': ['pd_delivery_view', 'pt_delivery_view']
  };

  // const isGoodsMenuHoveredRef = useRef(false);
  // const isMenuHoveredRef = useRef(false);

  // const menuBoxMouseEnter = (view) => {
  //   if (view === 'g_drop_down') {
  //     // isGoodsMenuHoveredRef.current = true;
  //     // setIsGoodsMenuHovered(true);
  //   }

  //   if (view === 'p_drop_down') {
  //     // isMenuHoveredRef.current = true;
  //     // setIsMenuHovered(true);
  //   }

  //   if (view === 'd_drop_down') {
  //     setIsDeliveryHovered(true);
  //   }
  // };

  const menuBoxMouseLeave = (view) => {
    if (view === 'g_drop_down') {
      // isGoodsMenuHoveredRef.current = false;
      setIsGoodsMenuHovered(false);
    }

    if (view === 'p_drop_down') {
      // isMenuHoveredRef.current = false;
      setIsMenuHovered(false);
    }

    if (view === 'd_drop_down') {
      setIsDeliveryHovered(false);
    }
  };

  const menuMouseEnter = (view) => {
    if (view === 'p_drop_down') {
      // setIsLiHovered(true);
      setIsMenuHovered(true);
    }
    
    if (view === 'g_drop_down') {
      // setIsGoodsLiHovered(true);
      setIsGoodsMenuHovered(true);
    }

    if (view === 'd_drop_down') {
      setIsDeliveryHovered(true);
    }
  };

  // const menuMouseLeave = (view) => {
  //   if (view === 'g_drop_down') {
  //     setIsGoodsLiHovered(false);
  //     setIsGoodsMenuHovered(false);
  //   }

  //   if (view === 'p_drop_down') {
  //     setIsLiHovered(false);
  //     setIsMenuHovered(false);
  //   }
  // };

  const isActiveMenuItem = (view, currentView) => {
    return viewMap[view]?.includes(currentView);
  };

  return (
    <header className='w100'>
      <div className='menuBox w100 flex a_i_center j_c_between'>
        <div className='logo cursor' onClick={() => navigate('/admin')}>Esupply_Admin</div>
        <ul className='menu-list flex h100'>
          {menuItems.map((item) => (
            <div
              key={item.view}
              // onMouseEnter={() => menuBoxMouseEnter(item.view)}
              onMouseLeave={() => menuBoxMouseLeave(item.view)}
              className='h100 relative mr3 flex a_i_center'
            >
              <li
                key={item.view}
                onMouseEnter={() => menuMouseEnter(item.view)}
                onClick={() => setCurrentView(item.view)}
                className={`relative ${isActiveMenuItem(item.view, currentView) || currentView === item.view ? 'active' : ''}`}
              >
                {item.label}
              </li>

              {/* 상품관리 드롭다운 */}
              <div className={`dd-menu ${item.view === 'g_drop_down' && isGoodsMenuHovered ? 'visible' : ''}`}>
                <div onClick={() => setCurrentView('goodsForm')} className='white h42 cursor'>상품입고</div>
                <div onClick={() => setCurrentView('goodsTable')} className='white h42 cursor'>상품목록</div>
              </div>

              {/* 제품관리 드롭다운 */}
              <div className={`dd-menu ${item.view === 'p_drop_down' && isMenuHovered ? 'visible' : ''}`}>
                <div onClick={() => setCurrentView('productForm')} className='white h42 cursor'>제품등록</div>
              </div>

              {/* 배송조회 드롭다운*/}
              <div className={`dd-menu ${item.view === 'd_drop_down' && isDeliveryHovered ? 'visible delivery' : ''}`}>
                <div onClick={() => setCurrentView('pd_delivery_view')} className='white h42 cursor'>상품배송조회</div>
                <div onClick={() => setCurrentView('pt_delivery_view')} className='white h42 cursor'>부품배송조회</div>
              </div>
            </div>
          ))}
        </ul>
        <HamburgerMenu setCurrentView={setCurrentView}/>
        <div className='header-right-menu flex a_i_center'>
          <button className="logOut cursor" onClick={handleLogout}>로그아웃</button>
          <button className="goBack cursor" onClick={() => navigate('/main')}>메인으로가기</button>
        </div>
      </div>
    </header>
  );
};

const HamburgerMenu = ({ setCurrentView }) => {
  const navigate = useNavigate();  
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
      setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // 로그아웃 시 세션에서 아이디를 제거하고 상태 초기화
    sessionStorage.removeItem('username');
    navigate('/login');
  };

  return (
      <div className="hamburger-menu-container">
          <div className={`hamburger-icon ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
          </div>
          <div className={`side-menu ${isOpen ? 'show' : ''}`}>
              <ul>
                <li onClick={() => setCurrentView('productList')} className='white h42 cursor'>상품재고목록</li>
                <li onClick={() => setCurrentView('partList')} className='white h42 cursor'>부품재고목록</li>
                <li onClick={() => setCurrentView('goodsForm')} className='white h42 cursor'>상품입고</li>
                <li onClick={() => setCurrentView('goodsTable')} className='white h42 cursor'>상품목록</li>
                <li onClick={() => setCurrentView('productForm')} className='white h42 cursor'>제품등록</li>
                <li onClick={() => setCurrentView('pd_delivery_view')} className='white h42 cursor'>상품배송조회</li>
                <li onClick={() => setCurrentView('pt_delivery_view')} className='white h42 cursor'>부품배송조회</li>
                <li onClick={handleLogout} className='white h42 cursor'>로그아웃</li>
                <li onClick={() => navigate('/main')} className='white h42 cursor'>메인으로가기</li>
              </ul>
          </div>
      </div>
  );
};

export default AdminHeader;
