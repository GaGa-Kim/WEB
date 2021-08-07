var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : '',
  port     : 3307,  // MariaDB가 3306을 사용, MySQL이 3307 포트 사용
  user     : '',
  password : '',
  database : ''
});
db.connect();
module.exports = db;