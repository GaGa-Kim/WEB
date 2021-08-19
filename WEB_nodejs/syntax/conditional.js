// 콘솔에서 입력값 받기 -> 하나의 프로그램이 여러가지 동작을 할 수 있도록 확장성이 높아짐
 
var args = process.argv;  // node.js 런타임이 어디에 위치하는지 [0], 실행시킨 파일의 경로 [1], 입력값 [2] 총 3개 출력  
console.log(args[2]);  // 입력값
console.log('A');
console.log('B');
if(args[2] === '1'){  // 콘솔에서 node syntax/conditional.js 1을 입력할 경우 C1이 출력
  console.log('C1');
} else {  // 그 외에는 C2 출력
  console.log('C2');  
}
console.log('D');