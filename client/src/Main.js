import React, { useState, useEffect, useCallback } from 'react';
import './styles/Common.css'
import Counter from './Counter';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageNation,{resetPageNum} from './PagiNation';
import AppHeader from './AppHeader';
import FilterSearchBar from './FilterSearchBar';
import CommonAlert from './CommonAlert';
const API_URL = process.env.REACT_APP_API_URL;

function Main() {  
  const [orderCnt, setOrderCnt]     = useState([]);
  const [username, setUsername]     = useState(null);  
  const [productNm, setProductNm]   = useState('');
  const [productId, setProductId]   = useState('');
  const [productObj, setProductObj] = useState({ count: 0, pList: [] });  
  const [optionObj, setOptionObj]   = useState([]);   
  const [orderList , setOrderList]  = useState([]); 
  const [totalCnt, setTotalCnt] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [alert, setAlert] = useState({ visible: false, type: '', text: '', reload: false });  
  const navigate = useNavigate();

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
      const res = await axios.post(`${API_URL}/product/goodList`,{
        product_nm : productNm,            // 제품명
        product_id : productId,            // 제품ID
      });        
      
      // 제품 리스트 설정
      setProductObj({ count: res.data.length, pList: res.data }); 
      
      // 주문 개수 1로 초기화
      setOrderCnt(initializeOrderCnt(res.data));        
      
      // 페이지 넘버 초기화
      resetPageNum();
      
      // 검색 키워드 초기화
      setProductNm('');
      setProductId('');
// console.log(res.data);
    }catch(e){
      console.log('제품 목록 가져오기 애러: ' + e);
    }
  };


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
      if (newCounts[index] > 1) {
        newCounts[index] -= 1;
      }
      return newCounts;
    });
  };


  //***********************************************************************************************
  // 제품 주문 API 요청
  //***********************************************************************************************
  const handleOrder = async() => {    
    const orderDetails = [];
    const p_count = orderList.length;   // 주문 품목 전체 개수    
    
    for (let i = 0; i < p_count; i++) {
      const product = orderList[i];
      // if(orderCnt[i] <= 0){ 
      //   continue;
      // }            
      
      orderDetails.push({
        class_id    : product.CLASS_ID,
        product_id  : product.PRODUCT_ID,
        qty         : orderCnt[product.originalIndex]
      });
    }
    
    // let orderData = {};
    // orderData = {
    //   user_id : username,
    //   order   : orderDetails
    // }

    const res = await axios.post(`${API_URL}/order/new`,{
      company_id : 'esupply',
      user_id : username,
      order   : orderDetails,
    })

    // console.log('주문 결과~');    
    // console.log(res);
    if(res.data.result === 'Success'){
      addProductClose();
      setAlert({
        visible: true,
        type: 'ok',
        text: '주문이 완료되었습니다.',
        reload: true
      });        
    }else{
      setAlert({
        visible: true,
        type: 'faile',
        text: '주문 실패: ' + res.data.msg,
        reload: false
      }); 
    }
  };
  //***********************************************************************************************


  const handleShowMessage = () => {
    // if (totalCnt.index === i) {
    setShowMessage(true);
    setFadeOut(false);

    setTimeout(() => {
      setFadeOut(true); // 2.5초 후에 서서히 사라지게 만듦
      setTimeout(() => {
        setShowMessage(false); // 3초 후에 완전히 제거
      }, 500); // 페이드아웃 시간과 동일
    }, 2500); // 2.5초 동안 유지 후 페이드 아웃 시작
    // }
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
          <div className='desc relative'>
            <a>
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
            {/* 장바구니에 담긴 해당 제품의 총 개수 문구*/}
            <div className='relative'>
            { totalCnt.index === i && showMessage ?
              <div className={`totalCntDesc ${fadeOut ? 'fade-out' : 'fade-in'}`}>
                {totalCnt.desc}
              </div>
              :
              <></>
            }
            <button onClick={() => addOrderList(product, price, i)} className='absolute orderAdddBtn fs14 bgSlate100 cursor'>
              장바구니 추가
            </button>
            </div>
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
  // 장바구니 렌더링
  //***********************************************************************************************
  const renderOrderList = () => {
    if(orderList.length <= 0){
      return (
        <div className='flex a_i_center j_c_center f_d_column'>
          <figure className="marketIco" style={{ backgroundImage: `url(/assets/Img/market_ico.png)` }}></figure>
          <div className='mt60 mb68 flex a_i_center j_c_center t_a_center f_d_column'> 
            <div>장바구니에 추가된 항목이 없습니다.</div>
            <div className='fw700'>제품을 추가해주세요.</div>
          </div>
        </div>
      )
    }

    return orderList.map((product, index) => {
      const price = parseFloat(product.PRICE).toLocaleString('ko-KR');
      return (
        <div className='list-item custom-item flex j_c_center mb32' key={product.PRODUCT_ID}>
          <figure className="thumb-photo" style={{ backgroundImage: `url(/assets/Img/${product.IMAGE})`}}></figure>
          <div className='desc w100 relative'>
            <a>
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
            <button className='absolute orderAdddBtn fs14 bgSlate100 cursor' onClick={() => removeFromOrderList(index)}>
              <figure className="trashBasket" style={{ backgroundImage: `url(/assets/Img/trash_basket.png)`}}></figure>
            </button>
          </div>
          <div className='countBox ml20 flex f_d_column a_i_center'>
            <p className='mb40 pt5 pb5 fs16 w100 t_a_center border-top-bottom'>수량</p>
            <div className='productCount flex f_d_column a_i_center j_c_center'>
              <p>{orderCnt[product.originalIndex]}</p>
            </div>
          </div>
        </div>
      );
    });
  };
  //***********************************************************************************************



  // 주문 목록에 제품 추가
  const addOrderList = (product, price, index) => {
    setOrderList(prevOrderList => {
      // 제품이 이미 장바구니에 있는지 확인
      const existingProductIndex = prevOrderList.findIndex(item => item.PRODUCT_ID === product.PRODUCT_ID);
      if (existingProductIndex !== -1) {
        if ( orderCnt[index] <= productObj.pList[index].COUNT ) {          
          // 기존 제품의 수량을 업데이트
          setOrderCnt(prevOrderCnt => {
            const updatedCnt = [...prevOrderCnt];
            updatedCnt[index] = orderCnt[index]; // 현재 index만큼 증가
            return updatedCnt;
          });
          setTotalCnt({ 
            totalCnt: orderCnt[index],
            index: index,
            desc :  (
              <>
                장바구니에 이미 존재하는 상품입니다.<br />
                현재 장바구니에 {orderCnt[index]}개의 상품이 있습니다.
              </>
            )
           });
          handleShowMessage();
        }else{
          alert('최대 재고 개수: ' + productObj.pList[index].COUNT + '를 담으셨습니다')          
        }
        return prevOrderList; // orderList는 그대로 유지
      }else{    
        // 제품 정보에 제품목록에서의 index 추가
        const productWithIndex = { ...product, originalIndex: index };
                 
        setTotalCnt({ 
          totalCnt: orderCnt[index],
          index: index,
          desc :  (
            <>
              장바구니에 상품이 추가되었습니다! <br />
              현재 총 {orderCnt[index]}개의 상품이 있습니다.
            </>
          )
        });
        handleShowMessage();
        // 기존 목록에 제품 추가        
        return [...prevOrderList, productWithIndex];   
      }
    });
  };

  // 주문 목록에서 제품 제거
  const removeFromOrderList = (index) => {
    setOrderList(prevOrderList => prevOrderList.filter((_, i) => i !== index));
  };


  const addProduct = () => {
    document.getElementById('marketPopup').style.display = 'flex';
    document.getElementById('customAlertBg').style.display = 'flex';
  };

  const addProductClose = () => {
    document.getElementById('customAlertBg').style.display = 'none';
    document.getElementById('marketPopup').style.display = 'none';
  }

  const setCloseAlert = () => {
    setAlert({ ...alert, visible: false });
  };

  return (
    <div className='MainWrap'>
      <AppHeader/>      
      <div className='MainContent content'>

        {/* 공통 검색 바 */}
        <FilterSearchBar setProductNm={setProductNm} setProductId={setProductId} searchRes={searchResProducts}/>
      
        {/* 제품목록 */}
        <PageNation data={productRender()} itemsPerPage={5}/>

        {/* 주문 버튼 */}
        <div className='flex'>
          <button className="orderBtn cursor" onClick={addProduct}><b>주문하기</b></button>
        </div>

        {/* 장바구니 배경 */}
        <div className='alertBg w100 h100' id='customAlertBg'></div>

        {/* 장바구니 팝업 */}
        <div id='marketPopup' className='custom-alert orderListPopup productPopup formWrap flex f_d_column a_i_center'>        
          <span className='alert-tit fs24 fw700'>장바구니</span>
          <div className='orderListCont'>{orderList.length > 3 ? <PageNation data={renderOrderList()} itemsPerPage={3}/> : renderOrderList()}</div>
          <div className='w100 flex a_i_center j_c_center mb19'>
            {orderList.length > 0 ?
              <>
                <button type="button" onClick={handleOrder} className='w168 h40 mt60 mr25 bgSlate100 fs14 cursor'>일괄 주문</button>
                <button type="button" onClick={addProductClose} className='w160 h40 mt60 mr38 cursor fs14 cancle'>닫기</button>
              </>
              :
              <button type="button" onClick={addProductClose} className='w160 h40 mt116 mr38 cursor fs14 cancle'>닫기</button>
            }
          </div>    
          <div className='deco-pin-l'></div>          
          <figure className="close-r" onClick={addProductClose} style={{ backgroundImage: `url(/assets/Img/close_ico.png)` }}></figure> 
        </div>

        {/* 주문 완료 알림 */}        
        {alert.visible && (
          <CommonAlert
            type={alert.type}
            text={alert.text}
            reload={alert.reload}
            reloadPage={'/main'}
            onClose={setCloseAlert}          
          />
        )}
      </div>
    </div>
  );
}

export default Main;