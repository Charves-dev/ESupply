import React, { useState, useEffect } from 'react';
import './styles/Common.css'
import Counter from './Counter';
import { useNavigate } from 'react-router-dom';

function Main() {  
  let productObj = {    
    pData :  { 
          count : 3, 
          pList : [ 
            { product_nm  : "라떼판다-4G,64GB", 
              product_id  : "cap_2349809" ,
              image       : "/assets/Img/img1.png",
              product_desc: "인텔 Cherry trail 1.8GHz 쿼드코어, windows10 기본 탑재, 아두이노 호환, 안드로이드, 우분투 사용 가능, latte panda",
              price       : "20000",
              count       : "3"
            }, 
            { product_nm  : "라떼판다 알파 864s DFR0547", 
              product_id  : "cap_2349810" ,
              image       : "/assets/Img/img2.png",
              product_desc: "kc인증완료, 인텔 8세대 CPU로 업그레이드된 new버전 라떼판다 알파 입니다.",
              price       : "40000",
              count       : "1"
            },
            { product_nm  : "HELP! 전자공학으로 아두이노 실습 문제 해결하기 교재 + 키트", 
              product_id  : "cap_2349811" ,
              image       : "/assets/Img/img3.png",
              product_desc: "전자공학으로 아두이노 실습 문제 해결하기 키트와 함께 볼 수 있는 14개의 예제!",
              price       : "50000",
              count       : "5"
            },  
          ]
    }
  }

  // 기본 주문 개수 초기화, 재고가 0인 경우 0으로 설정
  const initializeOrderCnt = (productList) => {
    const initOrderCnt = [];
    for (let i = 0; i < productList.length; i++) {
      initOrderCnt.push(productList[i].count > 0 ? 1 : 0);
    }
    return initOrderCnt;
  };
  

  const [orderCnt, setOrderCnt] = useState(initializeOrderCnt(productObj.pData.pList));
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 세션에서 사용자 아이디를 가져와서 username에 설정
    const savedUsername = sessionStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);


  // 상품 주문 개수 증가
  const handleIncrement = (index) => {
      const newCounts = [...orderCnt];
      newCounts[index] += 1;
      setOrderCnt(newCounts);
  };


  // 상품 주문 개수 감소
  const handleDecrement = (index) => {
      let newCounts = [...orderCnt];
      if (newCounts[index] > 0) {
        newCounts[index] -= 1;
      }
      setOrderCnt(newCounts);
  };  


  //***********************************************************************************************
  // todo 상품 주문 API 요청
  //***********************************************************************************************
  const handleOrder = () => {
    /* /product/neworder */
    const orderDetails = [];
    const p_count = productObj.pData.count;   // 상품 전체 개수
    for (let i = 0; i < p_count; i++) {
      const product = productObj.pData.pList[i];
      if(orderCnt[i] <= 0){ 
        continue;
      }
      orderDetails.push({
        product_id: product.product_id,
        orderCnt  : orderCnt[i]
      });
    }

    console.log(username);
    console.log(orderDetails);
  };
  //***********************************************************************************************


  //***********************************************************************************************
  //상품 목록 출력
  //***********************************************************************************************
  const productRender = () =>{
    const productList = [];
    const p_count = productObj.pData.count;   // 상품 전체 개수
    const pList   = productObj.pData.pList;   // 상품 정보    
    
    for (let i = 0; i < p_count; i++) {
      const product = pList[i];
      let   price   = parseFloat(product.price).toLocaleString('ko-KR');

      //재고 개수가 0개 이하일경우 상품을 출력하지 않고 건너뜀
      if(product.count <= 0){        
        continue;
      }
      
      productList.push(
        <li className='mt30 mb44' key={product.product_id}>
            <figure className="thumb-photo" style={{ backgroundImage: `url(${product.image})` }}>
            </figure>            
            <div className='desc'>
                <a href="">
                  <div className='product_nm'>
                    {product.product_nm}
                  </div>
                  <div className='priceText'>
                    {price}원
                  </div>
                  <div className='product_detail'>
                    {product.product_desc}
                  </div>
                </a>
            </div>
            <div className='ml20 flex f_d_column a_i_center j_c_center'>
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
    return <ul className="thumb-list row-line2">{productList}</ul>;;
  }
  //***********************************************************************************************


  const handleLogout = () => {
    // 로그아웃 시 세션에서 아이디를 제거하고 상태 초기화
    sessionStorage.removeItem('username');
    setUsername(null);
    navigate('/login');
  };


  return (
    <div className='MainWrap'>
      <div className='MainContent'>
        <div>ID: {username}</div>
        <button className="logOut" onClick={handleLogout}><b>로그아웃</b></button>
        {productRender()}        
        <div className='flex'>
          <button className="orderBtn" onClick={handleOrder}><b>주문하기</b></button>
        </div>
      </div>
    </div>
  );
}

export default Main;