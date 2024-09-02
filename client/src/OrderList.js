import React, {useState, useEffect, useRef} from "react";
import AppHeader from "./AppHeader";
import PageNation,{resetPageNum} from './PagiNation';
import axios from 'axios';
import SelectBox from "./SelectBox";

const OrderList = () => {
  const [searchKeyWord, setSearchKeyWord] = useState('');
  const [productObj, setProductObj]       = useState({ count: 0, pList: [] });  
  const [optionObj, setOptionObj]         = useState([]);    
  const [optionNo, setOptionNo]           = useState('1');
  const [openIndex, setOpenIndex]         = useState(null);  // 열려 있는 셀렉트 박스의 인덱스를 저장
  const tooltipRef                        = useRef(null);
  const labelRef                          = useRef(null);
  const [tooltipWidth, setTooltipWidth]   = useState('auto');
  const [orderCnt, setOrderCnt]   = useState([]);

  let testData = [
    {
      PRODUCT_NM  : "aaaaa",
      COUNT       : 100,
      ORDER_NO    : '1',
      ORDER_DTTM  : '2024-08-30',
      PURCHASE    : 30000,
      BILL_NO     : 'INV-2024-0831-00123',
      DLV_ADDR    : '경기도 성남시 분당구 판교로 235, 네이버 그린팩토리 16층, 비상출입구 옆 복도 끝, 오른쪽 끝에서 두 번째 사무실, 000호',
      ARRIVE_YN   : 'N'
    },
    {
      PRODUCT_NM  : "bbb",
      COUNT       : 100,
      ORDER_NO    : '2',
      ORDER_DTTM  : '2024-08-30',
      PURCHASE    : 30000,
      BILL_NO     : 'INV-2024-0831-00123',
      DLV_ADDR    : '경기도 안양시 동안구 경수대로 500번길 00-00 00층 000호',
      ARRIVE_YN   : 'N'
    },
    {
      PRODUCT_NM  : "ccc",
      COUNT       : 100,
      ORDER_NO    : '3',
      ORDER_DTTM  : '2024-09-01',
      PURCHASE    : 30000,
      BILL_NO     : 'INV-2024-0831-00123',
      DLV_ADDR    : '경기도 안양시 땡떙땡',
      ARRIVE_YN   : 'N'
    },
    {
      PRODUCT_NM  : "ddd",
      COUNT       : 100,
      ORDER_NO    : '3',
      ORDER_DTTM  : '2024-09-02',
      PURCHASE    : 30000,
      BILL_NO     : 'INV-2024-0831-00123',
      DLV_ADDR    : '경기도 안양시 땡떙땡',
      ARRIVE_YN   : 'N'
    },
  ]

  useEffect(() => {
    // 상품 리스트 설정
    setProductObj({ count: 4, pList: testData});
    // 상품 주문 개수 설정
    setOrderCnt(initializeOrderCnt(testData));
    setOptionObj([
      {value: '1', label: '제품명'},
      {value: '2', label: '제품코드'}
    ])

  },[])



  //**********************************************************************************************
  // 상품 주문수 초기화
  //**********************************************************************************************
  const initializeOrderCnt = (productList) => {
    const initOrderCnt = [];
    for (let i = 0; i < productList.length; i++) {
      initOrderCnt.push(productList[i].COUNT);
    }
    return initOrderCnt;
  };
  //**********************************************************************************************


  // 전체 주문 목록 가져오기 또는 검색시 대상 제품 가져오기
  const searchResProducts = async () => {
    const search_key_word = searchKeyWord;    
  };


  //**********************************************************************************************
  // 주문 상품 목록 렌더링
  //**********************************************************************************************
  const productRender = () => {
    const productList = [];
    const p_count = productObj.count; 
    const pList = productObj.pList; 
    let pDateGroup = 0;
    
    for (let i = 0; i < p_count; i++) {
      const product = pList[i];      
      const prevProduct = i > 0 ? pList[i - 1] : null;
      let price = parseFloat(product.PURCHASE).toLocaleString('ko-KR');

      if (prevProduct && product.ORDER_DTTM === prevProduct.ORDER_DTTM) {
        productList.push(
          <div className='list-item' key={product.CLASS_ID + '_' + product.PRODUCT_ID}>
            <div className="list-inner-item flex w100">
              <figure
                className='thumb-photo'
                style={{ backgroundImage: `url(/assets/Img/img1.png)` }}
              ></figure>
              <div className='desc relative'>
                <a>
                  <div className='product_nm'>{product.PRODUCT_NM}</div>
                  <div className='priceText'>{price}원</div>
                  <div className='product_detail'>
                    <span className='label'>주문번호</span> {product.ORDER_NO} {tooltipWidth}
                  </div>
                  <div className='product_detail flex tooltip cursor'>
                    <span className='label'>배송주소</span>                     
                    <div className="tooltipTitBox">
                      <div className="tooltipTit">{product.DLV_ADDR}</div>                        
                    </div>
                    <div className="tooltiptext">{product.DLV_ADDR}</div>                    
                  </div>
                  <div className='product_detail'>
                    <span className='label'>송장번호</span> {product.BILL_NO}
                  </div>
                  <div className='product_detail'>
                    <span className='label'>배송상태</span> { product.ARRIVE_YN === 'N' ? '배송중' : '도착'}
                  </div>
                </a>
              </div>
            </div>
            <div className='countBox ml20 flex f_d_column a_i_center'>
              <p className='mb40 pt5 pb5 fs16 w100 t_a_center border-top-bottom'>주문개수</p>
              <div className='productCount flex f_d_column a_i_center j_c_center'>
                <p>{orderCnt[i]}</p>
              </div>
            </div>
          </div>
        );        
      }else{
        productList.push(<div className="order-date custom-item mt36">{product.ORDER_DTTM}</div>)
        productList.push(
          <div className='list-item group-first' key={product.CLASS_ID + '_' + product.PRODUCT_ID}>
            <div className="list-inner-item flex w100">
              <figure
                className='thumb-photo'
                style={{ backgroundImage: `url(/assets/Img/img1.png)` }}
              ></figure>
              <div className='desc relative'>
                <a>
                  <div className='product_nm'>{product.PRODUCT_NM}</div>
                  <div className='priceText'>{price}원</div>
                  <div className='product_detail'>
                    <span className='label'>주문번호</span> {product.ORDER_NO}
                  </div>
                  <div className='product_detail flex tooltip cursor'>
                    <span className='label'>배송주소</span>                     
                    <div className="tooltipTitBox">
                      <div className="tooltipTit">{product.DLV_ADDR}</div>                        
                    </div>
                    <div className="tooltiptext">{product.DLV_ADDR}</div>                    
                  </div>
                  <div className='product_detail'>
                    <span className='label'>송장번호</span> {product.BILL_NO}
                  </div>
                  <div className='product_detail'>
                    <span className='label'>배송상태</span> { product.ARRIVE_YN === 'N' ? '배송중' : '도착'}
                  </div>
                </a>
              </div>
            </div>
            <div className='countBox ml20 flex f_d_column a_i_center'>
              <p className='mb40 pt5 pb5 fs16 w100 t_a_center border-top-bottom'>주문개수</p>
              <div className='productCount flex f_d_column a_i_center j_c_center'>
                <p>{orderCnt[i]}</p>
              </div>
            </div>
          </div>
        );
      }
    }
    
    return productList;
  };
  //**********************************************************************************************



  // 검색 엔터 이벤트
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      searchResProducts();
    }
  };

  return(
    <div className="MainWrap OrderListWrap">
      <div className="MainContent content">
        <AppHeader/>
        <div className="order-list-wrap w100 h100 mt67">
          <section className="flex">
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
                <input type='text' className='search' onChange={(e) => setSearchKeyWord(e.target.value)} onKeyDown={handleKeyPress}/>
                <div onClick={searchResProducts} className='searchBtn bgSlate100 fs16 flex a_i_center j_c_center'>검색</div>
              </div>  
            </section>  
          </section>
        </div>
        {productObj.pList.length > 0 && <PageNation data={productRender()} itemsPerPage={5}/>}
      </div>
    </div>
  )
}

export default OrderList;