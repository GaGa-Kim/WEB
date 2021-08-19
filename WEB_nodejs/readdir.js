// Node.js에서 특정 디렉토리 하위에 있는 파일과 디렉토리의 목록을 알아내는 방법

var testFolder = './data';
var fs = require('fs');
 
fs.readdir(testFolder, function(error, filelist){
  console.log(filelist); // [ 'CSS', 'HTML', 'JavaScript' ] -> 특정 디렉토리에 있는 파일 목록을 배열로 출력
})