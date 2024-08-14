const express 	= require('express');
const cors 		= require('cors');
const pool 		= require('./config/db');
const multer 	= require('multer');
const path 		= require('path');
const bodyParser = require('body-parser');

const env       = require('./esupplyEnv');          // 공통 환경 및 글로벌 변수

const app 		= express();
const port 		= 1092;

// Multer 설정
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'client/public/assets/Img/');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	}
});
  
const upload = multer({ storage: storage });

// Static 파일 제공을 위한 설정
app.use('/uploads', express.static('client/public/assets/Img'));

app.use(cors());


//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/client/build/index.html'));
});



//*********** */
// 요고는 테스트용
app.get('/uploadTest', (req, res) => {
  res.send(`
    <h2>Image Upload</h2>
    <form action="/product/add" method="post" enctype="multipart/form-data">
	  <input type="text" name="class_id" />
	  <input type="text" name="product_id" />
	  <input type="text" name="product_nm" />
	  <input type="text" name="price" />
	  <input type="text" name="weight" />
	  <input type="text" name="size_h" />
	  <input type="text" name="size_v" />
	  <input type="text" name="size_z" />
      <input type="file" name="image" />
      <button type="submit">Upload</button>
    </form>
  `);
});
//*********** */

//************* */
// 요고도 테스트용
// 이미지 업로드 처리
app.post('/upload', upload.single('image'), (req, res) => {
	if (!req.file) {
	  return res.status(400).send('No file uploaded.');
	}
	const originName = req.file.originalname;
	const storedName = req.file.filename;

	const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
	res.send(`
	  <h2>Image Uploaded</h2>
	  <img src="${imageUrl}" alt="Uploaded Image" />
	  <p><a href="/uploadTest">Upload another image</a></p>
	`);
});
//**************** */



//*************************************************************************************************
//
//*************************************************************************************************
app.post('/login', (req, res) => {
	//console.log(req.body);
	const { userName, userId } = req.body;
	console.log(`UserName: ${userName}, UserId: ${userId}`);
    res.send(`Received login data for userName: ${userName}, userId: ${userId}`);
});
//*************************************************************************************************

app.get('/product/sequencecheck', async (req, res) => {
	
	let conn = null;
	try{
		conn = await pool.getConnection();
		const query = 'SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = ?';
		const result = await conn.query(query, ['seqcap']);
		res.send(result);
	}catch(err){
		res.status(500).send(err.toString());
	}finally{
		if(conn) conn.release();
	}	
});



//*************************************************************************************************
// 제품삭제 (2024.08.08 최선아 개발)
//*************************************************************************************************
app.post('/product/delete', async (req, res) => {
	const { class_id, product_id } = req.body;
	console.log("****************************************************");
	console.log("req.body");
	console.log(req.body);
	console.log("****************************************************");

	let conn = null;

	try {
		conn = await pool.getConnection();
		
		// const checkQuery = 'SELECT COUNT(*) as cnt from esupply.product_master where class_id = ? and product_id = ? ';
		// const checkResult = await conn.query(checkQuery, [class_id, product_id]);
		const checkResult = await conn.query(env.QG.GET_PRODUCT_CNT, [class_id, product_id]);

		if(checkResult[0].cnt > 0){
			// const query = 'DELETE FROM esupply.product_master where class_id = ? and product_id = ? '
			// const result = await conn.query(query, [class_id, product_id]);
			const result = await conn.query(env.QG.DEL_PRODUCT, [class_id, product_id]);
			const rst = await conn.commit();

			let rtnMsg = {
				result : 'Success',
				message : '성공',
				count  : result.affectedRows
			};
			res.send(rtnMsg);
		}else{
			await conn.rollback();
			let rtnMsg = {
				result :  'Failed',
				message : `해당 항목은 존재하지 않습니다.( ${class_id} , ${product_id} )`,
				count  : 0
			};
			res.send(rtnMsg);
		}	
	} catch(err){
		res.status(500).send(err.toString());
	}finally{
		if(conn) conn.release();
	}
})
//*************************************************************************************************



