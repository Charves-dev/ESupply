import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './styles/Common.css';
import { useNavigate } from 'react-router-dom';
import AppHeader from "./AppHeader";
import AdminHeader from './AdminHeader';
import SelectBox from './SelectBox';

function DeliveryView() {
  const navigate = useNavigate();
  const deliveryViewWrapRef = useRef(null);
  const location = useLocation();
  const { type } = location.state || { type: 'PD' }; // 배송 조회 타입 'PD' : 상품 배송 조회 , 'PT' : 부품 배송 조회
  const { sourcePage } = location.state || { sourcePage: 'main' };
  const [searchOption, setSearchOption] = useState('invoiceNo');
  const [dlGroupCount, setDlGroupCount] = useState(0);
  const [currentView, setCurrentView] = useState( type === 'PD' ? 'pd_delivery_view' : 'pt_delivery_view');
  const [openIndex, setOpenIndex]       = useState(null);  // 열려 있는 셀렉트 박스의 인덱스를 저장
  const [optionObj, setOptionObj] = useState([]);
  // const [sliceCount, setSliceCount] = useState(4);
  let sliceCount = 4;

  useEffect(() => {
    if (deliveryViewWrapRef.current) {
      const count = deliveryViewWrapRef.current.querySelectorAll('.dl-group').length;
      setDlGroupCount(count);      
    }

    setOptionObj([
      {value: 'invoiceNo', label: '송장번호'},
      {value: 'partNo', label: '부품번호'},
      {value: 'productNo', label: '상품번호'},
    ])
  }, []);  

  // 상품 배송상태 가져오기 
  const searchResProduct = async () => {    
    if (searchOption === 'productNo') {
      // 상품 번호로 검색
      alert('상품 번호')
    }else{
      // 송장 번호로 검색
      alert('상품 송장')
    }
  }

  // 부품 배송상태 가져오기 
  const searchResPart = async () => {
    if (searchOption === 'partNo') {
      // 부품 번호로 검색
      alert('부품 번호')
    }else{
      // 송장 번호로 검색
      alert('부품 송장')
    }
  }

  const setSearchKind = () => {
    if (searchOption === 'partNo') {            //상품 번호로 배송 조회시
      searchResPart();
    } else if (searchOption === 'productNo') { //부품 번호로 배송 조회시
      searchResProduct();
    } else {
      if(type === 'PD'){   // 송장 상품 배송 조회
        searchResProduct();
      }else{
        searchResPart(); // 송장 부품 배송 조회
      }
    }
  }


  //********************************************************************************************
  // admin 헤더 메뉴 클릭시 호출되는 함수 
  // URL에 'view' 파라미터를 설정하여 클릭된 뷰를 표시하도록 한다
  //********************************************************************************************
  const handleMenuClick = (view) => {    
    setCurrentView(view);
    navigate(`/admin?view=${view}`);
  };
  //********************************************************************************************


  return(
    <div className={ sourcePage === 'main' ? `MainWrap` : `adminWrap`}>
      { sourcePage === 'main' ? <AppHeader/> : <AdminHeader currentView={currentView} setCurrentView={handleMenuClick} /> }

      <div className='delivery-wrap content w100 h100 mt67'>                    
        {/* 통합 배송 조회 */}
        <section className='w100'> 
          <div className='flex mt32'>
            <div className="w133 mr11">
              <SelectBox options={optionObj} val={searchOption} setVal={setSearchOption} index={0} openIndex={openIndex} setOpenIndex={setOpenIndex}/>     
            </div>
            <input type='text' className='search'/>        
            <div onClick={setSearchKind} className='searchBtn bgSlate100 fw700 fs18 flex a_i_center j_c_center'>검색</div>
          </div>  
        </section>  

        {/* 배송 지도 */}
        <div className='delivery-view-wrap relative' ref={deliveryViewWrapRef} style={{ width: dlGroupCount > 4 ? 'fit-content' : 'auto' }}>
          <section>
            <div className='delivery-view h100 flex a_i_center j_c_center'>          
              <div className='flex a_i_center j_c_center relative'>                            
                <div className='dl-group relative'>
                  <div className='flex f_d_column a_i_center j_c_center'>
                    <figure className="truck-ico" style={{ backgroundImage: `url(/assets/Img/truck.png)`}}>
                    </figure>
                  </div>
                  <div className='delText mt20'>충청한누리대로</div>
                </div>

                <div className='dl-group relative'>
                  <div className='flex f_d_column a_i_center j_c_center'>
                    <figure className="truck-ico" style={{ backgroundImage: `url(/assets/Img/truck.png)`}}>
                    </figure>
                  </div>
                  <div className='delText mt20'>충청한누리대로</div>
                </div>

                <div className='dl-group relative'>
                  <div className='flex f_d_column a_i_center j_c_center'>
                    <figure className="truck-ico" style={{ backgroundImage: `url(/assets/Img/truck.png)`}}>
                    </figure>
                  </div>
                  <div className='delText mt20'>충청한누리대로</div>
                </div>

                <div className='dl-group relative mr0'>                
                  <div className='flex f_d_column a_i_center j_c_center'>
                    <figure className="truck-ico" style={{ backgroundImage: `url(/assets/Img/truck.png)`}}>
                    </figure>
                  </div>
                  <div className='delText mt20'>충청한누리대로</div>
                </div>
                
                <div className='line'></div> 
                <section style={{ display: dlGroupCount > sliceCount ? 'block' : 'none'}}>
                  <img className='deliveryArrow absolute' src="/assets/Img/double-arrow-right.png" alt="Double Arrow Right"/>
                </section>
              </div>            
            </div>              
          </section>                                  

          <section className='lastDlGroup' style={{ display: dlGroupCount > sliceCount ? 'block' : 'none' }}>
            <div className='delivery-view sec2 h100 flex a_i_center'>          
              <div className='flex a_i_center j_c_center relative'>     
                <section style={{ display: dlGroupCount > sliceCount ? 'block' : 'none'}}>
                  <img className='deliveryArrow last absolute' src="/assets/Img/double-arrow-right.png" alt="Double Arrow Right"/>
                </section>
         
                <div className='dl-group relative'>                
                  <div className='flex f_d_column a_i_center j_c_center'>
                    <figure className="truck-ico" style={{ backgroundImage: `url(/assets/Img/truck.png)`}}>
                    </figure>
                  </div>
                  <div className='delText mt20'>충청한누리대로</div>
                </div>

                <div className='dl-group relative'>
                  <div className='flex f_d_column a_i_center j_c_center'>
                    <figure className="truck-ico" style={{ backgroundImage: `url(/assets/Img/truck.png)`}}>
                    </figure>
                  </div>
                  <div className='delText mt20'>충청한누리대로</div>
                </div>

                <div className='dl-group relative mr0 dlArrive'>
                  <div className='flex f_d_column a_i_center j_c_center'>
                    <figure className="truck-ico" style={{ backgroundImage: `url(/assets/Img/truck_check.png)`}}>
                    </figure>
                  </div>
                  <div className='delText mt20'>도착완료!</div>
                </div>

                
                <div className='line'></div>      
              </div>            
            </div>              
          </section>
        </div>  
      </div>
    </div>
  )
}

export default DeliveryView;
