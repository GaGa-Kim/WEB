// 파일 읽기
var fs = require('fs');
fs.readFile('sample.txt', 'utf8', function(err, data) {
  console.log(data);
});