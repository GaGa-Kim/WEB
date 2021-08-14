// 배열 - 대괄호
var members = ['egoing', 'k8805', 'hoya'];
console.log(members[1]); // k8805

var i = 0;
while(i < members.length) {
  console.console.log('array loop', members[i]);
  i = i + 1;
}

/* 객체 - 중괄호 -> 각각의 데이터마다 고유한 이름을 줌 
// 객체 : 서로 연관된 데이터와 그 데이터 처리하는 방법인 함수를 그룹핑해서 코드의 복잡성을 낮추는 수납상자 */
var roles = { // 키(key), 값(value)
  'programmer':'egoing',
  'designer' : 'k8805',
  'manager' : 'hoya'
}
console.log(roles.designer); // k8805 -> '.키 값' 으로 가져오기
console.log(roles['designer']);  // 배열처럼 키 값을 문자로 전달

for(var name in rols) {
  console.log('object => ', name, 'value => ', roles[name]);
}