import React, { useEffect, useState } from 'react';
import './styles/Common.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import AdminHeader from './AdminHeader';
import { AdminRenderContent } from './AdminRenderContent';

function Admin() {
  const [currentView, setCurrentView] = useState('default');
  const [orderCnt, setOrderCnt]   = useState([]);
  const [username, setUsername]   = useState(null);
  const [productNm, setProductNm] = useState('');
  const [productObj, setProductObj] = useState({ count: 0, pList: [] });      
  const navigate = useNavigate();
  const location = useLocation();
  // const [resetKey, setResetKey] = useState(0); // 초기화 키
  // const [dropDownMenu, setDropDownMenu] = useState('');



  //**********************************************************************************************
  // 상품 재고 초기화
  //**********************************************************************************************
  const initializeOrderCnt = (productList) => {
    const initOrderCnt = [];
    for (let i = 0; i < productList.length; i++) {
      initOrderCnt.push(productList[i].COUNT);
    }
    return initOrderCnt;
  };
  //**********************************************************************************************



  //**********************************************************************************************
  // 전체 상품 목록 또는 검색된 상품 목록 가져오기
  //**********************************************************************************************
  const searchResProducts = async () => {
    const search_key_word = productNm;
    try {
      const res = await axios.post('http://localhost:1092/product/goodList', {
        product_nm: search_key_word, // 상품명
        product_id: '', // 상품 ID
      });

      // 상품 리스트 설정
      setProductObj({ count: res.data.length, pList: res.data });

      // 상품 재고 개수 설정
      setOrderCnt(initializeOrderCnt(res.data));
    } catch (e) {
      console.log('상품 목록 가져오기 애러: ' + e);
    }
  };
  //**********************************************************************************************



  //**********************************************************************************************
  // 렌더링 초기화
  //**********************************************************************************************
  useEffect(() => {
    // 상품 목록을 불러오기
    searchResProducts();

    // 세션에서 사용자 아이디를 가져와서 username에 설정
    const savedUsername = sessionStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // URL 파라미터에서 'view' 값을 가져와 현재 뷰를 설정
    const params = new URLSearchParams(location.search);
    const view = params.get('view');

    if (view) {
      setCurrentView(view);
    } else if (currentView === 'default') {
      setCurrentView('productList');
    }
  }, [location.search]);
  //**********************************************************************************************



  //**********************************************************************************************
  // 부품목록 보기로 이동
  //**********************************************************************************************
  const goPartListView = (productId, productNm) => {
    navigate('/partList',{ state: { productId: productId, productNm: productNm}});
  };
  //**********************************************************************************************


  //**********************************************************************************************
  // 상품 목록 렌더링
  //**********************************************************************************************
  const productRender = () => {
    const productList = [];
    const p_count = productObj.count; 
    const pList = productObj.pList; 

    for (let i = 0; i < p_count; i++) {
      const product = pList[i];
      let price = parseFloat(product.PRICE).toLocaleString('ko-KR');

      productList.push(
        <div className='list-item' key={product.CLASS_ID + '_' + product.PRODUCT_ID}>
          <figure
            className='thumb-photo'
            style={{ backgroundImage: `url(/assets/Img/${product.IMAGE})` }}
          ></figure>
          <div className='desc relative'>
            <a>
              <div className='product_nm'>{product.PRODUCT_NM}</div>
              <div className='priceText'>{price}원</div>
              <div className='product_detail'>
                <span className='label'>높이</span> {product.SIZE_Z} mm
              </div>
              <div className='product_detail'>
                <span className='label'>너비</span> {product.SIZE_H} mm
              </div>
              <div className='product_detail'>
                <span className='label'>길이</span> {product.SIZE_V} mm
              </div>
              <div className='product_detail'>
                <span className='label'>무게</span> {product.WEIGHT} g
              </div>
            </a>
            <button onClick={() => goPartListView(product.PRODUCT_ID, product.PRODUCT_NM)} className='absolute partListBtn fs14 bgSlate100 cursor'>
              부품목록
            </button>
          </div>
          <div className='countBox ml20 flex f_d_column a_i_center'>
            <p className='mb40 pt5 pb5 fs16 w100 t_a_center border-top-bottom'>수량</p>
            <div className='productCount flex f_d_column a_i_center j_c_center'>
              <p>{orderCnt[i]}</p>
            </div>
          </div>
        </div>
      );
    }
    return productList;
  };
  //**********************************************************************************************



  //**********************************************************************************************
  // 엔터 키 눌렀을 때 검색 실행
  //**********************************************************************************************
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      searchResProducts();
    }
  };
  //**********************************************************************************************


  //**********************************************************************************************
  // 검색 바와 검색 버튼 JSX 요소
  //**********************************************************************************************
  const searchContent = () => {
    return (
      <section className='w100'>
        <div className='flex mt32'>
          <input
            type='text'
            className='search'
            onChange={(e) => setProductNm(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <div onClick={searchResProducts} className='searchBtn bgSlate100 fs16 flex a_i_center j_c_center'>
            검색
          </div>
        </div>
      </section>
    );
  };
  //**********************************************************************************************



  //**********************************************************************************************
  // JSX 요소들을 컴포넌트 형태로 관리하기 위한 객체
  //**********************************************************************************************
  const components = {
    searchContent: () => searchContent(),
    productRender: () => productRender(),
  };
  //**********************************************************************************************


  return (
    <div className='adminWrap'>
      <AdminHeader currentView={currentView} setCurrentView={setCurrentView} />
      <div className={currentView === 'goodsTable' ? 'adminContent mt67 w100' : 'adminContent content'}>
        {currentView === 'default' ? null : AdminRenderContent(currentView, components, navigate)}
      </div>{/*currentView가 default인 경우 useEffect에서 productList로 설정함 */}
    </div>
  );
}

export default Admin;
