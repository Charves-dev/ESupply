import React from 'react';
import './styles/Common.css'
import Counter from './Counter';

function Main() {  

  return (
    <div className='MainWrap'>
      <div className='MainContent'>
        <ul class="thumb-list row-line2">
          <li className='mt30 mb44'>
            <figure class="thumb-photo" style={{ backgroundImage: `url(${require('./assets/Img/img1.png')})` }}>
            </figure>
            <div class="desc"><a href="">ndustry. Lorem Ipsum has been the industry's standard dummy text 
                ever since the 1500s, when an unknown printer took a galley of type 
                and scrambled it to make a type specimen book. It has survived not 
                only five centuries, but also the leap into electronic
                It has survived not 
                only five centuries, but also the leap into electronic
            </a>
            </div>
            <div className='ml20 flex f_d_column a_i_center j_c_center'>
              <p className='mb10 pt5 pb5 fs16 w100 t_a_center border-top-bottom'>수량</p>
              <Counter/>
            </div>
          </li>
          <li className='mt30 mb44'>
            <figure class="thumb-photo" style={{ backgroundImage: `url(${require('./assets/Img/img2.png')})` }}>
            </figure>
            <div class="desc"><a href="">ndustry. Lorem Ipsum has been the industry's standard dummy text 
                ever since the 1500s, when an unknown printer took a galley of type 
                and scrambled it to make a type specimen book. It has survived not 
                only five centuries, but also the leap into electronic
                It has survived not 
                only five centuries, but also the leap into electronic
            </a>
            </div>
            <div className='ml20 flex f_d_column a_i_center j_c_center'>
              <p className='mb10 pt5 pb5 fs16 w100 t_a_center border-top-bottom'>수량</p>
              <Counter/>
            </div>
          </li>
          <li className='mt30 mb44'>
            <figure class="thumb-photo" style={{ backgroundImage: `url(${require('./assets/Img/img3.png')})` }}>
            </figure>
            <div class="desc"><a href="">ndustry. Lorem Ipsum has been the industry's standard dummy text 
                ever since the 1500s, when an unknown printer took a galley of type 
                and scrambled it to make a type specimen book. It has survived not 
                only five centuries, but also the leap into electronic
                It has survived not 
                only five centuries, but also the leap into electronic
            </a>
            </div>
            <div className='ml20 flex f_d_column a_i_center j_c_center'>
              <p className='mb10 pt5 pb5 fs16 w100 t_a_center border-top-bottom'>수량</p>
              <Counter/>
            </div>
          </li>
        </ul>
        
        <div className='flex'>
          <button class="orderBtn"><b>주문하기</b></button>
        </div>
      </div>
    </div>
  );
}

export default Main;