// 모듈 사용 후

var M = {
  v:'v',
  f:function() {
    conosole.log(this.v);
  }
}

module.exports = M;  // 모듈에 담긴 여러 기능들 중에서 M이 가리키는 객체를 모듈 밖에서 사용할 수 있도록 하기 위함 