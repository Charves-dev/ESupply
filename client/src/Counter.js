import React, { useState } from 'react';
import caretArrowUp from './assets/Img/caret-arrow-up.png';
import caretArrowDown from './assets/Img/caret-down.png';
import './styles/Common.css'

const Counter = () => {
  const [count, setCount] = useState(1);

  const countUp = () => setCount(count + 1);
  const countDown = () => setCount(count > 0 ? count - 1 : 0);

  return (
    <div className='counter-container'>
      <div onClick={countUp} className='countUp flex a_i_center j_c_center'>
        <img src={caretArrowUp} alt='countUp' />
      </div>
      <div className='productCount flex f_d_column a_i_center j_c_center'>
        <p>{count}</p>
      </div>
      <div onClick={countDown} className='countDown flex a_i_center j_c_center'>
        <img src={caretArrowDown} alt='countDown' />
      </div>
    </div>
  );
};

export default Counter;
