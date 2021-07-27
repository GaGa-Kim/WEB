/* JQuery 사용 전
var Body = {
  SetColor : function(color) {
    document.querySelector('body').style.color = color;
  },
  SetBackgroundColor : function(color) {
    document.querySelector('body').style.backgroundColor = color;
  }
}

var Links = {
  SetColor : function(color) {
    var alist = document.querySelectorAll('a');
    var i = 0;
    while(i < alist.length) {
      alist[i].style.color = color;
      i = i + 1;
    }
  }
} */

// JQuery 사용 후  
var Body = {
  SetColor : function(color) {
    $('body').css('color', color);
  },
  SetBackgroundColor : function(color) {
    $('body').css('backgroundColor', color);
  }
}

var Links = {
  SetColor : function(color) {
    // 이 웹 페이지에 있는 모든 a 태그를 JQuery로 제어한다는 뜻
    $('a').css('color', color);
  }
}

function nightDayHandler(self) {  // 색상 변경 버튼 함수 (객체 O)
  var target = document.querySelector('body');
  if (self.value == 'night') {
    Body.SetBackgroundColor('black');
    Body.SetColor('white');
    self.value = 'day';

    Links.SetColor('powderblue');
  } else {
    Body.SetBackgroundColor('white');
    Body.SetColor('black');
    self.value = 'night';

    Links.SetColor('blue');
  }
}
