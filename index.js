const express 			= require('express');
const swaggerUi 		= require('swagger-ui-express');
const swaggerJsdoc 	= require('swagger-jsdoc');
const cors 					= require('cors');
const pool 					= require('./config/db');
const multer 				= require('multer');
const path 					= require('path');
const bodyParser 		= require('body-parser');
const env       		= require('./esupplyEnv');          // 공통 환경 및 글로벌 변수
const app 					= express();
const port 					= 1092;

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

// Swagger 설정 옵션
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API 서버에 대한 설명입니다.',
    },
    servers: [
      {
        url: 'http://localhost:1092',
      },
    ],
  },
  apis: ['./index.js'], // JSDoc 주석이 들어갈 파일 위치
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Static 파일 제공을 위한 설정
app.use('/uploads', express.static('client/public/assets/Img'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());

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
/**
 * @swagger
 * /login:
 *   post:
 *     summary: "현재는 로그인에 입력했던 이름과 아이디를 반환합니다."
 *     description: "간단하게 로그인하는 API입니다(제대로 로그인처리 안되고 있음)"
 *     tags: [product]
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Hello World!"
 */
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
/**
 * @swagger
 * /product/delete:
 *  post:
 *    summary: "제품 삭제"
 *    description: "특정 클레스(모델)의 제품을 삭제한다."
 *    tags: [product]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               class_id:
 *                 type: string
 *                 description: The class ID
 *               product_id:
 *                 type: string
 *                 description: The product ID
 *    responses:
 *       200:
 *         description: Successful deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   description: "Result status (Success or Failure)"
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   description: "Result message"
 *                   example: "성공"
 *                 count:
 *                   type: integer
 *                   description: "Number of affected rows"
 *                   example: 1
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
app.post('/product/delete', async (req, res) => {
	const { class_id, product_id } = req.body;
	// console.log("****************************************************");
	// console.log("req.body");
	// console.log(req.body);
	// console.log("****************************************************");

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
/**
 * @swagger
 * /product/add:
 *   post:
 *     summary: "제품 등록"
 *     description: "신규 제품을 등록합니다"
 *     tags: [product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               class_id:
 *                 type: string
 *                 description: 모델(class) ID
 *               product_id:
 *                 type: string
 *                 description: 제품 ID
 *               product_nm:
 *                 type: string
 *                 description: 제품 이름
 *               price: 
 *                 type: integer
 *                 description: 제품 단가
 *                 example: 0
 *               weight: 
 *                 type: number
 *                 description: 제품 무게
 *                 example: 0.0
 *               size_h:
 *                 type: number
 *                 description: 제품 크기(가로)
 *                 example: 0.0
 *               size_v:
 *                 type: number
 *                 description: 제품 크기(세로)
 *                 example: 0.0
 *               size_z:
 *                 type: number
 *                 description: 제품 크기(높이)
 *                 example: 0.0
 *     responses:
 *       200:
 *         description: Successful product addition
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   description: "Result status (Success or Failure)"
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   description: "Result message"
 *                   example: "성공"
 *                 count:
 *                   type: integer
 *                   description: "Number of affected rows"
 *                   example: 1
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
app.post('/product/add', upload.single('image'), async (req, res) => {
// console.log("****************************************************");
// console.log("req.body");
// console.log(req.body);
// console.log("****************************************************");
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
/**
 * @swagger
 * /product/addgoods:
 *  post:
 *    summary: "상품 입고"
 *    description: "생산된 상품을 입고합니다."
 *    tags: [product]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               class_id:
 *                 type: string
 *                 description: 모델(class) ID
 *               product_id:
 *                 type: string
 *                 description: 제품 ID
 *               manufacturing_dttm: 
 *                 type: string
 *                 description: 제조일시(yyyymmddhh24miss)
 *               lot_no:
 *                 type: string
 *                 description: 생산라인 번호
 *               count:
 *                 type: string
 *                 description: 제조한 상품 갯수 (갯수만큼 serial_no가 채번된다.)
 *    responses:
 *       200:
 *         description: Successful deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 SERIAL_NOS:
 *                   type: object
 *                   description: "채번된 serial_no 배열"
 *                   example: ["CAPCERA2024072910001", "CAPCERA2024072910002", "CAPCERA2024072910003"]
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
app.post('/product/addgoods', async (req, res) => {
	const { class_id, product_id, manufacturing_dttm, lot_no, count } = req.body;
	// console.log("****************************************************");
	// console.log("req.body");
	// console.log(req.body);
	// console.log("****************************************************");
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
/**
 * @swagger
 * /comm/codelist:
 *  post:
 *    summary: "공통 코드 조회"
 *    description: "공통 코드 리스트 가져오기 (콤보박스용) - 나중에 공통영역이 만들어지면 그쪽으로 이동할 예정"
 *    tags: [product]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               group_id:
 *                 type: string
 *                 description: 그룹 ID
 *                 example: "OUT_TYPE"
 *    responses:
 *       200:
 *         description: Successful deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   CODE_ID:
 *                     type: string
 *                     description: "Code identifier"
 *                     example: "DISPOSE"
 *                   CODE_NM:
 *                     type: string
 *                     description: "Code name"
 *                     example: "폐기_처분"
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
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
/**
 * @swagger
 * /comm/productlist:
 *  post:
 *    summary: "공통 제품 목록 가져오기(콤보박스용)"
 *    description: "공통 제품 리스트 가져오기 (콤보박스용) - 나중에 공통영역이 만들어지면 그쪽으로 이동할 예정"
 *    tags: [product]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               class_id:
 *                 type: string
 *                 description: 모델(class) ID
 *    responses:
 *       200:
 *         description: Successful deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   PRODUCT_ID:
 *                     type: string
 *                     description: "Code identifier"
 *                     example: "DIO_008_CDLRWB678354"
 *                   PRODUCT_NM:
 *                     type: string
 *                     description: "Code name"
 *                     example: "광다이오드_17P"
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
app.get('/comm/productlist', async (req, res) => {
	const { class_id } = req.query;
	let conn = null;
	// const prodQuery = 'select PRODUCT_ID, PRODUCT_NM from esupply.product_master where CLASS_ID = ? ';
	const prodQuery = env.QG.GET_COMM_PRODUCT_LIST;
	try{
		conn = await pool.getConnection();
		const result = await conn.query(prodQuery, [class_id]);
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
/**
 * @swagger
 * /product/goodList:
 *  post:
 *    summary: "제품 리스트 조회(상품리스트 조회)"
 *    description: "제품 리스트 조회(상품리스트 조회) - 나중에 제품또는 상품이란 영역이 만들어지면 그쪽으로 이동할 예정"
 *    tags: [product]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_nm:
 *                 type: string
 *                 description: 제품 이름
 *                 example: "광다이오드_120"
 *               product_id:
 *                 type: string
 *                 description: 제품 ID
 *                 example: "DIO_120_DLCGBB999340"
 *    responses:
 *       200:
 *         description: Successful deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   CLASS_ID:
 *                     type: string
 *                     description: 모델(class) ID
 *                     example: "CAP_001"
 *                   PRODUCT_ID:
 *                     type: string
 *                     description: "제품 ID"
 *                     example: "CAP_001_CERA_DW467823"
 *                   PRODUCT_NM:
 *                     type: string
 *                     description: "제품 명"
 *                     example: "세라믹_저항_DW"
 *                   PRICE:
 *                     type: string
 *                     description: "단가(가격)"
 *                     example: 12000
 *                   WEIGHT:
 *                     type: number
 *                     description: "무게"
 *                     example: 20.3
 *                   SIZE_H:
 *                     type: number
 *                     description: "가로 크기"
 *                     example: 21.42 
 *                   SIZE_V:
 *                     type: number
 *                     description: "세로 크기"
 *                     example: 13.454 
 *                   SIZE_Z:
 *                     type: number
 *                     description: "높이"
 *                     example: 12.98 
 *                   COUNT:
 *                     type: int
 *                     description: "재고 수량"
 *                     example: 120 
 *                   IMAGE:
 *                     type: string
 *                     description: "제품 이미지 파일명(path포함)"
 *                     example: "1722403040248.jpg"
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
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
/**
 * @swagger
 * /product/goodListAdm:
 *  post:
 *    summary: "Admin 전용 상품조회"
 *    description: "Admin 전용 상품조회 ( 나중에 Admin 영역이 만들어지면 그쪽으로 이동할 예정 )"
 *    tags: [product]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               optionNo:
 *                 type: string
 *                 description:  1=제품명, 2=제조일시, 3=제조라인, 4=일련번호
 *                 example: 1
 *               search_txt:
 *                 type: string
 *                 description: 찾는 검색어
 *                 example: "다이오드"
 *    responses:
 *       200:
 *         description: Successful deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   CLASS_ID:
 *                     type: string
 *                     description: 모델(class) ID
 *                     example: "CAP_001"
 *                   PRODUCT_ID:
 *                     type: string
 *                     description: 제품 ID
 *                     example: "CAP_001_CERA_DW467823"
 *                   PRODUCT_NM:
 *                     type: string
 *                     description: 제품 명
 *                     example: "세라믹_저항_DW"
 *                   MANUFACTURING_DTTM:
 *                     type: string
 *                     description: 제조 일시(yyyymmddhh24miss)
 *                     example: "20240729154057"
 *                   LOT_NO:
 *                     type: string
 *                     description: 생산라인 번호
 *                     example: "F002"
 *                   SERIAL_NO:
 *                     type: string
 *                     description: 일련번호
 *                     example: "CAPCERA2024072910001"
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
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
// 상품 삭제(출고)
//*************************************************************************************************
/**
 * @swagger
 * /product/gooddel:
 *  post:
 *    summary: "상품 삭제(출고)"
 *    description: "상품 삭제(출고)"
 *    tags: [product]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               class_id:
 *                 type: string
 *                 description: 모델(class) ID
 *                 example: "CAP_001"
 *               product_id:
 *                 type: string
 *                 description: 제품 ID
 *                 example: "CAP_001_CERA_DW467823"
 *               serial_no:
 *                 description: 일련번호
 *                 example: "CAPCERA2024072910001"
 *               out_type:
 *                 description: 출고 구분("DISPOSE", "SALE")
 *                 example: "DISPOSE"
 *               order_no:
 *                 description: 주문번호(출고구분이 "SALE" 일때 필수입력)
 *                 example: null
 *    responses:
 *       200:
 *         description: Successful deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   description: "Result status (Success or Failure)"
 *                   example: "Success"
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
app.post('/product/gooddel', async (req, res) => {
	const { class_id, product_id, serial_no, out_type, order_no } = req.body;
	let conn = null;
	try{
		conn = await pool.getConnection();
		const result = await conn.query(env.QG.DEL_GOOD, [serial_no]);
		const invRst = await conn.query(env.QG.UPD_INVENTORY_DN, [class_id, product_id ]);
		const insOut = await conn.query(env.INS_GOOD_OUT, [product_id, serial_no, out_type, order_no]);
		await conn.commit();
		let rtnMsg = {
			result : 'Success',
		};
		res.send(rtnMsg);
	}catch(err){
		await conn.rollback();
		res.status(500).send(err.toString());
	}finally{
		if (conn) conn.release();
	}
});
//*************************************************************************************************



//*************************************************************************************************
// 제품별 파트리스트 조회
//*************************************************************************************************
/**
 * @swagger
 * /product/part/list:
 *  post:
 *    summary: "제품별 파트(부품)리스트 조회"
 *    description: "제품별 부품리스트를 조회합니다."
 *    tags: [product]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: The product ID
 *                 example: "CAP_001_CERA_DW467823"
 *    responses:
 *       200:
 *         description: Successful deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   PART_NO:
 *                     type: string
 *                     description: "부품 번호"
 *                     example: "DDI563_19830508_0140"
 *                   PART_NM: 
 *                     type: string
 *                     description: "부품 이름"
 *                     example: "다이오드140ma"
 *                   PRICE:
 *                     type: integer
 *                     description: "부품 단가"
 *                     example: 1300
 *                   WEIGHT:
 *                     type: number
 *                     description: "무게(중량)"
 *                     example: 22.3
 *                   SIZE_H:
 *                     type: number
 *                     description: "가로크기"
 *                     example: 25.23
 *                   SIZE_V:
 *                     type: number
 *                     description: "세로크기"
 *                     example: 20.56
 *                   SIZE_Z:
 *                     type: number
 *                     description: "높이"
 *                     example: 33.74
 *                   COUNT:
 *                     type: integer
 *                     description: "부품 소요 갯수"
 *                     example: 3
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
app.post('/product/part/list', async (req, res) => {
	const { product_id } = req.body;
	let conn 			= null;
	try{
		conn = await pool.getConnection();
		let result = await conn.query(env.QG.GET_PRODUCT_PART_LIST, [product_id]);
		res.json(result);
	}catch(err){
		res.status(500).send(err.toString());
	}finally{
		if (conn) conn.release();
	}
});
//*************************************************************************************************



//*************************************************************************************************
// 제품별 부품 정보 저장
//*************************************************************************************************
/**
 * @swagger
 * /product/part/save:
 *  post:
 *    summary: "제품별 부품 정보 저장"
 *    description: "제품 생산에 필요한 부품정보를 저장합니다."
 *    tags: [product]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               class_id:
 *                 type: string
 *                 description: 모델(class) ID
 *               product_id:
 *                 type: string
 *                 description: 제품 ID
 *               part_no:
 *                 type: string
 *                 description: 부품번호
 *               count:
 *                 type: integer
 *                 description: 소요되는 부품 갯수
 *    responses:
 *       200:
 *         description: Successful deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   description: "작업 결과"
 *                   example: "Success"
 *                 count:
 *                   type: integer
 *                   description: "작업 Row수"
 *                   example: 1
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
app.post('/product/part/save', async (req, res) => {
	const { class_id, product_id, part_no, count  } = req.body;
	let conn = null;
	try{
		conn = await pool.getConnection();
		let result = await conn.query(env.QG.UPD_PRODUCT_PART_CNT, [count, class_id, product_id, part_no]);
		let response = {
			result : "Success",
			count  : result.affectedRows
		};
		await conn.commit();
		res.json(response);
	}catch(err){
		await conn.rollback();
		res.status(500).send(err.toString());
	}finally{
		if(conn) conn.release();
	}
});
//*************************************************************************************************



//*************************************************************************************************
// 부품 상세조회
//*************************************************************************************************
/**
 * @swagger
 * /part/detail:
 *  post:
 *    summary: "부품 마스터 상세 조회"
 *    description: "부품 마스터 상세 조회"
 *    tags: [product]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               part_no:
 *                 type: string
 *                 description: 부품번호
 *    responses:
 *       200:
 *         description: Successful deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 part_no:
 *                   type: string
 *                   description: "부품번호"
 *                   example: "DDI563_19830508_0140"
 *                 part_nm:
 *                   type: string
 *                   description: "부품이름"
 *                   example: "다이오드140ma"
 *                 price:
 *                   type: integer
 *                   description: "부품 단가"
 *                   example: 309
 *                 weight:
 *                   type: number
 *                   description: "부품 중량"
 *                   example: 2.4
 *                 size_h:
 *                   type: number
 *                   description: "부품 가로크기"
 *                   example: 2.45
 *                 size_v:
 *                   type: number
 *                   description: "부품 세로크기"
 *                   example: 8.7
 *                 size_z:
 *                   type: string
 *                   description: "부품 높이"
 *                   example: 3.3
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
app.post('/part/detail', async (req, res) => {
	const { part_no } = req.body;
	let conn = null;
	try{
		conn = await pool.getConnection();
		let result = await conn.query(env.QG.GET_PART_MASTER, [part_no]);
		res.json(result);
	}catch(err){
		res.status(500).send(err.toString());
	}finally{
		if(conn) conn.release();
	}
});
//*************************************************************************************************



//*************************************************************************************************
// 부품 상세 저장
//*************************************************************************************************
/**
 * @swagger
 * /part/save:
 *  post:
 *    summary: "부품 마스터 상세 조회"
 *    description: "부품 마스터 상세 조회"
 *    tags: [product]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 part_no:
 *                   type: string
 *                   description: "부품번호"
 *                   example: "DDI563_19830508_0140"
 *                 part_nm:
 *                   type: string
 *                   description: "부품이름"
 *                   example: "다이오드140ma"
 *                 price:
 *                   type: integer
 *                   description: "부품 단가"
 *                   example: 309
 *                 weight:
 *                   type: number
 *                   description: "부품 중량"
 *                   example: 2.4
 *                 size_h:
 *                   type: number
 *                   description: "부품 가로크기"
 *                   example: 2.45
 *                 size_v:
 *                   type: number
 *                   description: "부품 세로크기"
 *                   example: 8.7
 *                 size_z:
 *                   type: string
 *                   description: "부품 높이"
 *                   example: 3.3
 *    responses:
 *       200:
 *         description: Successful deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   description: "작업결과"
 *                   example: "Success"
 *                 count:
 *                   type: integer
 *                   description: "작업Row수"
 *                   example: 1
 *                 job:
 *                   type: string
 *                   description: "Insert / Update 구분"
 *                   example: "I"
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
app.post('/part/detail/save', async (req, res) => {
	const { part_no, part_nm, price, weight, size_h, size_v, size_z } = req.body;
	let conn = null;
	try{
		conn = await pool.getConnection();
		let partCnt = await conn.query(env.QG.GET_PART_CNT, [part_no]);
		if(partCnt[0].cnt > 0){
			let result = await conn.query(env.QG.UPD_PART_INFO, [part_nm, price, weight, size_h, size_v, size_z, part_no]);
			let response = {
				result : "Success",
				count  : result.affectedRows,
				job    : "U"
			}
			await conn.commit();
			res.json(response);
		}else{
			let result = await conn.query(env.QG.INS_PART_INFO, [part_no, part_nm, price, weight, size_h, size_v, size_z]);
			let response = {
				result : "Success",
				count  : result.affectedRows,
				job    : "I"
			}
			await conn.commit();
			res.json(response);
		}
	}catch(err){
		await conn.rollback();
		res.status(500).send(err.toString());
	}finally{
		if(conn) conn.release();
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
