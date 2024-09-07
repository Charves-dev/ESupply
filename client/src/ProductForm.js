import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SelectBox from './SelectBox';
import CommonAlert from './CommonAlert';
import AdminHeader from "./AdminHeader";
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL;

const ProductForm = () => {
  const [image, setImage] = useState(null);
  const [classId, setClassId] = useState('');
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [sizeH, setSizeH] = useState('');
  const [sizeV, setSizeV] = useState('');
  const [sizeZ, setSizeZ] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [openIndex, setOpenIndex] = useState(null); // 열려 있는 셀렉트 박스의 인덱스를 저장
  const [commCode, setCommCode] = useState([]);
  const [alert, setAlert] = useState({ visible: false, type: '', text: '', reload: false });
  const navigate = useNavigate();

  const commCodeList = async () => {
    try {
      console.log('공통코드 가져오기 URL: ');
      console.log(`${API_URL}/comm/codelist`);
      
      
      const res = await axios.get(`${API_URL}/comm/codelist`, {
        params: {
          group_id: 'CLASS',
        },
      });

      console.log('공통코드_res: ');      
      console.log(res);

      const resCodes = res.data.map((item) => ({
        value: item.CODE_ID,
        label: `${item.CODE_ID} (${item.CODE_NM})`,
      }));
      
      setCommCode(resCodes);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  useEffect(() => {
    commCodeList();  
  }, []);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedFileName(file.name);
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    console.log(file);
  };

  //*************************************************************************************************
  // 제품 등록 
  //*************************************************************************************************
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 유효성 검사
    if (!image || !classId || !productId || !productName || !price || !weight || !sizeH || !sizeV || !sizeZ){      
      setAlert({
        visible: true,
        type: 'faile',
        text: '모든 항목을 빠짐없이 넣어주세요.',
        reload: false
      });
      return;   
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('class_id', classId);
    formData.append('product_id', productId);
    formData.append('product_nm', productName);
    formData.append('price', price);
    formData.append('weight', weight);
    formData.append('size_h', sizeH);
    formData.append('size_v', sizeV);
    formData.append('size_z', sizeZ);

    try {
      console.log('제품등록URL: ');
      console.log(`${API_URL}/product/addgoods`);      
      
      const response = await axios.post(`${API_URL}/product/addgoods`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });      
      
      if (response.data.result == "Success") {
        console.log(response);        
        setAlert({
          visible: true,
          type: 'ok',
          text: '저장이 완료되었습니다.',
          reload: true
        });        
      }else{
        console.log('제품등록 실패: ');
        console.log(response);        
        setAlert({
          visible: true,
          type: 'faile',
          text: '저장 실패: ' + response.data.message,
          reload: true
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


  //*************************************************************************************************
  // 제품 삭제
  //*************************************************************************************************
  const deleteProduct = async (e) => {
    try {
      const response = await axios.post(`${API_URL}/product/delete`, {
          class_id: classId,
          product_id: productId
      });     
      
      if (response.data.result == "Success") {
        setAlert({
          visible: true,
          type: 'ok',
          text: '삭제가 완료되었습니다.',
          reload: true
        });        
      }else{
        setAlert({
          visible: true,
          type: 'faile',
          text: '삭제 실패: ' + response.data.message,
          reload: false
        }); 
      }      
    } catch (error) {
      console.error('Error product delete:', error);
      setAlert({
        visible: true,
        type: 'faile',
        text: 'message: ' + error,
        reload: false
      }); 
    }
  }
  //*************************************************************************************************



  const setCloseAlert = () => {
    setAlert({ ...alert, visible: false });
  };

  const reloadPage = () =>{
    handleMenuClick('productList')
  }

  //********************************************************************************************
  // admin 헤더 메뉴 클릭시 호출되는 함수 
  // URL에 'view' 파라미터를 설정하여 클릭된 뷰를 표시하도록 한다
  //********************************************************************************************
  const handleMenuClick = (view) => {    
    navigate(`/admin?view=${view}`);
  };
  //********************************************************************************************

  return (        
    <form encType="multipart/form-data" onSubmit={handleSubmit}>
      <div className='adminWrap'>
        <div className='adminContent content'>
          <AdminHeader currentView={'productForm'} setCurrentView={handleMenuClick} /> 
          <div className='formWrap flex f_d_column a_i_center j_c_center'>
            <div className='formTit w100'>제품 등록</div>             
            <div className='flex w100'>                    
              <section className='w100'>
                <div className='formLeft'>                
                  <SelectBox title={'모델ID'} options={commCode} val={classId} setVal={setClassId} index={0} openIndex={openIndex} setOpenIndex={setOpenIndex}/>                        
                  <div className='inputTit'>제품ID</div>
                  <input type="text" name="product_id" value={productId} onChange={(e) => setProductId(e.target.value)} placeholder="제품ID" />              
                  <div className='inputTit'>제품명</div>
                  <input type="text" name="product_nm" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="제품명" />
                  <div className='inputTit'>기본가격</div>
                  <input type="text" name="price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="기본가격" />
                  <div className='inputTit'>무게</div>
                  <input type="text" name="weight" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="무게" />
                  <div className='inputTit'>너비</div>
                  <input type="text" name="size_h" value={sizeV} onChange={(e) => setSizeV(e.target.value)} placeholder="가로크기" />
                  <div className='inputTit'>길이</div>
                  <input type="text" name="size_v" value={sizeZ} onChange={(e) => setSizeZ(e.target.value)} placeholder="세로크기" />
                  <div className='inputTit'>높이</div>
                  <input type="text" name="size_z" value={sizeH} onChange={(e) => setSizeH(e.target.value)} placeholder="높이" />
                </div>
              </section>
              <section className='w100'>
                <div className='formRight'>
                  <div className='inputTit'>사진 등록</div>
                  {/* 실제 파일 입력 필드 (숨겨진 상태) */}
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="fileInput"
                  />

                  <div className='flex mb15'>
                    {/* 커스텀 파일 선택 버튼 */}
                    <button type='button' className='file-sel-btn mr11 cursor' onClick={() => document.getElementById('fileInput').click()}>
                      파일 선택
                    </button>

                    {/* 선택된 파일명 표시 */}            
                    <input className="file-name mb0" value={`${selectedFileName}`} placeholder='파일명' readOnly/>
                  </div>

                  {/* 이미지 미리 보기 */}
                  {previewUrl ? (
                    <div>                
                      <img style={{width: '100%', height: 'auto', objectFit: 'contain' }} src={previewUrl} alt="Uploaded" />
                      <div className='mt15 mb8 fs14' style={{color: '#a9a9a9'}}>썸네일</div>
                      <img style={{width: '141px', height: '138px', objectFit: 'cover', backgroundPosition: 'center'}} src={previewUrl} alt="Uploaded" />
                    </div>
                  ) : (
                    <div>
                      <div className='noneImgBox w100 flex a_i_center j_c_center bgSlate100 mb40'> 이미지를 업로드 해주세요 </div>
                      <div className='noneImgThumb flex a_i_center j_c_center bgSlate100'>썸네일</div>
                    </div>
                  )}
                  <div className='w100 flex mb19'>
                    <button type="submit" className='w100 h40 mt46 mr25 bgSlate100 fs14 cursor'>저장</button>
                    <button type="button" className='w100 h40 mt46 cursor fs14 cancle' onClick={reloadPage}>취소</button>
                  </div>
                  <button type="button" onClick={deleteProduct} className='w100 delete fs16 cursor'>제품삭제</button>
                </div>
              </section>
            </div> 
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
};

export default ProductForm;
