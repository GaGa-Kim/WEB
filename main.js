var http = require('http');  // http를 요구하는 모듈 
var fs = require('fs');  // fs를 요구하는 모듈
var url = require('url');  // url을 요구하는 모듈 (url이라는 모듈)

// 중복을 제거하기 위해 함수를 만듦
function templateHTML(title, list, body) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
  </body>
  </html>
  `
}

function templateList(filelist) {
  var list = `<ul>`;
  var i = 0;
  while(i < filelist.length) {
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }    
  list = list+`</ul>`
  return list;
}

// URL을 통해서 입력된 값을 사용하는 방법 (query string에 따라 다르게 동작) -> query에서 id를 찾아서 이를 이용 -> localhost:3000/?id=HTML -> 이 경우 HTML
// http://opentutorials.org:3000/main?id=HTML&page=12의 경우 http는 protocol, opentutorials.org는 host(domain), 3000은 port, main은 path, id=HTML&page=12는 query string
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;  // url에서 query string 부분만 가져온 것    
    
    // 사용자가 루트로 접근했는지 아닌지 구분. 즉, localhost:3000 뒤에 path 정보가 붙지 않는 것
    console.log(url.parse(_url, true).pathname); // 이를 출력하면 pathname은 '/', pathname은 '/?id=CSS' (query string 포함)
    var pathname = url.parse(_url, true).pathname;
     
    /* 불필요하여 주석 처리
    console.log(queryData.id);  // queryData만 넣을 경우 { id : 'HTML' } 출력, queryData.id일 경우 HTML 출력
    
    if(_url == '/'){  // 본문 제목
      title = 'Welcome';
    }
    if(_url == '/favicon.ico'){
      response.writeHead(404);
      response.end();
      return;    
    } */ 
    
    // 만약 접근한 pathname이 '/''라면, 즉 path가 없는 루트로 접근했다면 이를 실행
    if(pathname === '/') {
      // if문을 중첩하여 본문 처음 부분 
      if(queryData.id === undefined) {
        // 특정 디렉토리 하위에 있는 파일과 디렉토리의 목록을 알아내는 방법을 통해 글목록 출력   
        fs.readdir('./data', function(error, filelist){
          console.log(filelist); // [ 'CSS', 'HTML', 'JavaScript' ] -> 특정 디렉토리에 있는 파일 목록을 배열로 출력
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
          response.writeHead(200); 
          response.end(template);
        })
      } else {
        fs.readdir('./data', function(error, filelist){
          /* 이를 참고하여 밑을 만듦 
          var list = `<ul>
            <li><a href="/?id=HTML">HTML</a></li>
            <li><a href="/?id=CSS">CSS</a></li>
            <li><a href="/?id=JavaScript">JavaScript</a></li>
          </ul>` */
          
          /* 함수로 중복 제거
          var list = `<ul>`;
          var i = 0;
          while(i < filelist.length) {
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i = i + 1;
          }    
          list = list+`</ul>` */
          var list = templateList(filelist);

          // 파일 읽어오기 + 밑에 형식 부분 가져와서 수정
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
            var title = queryData.id;  // url에서 query string의 id를 가져와서 이를 title로 하여 문서의 제목(HTML, CSS, JavaScript)을 표현
            /* 함수로 중복 제거
            var template = `  
            <!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              ${list}
              <h2>${title}</h2>
              <p>${description}</p>
            </body>
            </html>
            `; */
            var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
            response.writeHead(200); // 성공적
            response.end(template);
          });  
        });
      }
    } else {
      response.writeHead(404);  
      response.end('Not found');
    }
    
    // Template Literal 사용, 아직은 본문 제목과 목록(리스트)만 변화할 뿐 본문의 내용은 변화시킬 수 없음
    /* -> query string에 따라서 데이터 디렉토리에 있는 파일을 읽어와 본문을 채워 넣음 (치환) 
    
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
    */
});
app.listen(3000);  // 포트번호 3000, 예) localhost:3000/?id=HTML