//*************************************************************************************************
// 제품등록
//*************************************************************************************************
app.post('/product/add', upload.single('image'), async (req, res) => {

console.log("****************************************************");
console.log("req.body");
console.log(req.body);
console.log("****************************************************");
	const { class_id, product_id, product_nm, price, weight, size_h, size_v, size_z } = req.body;

	let originalName = null;
	let storedName = null;
	let file_id = null;

	if (req.file) {
		originalName = req.file.originalname;
		storedName = req.file.filename;
	}

	let conn = null;
	try{
		conn = await pool.getConnection();
		//await conn.beginTransaction();

		if (req.file) {
			const insertFileResult = await conn.query(
				'insert into comm_files (TABLE_NM, ORIGIN_NM, STORE_NM) values (? , ? , ?)',
				['product_master', originalName, storedName]
			);
			file_id = insertFileResult.insertId;
		}

		//*****************************************************************************************
		// 클레스(모델) 시퀀스 존재 여부 체크 ( 없으면 생성한다 - 상품등록시에 시리얼번호 채번하기 위함 )
		//*****************************************************************************************
		let seqName = ('seq' + class_id.substring(0,3)).toLowerCase();
		// const seqQuery = 'SELECT count(*) as cnt FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = ?';
		const seqQuery = env.QG.GET_CHECK_SEQUENCE;
		const seqResult = await conn.query(seqQuery, [seqName]);
		if(seqResult[0].cnt <= 0){
			const insSeq = `CREATE SEQUENCE ${seqName} increment by 1 start with 1 NOCACHE MINVALUE 1 MAXVALUE 9999999`;
			const insRes = await conn.query(insSeq);	
		}
		//*****************************************************************************************


		//*****************************************************************************************
		// 제품 데이터가 이미 존재하는지 체크하고 없으면 Insert한다.
		//*****************************************************************************************
		// const checkQuery = 'SELECT COUNT(*) as cnt from esupply.product_master where class_id = ? and product_id = ? ';
		const checkQuery = env.QG.GET_PRODUCT_CNT;
		const checkResult = await conn.query(checkQuery, [class_id, product_id]);

		if(checkResult[0].cnt <= 0){
			// const query = 'INSERT INTO esupply.product_master (class_id, product_id, product_nm, price, weight, size_h, size_v, size_z, image) '
			// 						+ 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
			const query = env.QG.ADD_PRODUCT;
			const result = await conn.query(query, [class_id, product_id, product_nm, price, weight, size_h, size_v, size_z, file_id]);
			const rst = await conn.commit();

			let rtnMsg = {
				result : 'Success',
				message : '성공',
				count  : result.affectedRows
			};
			res.send(rtnMsg);
		}else{
			await conn.rollback();
			let rtnMsg = {
				result :  'Failed',
				message : `이미 존재합니다.( ${class_id} , ${product_id} )`,
				count  : 0
			};
			res.send(rtnMsg);
		}
		//*****************************************************************************************
	}catch(err){
		res.status(500).send(err.toString());
	}finally{
		if(conn) conn.release();
	}
});
//*************************************************************************************************



