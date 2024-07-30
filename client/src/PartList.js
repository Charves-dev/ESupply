import React, {useState, useCallback, useEffect} from 'react';
import './styles/Common.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Counter from './Counter';

function PartList() {
  let partObj = {    
      count : 3, 
      pList : [ 
        { product_nm  : "부품명1", 
          product_id  : "cap_2349809" ,
          image       : "/assets/Img/img1.png",
          price       : "20000",
          count       : "3"
        }, 
        { product_nm  : "부품명2", 
          product_id  : "cap_2349810" ,
          image       : "/assets/Img/img2.png",
          price       : "40000",
          count       : "1"
        },
        { product_nm  : "부품명3", 
          product_id  : "cap_2349811" ,
          image       : "/assets/Img/img3.png",
          price       : "50000",
          count       : "5"
        },  
      ]    
  }

   // 소요수량 초기화
   const initializeOrderCnt = (productList) => {
    console.log(productList);
    const initOrderCnt = [];
    for (let i = 0; i < productList.length; i++) {
      initOrderCnt.push(productList[i].count);
    }
    return initOrderCnt;
  };
  

  const [orderCnt, setOrderCnt]   = useState([]);
  const [username, setUsername]   = useState(null);
  const [partNm, setPartNm] = useState('');
  const [productObj, setProductObj] = useState({ count: 0, pList: [] });  
  const navigate = useNavigate();


  let hasAlerted = false;
  let prenIndex = -1;
  // 부품 주문 개수 증가
  const handleIncrement = useCallback((index) => {
    setOrderCnt(prevOrderCnt => {
      const newCounts = [...prevOrderCnt];

      if(index !== prenIndex){
        prenIndex = index;
        hasAlerted = false;
      }

      if ( newCounts[index] <= productObj.pList[index].COUNT-1 ) {
        newCounts[index] += 1;      
        hasAlerted = false;
      }else{
        if (!hasAlerted) {
          alert('더 이상 재고가 없습니다.')
          hasAlerted = true;
        }
        return newCounts;
      }
      
      return newCounts;
    });
  }, [productObj]);


  // 부품 주문 개수 감소
  const handleDecrement = (index) => {
      setOrderCnt(prevOrderCnt => {
        const newCounts = [...prevOrderCnt];
        if (newCounts[index] > 0) {
          newCounts[index] -= 1;
        }
        return newCounts;
      });
  };

  // 전체 부품 목록 가져오기 or 검색시 대상 부품 목록 가져오기
  const searchResParts = async () => {
// console.log('검색 부품 가져오기 요청');
// console.log('search_key_word: ' + search_key_word);
    const search_key_word = partNm;
    try{
//***************************상품 API (참고용)*******************************/      
//       const res = await axios.post('http://localhost:1092/product/goodList',{
//         product_nm : search_key_word,            // 상품명
//         product_id : "",    // 상품 ID
//       });

// 상품 리스트 설정
//       setProductObj({ count: res.data.length, pList: res.data }); 
      
// 부품 재고 개수 설정
      setOrderCnt(initializeOrderCnt(partObj.pList));        
 // console.log(res.data);
 //*************************************************************************/
    }catch(e){
      console.log('부품 목록 가져오기 애러: ' + e);
    }
  };


  useEffect(() => {
    /* 부품목록 불러오기 */
    searchResParts();

    // 세션에서 사용자 아이디를 가져와서 username에 설정
    const savedUsername = sessionStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    };
  }, []);

  const goAdmin = () => {
    navigate('/admin');
  };

  //***********************************************************************************************
  //부품 목록 렌더링
  //***********************************************************************************************
  const productRender = () =>{    
    const productList = [];
    const p_count = partObj.count;   // 부품 전체 개수
    const pList   = partObj.pList;   // 부품 정보    

    for (let i = 0; i < p_count; i++) {
      const part = pList[i];
      let   price   = parseFloat(part.price).toLocaleString('ko-KR');
      console.log(part.product_id);
      productList.push(
        <li className='mt30 mb44' key={part.product_id}>
            <figure className="thumb-photo" style={{ backgroundImage: `url(/assets/Img/img1.png)` }}>
            {/* <figure className="thumb-photo" style={{ backgroundImage: `url(${product.image}})` }}> */}
            </figure>            
            <div className='desc relative'>
                <a href="">
                  <div className='product_nm'>
                    부품명
                  </div>
                  <div className='priceText'>
                    00원
                  </div>
                  <div className='product_detail'>
                    높이: 00 mm
                  </div>
                  <div className='product_detail'>
                    너비: 00 mm
                  </div>
                  <div className='product_detail'>
                    길이: 00 mm
                  </div>
                  <div className='product_detail'>
                    무게: 00 g
                  </div>
                </a>                
            </div>
            <div className='ml20 flex f_d_column a_i_center j_c_center'>
                <p className='mb10 pt5 pb5 fs16 w100 t_a_center border-top-bottom'>소요수량</p>
                <Counter 
                  count={orderCnt[i]}
                  onIncrement={() => handleIncrement(i)}
                  onDecrement={() => handleDecrement(i)}
                />
            </div>
        </li>
      )
    }
    return <ul className="thumb-list row-line2">{productList}</ul>;
  }
  //***********************************************************************************************

  return (
    <div className='adminWrap'>
      <div>부품목록 API 개발중</div>
      <button onClick={goAdmin} className='loginBtn'>상품 목록으로 돌아가기</button>   
      <div className='partListContent'>
        {/* 검색 */}
        <section className='w100'> 
          <div className='flex'>
            <input type='text' className='search' onChange={(e) => setPartNm(e.target.value)}/>
            <div onClick={searchResParts} className='searchBtn bgSlate100 fw700 fs18 flex a_i_center j_c_center'>검색</div>
          </div>  
        </section>              
        
        {/* 부품목록 */}
        {productRender()} 
      </div>
    </div>
  );
}

export default PartList;
