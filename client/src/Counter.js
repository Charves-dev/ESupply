import React, { useRef } from 'react';
import './styles/Common.css'

const Counter = ({ count, onIncrement, onDecrement }) => {
  const intervalRef = useRef(null); 
  const timeoutRef  = useRef(null); //버튼 홀드 타이머

  const handleMouseDown = (e) =>{
    const ref_id = e.currentTarget.id;

    if (timeoutRef.current) return; //예외처리

    timeoutRef.current = setTimeout(() => {      
      if(ref_id === 'countUp'){                
        intervalRef.current = setInterval(onIncrement, 88); 
      }else{        
        intervalRef.current = setInterval(onDecrement, 88);
      }

      //길게 누를경우 timeoutRef를 null로 초기화한다
      timeoutRef.current  = null;
    }, 400); // 증가 or 감소 버튼을 누르고 0.4초가 지날경우 0.088초 간격으로 증가 or 감소를 반복 한다
  }

  const handleMouseUp = (e) => {
    const ref_id = e.currentTarget.id;        

    //초기 timeoutRef.current는 타이머 ID를 저장하고 있다
    if (timeoutRef.current !== null) {      
      // 마우스를 짧게 눌렀다가 떼는 경우 1회만 카운트
      if (ref_id === 'countUp') {        
        onIncrement();        
      } else {
        onDecrement();        
      }
    }

    //인터벌 중지
    clearInterval(intervalRef.current);
    intervalRef.current = null;

    //타이머 초기화
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };


  /* 마우스가 버튼을 떠났을경우 */
  const handleMouseLeave = (e) => {
    //인터벌 중지
    clearInterval(intervalRef.current);
    intervalRef.current = null;

    //타이머 초기화
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  return (
    <div className='counter-container'>
      <div id='countUp' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} className='countUp flex a_i_center j_c_center'>
        <img src={'/assets/Img/caret-arrow-up.png'} alt='countUp' />
      </div>
      <div className='productCount flex f_d_column a_i_center j_c_center'>
        <p>{count}</p>
      </div>
      <div id='countDown' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} className='countDown flex a_i_center j_c_center'>
        <img src={'/assets/Img/caret-down.png'} alt='countDown' />
      </div>
    </div>
  );
};

export default Counter;
