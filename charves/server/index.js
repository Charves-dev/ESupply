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
console.log(rtn);
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
