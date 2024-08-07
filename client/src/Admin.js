import React, {useEffect, useState, useCallback} from 'react';
import './styles/Common.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductForm from './ProductForm';

function Admin() {
  
  const [currentView, setCurrentView] = useState('default');
  const [orderCnt, setOrderCnt]   = useState([]);
  const [username, setUsername]   = useState(null);
  const [productNm, setProductNm] = useState('');
  const [productObj, setProductObj] = useState({ count: 0, pList: [] });  
  const [isLiHovered, setIsLiHovered] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [isGoodsLiHovered, setIsGoodsLiHovered] = useState(false);
  const [isGoodsMenuHovered, setIsGoodsMenuHovered] = useState(false);
  const navigate = useNavigate();

  // **********************************************************************************************
  // 재고 초기화
  // **********************************************************************************************
  const initializeOrderCnt = (productList) => {
    const initOrderCnt = [];
    for (let i = 0; i < productList.length; i++) {
      initOrderCnt.push(productList[i].COUNT);
    }
    return initOrderCnt;
  };
  // **********************************************************************************************

  
  // **********************************************************************************************
  // 전체 상품 목록 가져오기 or 검색시 대상 상품 목록 가져오기
  // **********************************************************************************************
  const searchResProducts = async () => {
// console.log('검색 상품 가져오기 요청');
// console.log('search_key_word: ' + search_key_word);
    const search_key_word = productNm;
    try{
      const res = await axios.post('http://localhost:1092/product/goodList',{
        product_nm : search_key_word,            // 상품명
        product_id : "",    // 상품 ID
      });

      // 상품 리스트 설정
      setProductObj({ count: res.data.length, pList: res.data }); 
      
      // 상품 재고 개수 설정
      setOrderCnt(initializeOrderCnt(res.data));        
// console.log(res.data);
    }catch(e){
      console.log('상품 목록 가져오기 애러: ' + e);
    }
  };
  // **********************************************************************************************
  

  useEffect(() => {
    /* 상품목록 불러오기 */
    searchResProducts();

    // 세션에서 사용자 아이디를 가져와서 username에 설정
    const savedUsername = sessionStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    };
  }, []);

  const goMain = () => {
    navigate('/main');
  };

  const goAdmin = () => {
    navigate('/admin');
  };

  const goPartListView = () =>{
    navigate('/partList');
  }

  //***********************************************************************************************
  //상품 목록 렌더링
  //***********************************************************************************************
  const productRender = () =>{    
    const productList = [];
    const p_count = productObj.count;   // 상품 전체 개수
    const pList   = productObj.pList;   // 상품 정보   

    for (let i = 0; i < p_count; i++) {
      const product = pList[i];
      let   price   = parseFloat(product.PRICE).toLocaleString('ko-KR');
      
      productList.push(
        <li className='mt30 mb44' key={product.PRODUCT_ID}>
            <figure className="thumb-photo" style={{ backgroundImage: `url(/assets/Img/img1.png)` }}>
            {/* <figure className="thumb-photo" style={{ backgroundImage: `url(${product.image}})` }}> */}
            </figure>            
            <div className='desc relative'>
                <a href="">
                  <div className='product_nm'>
                    {product.PRODUCT_NM}
                  </div>
                  <div className='priceText'>
                    {price}원
                  </div>
                  <div className='product_detail'>
                    <span className='label'>높이</span> {product.SIZE_H} mm
                  </div>
                  <div className='product_detail'>
                    <span className='label'>너비</span> {product.SIZE_V} mm
                  </div>
                  <div className='product_detail'>
                    <span className='label'>길이</span> {product.SIZE_Z} mm
                  </div>
                  <div className='product_detail'>
                    <span className='label'>무게</span> {product.WEIGHT} g
                  </div>
                </a>
                <button onClick={goPartListView} className='absolute partListBtn fs14 bgSlate100 cursor'>부품목록</button>
            </div>
            <div className='countBox ml20 flex f_d_column a_i_center'>
                <p className='mb40 pt5 pb5 fs16 w100 t_a_center border-top-bottom'>수량</p>
                <div className='productCount flex f_d_column a_i_center j_c_center'>
                  <p>{orderCnt[i]}</p>
                </div>                                
                {/* <div id='productEdit' className='global-button flex a_i_center j_c_center'>
                  수정하기
                </div>   */}
                {/* <Counter 
                  count={orderCnt[i]}
                  onIncrement={() => handleIncrement(i)}
                  onDecrement={() => handleDecrement(i)}
                /> */}
            </div>
        </li>
      )
    }
    return <ul className="thumb-list row-line2">{productList}</ul>;
  }
  //***********************************************************************************************


  // 상품등록 폼 반환
  const goodsCRUD = () => {
    let goodsForm = <div className='mb10'>상품등록.. 작업예정</div>
    return goodsForm
  }

  // 제품등록 폼 반환
  const productCRUD = () => {
    let prodcutForm = <div><ProductForm /></div>
    return prodcutForm
  }

  // currentView 값에 따라 현재 보여줄 뷰 렌더링
  const renderContent = () => {
    switch (currentView) {
      case 'productList':
        return (
          <>
            {searchContent()}
            {productRender()}
          </>
        )
      case 'goodsCRUD':
        return goodsCRUD();
      case 'productCRUD':
        return productCRUD();
      default:
        return null;
    }
  };

  // **********************************************************************************************
  // 검색 엔터 이벤트 및 JSX
  // **********************************************************************************************
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      searchResProducts();
    }
  };

  const searchContent = () => {
    return (
      <section className='w100'> 
        <div className='flex mt32'>
          <input type='text' className='search' onChange={(e) => setProductNm(e.target.value)} onKeyDown={handleKeyPress}/>
          <div onClick={searchResProducts} className='searchBtn bgSlate100 fs16 flex a_i_center j_c_center'>검색</div>
        </div>  
      </section> 
    );
  };
  // **********************************************************************************************

  
  // **********************************************************************************************
  // 헤더 - 메뉴 초기화 (드롭다운 포함)
  // **********************************************************************************************
  const menuItems = [
    { label: '상품재고목록',        view: 'productList' },
    { label: '부품재고목록',        view: 'partList' },
    { label: '상품관리',            view: 'g_drop_down' },
    { label: '제품관리',            view: 'p_drop_down' },
  ];

  // 각 상단 메뉴를 여러개의 dropDown메뉴에 매핑하는 객체
  // - 'g_drop_down': 상품관리 드롭다운과 관련된 뷰들을 매핑
  //   - 'goodsCRUD': 상품 등록 뷰
  //   - 'goodsTable': 상품 목록 뷰
  // - 'p_drop_down': 제품관리 드롭다운과 관련된 뷰들을 매핑
  //   - 'productCRUD': 제품 등록 뷰
  //   - 'productTable': 제품 목록 뷰
  const viewMap = {
    'g_drop_down': ['goodsCRUD', 'goodsTable'],
    'p_drop_down': ['productCRUD', 'productTable'],
  };
  // **********************************************************************************************


  // **********************************************************************************************
  // 헤더 - 드롭다운 메뉴 관련 이벤트
  // **********************************************************************************************
  // 드롭다운 메뉴 클릭시 현재 보여줄 뷰를 설정하고 관련 스테이트를 초기화한다
  const dropDownMenuClick = (view) => {
    // console.log(`Setting current view to: ${view}`);
    setCurrentView(view);
    // 드롭다운 메뉴를 숨기기 위해 상태 초기화
    setIsLiHovered(false);
    setIsMenuHovered(false);
    setIsGoodsLiHovered(false);
    setIsGoodsMenuHovered(false);
  };


  // 메뉴를 감싸는 박스를 호버하면 호버된 메뉴값에 따라 state에 설정하고
  // 드롭다운 visible 조건문에 추가한다 
  const menuBoxMouseEnter = (view) => {
    if (view === 'g_drop_down') { // 상품관리
      setIsGoodsMenuHovered(true);
    }

    if (view === 'p_drop_down') { // 제품관리
      setIsMenuHovered(true);
    }
  };


  // 메뉴를 호버하면 해당하는 LiHovered State에 true로 설정
  // 메뉴 호버시 감싸는 박스 영역 State도 무조건 true로 설정
  // 이후 드롭다운 visible 조건문에 추가함
  const menuMouseEnter = (view) => {
    if (view === 'p_drop_down') {
      setIsLiHovered(true);         // 메뉴 텍스트
      setIsMenuHovered(true);       // 메뉴 박스
    }
    if (view === 'g_drop_down') {
      setIsGoodsLiHovered(true)     // 메뉴 텍스트
      setIsGoodsMenuHovered(true);  // 메뉴 박스
    }
  }


  // 메뉴박스를 벗어날시 스테이트 초기화
  const menuMouseLeave = (view) =>{
    if(view === 'g_drop_down'){ // 상품관리
      setIsGoodsLiHovered(false)
      setIsGoodsMenuHovered(false)
    }

    if(view === 'p_drop_down'){ // 제품관리
      setIsLiHovered(false)
      setIsMenuHovered(false)
    }
  }


  const isActiveMenuItem = (view, currentView) => {
    // 배열 내에 currentView가 포함되어 있는지 확인
    return viewMap[view]?.includes(currentView);
  };

  // **********************************************************************************************

  return (
    <div className='adminWrap'>
      <header className='w100'>
        <div className='menuBox w100 flex a_i_center j_c_between'>
          <div className='logo cursor' onClick={goAdmin}>Esuply_Admin</div>
          <ul className='flex h100'>
            {menuItems.map(item => (
              <div
                key={item.view}
                onMouseEnter={() => menuBoxMouseEnter(item.view)}
                onMouseLeave={() => menuMouseLeave(item.view)}
                className='h100 relative mr3 flex a_i_center'
              >
                <li
                  key={item.view}
                  onMouseEnter={() => menuMouseEnter(item.view)}
                  onClick={() => setCurrentView(item.view)}
                  className={`relative ${isActiveMenuItem(item.view, currentView) || currentView === item.view? 'active' : ''}`}
                >
                  {item.label}
                </li>
                {/* 상품관리 드롭다운 */}
                <div className={`dd-menu ${item.view === 'g_drop_down' && isGoodsMenuHovered && isGoodsLiHovered ? 'visible' : ''}`}>
                  <div onClick={() => dropDownMenuClick('goodsCRUD')} className='white h42 cursor'>상품등록</div>
                  <div onClick={() => dropDownMenuClick('goodsTable')} className='white h42 cursor'>상품목록</div>
                </div>
                
                {/* 제품관리 드롭다운 */}
                <div className={`dd-menu ${item.view === 'p_drop_down' && isMenuHovered && isLiHovered ? 'visible' : ''}`}>
                  <div onClick={() => dropDownMenuClick('productCRUD')} className='white h42 cursor'>제품등록</div>
                  <div onClick={() => dropDownMenuClick('productTable')} className='white h42 cursor'>제품목록</div>
                </div>
              </div>
            ))}
          </ul>          
          <button className="logOut"><b>로그아웃</b></button>        
          <button className="goBack cursor" onClick={goMain}>메인으로가기</button>  
        </div>
      </header>
   
      <div className='adminContent content'>       
        {currentView === 'default' ? setCurrentView('productList') : renderContent()}                  
      </div>
    </div>
  );
}

export default Admin;
