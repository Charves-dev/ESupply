const express 	= require('express');
const cors 		= require('cors');
const pool 		= require('./config/db');
const multer 	= require('multer');
const path 		= require('path');
const bodyParser = require('body-parser');

const env       = require('./CommonEnv');          // 공통 환경 및 글로벌 변수

const app 		= express();
const port 		= 7943;

app.use(cors());
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {

  res.sendFile(path.join(__dirname, '/public/index.html'));

});


app.post('/login', async (req, res) => {
  let conn = null;
  const { userId, password } = req.body;
  try{
    conn = await pool.getConnection();
    let rtn = await conn.query(env.QG.GET_USER_LOGIN_CHECK, [userId, password]);
    if(rtn.length >= 1){
      let rtn1 = {
        result : 'success',
        company_id : rtn[0].COMPANY_NM,
        company_nm : rtn[0].COMPANY_CD,
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


app.listen(port, () => {
	console.log(`서버가 실행됩니다. http://localhost:${port}`);
});







// /product/neworder
// /product/goodList
// /product/goodDetail
// /part/list
// /part/detail')
