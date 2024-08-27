import React, {useState, useEffect} from "react";
import SelectBox from "./SelectBox";

function FilterSearchBar ({setProductNm, setProductId, searchRes, initialOptionObj = [], initialValue = ''}) {
  const [searchKeyWord, setSearchKeyWord] = useState(initialValue);
  const [optionObj, setOptionObj]       = useState([]);   
  const [optionNo, setOptionNo]         = useState('');
  const [openIndex, setOpenIndex]       = useState(null);  // 열려 있는 셀렉트 박스의 인덱스를 저장
  const [searchCompleted, setSearchCompleted] = useState(false);
  
  useEffect(() => {
    if(initialOptionObj.length > 0){
      setOptionObj(initialOptionObj)
    }else{
      setOptionObj([
        {value: '1', label: '제품명'},
        {value: '2', label: '제품ID'}
      ])
    }
  }, [])

  useEffect(()=>{
    searchRes();
    setSearchCompleted(false);
  },[searchCompleted])

  const handleSearchInput = () => {
    if(optionNo === '1' || optionNo === ''){      
      setProductNm(searchKeyWord);
      setProductId('');
      setSearchCompleted(true);
    }else{      
      setProductNm('');
      setProductId(searchKeyWord);
      setSearchCompleted(true)
    }
  }

  // 검색 엔터 이벤트 및 버튼 클릭 이벤트 처리
  const handleSearch = (event) => {
    if (event.type === 'click' || event.key === 'Enter') {
      handleSearchInput();
    }
  };
  
  return(
    <section className="flex mt32">
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
          <input type='text' className='search' value={searchKeyWord} onChange={(e) => setSearchKeyWord(e.target.value)} onKeyDown={(e) => handleSearch(e)}/>
          <div onClick={(e) => handleSearch(e)} className='searchBtn bgSlate100 fs16 flex a_i_center j_c_center'>
            검색
          </div>
        </div>  
      </section>   
    </section>  
  );
}

export default FilterSearchBar;
