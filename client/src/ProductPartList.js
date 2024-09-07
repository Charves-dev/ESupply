import React, {useState, useCallback, useEffect} from 'react';
import './styles/Common.css'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Counter from './Counter';
import AdminHeader from './AdminHeader';
import PageNation from './PagiNation';
import FilterSearchBar from './FilterSearchBar';
import CommonAlert from './CommonAlert';
const API_URL = process.env.REACT_APP_API_URL;

function ProductPartList() {
  const location = useLocation();
  const [classId, setClassId]         = useState('');
  const [productId, setProductId]     = useState(location.state?.productId || '');  
  const [productNm, setProductNm]     = useState(location.state?.productNm || '');
  const [currentView, setCurrentView] = useState('productPartList');
  const [orderCnt, setOrderCnt]       = useState([]);
  const [username, setUsername]       = useState(null);  
  const [partObj, setPartObj]         = useState({ count: 0, pList: [] });
  const [alert, setAlert]             = useState({ visible: false, type: '', text: '', reload: false });    
  const [addPartNo, setAddPartNo]     = useState('');
  const [addPartCnt, setAddPartCnt]   = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    /* 부품목록 불러오기 */
    searchResParts();

    // 로컬스토리지에서 productId를 가져와서 state에 설정(새로고침으로 인한 삭제를 막기 위함)
    const storedProductId = localStorage.getItem('productId');
    if (storedProductId) {
      setProductId(storedProductId);
    }

    // 세션에서 사용자 아이디를 가져와서 username에 설정
    const savedUsername = sessionStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    };
  }, []);

  // productId가 변경될 때 부품 목록을 가져옴
  useEffect(() => {
    if (productId) {
      searchResParts();
      localStorage.setItem('productId', productId);
    }
  }, [productId]);


  //********************************************************************************************
  // admin 헤더 메뉴 클릭시 호출되는 함수 
  // URL에 'view' 파라미터를 설정하여 클릭된 뷰를 표시하도록 한다
  //********************************************************************************************
  const handleMenuClick = (view) => {    
    setCurrentView(view);
    navigate(`/admin?view=${view}`);
  };
  //********************************************************************************************


   // 소요수량 초기화
   const initializeOrderCnt = (productList) => {
    // console.log(productList);
    const initOrderCnt = [];
    for (let i = 0; i < productList.length; i++) {
      initOrderCnt.push(productList[i].COUNT);            
    }
    return initOrderCnt;
  };


  useEffect(() => {
    if (partObj.pList.length > 0) {
      setOrderCnt(initializeOrderCnt(partObj.pList));  // 소요수량 초기화
    }
  }, [partObj]);


  // 부품 소요 개수 증가
  const handleIncrement = useCallback((index) => {
    setOrderCnt(prevOrderCnt => {
      const newCounts = [...prevOrderCnt];
      newCounts[index] += 1;      
      
      return newCounts;
    });
  }, [partObj]);


  // 부품 소요 개수 감소
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
  // 제품ID 검색(제품명으로 검색시 부품조회에 필요)
  //***********************************************************************************************
  const searchResProduct = async () =>{ 
    try {           
      const res = await axios.post(`${API_URL}/product/goodList`, {
        product_nm: productNm, // 상품명
        product_id: productId, // 상품 ID
      });
      
      setClassId(res.data[0].CLASS_ID);
      setProductId(res.data[0].PRODUCT_ID);   

    } catch (e) {
      console.log('상품 목록 가져오기 애러: ' + e);
    }
  }
  //***********************************************************************************************


  //***********************************************************************************************
  // 전체 부품 목록 가져오기 or 검색시 대상 부품 목록 가져오기
  //***********************************************************************************************
  const searchResParts = async () => {
    try{            
      const res = await axios.post(`${API_URL}/product/part/list`,{
        product_id : productId,    // 상품 ID
      });

      // console.log('부품리스트: ');      
      // console.log(res);
      
      // 상품 리스트 설정
      setPartObj({ count: res.data.length, pList: res.data });       

    }catch(e){
      console.log('부품 목록 가져오기 에러: ' + e);
    }
  };
  //***********************************************************************************************



  //***********************************************************************************************
  // 제품별 부품 목록 렌더링
  //***********************************************************************************************
  const partRender = () =>{    
    const partList = [];
    const p_count = partObj.count;   // 부품 전체 개수
    const pList   = partObj.pList;   // 부품 정보    

    for (let i = 0; i < p_count; i++) {
      const part = pList[i];
      
      let price = parseFloat(part.PRICE).toLocaleString('ko-KR');      
      partList.push(
        <div className='list-item' key={part.PART_NO}>                                    
          <div className='desc relative'>
            <a>
              <div className='product_nm'>
                {part.PART_NM}
              </div>
              <div className='priceText'>
                {price}원
              </div>
              <div className='product_detail'>
                <span className='label'>높이</span> {part.SIZE_Z} mm
              </div>
              <div className='product_detail'>
                <span className='label'>너비</span> {part.SIZE_H} mm
              </div>
              <div className='product_detail'>
                <span className='label'>길이</span> {part.SIZE_V} mm
              </div>
              <div className='product_detail'>
                <span className='label'>무게</span> {part.WEIGHT} g
              </div>
            </a>    
            <button onClick={()=>{savePart(part.PART_NO, orderCnt[i])}} className='absolute partListBtn fs14 bgSlate100 cursor'>
              저장하기
            </button>            
          </div>
          <div className='ml20 flex f_d_column a_i_center j_c_center'>
            <p className='mb10 pt5 pb5 fs16 w100 t_a_center border-top-bottom'>소요수량</p>
            <Counter 
              count={orderCnt[i]}
              onIncrement={() => handleIncrement(i)}
              onDecrement={() => handleDecrement(i)}
              />
          </div>
        </div>
      )
    }
    return partList;
  }
  //***********************************************************************************************
  

  
  //***********************************************************************************************
  // 부품 수량 일괄 저장
  //***********************************************************************************************
  const saveAllParts = async() => {    
    const p_count = partObj.count;
    let res = {};

    try {
      for (let i = 0; i < p_count; i++) {
        const part = partObj.pList[i];
        if(orderCnt[i] <= 0){ 
          continue;
        }    
        
        res = await axios.post('http://localhost:1092/product/part/save',{
          class_id    : classId,
          product_id  : productId,
          part_no     : part.PART_NO,
          count       : orderCnt[i],
        });    
      }

      if(res.data.result === "Success"){
        setAlert({
          visible: true,
          type: 'ok',
          text: '저장이 완료되었습니다.',
          reload: true
        });   
      }else{
        setAlert({
          visible: true,
          type: 'faile',
          text: '저장 실패: ' + res.data.message,
          reload: false
        }); 
      }

    } catch (e) {
      console.log('부품 일괄 저장 에러: ' + e);
      setAlert({
        visible: true,
        type: 'faile',
        text: 'message: ' + e,
        reload: false
      }); 
    }
  }

  //***********************************************************************************************


  //***********************************************************************************************
  // 부품 수량 저장 
  //***********************************************************************************************
  const savePart = async(partNo, qty) => {
    try{            
      const res = await axios.post('http://localhost:1092/product/part/save',{
        class_id    : classId,
        product_id  : productId,
        part_no     : partNo,
        count       : qty,
      });

      if(res.data.result === "Success"){
        setAlert({
          visible: true,
          type: 'ok',
          text: '저장이 완료되었습니다.',
          reload: true
        });   
      }else{
        setAlert({
          visible: true,
          type: 'faile',
          text: '저장 실패: ' + res.data.message,
          reload: false
        }); 
      }
      
    }catch(e){
      console.log('부품 저장 에러: ' + e);
      setAlert({
        visible: true,
        type: 'faile',
        text: 'message: ' + e,
        reload: false
      }); 
    }  
  }
  //***********************************************************************************************



  const addPart = () => {
    document.getElementById('customAlert').style.display = 'flex';
    document.getElementById('customAlertBg').style.display = 'flex';
  };

  const addPartClose = () => {
    document.getElementById('customAlertBg').style.display = 'none';
    document.getElementById('customAlert').style.display = 'none';
  }

  const setCloseAlert = () => {
    setAlert({ ...alert, visible: false });
  };

  const addPartSave = () => {
    savePart(addPartNo, addPartCnt);
    addPartClose();
  }

  
  return (
    <div className='adminWrap'>
      <AdminHeader currentView={currentView} setCurrentView={handleMenuClick} /> 

      {/* 메인 컨텐츠 영역 */}
      <div className='partListContent content mt67'>
        <FilterSearchBar initialValue={productNm} setProductNm={setProductNm} setProductId={setProductId} searchRes={searchResProduct}/>                

        {/* 부품목록(페이지네이션)*/}
        {orderCnt.length > 0 && <PageNation data = {partRender()} itemsPerPage={5}/>}        
      </div>

      {/* 일괄 저장, 부품 추가 버튼 */}
      <div className='addPartBtn' onClick={addPart}>부품<br/>추가</div>
      <div className='flex'>
        <button className="orderBtn cursor" onClick={saveAllParts}><b>일괄 저장하기</b></button>
      </div>

      {/* 알림 배경 */}
      <div className='alertBg w100 h100' id='customAlertBg'></div>

      {/* 저장완료 또는 실패 알림 */}
      {alert.visible && (
        <CommonAlert
          type={alert.type}
          text={alert.text}
          reload={alert.reload}
          reloadPage={`/productPartList`}
          onClose={setCloseAlert}          
        />
      )}

      {/* 부품 추가 팝업 */}
      <div id='customAlert' className='custom-alert partPopup formWrap flex f_d_column a_i_center'>        
        <span className='alert-tit'>부품 추가하기</span>
        
        <ul className="inputList ml10 flex f_d_column a_icenter j_c_center">
          <li className="relative flex mt50">
            <span className="inputLabel">제품ID </span>
            <input className="w277" type='text' value={productId} placeholder="제품ID" readOnly/> 
          </li>
          <li className="relative flex mt20">
            <span className="inputLabel">제품명 </span>
            <input className="w277" type='text' value={productNm} placeholder="제품명" readOnly/>
          </li>
          <li className="relative flex mt20">
            <span className="inputLabel">부품번호 </span>
            <input className="w277" type='text' value={addPartNo} onChange={(e) => setAddPartNo(e.target.value)} placeholder="부품번호"/>
          </li>
          <li className="relative flex mt20">
            <span className="inputLabel">소요개수 </span>
            <input className="w277" type='text' value={addPartCnt} onChange={(e) => setAddPartCnt(e.target.value)} placeholder="소요개수"/>
          </li>
        </ul>
        <div className='w100 flex a_i_center j_c_center mb19'>
          <button type="button" onClick={addPartSave} className='w168 h40 mt116 mr25 bgSlate100 fs14 cursor'>저장</button>
          <button type="button" onClick={addPartClose} className='w160 h40 mt116 mr38 cursor fs14 cancle'>취소</button>
        </div>    
        <div className='deco-pin-l'></div>
        <div className='deco-pin-r'></div>
      </div>
    </div>
  );
}

export default ProductPartList;
