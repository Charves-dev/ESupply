import axios from "axios";
import React, {useState, useEffect} from "react";

const GoodsTable = () => {
  const [data, setData] = useState([]);
  const [classId, setClassId] = useState('');
  const [productId, setProductId] = useState('');
  const [serialNo, setSerialNo] = useState('');

  const searchResGoods = async() => {
    const optionNo = '';
    const search_txt = '';
    try {
      const res = await axios.post('http://localhost:1092/product/goodListAdm',{
        optionNo   : optionNo,
        search_txt : search_txt
      });

      console.log('상품목록테이블 조회결과: ');      
      console.log(res);

      setData(res.data);
      
    } catch (error) {
      
    }
  }

  const goodDelete = async() => {
    console.log(classId);
    console.log(productId);
    console.log(serialNo);
    
    try {
      const res = await axios.post('http://localhost:1092/product/gooddel',{
        class_id    : classId,
        product_id  : productId,
        serial_no   : serialNo,
      });

      console.log('상품삭제결과');
      console.log(res);

      if(res.data.result == 'Success'){
        alert(`시리얼번호: ${serialNo} 삭제가 완료되었습니다.`)
        searchResGoods();
      }
      
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    searchResGoods();
  },[])

  useEffect(() => {
    // 클래스 ID, 제품 ID, 시리얼 번호가 모두 설정된 상태일떄 삭제 함수 호출
    if (classId && productId && serialNo) {
      goodDelete();
    }
  }, [classId, productId, serialNo]);

  const setDelData = (classId, productId, serialNo) =>{
    setClassId(classId);
    setProductId(productId);
    setSerialNo(serialNo);
  }


  return (
    <div>
      <button onClick={goodDelete}>삭제테스트</button>
      <div className="grid-container">        
        <div className="grid-item checkBox"><input className="w18 h17" type="checkBox"/></div>
        <div className="grid-item header">모델ID</div>
        <div className="grid-item header">제품ID</div>
        <div className="grid-item header">제품명</div>
        <div className="grid-item header">제조일자</div>
        <div className="grid-item header">제조라인</div>
        <div className="grid-item header">일렬번호</div>
        <div className="grid-item header">상품삭제</div>              

        {
          data.map((item,index)=>
            {
              const isEvenRow   = index % 2 === 1;
              const rowClass    = `grid-item data ${index % 2 === 1 ? 'even' : ''}`; // 짝수일경우 .even클래스를추가
              const deleteClass = `grid-item data del ${isEvenRow ? 'even' : ''}`;  // .del 클래스 추가
              return (            
                <React.Fragment key={index}>
                  <div className="grid-item checkBox"><input className="w18 h17" type="checkBox"/></div>
                  <div className={rowClass}>{item.CLASS_ID}</div>
                  <div className={rowClass}>{item.PRODUCT_ID}</div>
                  <div className={rowClass}>{item.PRODUCT_NM}</div>
                  <div className={rowClass}>{item.MANUFACTURING_DTTM}</div>
                  <div className={rowClass}>{item.LOT_NO}</div>
                  <div className={rowClass}>{item.SERIAL_NO}</div>
                  <div className={deleteClass} onClick={()=>{setDelData(item.CLASS_ID, item.PRODUCT_ID, item.SERIAL_NO)}}>
                    상품삭제
                  </div>
                </React.Fragment>
              )
            }
          )
        }
      </div>
    </div>
  )
}

export default GoodsTable;