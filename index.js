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



app.listen(port, () => {
	console.log(`서버가 실행됩니다. http://localhost:${port}`);
});





// /product/neworder
// /product/goodList
// /product/goodDetail
// /part/list
// /part/detail')
