import axios from "axios";
import React, { useState, useEffect } from "react";
import SelectBox from './SelectBox';
import PageNation from './PagiNation';
import GoodsForm from "./GoodsForm";
import AdminHeader from "./AdminHeader";
import { useNavigate, useLocation } from 'react-router-dom';

const GoodsTable = ({ resetKey, onBackToList }) => {
  const [data, setData] = useState([]);                    // 상품 목록 데이터
  const [checkedItems, setCheckedItems] = useState([]);    // 체크된 항목의 ID
  const [classId, setClassId]           = useState('');
  const [productId, setProductId]       = useState('');
  const [serialNo, setSerialNo]         = useState('');
  const [optionNo, setOptionNo]         = useState('');
  const [optionObj, setOptionObj]       = useState([]);  
  const [searchText, setSearchText]     = useState('');
  const [openIndex, setOpenIndex]       = useState(null);  // 열려 있는 셀렉트 박스의 인덱스를 저장
  const [checkAll, setCheckAll]         = useState(false); // 전체 선택 상태
  const [currentPage, setCurrentPage]   = useState(1);     // 현재 페이지 번호
  const [viewDetail, setViewDetail]     = useState(false); // 상품 상세 화면 렌더링 조건
  const [detailItem, setDetailItem]     = useState([]);    // 상품 상세 데이터
  const [currentView, setCurrentView]   = useState('default');
  const itemsPerPage = 20; // 페이지 당 항목 수
  const navigate = useNavigate();

  //********************************************************************************************
  // 상품 항목 조회 및 검색 조회
  //********************************************************************************************
  const searchResGoods = async() => {
    try {
      const res = await axios.post('http://localhost:1092/product/goodListAdm',{
        optionNo   : optionNo === '' ? '1' : optionNo,  // 옵션선택이 없을경우 기본 1: 제품명
        search_txt : searchText
      });

      // console.log('상품목록테이블 조회결과: ');      
      // console.log(res);

      setData(res.data);
      setCheckedItems([]); // 새로운 데이터가 로드될 때 체크박스 초기화
      
    } catch (error) {
      console.error('상품 목록 조회 오류:', error);
    }
  }
  //********************************************************************************************



  //********************************************************************************************
  // 초기화
  //********************************************************************************************
  useEffect(() => {    
    searchResGoods();
    setViewDetail(false);
    setOptionObj([
      { value: '1', label: '제품명' },
      { value: '2', label: '제조일시' },
      { value: '3', label: '제조라인' },
      { value: '4', label: '일렬번호' }
    ]);
    
  }, [resetKey]);
  //********************************************************************************************



  //********************************************************************************************
  // 단일 항목 체크/해제
  //********************************************************************************************
  const handleCheck = (e, item) => {
    const isChecked = e.target.checked;
    setCheckedItems(prev => 
      isChecked 
      ? [...prev, { serialNo: item.SERIAL_NO, classId: item.CLASS_ID, productId: item.PRODUCT_ID }] 
      : prev.filter(checkedItem => checkedItem.serialNo !== item.SERIAL_NO)
    );
  };
  //********************************************************************************************


  //********************************************************************************************
  // 항목 전체 체크/해제
  //********************************************************************************************
  const handleCheckAll = (e) => {
    const isChecked = e.target.checked;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data.slice(startIndex, endIndex);

    if (isChecked) {
        // 전체 체크할 때
        setCheckedItems(prevCheckedItems => {
            // currentItems(현재 페이지의 항목) 중에서 기존 checkedItems(체크된 항목들)에 없는 항목들만 추가
            const newCheckedItems = currentItems.filter(item => 
                !prevCheckedItems.find(checkedItem => checkedItem.serialNo === item.SERIAL_NO)
            );
            return [...prevCheckedItems, ...newCheckedItems.map(item => ({
                serialNo: item.SERIAL_NO,
                classId: item.CLASS_ID,
                productId: item.PRODUCT_ID
            }))];
        });
    } else {
        // 전체 체크 해제할 때
        setCheckedItems(prevCheckedItems => {
            // 기존 checkedItems(체크된 항목들)에서 currentItems(현재 페이지의 항목)들을 제거
            return prevCheckedItems.filter(checkedItem =>
                !currentItems.find(item => item.SERIAL_NO === checkedItem.serialNo)
            );
        });
    }

    setCheckAll(isChecked);
  };
  //********************************************************************************************



  //*********************************************************************************************
  // 상품 삭제
  //*********************************************************************************************
  const goodDelete = async() => {
    console.log('삭제요청');
    console.log(checkedItems.length);
    
    //*********************************************************************************************
    // 상품 삭제 대상이 여러개(배열)인 경우
    //*********************************************************************************************
    if(checkedItems.length > 0){
      let res;
      let serial_no_message = '';
      for (let i = 0; i < checkedItems.length; i++) {
        let cur_serial_no = checkedItems[i].serialNo;
        let cur_class_id = checkedItems[i].classId;
        let cur_product_id = checkedItems[i].productId; 

        try {
          res = await axios.post('http://localhost:1092/product/gooddel',{
            class_id    : cur_class_id,
            product_id  : cur_product_id,
            serial_no   : cur_serial_no,
          });

          serial_no_message += i == checkedItems.length-1 ? cur_serial_no : cur_serial_no+', ';
        } catch (error) {
          alert(`항목 삭제에 실패했습니다. 삭제 실패 시리얼번호: ${cur_serial_no}`)
        }
      }

      if(res.data.result === 'Success'){
        alert(`삭제가 완료되었습니다. 시리얼번호: ${serial_no_message} `);
        searchResGoods();
      }

    }
    //*********************************************************************************************
    
    
    //*********************************************************************************************
    // 단일 상품 삭제
    //*********************************************************************************************
    if(checkedItems.length <= 0){
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
    //********************************************************************************************* 
  }
  //********************************************************************************************

  
  //********************************************************************************************
  // 단일 상품 삭제를 위한 State 설정 및 변경 감지 후 삭제 요청 실행
  //********************************************************************************************
  useEffect(() => {
    if (classId && productId && serialNo) {
      goodDelete();
    }
  }, [classId, productId, serialNo]);

  

  const setDelData = (classId, productId, serialNo) => {
    console.log('setDelData');
    
    setClassId(classId);
    setProductId(productId);
    setSerialNo(serialNo);
  }
  //********************************************************************************************

  const handleKeyPress = (event) => { // 검색 엔터 동작
    if (event.key === 'Enter') {
      searchResGoods();
    }
  };

  //********************************************************************************************
  // 상품 상세 보기
  //********************************************************************************************
  const viewGoodDetail = (item) =>{
    setViewDetail(true);
    // viewDetail = true;
    setDetailItem(item);
  }
  //********************************************************************************************



  //********************************************************************************************
  // 상품 항목 렌더링
  //********************************************************************************************
  const renderProductItems = () => {
    return data.map((item, index) => {
      const isEvenRow = index % 2 === 1;
      const rowClass = `grid-item data ${isEvenRow ? 'even' : ''}`;
      const deleteClass = `grid-item data del ${isEvenRow ? 'even' : ''}`;
      const isChecked = checkedItems.find(checkedItem => checkedItem.serialNo === item.SERIAL_NO) !== undefined;

      return (
        <React.Fragment key={item.SERIAL_NO}>
          <div className="grid-item checkBox">
            <input
              className="w18 h17 cursor"
              type="checkbox"
              onChange={(e) => handleCheck(e, item)}
              checked={isChecked}              
            />
          </div>
          <div
            className="grid-item-group cursor"            
            onClick={() => viewGoodDetail(item)}
          >
            <div className={rowClass}>{item.CLASS_ID}</div>
            <div className={rowClass}>{item.PRODUCT_ID}</div>
            <div className={rowClass}>{item.PRODUCT_NM}</div>
            <div className={rowClass}>{item.MANUFACTURING_DTTM}</div>
            <div className={rowClass}>{item.LOT_NO}</div>
            <div className={rowClass}>{item.SERIAL_NO}</div>
          </div>
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
  //********************************************************************************************



  //********************************************************************************************
  // admin 헤더 메뉴 클릭시 호출되는 함수 
  // - URL에 'view' 파라미터를 설정하여 클릭된 뷰를 표시하도록 한다
  // - 예: navigate(`/admin?view=${view}`)는 '/admin' 페이지로 이동하면서, 
  //       해당 뷰를 renderContent에 전달하여 해당하는 함수를 실행한다
  //********************************************************************************************
  const handleMenuClick = (view) => {    
    navigate(`/admin?view=${view}`);
  };
  //********************************************************************************************

  return (
    <>         
      <div className='adminWrap'>
        <AdminHeader currentView={'goodsTable'} setCurrentView={handleMenuClick} />       
        <div className="w100 mt67">
          {viewDetail ? 
            (      
              //********************************************************************************************
              // 상품 상세 화면 전환 jsx
              //********************************************************************************************
              <div className="detailWrap content">
                <GoodsForm detail={true} detailData={detailItem} setViewDetail={setViewDetail}/>
              </div> 
              //********************************************************************************************
            )
            : 
            (
              //********************************************************************************************
              // 상품 테이블 jsx
              //********************************************************************************************
              <div className="goodsTableWrap">      
                {/* 검색 s */}
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
                {/* 테이블 s */}
                <div className="grid-container">
                  <div className="grid-item checkBox">
                  {/* 전체 체크 박스 */}
                  <input
                    className="w18 h17"
                    type="checkbox"
                    onChange={handleCheckAll}
                    checked={
                      data
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .every(item => 
                          checkedItems.some(checkedItem => checkedItem.serialNo === item.SERIAL_NO)
                        )
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

                  {/* 상품목록 페이지 네이션 */}
                  <PageNation data={renderProductItems()} itemsPerPage={itemsPerPage} type={'table'} onPageChange={setCurrentPage} />             
                </div>
              </div>
              //********************************************************************************************
            )
          }
        </div>
      </div>   
    </>
  );
}

export default GoodsTable;
