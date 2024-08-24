import React, {useState, useCallback, useEffect} from 'react';
import './styles/Common.css'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Counter from './Counter';
import AdminHeader from './AdminHeader';

function PartList() {
  const location = useLocation();
  const [productId, setProductId] = useState(location.state?.productId || '');  
  const [productNm, setproductNm] = useState(location.state?.productNm || '');
  const [searchKeyWord, setSearchKeyWord] = useState(productNm);
  const [currentView, setCurrentView] = useState('partList');
  const [orderCnt, setOrderCnt]   = useState([]);
  const [username, setUsername]   = useState(null);  
  const [productObj, setProductObj] = useState({ count: 0, pList: [] });  
  const navigate = useNavigate();

  useEffect(() => {
    /* 부품목록 불러오기 */
    searchResParts();

    // 세션에서 사용자 아이디를 가져와서 username에 설정
    const savedUsername = sessionStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    };
  }, []);

  const goAdmin = () => {
    navigate('/admin');
  };

  // productId가 변경될 때 부품 목록을 가져옴
  useEffect(() => {
    if (productId) {
        searchResParts();
    }
  }, [productId]);

  useEffect(() => {
    if (productObj.pList.length > 0) {
      setOrderCnt(initializeOrderCnt(productObj.pList));
    }
  }, [productObj]);


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


  // 부품 주문 개수 증가
  const handleIncrement = useCallback((index) => {
    setOrderCnt(prevOrderCnt => {
      const newCounts = [...prevOrderCnt];
      newCounts[index] += 1;      
      
      return newCounts;
    });
  }, [productObj]);


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


  //***********************************************************************************************
  // 제품ID 검색(제품명으로 검색시 부품조회에 필요)
  //***********************************************************************************************
  const searchResProduct = async () =>{
    const searchPnm = searchKeyWord === '' ? productNm : searchKeyWord; // 검색 키워드    
    try {
      const res = await axios.post('http://localhost:1092/product/goodList', {
        product_nm: searchPnm, // 상품명
        product_id: '', // 상품 ID
      });

      setProductId(res.data[0].PRODUCT_ID);
      setproductNm(searchPnm);
      searchResParts();
      
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
      const res = await axios.post('http://localhost:1092/part/list',{
        product_id : productId,    // 상품 ID
      });

      console.log('검색 키워드: ');
      console.log(productId);
      
      
      console.log('부품리스트: ');      
      console.log(res);
      
      // 상품 리스트 설정
      setProductObj({ count: res.data.length, pList: res.data });       

    }catch(e){
      console.log('부품 목록 가져오기 애러: ' + e);
    }
  };
  //***********************************************************************************************



  //***********************************************************************************************
  //부품 목록 렌더링
  //***********************************************************************************************
  const productRender = () =>{    
    const productList = [];
    const p_count = productObj.count;   // 부품 전체 개수
    const pList   = productObj.pList;   // 부품 정보    

    for (let i = 0; i < p_count; i++) {
      const part = pList[i];
      
      let price = parseFloat(part.PRICE).toLocaleString('ko-KR');      
      productList.push(
        <li className='mt30 mb44' key={part.PART_NO}>                                    
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
            </div>
            <div className='ml20 flex f_d_column a_i_center j_c_center'>
                <p className='mb10 pt5 pb5 fs16 w100 t_a_center border-top-bottom'>소요수량</p>
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

  return (
    <div className='adminWrap'>
      <AdminHeader currentView={currentView} setCurrentView={handleMenuClick} /> 
      <div className='partListContent mt67'>
        {/* 검색 */}
        <section className='w100 mt32'> 
          <div className='flex'>
            <input type='text' className='search' onChange={(e) => setSearchKeyWord(e.target.value)} value={searchKeyWord}/>
            <div onClick={searchResProduct} className='searchBtn bgSlate100 fw700 fs18 flex a_i_center j_c_center'>검색</div>
          </div>  
        </section>              
        
        {/* 부품목록 */}
        {orderCnt.length > 0 && productRender()}
      </div>
      <div className='flex'>
        <button className="orderBtn cursor"><b>저장하기</b></button>
      </div>
    </div>
  );
}

export default PartList;
