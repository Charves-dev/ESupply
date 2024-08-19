import React, { useState, useEffect } from "react";
import axios from 'axios';
import SelectBox from './SelectBox';
import CommonAlert from './CommonAlert';
import AdminHeader from "./AdminHeader";
import { useNavigate, useLocation } from 'react-router-dom';

const GoodsForm = ({detail='false', detailData=[], setViewDetail}) => {  
  const [classId, setClassId] = useState('');
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [MFD, setMFD] = useState('');           // 제조일자
  const [lotNo, setLotNo] = useState('');       // 제조라인
  const [count, setCount] = useState('');       // 상품개수
  const [serialNo, setSerialNo] = useState('')  // 시리얼 넘버
  
  const [previewUrl, setPreviewUrl] = useState(null);
  const [openIndex, setOpenIndex] = useState(null); // 열려 있는 셀렉트 박스의 인덱스를 저장
  const [commCode, setCommCode] = useState([]);
  const [commProduct, setCommProduct] = useState([]);
  const [alert, setAlert] = useState({ visible: false, type: '', text: '', reload: false });  
  const [isLoading, setIsLoading] = useState(true); // 이미지 로딩 상태를 관리하는 상태 변수
  const [currentView, setCurrentView] = useState('goodsForm');
  const navigate = useNavigate();



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

      // console.log(res);
      
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
        
        // console.log('resProducts');
        // console.log(resProducts);        
        
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


  //***********************************************************************************************
  // 초기화
  //***********************************************************************************************
  useEffect(() => {           
    if(detail === 'false'){       
      searchResProducts();       
      commCodeList();
    }
  }, []);
  //***********************************************************************************************


  //***********************************************************************************************
  // 상품 상세 보기 초기화(데이터 세팅)
  //***********************************************************************************************
  useEffect(() => {
    if(detail === true){     
      // console.log(detailData);
       
      const detail_item_date = detailData.MANUFACTURING_DTTM;
      let year = detail_item_date.substring(0,4);
      let month = detail_item_date.substring(4,6);
      let day = detail_item_date.substring(6,8);
      setMFD(year+month+day);
      setClassId(detailData.CLASS_ID);
      setProductId(detailData.PRODUCT_ID);
      setProductName(detailData.PRODUCT_NM);
      setLotNo(detailData.LOT_NO);     
      setSerialNo(detailData.SERIAL_NO)            
    }
    
    if(productName !== '' && productId !== ''){
      searchResProducts(); 
    }
  }, [detailData, detail, productName, productId])
  //***********************************************************************************************


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
    handleMenuClick('productList');
  }

  // 이미지 로드 완료 시 호출되는 함수
  const handleImageLoad = () => {
    setIsLoading(false); // 로딩 상태를 false로 변경하여 로딩 메시지를 숨김
  };

  const onBackToList = () =>{    
    setViewDetail(false);
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


  return (        
    <form encType="multipart/form-data" onSubmit={handleSubmit}>
      <div className='adminWrap'>
        <div className={detail === true ? 'w100' : 'adminContent content'}>
          <AdminHeader currentView={currentView} setCurrentView={handleMenuClick} /> 
          <div className='formWrap flex f_d_column a_i_center j_c_center'>
            <div className='formTit w100'>{detail === true ? '상품 상세': '상품 입고'}</div>             
            <div className='flex w100'>                    
              <section className='w100'>
                <div className='formLeft'>                   
                  {detail === true ?
                  <>
                    <div className='inputTit'>모델ID</div>
                    <input type="text" name="class_id" value={classId} placeholder="모델ID" readOnly />  
                    <div className='inputTit'>제품ID</div>
                    <input type="text" name="product_id" value={productId} placeholder="제품ID" readOnly />  
                  </>
                  :         
                  <>
                    <SelectBox title={'모델ID'} options={commCode} val={classId} setVal={setClassId} index={0} openIndex={openIndex} setOpenIndex={setOpenIndex}/>      
                    <SelectBox title={'제품ID'} options={commProduct} val={productId} setVal={setProductId} index={1} openIndex={openIndex} setOpenIndex={setOpenIndex}/>                                    
                  </>
                  }              
                  <div className='inputTit'>제품명</div>
                  <input type="text" name="product_nm" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="제품명" readOnly={detail === true}  />
                  <div className='inputTit'>제조일시</div>
                  <input type="text" name="manufacturing_dttm" value={MFD} onChange={(e) => setMFD(e.target.value)} placeholder="제조일시" />
                  <div className='inputTit'>제조라인</div>
                  <input type="text" name="lot_no" value={lotNo} onChange={(e) => setLotNo(e.target.value)} placeholder="제조라인" />
                  {detail === true ? 
                    <>
                      <div className='inputTit'>상품 시리얼 번호</div>
                      <input type="text" name="serial_no" value={serialNo} placeholder="상품시리얼번호" readOnly />
                    </>
                  :
                    <>
                      <div className='inputTit'>상품개수</div>
                      <input type="number" name="count" value={count} onChange={(e) => setCount(e.target.value)} placeholder="상품개수" />
                    </>
                  }
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
            {detail === true ? 
              <div className='w100 flex a_i_center j_c_center mb19'>
                <button type="button" className='w168 h40 mt116 mr25 bgSlate100 fs14 cursor' onClick={onBackToList}>목록으로 가기</button>            
              </div>   
            :
              <div className='w100 flex a_i_center j_c_center mb19'>
                <button type="submit" className='w168 h40 mt116 mr25 bgSlate100 fs14 cursor'>저장</button>
                <button type="button" className='w160 h40 mt116 mr38 cursor fs14 cancle' onClick={reloadPage}>취소</button>
              </div>        
            }
          </div>     
          <div className='alertBg w100 h100' id='customAlertBg'></div>
          {alert.visible && (
            <CommonAlert
              type={alert.type}
              text={alert.text}
              reload={alert.reload}
              reloadPage={'/admin'}
              onClose={setCloseAlert}          
            />
          )}
        </div>
      </div>
    </form>    
  );
}

export default GoodsForm;