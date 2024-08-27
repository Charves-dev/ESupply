import React, {useEffect, useState, useCallback} from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import AdminHeader from "./AdminHeader";
import FilterSearchBar from "./FilterSearchBar";
import Counter from './Counter';
import PageNation from './PagiNation';

const PartList = () =>{
  const location = useLocation();
  const [currentView, setCurrentView] = useState('partList');
  const [partNm, setPartNm] = useState('');
  const [productId, setPartId] = useState('');
  const [orderCnt, setOrderCnt]   = useState([]);
  const [username, setUsername]   = useState(null);
  const navigate = useNavigate();

  let partObj = {    
    count : 6, 
    pList : [ 
      { product_nm  : "부품명1", 
        product_id  : "cap_2349809" ,
        image       : "/assets/Img/img1.png",
        price       : "20000",
        count       : "3"
      }, 
      { product_nm  : "부품명2", 
        product_id  : "cap_2349810" ,
        image       : "/assets/Img/img2.png",
        price       : "40000",
        count       : "1"
      },
      { product_nm  : "부품명3", 
        product_id  : "cap_2349811" ,
        image       : "/assets/Img/img3.png",
        price       : "50000",
        count       : "5"
      }, 
      { product_nm  : "부품명3", 
        product_id  : "cap_2349811" ,
        image       : "/assets/Img/img3.png",
        price       : "50000",
        count       : "5"
      },  
      { product_nm  : "부품명3", 
        product_id  : "cap_2349811" ,
        image       : "/assets/Img/img3.png",
        price       : "50000",
        count       : "5"
      },  
      { product_nm  : "부품명3", 
        product_id  : "cap_2349811" ,
        image       : "/assets/Img/img3.png",
        price       : "50000",
        count       : "5"
      },   
    ]    
  }


  useEffect(() => {
    /* 부품목록 불러오기 */
    searchResParts();

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


  // 소요수량 초기화
  const initializeOrderCnt = (partList) => {    
    const initOrderCnt = [];
    for (let i = 0; i < partList.length; i++) {
      initOrderCnt.push(partList[i].count);
    }
    return initOrderCnt;
  };


  // 전체 부품 목록 가져오기 or 검색시 대상 부품 목록 가져오기
  const searchResParts = async () => {    
    try{        
      // 부품 재고 개수 설정
      setOrderCnt(initializeOrderCnt(partObj.pList));        
    }catch(e){
      console.log('부품 목록 가져오기 애러: ' + e);
    }
  };


  //***********************************************************************************************
  //부품 목록 렌더링
  //***********************************************************************************************
  const partRender = () =>{    
    const partList = [];
    const p_count = partObj.count;   // 부품 전체 개수
    const pList   = partObj.pList;   // 부품 정보    

    for (let i = 0; i < p_count; i++) {
      const part = pList[i];
      let   price   = parseFloat(part.price).toLocaleString('ko-KR');
      partList.push(
        <div className='list-item a_i_center' key={part.product_id}>
          <figure className="thumb-photo" style={{ backgroundImage: `url(/assets/Img/img1.png)` }}></figure>            
          <div className='desc relative h100'>
              <a>
                <div className='product_nm'>
                  {part.product_nm}
                </div>
                <div className='priceText'>
                  00원
                </div>
                <div className='product_detail'>
                  높이: 00 mm
                </div>
                <div className='product_detail'>
                  너비: 00 mm
                </div>
                <div className='product_detail'>
                  길이: 00 mm
                </div>
                <div className='product_detail'>
                  무게: 00 g
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
              <div className="partOrderBtn w100 flex a_i_center j_c_center">주문</div>
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

  return(
    <div className='adminWrap'>
      <AdminHeader currentView={currentView} setCurrentView={handleMenuClick} />       
      <div className='partListContent content mt67'>
        <FilterSearchBar initialOptionObj={optionObj} setProductNm={setPartNm} setProductId={setPartId} searchRes={searchResParts}/> 
        {/* 부품목록 */}        
        {orderCnt.length > 0 && <PageNation data = {partRender()} itemsPerPage={5}/>}
        <div className="charvesPartsBtn">부품<br/>더보기</div>
      </div>
    </div>
  )
}

export default PartList;