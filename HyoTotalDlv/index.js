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


app.listen(port, () => {
	console.log(`서버가 실행됩니다. http://localhost:${port}`);
});





// /product/neworder
// /product/goodList
// /product/goodDetail
// /part/list
// /part/detail')
