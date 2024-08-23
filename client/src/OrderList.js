import React, {useState, useEffect} from "react";
import AppHeader from "./AppHeader";
import PageNation,{resetPageNum} from './PagiNation';
import axios from 'axios';
import SelectBox from "./SelectBox";

const OrderList = () => {
  const [searchKeyWord, setSearchKeyWord] = useState('');
  const [productObj, setProductObj] = useState({ count: 0, pList: [] });  
  const [optionObj, setOptionObj]       = useState([]);    
  const [optionNo, setOptionNo]         = useState('1');
  const [openIndex, setOpenIndex]       = useState(null);  // 열려 있는 셀렉트 박스의 인덱스를 저장

  useEffect(() => {
    setOptionObj([
      {value: '1', label: '제품명'},
      {value: '2', label: '제품코드'}
    ])
  },[])


  // 전체 주문 목록 가져오기 또는 검색시 대상 제품 가져오기
  const searchResProducts = async () => {
    const search_key_word = searchKeyWord;
    
  };

  // 검색 엔터 이벤트
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      searchResProducts();
    }
  };

  return(
    <div className="MainWrap">
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
      </div>
    </div>
  )
}

export default OrderList;