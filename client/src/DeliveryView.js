import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './styles/Common.css';
import { useNavigate } from 'react-router-dom';

function DeliveryView() {
  const location = useLocation();
  const { type } = location.state || { type: 'P' }; // 배송 조회 타입 'P' : 상품 배송 조회 , 'C' : 부품 배송 조회
  const [searchOption, setSearchOption] = useState('invoiceNo');
  const [dlGroupCount, setDlGroupCount] = useState(0);
  const deliveryViewWrapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (deliveryViewWrapRef.current) {
      const count = deliveryViewWrapRef.current.querySelectorAll('.dl-group').length;
      setDlGroupCount(count);      
    }
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
      if(type === 'P'){   // 송장 상품 배송 조회
        searchResProduct();
      }else{
        searchResPart(); // 송장 부품 배송 조회
      }
    }
  }

  const goMain = () => {        
    navigate('/main');
  };

  return(
    <div className='delivery-wrap w100 h100'>
      <div>{type}</div>
      <div className='cursor' onClick={goMain}>메인으로 가기</div>
      {/* 통합 배송 조회 */}
      <section className='w100'> 
        <div className='flex'>
          <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)}>
            <option value='invoiceNo'>송장번호</option>
            <option value='partNo'>부품번호</option>
            <option value='productNo'>상품번호</option>
          </select>
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
                <div className='connect-round1' style={{ display: dlGroupCount > 4 ? 'block' : 'none' }}></div> {/* 마지막줄 마지막 노드에만 추가 */}
                <div className='flex f_d_column a_i_center j_c_center'>
                  <figure className="truck-ico" style={{ backgroundImage: `url(/assets/Img/truck.png)`}}>
                  </figure>
                </div>
                <div className='delText mt20'>충청한누리대로</div>
              </div>
              
              <div className='line'></div>      
            </div>            
          </div>              
        </section>        
        
        <div style={{ display: dlGroupCount > 4 ? 'block' : 'none' }}>
          {/* <div className='connect-round1_1'></div> */}
          <div className='line connect-line' style={{top: '50%', left: '50%'}}></div>
          {/* <div className='connect-round2_2'></div> */}
        </div>

        <section style={{ display: dlGroupCount > 4 ? 'block' : 'none' }}>
          <div className='delivery-view sec2 h100 flex a_i_center'>          
            <div className='flex a_i_center j_c_center relative'>              
              <div className='dl-group relative'>
                <div className='connect-round2' style={{ display: dlGroupCount > 4 ? 'block' : 'none' }}></div> {/* 첫번째줄 처음 노드에만 추가 */}                
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
                  <figure className="truck-ico" style={{ backgroundImage: `url(/assets/Img/truck_check.png)`}}>
                  </figure>
                </div>
                <div className='delText mt20'>도착지</div>
              </div>

              
              <div className='line'></div>      
            </div>            
          </div>              
        </section>
      </div>  
    </div>
  )
}

export default DeliveryView;
