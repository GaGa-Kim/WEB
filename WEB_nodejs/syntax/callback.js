// callback

/*
function a() {
  console.log('A');
} */

var a = function() { // 이름이 없는 익명 함수, a라는 변수의 값으로 함수를 정의. 즉, 함수가 값
  console.log('A');
}
// a();

function slowfunc(callback) {  // 이 기능에 대한 실행이 끝난 후에, 이 기능을 실행한 쪽에 함수가 실행이 끝났으니까 다음 일을 하라고 함
  callback(); // A 출력
}

slowfunc(a); // callback이라는 파라미터는 위의 a가 가리키는 위의 함수를 갖게 됨