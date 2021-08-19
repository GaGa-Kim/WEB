// 동기와 비동기
var fs = require('fs');

/* readFileSync : ABC 출력 - 동기적
console.log('A');
var result = fs.readFileSync('syntax/sample.txt', 'utf8'); // readFileSync는 return 값을 줌으로 result에 return값을 주게 됨
console.log(result); // B가 나와야 함
console.log('C'); */

// readFile : ACB 출력 - 비동기적 (작업이 끝난 후 readFile 안의 세번째 인자인 함수가 실행)
console.log('A');
// function은 callback을 의미, readFile은 return 값을 주지 않으므로 함수를 세번째 인자로 줘서 node.js가 파일을 읽는 작업이 끝나면 세번째 인자로 준 함수를 실행. (에러가 있다면 에러를 인자로 제공, 에러가 없으면 파일의 내용을 인자로 줌) 
// readFile을 이용해서 파일을 읽어오는데 시간이 걸리므로 작업이 끝난 후에 세번째 인자인 함수를 실행시켜라 (파일을 읽은 후, 세번째 인자인 함수를 내부적으로 호출 - callback)
/*
fs.readFile('syntax/sample.txt', 'utf8', function(err, result) {
                                            console.log(result);
                                          }); */
fs.readFile('syntax/sample.txt', 'utf8', function(err, result) {
  console.log(result);
}); 
console.log('C');