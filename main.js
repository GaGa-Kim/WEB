var http = require('http');  // http를 요구하는 모듈 
var fs = require('fs');  // fs를 요구하는 모듈
var url = require('url');  // url을 요구하는 모듈 (url이라는 모듈)

// URL을 통해서 입력된 값을 사용하는 방법 (query string에 따라 다르게 동작) -> query에서 id를 찾아서 이를 이용 -> localhost:3000/?id=HTML -> 이 경우 HTML
// http://opentutorials.org:3000/main?id=HTML&page=12의 경우 http는 protocol, opentutorials.org는 host(domain), 3000은 port, main은 path, id=HTML&page=12는 query string
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;  // url에서 query string 부분만 가져온 것
    var title = queryData.id;  // url에서 query string의 id를 가져와서 이를 title로 하여 문서의 제목(HTML, CSS, JavaScript)을 표현
    
    console.log(queryData.id);  // queryData만 넣을 경우 { id : 'HTML' } 출력, queryData.id일 경우 HTML 출력
    
    if(_url == '/'){  // 본문 제목
      title = 'Welcome';
    }
    if(_url == '/favicon.ico'){
      response.writeHead(404);
      response.end();
      return;    
    }
    response.writeHead(200);
    
    // Template Literal 사용, 아직은 본문 제목과 목록(리스트)만 변화할 뿐 본문의 내용은 변화시킬 수 없음
    var template = `  
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <ul>
        <li><a href="?id=HTML">HTML</a></li>
        <li><a href="?id=CSS">CSS</a></li>
        <li><a href="?id=JavaScript">JavaScript</a></li>
      </ul>
      <h2>${title}</h2>
      <p><a href="https://www.w3.org/TR/html5/" target="_blank" title="html5 speicification">Hypertext Markup Language (HTML)</a> is the standard markup language for <strong>creating <u>web</u> pages</strong> and web applications.Web browsers receive HTML documents from a web server or from local storage and render them into multimedia web pages. HTML describes the structure of a web page semantically and originally included cues for the appearance of the document.
      <img src="coding.jpg" width="100%">
      </p><p style="margin-top:45px;">HTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects, such as interactive forms, may be embedded into the rendered page. It provides a means to create structured documents by denoting structural semantics for text such as headings, paragraphs, lists, links, quotes and other items. HTML elements are delineated by tags, written using angle brackets.
      </p>
    </body>
    </html>
    `;
    
    response.end(template);  // 위의 내용을 가져옴
 
});
app.listen(3000);  // 포트번호 3000, 예) localhost:3000/?id=HTML