//*************************************************************************************************
// 상품 입고 (재고 등록) 기능 수정 - 입고: 공장에서 상품이 제작되어 입고됨
// 수정자: 최선아 (2024.08.09)
// - 기능 개선: checkQuery, insertQuery 추가하여 재고 등록 시 항목 존재 여부 확인 및 필요 시 신규 등록
//*************************************************************************************************
app.post('/product/addgoods', async (req, res) => {
	
	const { class_id, product_id, manufacturing_dttm, lot_no, count } = req.body;
	console.log("****************************************************");
	console.log("req.body");
	console.log(req.body);
	console.log("****************************************************");
	const prod = product_id.replace(class_id, '');
	const serial_h = class_id.substring(0,3) + prod.substring(0,4) + manufacturing_dttm.substring(0,8);
	const seqName  = 'seq' + class_id.substring(0,3).toLowerCase();

	const nextQuery = `select lpad(nextval(esupply.${seqName}), 5, '0') as nextSN from dual`; 

	// const goodQuery = 'insert into GOOD (CLASS_ID, PRODUCT_ID, SERIAL_NO, MANUFACTURING_DTTM, LOT_NO) '
	// 				+ 'VALUES ( ? '
	// 				+ '       , ? '
	// 				+ '		    , concat(? , ?) '
  //         + '       , DATE_FORMAT(CURRENT_TIMESTAMP(), \'%Y%m%d%H%i%s\') '
  //         + '       , ? )'
	// 				;
	const goodQuery = env.QG.ADD_GOOD;
	// const checkQuery = 'SELECT COUNT(*) as cnt FROM good_inventory WHERE CLASS_ID = ? AND PRODUCT_ID = ?';
	const checkQuery = env.QG.GET_INVENTORY;
	// const insertQuery = 'insert into good_inventory (CLASS_ID, PRODUCT_ID, COUNT) '
	// 				+ 'VALUES (?, ?, ?)';
	const insertQuery = env.QG.ADD_INVENTORY;
	
	//const updQuery = `update good_inventory set COUNT = COUNT + ${count} where CLASS_ID = ? and PRODUCT_ID  = ?`;
	const updQuery = env.QG.UPD_INVENTORY;

	let conn = null;
	let iCount = 0;
	let arrSerialNos = [];
	try{
		conn = await pool.getConnection();
		await conn.beginTransaction();
		for(let i=0;i<count; i++){
			let nextResult = await conn.query(nextQuery);
			let nextSN = nextResult[0].nextSN;
			arrSerialNos.push(nextSN);
			let goodResult = await conn.query(goodQuery, [class_id, product_id, serial_h, nextSN, lot_no]);
			iCount += goodResult.affectedRows;
		}
	
		// good_inventory에 항목이 존재하는지 확인
		console.log('진입');
		
		const checkResult = await conn.query(checkQuery, [class_id, product_id]);
		
		if(checkResult[0].cnt > 0){
			console.log('업데이트');
			
			// 항목이 존재하면 업데이트
			await conn.query(updQuery, [count, class_id, product_id]);
		} else {
			console.log('추가');
			
			// 항목이 존재하지 않으면 추가
			await conn.query(insertQuery, [class_id, product_id, count]);
		}		

		await conn.commit();
		let returnJson = {
			SERIAL_NOS : arrSerialNos
		}
		res.send(returnJson);
	}catch(err){
		res.status(500).send(err.toString());
	}finally{
		if(conn) conn.release();
	}
	
});
//*************************************************************************************************



//*************************************************************************************************
// 공통 코드 리스트 가져오기 (콤보박스용) - 나중에 공통영역이 만들어지면 그쪽으로 이동할 예정
//*************************************************************************************************
app.get('/comm/codelist', async (req, res) => {
	const { group_id } = req.query;
	let conn = null;
	// const codeQuery = 'select CODE_ID, CODE_NM from comm_code where GROUP_ID = ? ';
	const codeQuery = env.QG.GET_COMM_CODE;
	try{
		conn = await pool.getConnection();
		const result = await conn.query(codeQuery, [group_id]);
		res.send(result);
	}catch(err){
		res.status(500).send(err.toString());
	}finally{
		if (conn) conn.release();
	}
});
//*************************************************************************************************



//*************************************************************************************************
// 공통 제품 리스트 가져오기 (콤보박스용) - 나중에 공통영역이 만들어지면 그쪽으로 이동할 예정
//*************************************************************************************************
app.get('/comm/productlist', async (req, res) => {
	const { class_id } = req.query;
	let conn = null;
	// const prodQuery = 'select PRODUCT_ID, PRODUCT_NM from esupply.product_master where CLASS_ID = ? ';
	const prodQuery = env.QG.GET_COMM_PRODUCT_LIST;
	try{
		conn = await pool.getConnection();
		const result = await conn.query(prodQuery, [class_id]);
console.log(result);
		res.send(result);
	}catch(err){
		res.status(500).send(err.toString());
	}finally{
		if (conn) conn.release();
	}
});
//*************************************************************************************************



