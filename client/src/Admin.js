import React, {useEffect, useState, useCallback} from 'react';
import './styles/Common.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Counter from './Counter';

function Admin() {
  // 기본 주문 개수 초기화, 재고가 0인 경우 0으로 설정
  const initializeOrderCnt = (productList) => {
    const initOrderCnt = [];
    for (let i = 0; i < productList.length; i++) {
      initOrderCnt.push(productList[i].COUNT);
    }
    return initOrderCnt;
  };
  
  const [currentView, setCurrentView] = useState('default');
  const [orderCnt, setOrderCnt]   = useState([]);
  const [username, setUsername]   = useState(null);
  const [productNm, setProductNm] = useState('');
  const [productObj, setProductObj] = useState({ count: 0, pList: [] });  
  const navigate = useNavigate();


  // let hasAlerted = false;
  // let prenIndex = -1;
  // // 상품 주문 개수 증가
  // const handleIncrement = useCallback((index) => {
  //   setOrderCnt(prevOrderCnt => {
  //     const newCounts = [...prevOrderCnt];

  //     if(index !== prenIndex){
  //       prenIndex = index;
  //       // hasAlerted = false;
  //     }

  //     if ( newCounts[index] <= productObj.pList[index].COUNT-1 ) {
  //       newCounts[index] += 1;      
  //       // hasAlerted = false;
  //     }
      
  //     return newCounts;
  //   });
  // }, [productObj]);


  // // 상품 주문 개수 감소
  // const handleDecrement = (index) => {
  //     setOrderCnt(prevOrderCnt => {
  //       const newCounts = [...prevOrderCnt];
  //       if (newCounts[index] > 0) {
  //         newCounts[index] -= 1;
  //       }
  //       return newCounts;
  //     });
  // };

  // 전체 상품 목록 가져오기 or 검색시 대상 상품 목록 가져오기
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
                    높이: {product.SIZE_H} mm
                  </div>
                  <div className='product_detail'>
                    너비: {product.SIZE_V} mm
                  </div>
                  <div className='product_detail'>
                    길이: {product.SIZE_Z} mm
                  </div>
                  <div className='product_detail'>
                    무게: {product.WEIGHT} g
                  </div>
                </a>
                <button onClick={goPartListView} className='absolute partListBtn cursor'>부품목록</button>
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

  const goodsCRUD = () => {
    let test = <div className='mb10'>제품등록</div>
    return test
  }

  const productCRUD = () => {
    let test = <div className='mb10'>상품등록</div>
    return test
  }

  const renderContent = () => {
    switch (currentView) {
      case 'productList':
        return productRender();
      case 'productCRUD':
        return productCRUD();
      default:
        return null;
    }
  };

  const searchContent = () =>{
    
  }

  return (
    <div className='adminWrap'>
      <div onClick={() => setCurrentView('productList')}>상품재고목록</div>  
      <div style={{color: '#b0b0b0'}}>부품재고목록 및 주문</div>  
      <div onClick={() => setCurrentView('goodsCRUD')} className='cursor'>제품등록</div>  
      <div onClick={() => setCurrentView('productCRUD')}>상품등록</div>  
      <button onClick={goMain} className='loginBtn'>메인으로 돌아가기</button>    
      <div className='adminContent'>       
        {/* 검색 */}
        <section className='w100'> 
        <div className='flex'>
          <input type='text' className='search' onChange={(e) => setProductNm(e.target.value)}/>
          <div onClick={searchResProducts} className='searchBtn bgSlate100 fw700 fs18 flex a_i_center j_c_center'>검색</div>
        </div>  
        </section>  
        {currentView === 'default' ? productRender() : renderContent()}                 
              
      </div>
    </div>
  );
}

export default Admin;
