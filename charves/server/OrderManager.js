
const env     = require('./CommonEnv');          // 공통 환경 및 글로벌 변수
const pool    = require('./config/db');
const express = require('express');
const session = require('express-session');


//*************************************************************************************************
// 주문접수 : 주문번호를 채번하기 이전에 우선적으로 order_out_good 테이블에 상품을 등록하고 Commit한다.
//            이때 상품등록이 되지 않을 경우 그 다음 상품을 등록해 본다. 
//            만일 상품테이블에 들어 있는 모든 상품들이 모두  order_out_good 테이블에 insert가 되지 않는다면
//            그것은 한 순간에 Sold Out 된 것이다.
//*************************************************************************************************
exports.ORDER_NEW = async function (req, res) {

  const {user_id, company_id, orderInfo } = req.body;
  let conn = null;
  let lastProdId = '';
  try{
    conn = await pool.getConnection();
    //***************************************************************
    // 사용자 회사정보 가져오기(주소가 목적이것지?)
    //***************************************************************
    let compInfo = await conn.query(env.QG.GET_COMPANY_INFO, [company_id]);
    if(compInfo.length < 1){
      const result = {
        result : 'Failed',
        order_no : '',
        msg : 'COMPANY INFO NOT FOUND'
      }
      return res.json(result);
    }
    //***************************************************************


    //***************************************************************
    // 미리 주문번호를 채번 할 수 밖에 없는것은 NEW_GOOD_OUT 에서 주문번호를 넣기 때문인데... 안넣어도 되는데... 좀더 체계적으로 ..
    //***************************************************************
    let orNo = await conn.query(env.QG.GET_ORDER_NO);
    let orderNo = orNo[0].ORDER_NO;
    //***************************************************************


    let totalPrice = BigInt(0);
    for(let i=0;i<orderInfo.length;i++){
      lastProdId = orderInfo[i].product_id;

      //*************************************************************
      // 제품 단가 계산 및 시리얼 번호 가져오기 위해....
      //*************************************************************
      let GoodPrice = await conn.query(env.QG.GET_ONE_PRICE, [orderInfo[i].count, lastProdId]);
      totalPrice += BigInt(GoodPrice[0].PRICE);
      let GoodSerials = await conn.query(env.QG.GET_GOOD_SERIALNOS, [lastProdId, lastProdId, orderInfo[i].count]);
      //*************************************************************
console.log(lastProdId);
console.log(env.QG.GET_GOOD_SERIALNOS);
console.log(GoodSerials);
      //*************************************************************
      // 상품이 주문한 갯수만큼 없으면 SOLD OUT
      //*************************************************************
      if(GoodSerials.length < orderInfo[i].count){
        // Sold Out처리 
        const result = {
          result : 'Failed',
          order_no : '',
          msg : 'SOLD OUT [' + lastProdId + '], Request='+ orderInfo[i].count + ', Inventory=' + GoodSerials.length
        }
        await conn.rollback();
        return res.json(result);
      }
      //*************************************************************


      //*************************************************************
      // 재고가 0으로 맞아 떨어지도록 하기 위해 여기서 세마포어를 구동한다.
      // 아마 여기서 PK충돌에 의해 에러가 나면 catch로 넘어갈 것으로 예상된다.
      //*************************************************************
      for(let j=0;j<GoodSerials.length;j++){
console.log("prodId = " + lastProdId);
console.log("sn = " + GoodSerials[j].SERIAL_NO);
        let outRes = await conn.query(env.QG.NEW_GOOD_OUT, [lastProdId, GoodSerials[j].SERIAL_NO, 'SALE', orderNo]);
      }
      //*************************************************************

      //*************************************************************
      // 주문 상세 상품정보 Insert
      //*************************************************************
      await conn.query(env.QG.NEW_ORDER_GOOD, [orderNo, lastProdId, orderInfo[i].count]);
      //*************************************************************
    }

    //***************************************************************
    // 주문 발주 처리
    //***************************************************************
    await conn.query(env.QG.NEW_ORDER, [orderNo, company_id, user_id, totalPrice, totalPrice, compInfo[0].ADDRESS]);
    //***************************************************************

    await conn.commit();

    let rtn = {
      result  : 'Success',
      order_no : orderNo,
      msg : ''
    }
    return res.json(rtn);
  }catch(err){
    console.log(err.toString());
    await conn.rollback();
    const result = {
      result : 'Failed',
      order_no : '',
      msg : 'PK Error SOLD OUT [' + lastProdId + ']'
    }
    return res.json(result);
  }finally{
    if(conn) conn.release();
  }
}
//*************************************************************************************************



//*************************************************************************************************
// 접수된 주문정보를 기반으로 실제 물건을 상자에 담고 
// 배송 업체에 배송의뢰 한 상태까지되고 나면 주문 시작이 된다.
// 이 API를 호출하는것은 (주)차베스 전기 직원이 한다.
//*************************************************************************************************
exports.ORDER_BOX = async function (req, res) {
  // 배송업체 배송의뢰 API 호출
}
//*************************************************************************************************



//*************************************************************************************************
// 배송업체직원이 와서 해당 물건을 가져감 (배송시작)
// 이 API를 호출하는것은 (주)효성종합배송 직원이 한다. (송장번호가 입력된다.)
//*************************************************************************************************
exports.ORDER_DLV_START = async function (req, res) {
  // 주문에 대한 송장번호 등록
}
//*************************************************************************************************



//*************************************************************************************************
// 배송조회 : 배송업체와 연동하여 배송정보를 리턴한다.
//*************************************************************************************************
exports.ORDER_STATUS = async function (req, res) {

}
//*************************************************************************************************



//*************************************************************************************************
// 배송완료된 주문에 대하여 일정기간이 지나면 해당 주문은 완료처리된다.(배치프로그램에서 해야 함)
// 수동으로 해당 배송을 완료 처리 할 경우에 이 API를 호출한다.
//*************************************************************************************************
exports.ORDER_END = async function (req, res) {

}
//*************************************************************************************************



//*************************************************************************************************
// 반품/교환 처리 : 이부분까지 개발 할 시간이 되면 참 좋으련만....
//*************************************************************************************************
exports.ORDER_RECALL = async function (req, res){

}
//*************************************************************************************************