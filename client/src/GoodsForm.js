import React, { useState, useEffect } from "react";
import axios from 'axios';
import SelectBox from './SelectBox';
import CommonAlert from './CommonAlert';

const GoodsForm = () => {
  const [image, setImage] = useState(null);
  const [classId, setClassId] = useState('');
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [MFD, setMFD] = useState(''); // 제조일자
  const [lotNo, setLotNo] = useState('');
  const [count, setCount] = useState(''); // 상품개수
  
  const [previewUrl, setPreviewUrl] = useState(null);
  const [openIndex, setOpenIndex] = useState(null); // 열려 있는 셀렉트 박스의 인덱스를 저장
  const [commCode, setCommCode] = useState([]);
  const [commProduct, setCommProduct] = useState([]);
  const [alert, setAlert] = useState({ visible: false, type: '', text: '', reload: false });  
  const [isLoading, setIsLoading] = useState(true); // 이미지 로딩 상태를 관리하는 상태 변수


  //***********************************************************************************************
  // 공통 코드 리스트
  //***********************************************************************************************
  const commCodeList = async () => {
    try {
      const res = await axios.get('http://localhost:1092/comm/codelist', {
        params: {
          group_id: 'CLASS',
        },
      });

      const resCodes = res.data.map((item) => ({
        value: item.CODE_ID,
        label: `${item.CODE_ID} (${item.CODE_NM})`,
      }));

      setCommCode(resCodes);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  //***********************************************************************************************



  //***********************************************************************************************
  // 공통 제품 리스트
  //***********************************************************************************************
  const commProductList = async () =>{
    try {
      const res = await axios.get('http://localhost:1092/comm/productlist',{
        params: {
          class_id: classId,
        },
      })
      
      if(res.data.length !== 0){
        const resProducts = res.data.map((item) => ({
          value: item.PRODUCT_ID,
          label: `${item.PRODUCT_ID} (${item.PRODUCT_NM})`,
          name: `${item.PRODUCT_NM}`,          
        }));
        
        console.log('resProducts');
        console.log(resProducts);        
        
        setCommProduct(resProducts);      
      }else{
        //제품ID가 없을경우 빈값으로 설정
        setCommProduct('');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }    
  }
  //***********************************************************************************************



  //***********************************************************************************************
  // 상품 상세 (이미지 가져오기용) 
  //***********************************************************************************************
  const searchResProducts = async () => {
    const search_key_word = productName;
    try{
      const res = await axios.post('http://localhost:1092/product/goodList',{
        product_nm : search_key_word,            // 상품명
        product_id : productId,                  // 상품 ID
      });

      setPreviewUrl(res.data[0].IMAGE);             // 이미지 세팅
// console.log('IMAGE_Res: ');
// console.log(res.data[0].IMAGE);
    }catch(e){
      console.log('상품 목록 가져오기 애러: ' + e);
    }
  };
  //***********************************************************************************************


  useEffect(() => {
    commCodeList();  
  }, []);


  useEffect(() => {
    if (classId !== '') {
      commProductList();
    }
  }, [classId])


  useEffect(() => {    
    if(commProduct){
      const foundProduct = commProduct.find(option => option.value === productId);
      if (foundProduct) {
          setProductName(foundProduct.name);        
          searchResProducts();
          // setPreviewUrl(foundProduct.image);
      }    
    }
  }, [productId])


  useEffect(() => {
    setIsLoading(true);
  }, [previewUrl]);


  //*************************************************************************************************
  // 제품 등록 
  //*************************************************************************************************
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 유효성 검사
    if (!classId || !productId || !productName || !MFD || !lotNo || !count){      
      setAlert({
        visible: true,
        type: 'faile',
        text: '모든 항목을 빠짐없이 넣어주세요.',
        reload: false
      });
      return;   
    }


    try {
      const response = await axios.post('http://localhost:1092/product/addgoods', {
        class_id: classId,
        product_id: productId,
        product_nm: productName,
        manufacturing_dttm: MFD,
        lot_no: lotNo,
        count: count
      });      

      console.log('response:');      
      console.log(response);
            
      const data = response.data      
      
      if (data.SERIAL_NOS.length > 0) {
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
          text: '저장 실패: ' + response.data.message,
          reload: false
        }); 
      }

    } catch (error) {
      console.error('Error product add:', error);
      setAlert({
        visible: true,
        type: 'faile',
        text: 'message: ' + error,
        reload: false
      });      
    }
  };
  //*************************************************************************************************


  const setCloseAlert = () => {
    setAlert({ ...alert, visible: false });
  };

  const reloadPage = () =>{
    window.location.reload()
  }

  // 이미지 로드 완료 시 호출되는 함수
  const handleImageLoad = () => {
    setIsLoading(false); // 로딩 상태를 false로 변경하여 로딩 메시지를 숨김
  };

  return (        
    <form encType="multipart/form-data" onSubmit={handleSubmit}>
      <div className='formWrap flex f_d_column a_i_center j_c_center'>
        <div className='formTit w100'>상품 입고</div>             
        <div className='flex w100'>                    
          <section className='w100'>
            <div className='formLeft'>                
              <SelectBox title={'모델ID'} options={commCode} val={classId} setVal={setClassId} index={0} openIndex={openIndex} setOpenIndex={setOpenIndex}/>      
              <SelectBox title={'제품ID'} options={commProduct} val={productId} setVal={setProductId} index={1} openIndex={openIndex} setOpenIndex={setOpenIndex}/>                                    
              <div className='inputTit'>제품명</div>
              <input type="text" name="product_nm" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="제품명" readOnly />
              <div className='inputTit'>제조일시</div>
              <input type="text" name="manufacturing_dttm" value={MFD} onChange={(e) => setMFD(e.target.value)} placeholder="제조일시" />
              <div className='inputTit'>제조라인</div>
              <input type="text" name="lot_no" value={lotNo} onChange={(e) => setLotNo(e.target.value)} placeholder="제조라인" />
              <div className='inputTit'>상품개수</div>
              <input type="number" name="count" value={count} onChange={(e) => setCount(e.target.value)} placeholder="상품개수" />
            </div>
          </section>
          <section className='w100'>
            <div className='formRight'>  
              <div className='inputTit'>등록된 사진</div>          
              {/* 제품 이미지 불러오기 */}
              {previewUrl && previewUrl !== 'null' ? (                
                <div>
                  {isLoading && (
                    <div style={{ width: '100%', textAlign: 'center', color: '#a9a9a9' }}>
                      로딩 중...
                    </div>
                  )}
                  <img
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      display: isLoading ? 'none' : 'block' // 로딩 중에는 숨김
                    }}
                    src={`/assets/Img/${previewUrl}`}
                    alt="Uploaded"
                    onLoad={handleImageLoad} // 이미지가 로드되면 상태 변경
                  />
                  {!isLoading && (
                    <>
                      <div className='mt15 mb8 fs14' style={{ color: '#a9a9a9' }}>썸네일</div>
                      <img
                        style={{
                          width: '141px',
                          height: '138px',
                          objectFit: 'cover',
                          backgroundPosition: 'center',
                        }}
                        src={`/assets/Img/${previewUrl}`}
                        alt="Uploaded"
                      />
                    </>
                  )}
                </div>               
              ) : (
                // 이미지가 없는경우 기본 박스 렌더링
                <div>
                  <div className='noneImgBox w100 flex a_i_center j_c_center bgSlate100 mb40'>이미지</div>
                  <div className='noneImgThumb flex a_i_center j_c_center bgSlate100'>썸네일</div>
                </div>
              )}                            
            </div>
          </section>
        </div>         
        <div className='w100 flex a_i_center j_c_center mb19'>
          <button type="submit" className='w168 h40 mt116 mr25 bgSlate100 fs14 cursor'>저장</button>
          <button type="button" className='w160 h40 mt116 mr38 cursor fs14 cancle' onClick={reloadPage}>취소</button>
        </div>        
      </div>     
      <div className='alertBg w100 h100' id='customAlertBg'></div>
      {alert.visible && (
        <CommonAlert
          type={alert.type}
          text={alert.text}
          reload={alert.reload}
          onClose={setCloseAlert}          
        />
      )}
    </form>    
  );
}

export default GoodsForm;