//*************************************************************************************************
// 제품 리스트 조회(상품리스트 조회) - 나중에 제품또는 상품이란 영역이 만들어지면 그쪽으로 이동할 예정
//*************************************************************************************************
app.post('/product/goodList', async (req, res) => {
	const { product_nm, product_id } = req.body;
	let nm_where = '';
	let id_where = '';
	if(product_id !== '' && product_id !== undefined){
		id_where = ` and mst.PRODUCT_ID like '%${product_id}%'`;
	}
	if(product_nm !== '' && product_nm !== undefined){
		nm_where = ` and mst.PRODUCT_NM like '%${product_nm}%'`;
	}
	// let query = 'select mst.CLASS_ID , mst.PRODUCT_ID, mst.PRODUCT_NM, mst.PRICE, mst.WEIGHT, mst.SIZE_H, mst.SIZE_V, mst.SIZE_Z' 
	//           + '     , ifnull(inv.COUNT , 0) as COUNT '
	// 		  		+ '     , cf.STORE_NM as IMAGE'
  //           + ' from esupply.product_master mst '
 	// 		  		+ ' left join esupply.good_inventory inv on mst.CLASS_ID = inv.CLASS_ID and mst.PRODUCT_ID = inv.PRODUCT_ID'
	// 		  		+ ' left join esupply.comm_files cf on mst.IMAGE = cf.FILE_ID and cf.TABLE_NM = \'product_master\' '
	// 		  		;
	let query = env.QG.GET_GOOD_LIST;
	let conn = null;
	try{
		conn = await pool.getConnection();
		if(id_where !== '' || nm_where !== ''){
			query = query + ' where 1 = 1' + id_where + nm_where;
		}
    	let result = await conn.query(query);
    	res.json(result);
	}catch(err){
		res.status(500).send(err.toString());
	}finally{
		if (conn) conn.release();
	}
});
//*************************************************************************************************



//*************************************************************************************************
// Admin 전용 상품조회 ( 나중에 Admin 영역이 만들어지면 그쪽으로 이동할 예정 )
//*************************************************************************************************
app.post('/product/goodListAdm', async (req, res) => {
	const { optionNo, search_txt } = req.body;			// (optionNo : 1=제품명, 2=제조일시, 3=제조라인, 4=일련번호 )
	let conn = null;
	try{
		let lstQuery   = env.QG.GET_GOOD_LIST_ADMIN;
		let orderQuery = env.QG.GET_GOOD_LIST_ORDER;
		let whereQuery = '';
		let result = null;
		conn = await pool.getConnection();
		if(search_txt){
			if(optionNo === '1') whereQuery = env.QG.GET_GOOD_LIST_NM;
			else if(optionNo === '2') whereQuery = env.QG.GET_GOOD_LIST_DTTM;
			else if(optionNo === '3') whereQuery = env.QG.GET_GOOD_LIST_LOT;
			else if(optionNo === '4') whereQuery = env.QG.GET_GOOD_LIST_SERIAL;
			result = await conn.query(lstQuery + whereQuery + orderQuery, [search_txt]);
		}else{
			result = await conn.query(lstQuery + orderQuery);
		}
		res.json(result);
	}catch(err){
		res.status(500).send(err.toString());
	}finally{
		if (conn) conn.release();
	}
});
//*************************************************************************************************



//*************************************************************************************************
// 상품 삭제
//*************************************************************************************************
app.post('/product/gooddel', async (req, res) => {
	const { class_id, product_id, serial_no } = req.body;
	let conn = null;
	try{
		conn = await pool.getConnection();
		const result = await conn.query(env.QG.DEL_GOOD, [serial_no]);
		const invRst = await conn.query(env.QG.UPD_INVENTORY_DN, [class_id, product_id ]);
		await conn.commit();
		let rtnMsg = {
			result : 'Success',
		};
		res.send(rtnMsg);
	}catch(err){
		res.status(500).send(err.toString());
	}finally{
		if (conn) conn.release();
	}
});
//*************************************************************************************************



//******************************* */
app.listen(port, () => {
	console.log(`서버가 실행됩니다. http://localhost:${port}`);
});





// /product/neworder
// /product/goodList
// /product/goodDetail
// /part/list
// /part/detail')
