const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ESupply',
  connectionLimit: 5
});

//*************************************************************************************************
// 서버 종료 시 연결 풀을 종료하는 핸들러
//*************************************************************************************************
let isPoolClosed = false;
process.on('SIGINT', async () => {
  if (!isPoolClosed) {
    try {
      await pool.end();
      isPoolClosed = true;
      console.log('MySQL pool closed.');
    } catch (err) {
      // 본 소스는 안전장치일 뿐이므로 에러날 경우 로그를 찍지않아도 된다.
      //console.error('Error closing MySQL pool:', err.stack);
    } finally {
      process.exit();
    }
  } else {
    console.log('MySQL pool is already closed.');
    process.exit();
  }
});
//*************************************************************************************************

module.exports = pool;
