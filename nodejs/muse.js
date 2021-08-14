// 모듈 사용 전 : 정리정돈 하기 위해 사용, 파일로 쪼개서 웹으로 독립시키기           
 
/* 
var M = {
  v:'v',
  f:function() {
    conosole.log(this.v); // v 출력
  }
} */

// 모듈을 가져옴
var part = require('./mpart.js');
console.log(part);  // 출력 결과 : {v:'v', f:[Function: f]} -> 모듈을 로딩한 결과인 객체가 담김
part.f(); // v 출력