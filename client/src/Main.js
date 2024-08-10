import React, { useState, useEffect, useCallback } from 'react';
import './styles/Common.css'
import Counter from './Counter';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Main() {  
  const [orderCnt, setOrderCnt]   = useState([]);
  const [username, setUsername]   = useState(null);
  const [productNm, setProductNm] = useState('');
  const [productObj, setProductObj] = useState({ count: 0, pList: [] });  
  const navigate = useNavigate();

  // 기본 주문 개수 초기화, 재고가 0인 경우 0으로 설정
  const initializeOrderCnt = (productList) => {
    const initOrderCnt = [];
    for (let i = 0; i < productList.length; i++) {
      initOrderCnt.push(productList[i].COUNT > 0 ? 1 : 0);
    }
    return initOrderCnt;
  };
  

  // 전체 상품 목록 가져오기 or 검색시 대상 상품 목록 가져오기
  const searchResProducts = async () => {
      const search_key_word = productNm;
      try{
        const res = await axios.post('http://localhost:1092/product/goodList',{
          product_nm : search_key_word,            // 상품명
          product_id : "",                         // 상품 ID
        });
  
        // 상품 리스트 설정
        setProductObj({ count: res.data.length, pList: res.data }); 
        
        // 주문 개수 1로 초기화
        setOrderCnt(initializeOrderCnt(res.data));        
  // console.log(res.data);
    }catch(e){
      console.log('상품 목록 가져오기 애러: ' + e);
    }
  };
    
    
  useEffect(() => {
    /* 상품목록 불러오기 */
    searchResProducts();

    // 세션에서 사용자 아이디를 가져와서 username에 설정
    const savedUsername = sessionStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    };
  }, []);


  let hasAlerted = false;
  let prenIndex = -1;
  // 상품 주문 개수 증가
  const handleIncrement = useCallback((index) => {
    setOrderCnt(prevOrderCnt => {
      const newCounts = [...prevOrderCnt];

      if(index !== prenIndex){
        prenIndex = index;
        hasAlerted = false;
      }

      if ( newCounts[index] <= productObj.pList[index].COUNT-1 ) {
        newCounts[index] += 1;      
        hasAlerted = false;
      }else{
        if (!hasAlerted) {
          alert('더 이상 재고가 없습니다.')
          hasAlerted = true;
        }
        return newCounts;
      }
      
      return newCounts;
    });
  }, [productObj]);


  // 상품 주문 개수 감소
  const handleDecrement = (index) => {
      setOrderCnt(prevOrderCnt => {
        const newCounts = [...prevOrderCnt];
        if (newCounts[index] > 0) {
          newCounts[index] -= 1;
        }
        return newCounts;
      });
  };



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

      //재고 개수가 0개 이하일경우 상품을 출력하지 않고 건너뜀
      if(product.COUNT <= 0){        
        continue;
      }
      
      productList.push(
        <li className='mt32 mb32' key={product.PRODUCT_ID}>
            <figure className="thumb-photo" style={{ backgroundImage: `url(/assets/Img/${product.IMAGE})` }}>
            {/* <figure className="thumb-photo" style={{ backgroundImage: `url(${product.image}})` }}> */}
            </figure>            
            <div className='desc'>
                <a href="">
                  <div className='product_nm'>
                    {product.PRODUCT_NM}
                  </div>
                  <div className='priceText'>
                    {price}원
                  </div>
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
            </div>
            <div className='ml20 flex f_d_column a_i_center j_c_between'>
                <p className='mb10 pt5 pb5 fs16 w100 t_a_center border-top-bottom'>수량</p>
                <Counter 
                  count={orderCnt[i]}
                  onIncrement={() => handleIncrement(i)}
                  onDecrement={() => handleDecrement(i)}
                />
            </div>
        </li>
      )
    }
    return <ul className="thumb-list row-line2">{productList}</ul>;
  }
  //***********************************************************************************************


  //***********************************************************************************************
  // todo 상품 주문 API 요청
  //***********************************************************************************************
  const handleOrder = () => {
    /* /product/neworder */
    const orderDetails = [];
    const p_count = productObj.count;   // 상품 전체 개수
    for (let i = 0; i < p_count; i++) {
      const product = productObj.pList[i];
      if(orderCnt[i] <= 0){ 
        continue;
      }
      orderDetails.push({
        product_id : product.product_id,
        orderCnt   : orderCnt[i]
      });
    }

    let orderData = {};
    orderData = {
      user_id : username,
      order   : orderDetails
    }
    console.log(orderData);
  };
  //***********************************************************************************************



  const handleLogout = () => {
    // 로그아웃 시 세션에서 아이디를 제거하고 상태 초기화
    sessionStorage.removeItem('username');
    setUsername(null);
    navigate('/login');
  };

  const goDeliveryView = () => {
    navigate('/deliveryView', { state: { type: 'P' }});
  };

  const goAdminView = () => {
    navigate('/admin');
  };


//   const addProductTest = async () => {
// // console.log('상품등록 요청');
//     try{
//       const res = await axios.post('http://localhost:1092/product/add',{
//         "class_id" : "DIO_121",
//         "product_id" : "DIO_121_DLCGBB999341",
//         "product_nm" : "광다이오드_121",
//         "price" : "900",
//         "weight" : "80",
//         "size_h" : "52",
//         "size_v" : "12",
//         "size_z" : "12"
//       });

// // console.log(res);
//     }catch(e){
//       console.log('상품등록 요청 에러: ' + e);
//     }
//   }

  const goMain = () => {
    navigate('/main');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      searchResProducts();
    }
  };

  return (
    <div className='MainWrap'>
      <header className='w100'>
        <div className='menuBox w100 flex a_i_center j_c_between'>
          <div className='logo cursor' onClick={goMain}>Esuply</div>
          <ul className='flex'>
            <li className='mr35' onClick={goAdminView}>관리자</li>            
            <li onClick={goDeliveryView}>배송조회</li>
          </ul>          
          <button className="logOut" onClick={handleLogout}><b>로그아웃</b></button>          
        </div>
      </header>      
      
      <div className='MainContent content'>
        {/* 검색 */}
        <section className='w100'> 
          <div className='flex mt32'>
            <input type='text' className='search' onChange={(e) => setProductNm(e.target.value)} onKeyDown={handleKeyPress}/>
            <div onClick={searchResProducts} className='searchBtn bgSlate100 fs16 flex a_i_center j_c_center'>검색</div>
          </div>  
        </section>              
      
        {/* 상품목록 */}
        {productRender()}

        <div className='flex'>
          <button className="orderBtn cursor" onClick={handleOrder}><b>주문하기</b></button>
        </div>
      </div>
    </div>
  );
}

export default Main;