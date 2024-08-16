import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";

const CommonAlert = ({text, type, onClose, reload, reloadPage}) => {
  const navigate = useNavigate();

  useEffect(() => {
    setAlertType();
    alertOpen();
  },[type, text])
  
  const alertClose = (e) => {
    onClose ();
    document.getElementById('customAlert').style.display = 'none';
    document.getElementById('customAlertBg').style.display = 'none';    
    if(reload){
      //페이지 새로고침
      navigate(reloadPage);
    }
  }

  const alertOpen = (e) => {    
    document.getElementById('customAlert').style.display = 'flex';
    document.getElementById('customAlertBg').style.display = 'flex';
  }

  // const setAlertText = () => {
  //   const alertTitleElement = document.querySelector('.alert-tit');
  //   alertTitleElement.textContent = text;    
  // }

  const setAlertType = () => {
    const alertTitleElement = document.getElementById('customAlert');
    type === 'ok' ? alertTitleElement.classList.remove('faile-alert') : alertTitleElement.classList.remove('ok-alert'); 
    type === 'ok' ? alertTitleElement.classList.add('ok-alert') : alertTitleElement.classList.add('faile-alert'); 
  }

  return(
    <div id='customAlert' className='custom-alert flex f_d_column a_i_center'>        
      <span className='alert-tit'>{text}</span>
      <div className='alert-btn' onClick={alertClose}>확인</div>
      <div className='deco-pin-l'></div>
      <div className='deco-pin-r'></div>
    </div>
  )
}

export default CommonAlert;