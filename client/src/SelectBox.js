import React, { useEffect, useRef } from 'react';
import './styles/Common.css'

const SelectBox = ({ title, options, val, setVal, index, openIndex, setOpenIndex }) => {
  const isOpen = openIndex === index; // 인덱스를 통해 열림 상태 판단

  const handleSelect = (value) => {
    setVal(value);
    setOpenIndex(null); // 선택 시 모든 셀렉트 박스 닫기
  };
  
  // 이전 options 값을 저장할 ref
  const prevOptionsRef = useRef(options);
  
  useEffect(() => {
    // 이전 options와 현재 options를 비교
    if (prevOptionsRef.current !== options) {
      setVal(''); // options가 변경되면 val을 초기화
    }
    // 현재 options를 이전 options로 업데이트
    prevOptionsRef.current = options;
  }, [options]); // options가 변경될 때마다 실행
  
  
  return(
    <div>
      <div className='inputTit'>{title}</div>
      <div className="selectBox fs14 cursor">
        <div
          className={`select ${isOpen ? 'open' : ''}`}
          onClick={() => setOpenIndex(isOpen ? null : index)} // 클릭 시 열고 닫기 토글
        >
        { options !== '' ? 
          <span className={val ? 'selectVal' : 'placeHolder'}>
            {val ? options.find(option => option.value === val)?.label : title}
          </span>
        :
          <span className={'placeHolder'}>{title}</span>
        }
        <span className="icoArrow"><img src={'/assets/Img/caret-down.png'} alt="selDown" /></span>
        </div>
        {isOpen && options.length > 0 && (
            <ul className="dropdown-list">
            {options.map((option) => (
                <li
                  key={option.value}
                  className={`dropdown-item ${val === option.value ? 'selected' : ''} ${option.disabled ? 'disabled' : ''}`}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                >
                {option.label}
                </li>
            ))}
            </ul>
        )    
      }
      
      {/* options의 값이 없을경우 */}
      {isOpen && options.length <= 0 && (
        <ul className="dropdown-list"><div className='h190 flex a_i_center j_c_center'> {title}(이)가 0건 입니다</div></ul>
      )}
      </div>
    </div>
    )
}

export default SelectBox;