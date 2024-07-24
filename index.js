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



//*************************************************************************************************
//
//*************************************************************************************************
app.post('/product/add', async (req, res) => {
	const { class_id, product_id, product_nm, price, weight, size_h, size_v, size_z } = req.body;
console.log("****************************************************");
console.log("req.body");
console.log(req.body);
console.log("****************************************************");
	try{
		conn = await pool.getConnection();
		const query = 'INSERT INTO esupply.product_master (class_id, product_id, product_nm, price, weight, size_h, size_v, size_z) '
		            + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    	const result = await conn.query(query, [class_id, product_id, product_nm, price, weight, size_h, size_v, size_z]);
		let rtnMsg = {
			result : 'Success',
			count  : result.affectedRows
		};
		res.send(rtnMsg);
	}catch(err){
		res.status(500).send(err.toString());
	}finally{
		if(conn) conn.release();
	}
});
//*************************************************************************************************



//*************************************************************************************************
//
//*************************************************************************************************
app.post('/product/goodList', async (req, res) => {
	const { product_nm, product_id } = req.body;
console.log(`product_nm = ${product_nm}`);
console.log(`product_id = ${product_id}`);
	try{
		conn = await pool.getConnection();
    	const rows = await conn.query('select CLASS_ID '
		+'    , PRODUCT_ID'
		+'    , PRODUCT_NM'
		+'    , PRICE'
		+'    , WEIGHT'
		+'    , SIZE_H'
		+'    , SIZE_V'
		+'    , SIZE_Z'
		+' from esupply.product_master ');
    	res.json(rows);
	}catch(err){
		res.status(500).send(err.toString());
	}finally{
		if (conn) conn.release();
	}
});
//*************************************************************************************************



app.listen(port, () => {
	console.log(`서버가 실행됩니다. http://localhost:${port}`);
});





// /product/neworder
// /product/goodList
// /product/goodDetail
// /part/list
// /part/detail')
