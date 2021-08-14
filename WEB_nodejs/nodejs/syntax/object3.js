/* 데이터와 값을 담는 그릇으로서 객체
var v1 = 'v1';
var v2 = 'v2';

var o = {
  v1:'v1',
  v2:'v2'
} */

/*
function f1() {
  console.log(o.v1);
}

function f2() {
  console.log(o.v2);
} 함수가 값이라는 특징을 활용하여 이 함수를 밑의 객제의 멤버로써 추가 */

var q = {
  v1:'v1',
  v2:'v2',
  f1:function (){
    console.log(this.v1); // 함수가 객체 안에서 실행될 때 자신의 객체를 참조하도록 this 사용
  },
  f2:function(){
    console.log(this.v2);
  }
}
 
q.f1();
q.f2();