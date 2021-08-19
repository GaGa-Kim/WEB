var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : '',
  port     : 3307,  // MariaDB가 3306을 사용, MySQL이 3307 포트 사용
  user     : '',
  password : '',
  database : ''
  // , multipleStatements:true -> 강제로 여러 개의 구문을 입력할 수 있도록 하는 것
});
db.connect();
module.exports = db;