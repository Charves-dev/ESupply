const express 	= require('express');
const cors 		= require('cors');
const pool 		= require('./config/db');
const path 		= require('path');
const app 		= express();
const port 		= 1092;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

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
// 제품등록
//*************************************************************************************************
app.post('/product/add', async (req, res) => {
	const { class_id, product_id, product_nm, price, weight, size_h, size_v, size_z } = req.body;
console.log("****************************************************");
console.log("req.body");
console.log(req.body);
console.log("****************************************************");
	let conn = null;
	try{
		conn = await pool.getConnection();

		//*****************************************************************************************
		// 클레스(모델) 시퀀스 존재 여부 체크 ( 없으면 생성한다 - 상품등록시에 시리얼번호 채번하기 위함 )
		//*****************************************************************************************
		let seqName = ('seq' + class_id.substring(0,3)).toLowerCase();
		const seqQuery = 'SELECT count(*) as cnt FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = ?';
		const seqResult = await conn.query(seqQuery, [seqName]);
		if(seqResult[0].cnt <= 0){
			const insSeq = `CREATE SEQUENCE ${seqName} increment by 1 start with 1 NOCACHE MINVALUE 1 MAXVALUE 9999999`;
			const insRes = await conn.query(insSeq);	
		}
		//*****************************************************************************************


		//*****************************************************************************************
		// 제품 데이터가 이미 존재하는지 체크하고 없으면 Insert한다.
		//*****************************************************************************************
		const checkQuery = 'SELECT COUNT(*) as cnt from esupply.product_master where class_id = ? and product_id = ? ';
		const checkResult = await conn.query(checkQuery, [class_id, product_id]);

		if(checkResult.cnt <= 0){
			const query = 'INSERT INTO esupply.product_master (class_id, product_id, product_nm, price, weight, size_h, size_v, size_z) '
						+ 'VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
			const result = await conn.query(query, [class_id, product_id, product_nm, price, weight, size_h, size_v, size_z]);
			let rtnMsg = {
				result : 'Success',
				message : '성공',
				count  : result.affectedRows
			};
			res.send(rtnMsg);
		}else{
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
// 상품 입고 (재고 등록) - 입고 : 공장에서 상품이 제작되어서 들어옴
//*************************************************************************************************
app.post('/product/addgoods', async (req, res) => {
	//insert into GOOD
	//insert or update into GOOD_INVENTORY
	
});
//*************************************************************************************************



//*************************************************************************************************
// 제품 리스트 조회(상품리스트 조회)
//*************************************************************************************************
app.post('/product/goodList', async (req, res) => {
	const { product_nm, product_id } = req.body;
console.log(`product_nm = ${product_nm}`);
console.log(`product_id = ${product_id}`);
	let nm_where = '';
	let id_where = '';
	if(product_id !== '' && product_id !== undefined){
		id_where = ` and mst.PRODUCT_ID like '%${product_id}%'`;
	}
	if(product_nm !== '' && product_nm !== undefined){
		nm_where = ` and mst.PRODUCT_NM like '%${product_nm}%'`;
	}
console.log(id_where);
console.log(nm_where);	
	let query = 'select mst.CLASS_ID , mst.PRODUCT_ID, mst.PRODUCT_NM, mst.PRICE, mst.WEIGHT, mst.SIZE_H, mst.SIZE_V, mst.SIZE_Z, ifnull(inv.COUNT , 0) as COUNT '
              + ' from esupply.product_master mst '
 			  + ' left join esupply.good_inventory inv on mst.CLASS_ID = inv.CLASS_ID and mst.PRODUCT_ID = inv.PRODUCT_ID'
			  ;
	try{
		conn = await pool.getConnection();
		if(id_where !== '' || nm_where !== ''){
			query = query + ' where 1 = 1' + id_where + nm_where;
		}
console.log(query);
    	let result = await conn.query(query);
    	res.json(result);
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
