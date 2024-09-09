const express 	  = require('express');
const session     = require('express-session');
const cors 		    = require('cors');
const pool 		    = require('./config/db');
// const multer 	    = require('multer');
const path 		    = require('path');
const bodyParser  = require('body-parser');
const env         = require('./CommonEnv');           // 공통 환경 및 글로벌 변수
const OrderManager = require('./OrderManager');       // 주문관련한 모든 처리
const app 		    = express();
const port 		    = 7943;

app.use(session({
  secret: 'your-secret-key', // 세션 암호화를 위한 비밀 키
  resave: false,             // 요청이 변경되지 않더라도 세션을 다시 저장할지 여부
  saveUninitialized: false,  // 초기화되지 않은 세션을 저장할지 여부
  cookie: {
    maxAge: 1000 * 60 * 60,  // 세션 쿠키의 만료 시간 (여기서는 1시간으로 설정)
  }
}));

app.use(cors());
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});


app.post('/login', async (req, res) => {
  let conn = null;
  const { userId, password } = req.body;
  try{
    conn = await pool.getConnection();
    let rtn = await conn.query(env.QG.GET_USER_LOGIN_CHECK, [userId, password]);
    if(rtn.length >= 1){
      req.session.userId = userId;        // 로그인한 접속자의 ID를 세션에 저장해 둔다.
      let rtn1 = {
        result : 'success',
        company_id : rtn[0].COMPANY_ID,
        company_nm : rtn[0].COMPANY_NM,
        user_nm : rtn[0].USER_NM,
        user_id : rtn[0].USER_ID,
        password : rtn[0].USER_PW,
        msg : '로그인에 성공하였습니다.'
      };
      res.send(rtn1);
    }else{
      let rtn1 = {
        result : 'failed',
        msg : '사용자 정보가 없습니다. 똑바로 로그인하시와요'
      };
      res.send(rtn1);
    }
  }catch(err){
    res.status(500).send(err.toString());
  }finally{
    if(conn) conn.release();
  }
    
});

app.post('/customer/list', async (req, res) => {
  conn = null;
  const { companyNm, managerNm } = req.body;
  try{
    conn = await pool.getConnection();
    let listQuery = env.QG.GET_COMPANY_LIST;
    let params = [];
    if(companyNm){
      listQuery += env.QG.GET_COMPANY_LIST_NM;
      params.push(companyNm);
    }
    if(managerNm){
      listQuery += env.QG.GET_COMPANY_LIST_MANAGER_NM;
      params.push(managerNm);
    }
console.log("liseQuery -------------------");
console.log(listQuery);
console.log('params------------------------');
console.log(params);
    let rtn = await conn.query(listQuery, params);
    res.send(rtn);
  }catch(err){
    res.status(500).send(err.toString());
  }finally{
    if(conn) conn.release();
  }
});

app.get('/parts_show', async (req, res) => {
  res.sendFile(path.join(__dirname, '/parts_show.html'));
})


//*************************************************************************************************
// 상품 목록 조회하기
//*************************************************************************************************
app.post('/goods/list', async (req, res) => {
  const { optionNo, searchTxt } = req.body;
  conn = null;
  try{

  console.log(optionNo);
  console.log(searchTxt);
    conn = await pool.getConnection();
    let strQuery = env.QG.GET_PRODUCT_LIST;

    if(optionNo){
      if(optionNo === '1'){
        strQuery += env.QG.GET_PRODUCT_LIST_NM;
        const result = await conn.query(strQuery, [searchTxt]);
        res.json(result);
      }else{
        strQuery += env.QG.GET_PRODUCT_LIST_ID;
        const result = await conn.query(strQuery, [searchTxt]);
        res.json(result);
      }
    }else {
      const result = await conn.query(strQuery);
      res.json(result);
    }
  }catch(err){
    res.status(500).send(err.toString());
  }finally{
    if(conn) conn.release();
  }
});
//*************************************************************************************************


app.post('/order/new', OrderManager.ORDER_NEW);


// 운영
app.listen( port, () => {
	console.log(`서버가 실행됩니다. http://3.39.248.72:${port}`);
});

// 개발
// app.listen(port, () => {
// 	console.log(`서버가 실행됩니다. http://localhost:${port}`);
// });







// /product/neworder
// /product/goodList
// /product/goodDetail
// /part/list
// /part/detail')
