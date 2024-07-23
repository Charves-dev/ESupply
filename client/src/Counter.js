import React, { useState } from 'react';
import './styles/Common.css'

const Counter = ({ count, onIncrement, onDecrement }) => {
  return (
    <div className='counter-container'>
      <div onClick={onIncrement} className='countUp flex a_i_center j_c_center'>
        <img src={'/assets/Img/caret-arrow-up.png'} alt='countUp' />
      </div>
      <div className='productCount flex f_d_column a_i_center j_c_center'>
        <p>{count}</p>
      </div>
      <div onClick={onDecrement} className='countDown flex a_i_center j_c_center'>
        <img src={'/assets/Img/caret-down.png'} alt='countDown' />
      </div>
    </div>
  );
};

export default Counter;
