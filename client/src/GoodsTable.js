import axios from "axios";
import React, { useState, useEffect } from "react";
import SelectBox from './SelectBox';
import PageNation from './PagiNation';

const GoodsTable = () => {
  const [data, setData] = useState([]); // 상품 목록 데이터
  const [checkedItems, setCheckedItems] = useState([]); // 체크된 항목의 ID
  const [classId, setClassId] = useState('');
  const [productId, setProductId] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [optionNo, setOptionNo] = useState('');
  const [optionObj, setOptionObj] = useState([]);  
  const [searchText, setSearchText] = useState('');
  const [openIndex, setOpenIndex] = useState(null); // 열려 있는 셀렉트 박스의 인덱스를 저장
  const [checkAll, setCheckAll] = useState(false); // 전체 선택 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const itemsPerPage = 20; // 페이지 당 항목 수

  const searchResGoods = async() => {
    try {
      const res = await axios.post('http://localhost:1092/product/goodListAdm',{
        optionNo   : optionNo === '' ? '1' : optionNo,  // 옵션선택이 없을경우 기본 1-제품명
        search_txt : searchText
      });

      console.log('상품목록테이블 조회결과: ');      
      console.log(res);

      setData(res.data);
      setCheckedItems([]); // 새로운 데이터가 로드될 때 체크박스 초기화
      
    } catch (error) {
      console.error('상품 목록 조회 오류:', error);
    }
  }

  const handleCheck = (e, itemId) => {
    const isChecked = e.target.checked;
    setCheckedItems(prev =>
      isChecked ? [...prev, itemId] : prev.filter(id => id !== itemId)
    );
  };

  const handleCheckAll = (e) => {
    const isChecked = e.target.checked;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data.slice(startIndex, endIndex).map(item => item.SERIAL_NO);

    setCheckedItems(isChecked 
      ? [...checkedItems, ...currentItems.filter(id => !checkedItems.includes(id))] 
      : checkedItems.filter(id => !currentItems.includes(id))
    );
    setCheckAll(isChecked);
  };

  const goodDelete = async() => {
    try {
      const res = await axios.post('http://localhost:1092/product/gooddel',{
        class_id    : classId,
        product_id  : productId,
        serial_no   : serialNo,
      });

      console.log('상품삭제결과:', res);

      if(res.data.result === 'Success'){
        alert(`시리얼번호: ${serialNo} 삭제가 완료되었습니다.`);
        searchResGoods();
      }
      
    } catch (error) {
      console.error('상품 삭제 오류:', error);
    }
  }

  useEffect(() => {
    searchResGoods();
    setOptionObj([
      { value: '1', label: '제품명' },
      { value: '2', label: '제조일시' },
      { value: '3', label: '제조라인' },
      { value: '4', label: '일렬번호' }
    ]);
  }, []);

  useEffect(() => {
    if (classId && productId && serialNo) {
      goodDelete();
    }
  }, [classId, productId, serialNo]);

  const setDelData = (classId, productId, serialNo) => {
    setClassId(classId);
    setProductId(productId);
    setSerialNo(serialNo);
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      searchResGoods();
    }
  };

  const renderProductItems = () => {
    return data.map((item, index) => {
      const isEvenRow = index % 2 === 1;
      const rowClass = `grid-item data ${isEvenRow ? 'even' : ''}`;
      const deleteClass = `grid-item data del ${isEvenRow ? 'even' : ''}`;
      const isChecked = checkedItems.includes(item.SERIAL_NO);

      return (
        <React.Fragment key={item.SERIAL_NO}>
          <div className="grid-item checkBox">
            <input
              className="w18 h17"
              type="checkbox"
              onChange={(e) => handleCheck(e, item.SERIAL_NO)}
              checked={isChecked}
            />
          </div>
          <div className={rowClass}>{item.CLASS_ID}</div>
          <div className={rowClass}>{item.PRODUCT_ID}</div>
          <div className={rowClass}>{item.PRODUCT_NM}</div>
          <div className={rowClass}>{item.MANUFACTURING_DTTM}</div>
          <div className={rowClass}>{item.LOT_NO}</div>
          <div className={rowClass}>{item.SERIAL_NO}</div>
          <div
            className={deleteClass}
            onClick={() => setDelData(item.CLASS_ID, item.PRODUCT_ID, item.SERIAL_NO)}
          >
            상품삭제
          </div>
        </React.Fragment>
      );
    });
  };

  return (
    <div className="goodsTableWrap">                       
      <section className='w100'> 
        <div className='flex a_i_center j_c_center mt32 mb30'>
          <div className="w50p table-search-box flex">
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
            <input
              type='text'
              className='search'
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <div onClick={searchResGoods} className='searchBtn bgSlate100 fs16 flex a_i_center j_c_center'>검색</div>
          </div>
        </div>  
      </section> 
      <div className="grid-container">
        <div className="grid-item checkBox">
          <input
            className="w18 h17"
            type="checkbox"
            onChange={handleCheckAll}
            checked={
              data
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .every(item => checkedItems.includes(item.SERIAL_NO))
              && data.length > 0
            }
          />
        </div>
        <div className="grid-item header">모델ID</div>
        <div className="grid-item header">제품ID</div>
        <div className="grid-item header">제품명</div>
        <div className="grid-item header">제조일자</div>
        <div className="grid-item header">제조라인</div>
        <div className="grid-item header">일렬번호</div>
        <div className="grid-item header">상품삭제</div> 

        {/* 상품목록 */}
        <PageNation data={renderProductItems()} itemsPerPage={itemsPerPage} type={'table'} onPageChange={setCurrentPage} />             
      </div>
    </div>
  );
}

export default GoodsTable;
