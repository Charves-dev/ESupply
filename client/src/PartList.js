import React, {useEffect, useState, useCallback} from "react";
import { useNavigate } from 'react-router-dom';
import AdminHeader from "./AdminHeader";
import FilterSearchBar, {getOrderNo} from "./FilterSearchBar";
import Counter from './Counter';
import PageNation from './PagiNation';
import axios from "axios";
import CommonAlert from './CommonAlert';
const API_URL = process.env.CHARVES_REACT_APP_API_URL;

const PartList = () =>{  
  const [currentView, setCurrentView] = useState('partList');
  const [partNm, setPartNm]           = useState('');
  const [partId, setPartId]           = useState('');
  const [orderCnt, setOrderCnt]       = useState([]);
  const [username, setUsername]       = useState(null);
  const [partObj , setPartObj]        = useState([]);
  const [alert, setAlert]             = useState({ visible: false, type: '', text: '', reload: false });
  const navigate = useNavigate();


  useEffect(() => {
    /* 부품목록 불러오기 */
    searchCharvesParts();

    // 세션에서 사용자 아이디를 가져와서 username에 설정
    const savedUsername = sessionStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    };
  }, []);


  //********************************************************************************************
  // admin 헤더 메뉴 클릭시 호출되는 함수 
  // URL에 'view' 파라미터를 설정하여 클릭된 뷰를 표시하도록 한다
  //********************************************************************************************
  const handleMenuClick = (view) => {    
    setCurrentView(view);
    navigate(`/admin?view=${view}`);
  };
  //********************************************************************************************


  let hasAlerted = false;
  let prenIndex = -1;
  // 부품 주문 개수 증가
  const handleIncrement = useCallback((index) => {
    setOrderCnt(prevOrderCnt => {
      const newCounts = [...prevOrderCnt];
      newCounts[index] += 1;      
      
      return newCounts;
    });
  }, [partObj]);


  // 부품 주문 개수 감소
  const handleDecrement = (index) => {
      setOrderCnt(prevOrderCnt => {
        const newCounts = [...prevOrderCnt];
        if (newCounts[index] > 0) {
          newCounts[index] -= 1;
        }
        return newCounts;
      });
  };


  // 부품 주문 수량 초기화 기본 1개로 고정, 재고가 0인경우 0으로 설정
  const initializeOrderCnt = (partList) => {    
    const initOrderCnt = [];
    for (let i = 0; i < partList.length; i++) {
      initOrderCnt.push(partList[i].CNT > 0 ? 1 : 0);
    }
    return initOrderCnt;
  };

  //***********************************************************************************************
  // (주)차베스 부품 주문
  //***********************************************************************************************
  const orderPart = async(prductId, count)=>{
    try{
      const res = await axios.post(`http://3.39.248.72:7943/order/new`,{
        user_id : username,
        company_id : "esupply",
        orderInfo : [
            { "product_id" : prductId, "count" : count },
        ]
      })

      console.log('주문 결과~');    
      console.log(res);

      if (res.data.result == "Success") {
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
          text: '주문 실패: ' + res.data.message,
          reload: false
        }); 
      }      

    }catch(e){
      console.log('부품주문 에러: ' + e);      
    }
  }
  //***********************************************************************************************


  //***********************************************************************************************
  // (주)차베스 전체 부품 목록 가져오기 or 검색시 대상 부품 목록 가져오기
  //***********************************************************************************************
  const searchCharvesParts = async () => {    
    try{        
      const orderNumber = getOrderNo();
// console.log(orderNumber);
// console.log(partNm);
      
      
      const res = await axios.post(`http://3.39.248.72:7943/goods/list`,{
        optionNo:  orderNumber,
        searchTxt: orderNumber === '1' ? partNm : partId        
      })
console.log('(주)차베스 부품목록가져오기: ');
console.log(res);
      
      setPartObj({ count: res.data.length, pList: res.data });

      // 부품 주문 수량 초기화, 기본 1로 설정, 재고가 0인경우 0으로 설정
      setOrderCnt(initializeOrderCnt(res.data));        

      // 검색 키워드 초기화
      setPartNm('');
      setPartId('');

      // Esupply에서 부품 재고 수량 검색...하려다가 중단
      // for (let i = 0; i < res.data.length; i++) {
        // console.log(res.data[i].PRODUCT_ID);        
        // partDetail('');        
      // }
    }catch(e){
      console.log('부품 목록 가져오기 에러: ' + e);
    }
  };
  //***********************************************************************************************


  //***********************************************************************************************
  // Esupply 대상 부품 재고 정보 가져오기
  //***********************************************************************************************
  // const partDetail = async(productId) => {
  //   const res = await axios.post('http://localhost:7943/product/part/detail',{
  //     part_no: 'CAF054GU8901X',
  //   })
  //   console.log('Esupply 부품 재고 개수 가져오기: ');
    
  //   console.log(res);    
  //   // return res.data.COUNT;
  // }
  //***********************************************************************************************


  //***********************************************************************************************
  // 부품 목록 렌더링
  //***********************************************************************************************
  const partRender = () =>{    
    const partList = [];
    const p_count = partObj.count;   // 부품 전체 개수
    const pList   = partObj.pList;   // 부품 정보    

    for (let i = 0; i < p_count; i++) {
      const part = pList[i];
      let   price   = parseFloat(part.PRICE).toLocaleString('ko-KR');

      //(주)charves에서 재고 개수가 없을경우 출력하지 않고 건너뜀
      // if(part.CNT <= 0){        
      //   continue;
      // }

      partList.push(
        <div className='list-item a_i_center' key={part.product_id}>
          <figure className="thumb-photo" style={{ backgroundImage: `url(/assets/Img/img1.png)` }}></figure>            
          <div className='desc relative h100'>
              <a>
                <div className='product_nm'>
                  {part.PRODUCT_NM}
                </div>
                <div className='priceText'>
                  {price}원
                </div>
                <div className='product_detail'>
                  높이: {part.SIZE_Z} mm
                </div>
                <div className='product_detail'>
                  너비: {part.SIZE_H} mm
                </div>
                <div className='product_detail'>
                  길이: {part.SIZE_V} mm
                </div>
                <div className='product_detail'>
                  무게: {part.WEIGHT} g
                </div>
              </a>                
          </div>
          <div className='ml20 flex f_d_column a_i_center j_c_center'>
              <p className='mb10 pt5 pb5 fs16 w100 t_a_center border-top-bottom'>수량</p>
              <Counter 
                count={part.CNT <= 0 ? '재고없음' : orderCnt[i]}
                onIncrement={() => handleIncrement(i)}
                onDecrement={() => handleDecrement(i)}
              />
              <div 
                className={part.CNT <= 0 ? `partOrderBtn disabled` : `partOrderBtn`}
                onClick={(e) => {
                  if (part.CNT > 0) {
                    orderPart(part.PRODUCT_ID, orderCnt[i]);
                  }
                }}
              >
                {part.CNT <= 0 ? '주문불가' : '주문'}
              </div>
          </div>
        </div>
      )
    }
    return partList;
  }
  //***********************************************************************************************


  // 검색 옵션
  const optionObj = [
    {value: '1', label: '부품명'},
    {value: '2', label: '부품번호'}
  ]


  // (주)차베스로 이동
  const charvesGo = () => {
    window.location.href = `http://3.39.248.72:7943/parts_show`;
  }

  const setCloseAlert = () => {
    setAlert({ ...alert, visible: false });
  };

  return(
    <div className='adminWrap'>
      <AdminHeader currentView={currentView} setCurrentView={handleMenuClick} />       
      <div className='partListContent content mt67'>
        <FilterSearchBar initialOptionObj={optionObj} setProductNm={setPartNm} setProductId={setPartId} searchRes={searchCharvesParts}/> 
        {/* 부품목록 */}        
        {orderCnt.length > 0 && <PageNation data = {partRender()} itemsPerPage={5}/>}
        <div className="charvesPartsBtn" onClick={charvesGo}>부품<br/>더보기</div>
      </div>
      <div className='alertBg w100 h100' id='customAlertBg'></div>
      {alert.visible && (
        <CommonAlert
          type={alert.type}
          text={alert.text}
          reload={alert.reload}
          reloadPage={'/partList'}
          onClose={setCloseAlert}          
        />
      )}
    </div>
  )
}

export default PartList;