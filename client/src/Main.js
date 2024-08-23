import React, { useState, useEffect, useCallback } from 'react';
import './styles/Common.css'
import Counter from './Counter';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageNation,{resetPageNum} from './PagiNation';
import AppHeader from './AppHeader';
import SelectBox from './SelectBox';

function Main() {  
  const [orderCnt, setOrderCnt]   = useState([]);
  const [username, setUsername]   = useState(null);
  const [searchKeyWord, setSearchKeyWord] = useState('');
  const [productNm, setProductNm] = useState('');
  const [productNo, setProductNo] = useState('');
  const [productObj, setProductObj] = useState({ count: 0, pList: [] });  
  const [optionObj, setOptionObj]       = useState([]);    
  const [optionNo, setOptionNo]         = useState('');
  const [openIndex, setOpenIndex]       = useState(null);  // 열려 있는 셀렉트 박스의 인덱스를 저장
  const navigate = useNavigate();

  // 기본 주문 개수 초기화, 재고가 0인 경우 0으로 설정
  const initializeOrderCnt = (productList) => {
    const initOrderCnt = [];
    for (let i = 0; i < productList.length; i++) {
      initOrderCnt.push(productList[i].COUNT > 0 ? 1 : 0);
    }
    return initOrderCnt;
  };
  

  // 전체 제품 목록 가져오기 or 검색시 대상 제품 목록 가져오기
  const searchResProducts = async () => {    
      try{                
        const res = await axios.post('http://localhost:1092/product/goodList',{
          product_nm : productNm,            // 제품명
          product_id : productNo,            // 제품 ID
        });
  
        // 제품 리스트 설정
        setProductObj({ count: res.data.length, pList: res.data }); 
        
        // 주문 개수 1로 초기화
        setOrderCnt(initializeOrderCnt(res.data));        
        
        // 페이지 넘버 초기화
        resetPageNum();
        
        // 검색 키워드 초기화
        setProductNm('');
        setProductNo('');
  // console.log(res.data);
    }catch(e){
      console.log('제품 목록 가져오기 애러: ' + e);
    }
  };
    
    
  useEffect(() => {
    /* 제품목록 불러오기 */
    searchResProducts();
    
    // 세션에서 사용자 아이디를 가져와서 username에 설정
    const savedUsername = sessionStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    };

    setOptionObj([
      {value: '1', label: '제품명'},
      {value: '2', label: '제품ID'}
    ])
  }, []);


  let hasAlerted = false;
  let prenIndex = -1;
  // 제품 주문 개수 증가
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


  // 제품 주문 개수 감소
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
  // 제품 목록 렌더링
  //***********************************************************************************************
  const productRender = () =>{    
    const productList = [];
    const p_count = productObj.count;   // 제품 전체 개수
    const pList   = productObj.pList;   // 제품 정보    

    for (let i = 0; i < p_count; i++) {
      const product = pList[i];
      let   price   = parseFloat(product.PRICE).toLocaleString('ko-KR');

      //재고 개수가 0개 이하일경우 제품을 출력하지 않고 건너뜀
      if(product.COUNT <= 0){        
        continue;
      }
      
      productList.push(
        <div className='list-item' key={product.PRODUCT_ID}>
            <figure className="thumb-photo" style={{ backgroundImage: `url(/assets/Img/${product.IMAGE})` }}></figure>            
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
        </div>
      )
    }
    return productList;
  }
  //***********************************************************************************************


  //***********************************************************************************************
  // todo 제품 주문 API 요청
  //***********************************************************************************************
  const handleOrder = async() => {
    /* /product/neworder */
    const orderDetails = [];
    const p_count = productObj.count;   // 제품 전체 개수
    for (let i = 0; i < p_count; i++) {
      const product = productObj.pList[i];
      if(orderCnt[i] <= 0){ 
        continue;
      }
      
      orderDetails.push({
        product_id : product.PRODUCT_ID,
        qty   : orderCnt[i]
      });
    }
    
    let orderData = {};
    orderData = {
      user_id : username,
      order   : orderDetails
    }
// console.log('주문 받아요~');    
// console.log(orderData.order);

    // const res = await axios.post('http://localhost:1092/product/neworder',{
    //   user_id : orderData.user_id,
    //   order   : orderData.order,
    // })

    // console.log('주문 결과~');
    
    // console.log(res);
    
  };
  //***********************************************************************************************


  const handleSearchInput = () => {
    if(optionNo === '1' || optionNo === ''){      
      setProductNm(searchKeyWord);
      setProductNo('');
    }else{      
      setProductNo(searchKeyWord);
      setProductNm('');
    }
  }

  // 검색 엔터 이벤트
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchInput();
      searchResProducts();
    }
  };

  // 검색 옵션이 변경되거나 검색키워드가 변경될시 해당 값에 맞는 검색어를 설정
  useEffect(()=>{
    handleSearchInput();
  },[optionNo, searchKeyWord])

  return (
    <div className='MainWrap'>
      <AppHeader/>      
      <div className='MainContent content'>
        <section className="flex mt32">
          <div className="w133 mr11">
            <SelectBox
              title={''}
              options={optionObj}
              val={optionNo}
              setVal={setOptionNo}
              index={0}
              openIndex={openIndex}
              setOpenIndex={setOpenIndex}
            />
          </div>

          {/* 검색 */}
          <section className='flex1'> 
            <div className='flex'>
              <input type='text' className='search' onChange={(e) => setSearchKeyWord(e.target.value)} onKeyDown={(e) => handleKeyPress(e)}/>
              <div onClick={searchResProducts} className='searchBtn bgSlate100 fs16 flex a_i_center j_c_center'>
                검색
              </div>
            </div>  
          </section>   
        </section>        
      
        {/* 제품목록 */}
        <PageNation data = {productRender()} itemsPerPage={5}/>

        <div className='flex'>
          <button className="orderBtn cursor" onClick={handleOrder}><b>주문하기</b></button>
        </div>
      </div>
    </div>
  );
}

export default Main;