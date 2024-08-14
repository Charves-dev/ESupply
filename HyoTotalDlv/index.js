const express 	= require('express');
const cors 		= require('cors');
//const pool 		= require('./config/db');
const path 		= require('path');
const app 		= express();
const port 		= 8282;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', (req, res) => {
	//res.sendFile(path.join(__dirname, '/client/build/index.html'));
	let jsonObj = {
		message : "오케바리"
	};
	res.send(jsonObj);
});


//*************************************************************************************************
// 손윤석 메모
// (주)차베스전기쪽에 주문 처리가 완료되면 (주)효성종합배송에서 배송접수가 실행되고, 송장번호 채번이 이뤄져야 한다.
// (주)차베스전기쪽에 급한거 먼저 하고 나면 이부분에 손을 댈 것이다.
//*************************************************************************************************
// 집화센터에서 송장번호를 채번해야 한다. (집화센터 코드명의 시퀀스가 존재하는가? 존재하지 않으면 생성한다.)
// 센터 추가시에 미리 시퀀스를 만들어 주는것 도 좋은 방법이다.
// 센터 삭제시에 시퀀스도 삭제된다. (하지만, 센터가 삭제되면 배송중인 송장번호의 신뢰도가 떨어지므로 데이터삭제는 하지 않는다.)
// const seqQuery = 'SELECT count(*) as cnt FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = ?';
// CREATE SEQUENCE hyosungtotal.seq059 START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 99999999 CYCLE;
//*************************************************************************************************


app.listen(port, () => {
	console.log(`서버가 실행됩니다. http://localhost:${port}`);
});





// /product/neworder
// /product/goodList
// /product/goodDetail
// /part/list
// /part/detail')
