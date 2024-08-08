import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SelectBox from './SelectBox';
import CommonAlert from './CommonAlert';

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
  // const [commProduct, setCommProduct] = useState([]);

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

  // const commProductList = async () =>{
  //   try {
  //     const res = await axios.get('http://localhost:1092/comm/productlist',{
  //       params: {
  //         class_id: classId,
  //       },
  //     })
      
  //     if(res.data.length !== 0){
  //       const resProducts = res.data.map((item) => ({
  //         value: item.PRODUCT_ID,
  //         label: `${item.PRODUCT_ID} (${item.PRODUCT_NM})`,
  //       }));
        
  //       console.log('resProducts');
  //       console.log(resProducts);
        
        
  //       setCommProduct(resProducts);
  //     }else{
  //       //제품ID가 없을경우 빈값으로 설정
  //       setCommProduct('');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }    
  // }
  

  useEffect(() => {
    commCodeList();  
  }, []);

  // useEffect(() => {
  //   if (classId !== '') {
  //     commProductList();
  //   }
  // }, [classId])

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedFileName(file.name);
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    console.log(file);
  };

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
      const response = await axios.post('http://localhost:1092/product/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });      
      
      if (response.data.result == "Success") {
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
          reload: true
        }); 
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      setAlert({
        visible: true,
        type: 'faile',
        text: 'message: ' + error,
        reload: false
      });      
    }
  };


  const deleteProduct = async (e) => {
    alert('삭제 API 개발중')
  }

  const setCloseAlert = () => {
    setAlert({ ...alert, visible: false });
  };

  const reloadPage = () =>{
    window.location.reload()
  }

  return (        
    <form encType="multipart/form-data" onSubmit={handleSubmit}>
      <div className='formWrap flex f_d_column a_i_center j_c_center'>
        <div className='formTit w100'>제품 등록</div>             
        <div className='flex w100'>                    
          <section className='w100'>
            <div className='formLeft'>                
              <SelectBox title={'모델ID'} options={commCode} val={classId} setVal={setClassId} index={0} openIndex={openIndex} setOpenIndex={setOpenIndex}/>      
              {/* <SelectBox title={'제품ID'} options={commProduct} val={productId} setVal={setProductId} index={1} openIndex={openIndex} setOpenIndex={setOpenIndex}/>                       */}
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
          onClose={setCloseAlert}          
        />
      )}
    </form>    
  );
};

export default ProductForm;
