var http = require('http');  // http를 요구하는 모듈 
var fs = require('fs');  // fs를 요구하는 모듈
var url = require('url');  // url을 요구하는 모듈 (url이라는 모듈)
var qs = require('querystring');  // node.js가 가지고 있는 모듈
var template = require('./lib/template.js')// 모듈 사용
var path = require('path'); // 디렉토리를 타고 올라가 보안의 위험이 생기는 것을 방지하기 위해 사용
var sanitizeHtml = require('sanitize-html');  // 출력정보에 대한 보안을 위해 외부 모듈인 sanitize-html을 사용 (create나 update를 사용할 때 그 안에 스크립트나 링크 등의 예민한 것을 사용하여 보안의 위험에 생기는 것을 방지하기 위해 사용)

/* 중복을 제거하기 위해 함수를 만듦, 객체를 통해 templateHTML과 templateList를 그룹핑 -> 리팩토링
function templateHTML(title, list, body, control) {
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
    ${control}
    ${body}
  </body>
  </html>
  `;
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
} */

/* 객체를 통해 templateHTML과 templateList를 그룹핑 -> 모듈을 이용하여 밖으로 꺼냄
var template = {
  html:function (title, list, body, control) {
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
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  list:function templateList(filelist) {
    var list = `<ul>`;
    var i = 0;
    while(i < filelist.length) {
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }    
    list = list+`</ul>`
    return list;
  } 
} */

// URL을 통해서 입력된 값을 사용하는 방법 (query string에 따라 다르게 동작) -> query에서 id를 찾아서 이를 이용 -> localhost:3000/?id=HTML -> 이 경우 HTML
// http://opentutorials.org:3000/main?id=HTML&page=12의 경우 http는 protocol, opentutorials.org는 host(domain), 3000은 port, main은 path, id=HTML&page=12는 query string
// createServer에 전달된 callback 함수, node.js로 웹브라우저가 접속이 들어올 때마다 callback 함수를 호출, 요청할 때 웹브라우저가 보낸 정보, 응답할 때 우리가 웹브라우저에게 전송할 정보를 인자로 가짐
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
          
          /* 객체 사용 전
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
          response.writeHead(200); 
          response.end(template); */
          
          // 객체 사용 후
          var list = template.list(filelist);
          var html = template.html(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
          response.writeHead(200); 
          response.end(html);
        })
      } else {
        fs.readdir('./data', function(error, filelist){
          var filteredID = path.parse(queryData.id).base;  // 보안을 위해
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
          var list = template.list(filelist);

          // 파일 읽어오기 + 밑에 형식 부분 가져와서 수정
          fs.readFile(`data/${filteredID}`, 'utf8', function(err, description) {
            var title = queryData.id;  // url에서 query string의 id를 가져와서 이를 title로 하여 문서의 제목(HTML, CSS, JavaScript)을 표현
            var sanitizedTitle = sanitizeHtml(title);  // 보안을 위해 소독
            var sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1']
            }); 
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
            var html = template.html(sanitizedTitle, list, 
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`, 
              `<a href="/create">create</a> 
               <a href="/update?id=${sanitizedTitle}">update</a>
               <form action="delete_process" method="post">
                 <input type="hidden" name="id" value="${sanitizedTitle}">
                 <input type="submit" value="delete">
               </form>`);
            response.writeHead(200); // 성공적
            response.end(html);
          });  
        });
      }
    } else if(pathname === '/create') { // WEB을 눌렀을 때(홈)의 코드를 활용하여 create를 클릭할 경우 글생성 폼을 가져오도록 함
      fs.readdir('./data', function(error, filelist){
        console.log(filelist); 
        var title = 'WEB - create';
        
        var list = template.list(filelist);
        var html = template.html(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `, '');
        response.writeHead(200); 
        response.end(html);
      });
    } else if(pathname === '/create_process') { // post 방식으로 전송된 데이터를 node.js 안에서 가져오기
      var body = '';
      // callback을 이용하여 웹브라우저 post방식으로 데이터를 전송할 때 데이터가 많으면 조각 조각의 양을 서버에서 수신할 때마다 서버는 data 다음의 callback 함수를 호출. 그리고선 data라는 인자로 수신한 정보를 줌.
      request.on('data', function(data) { 
        body = body + data; // callback이 실행될 때마다 데이터를 추가
      });
      request.on('end', function() {  // 더이상 들어올 정보가 없으면 end 다음의 callback함수를 호출 (정보 수신 끝)
        var post = qs.parse(body);  // 지금까지 저장한 body를 입력값으로 줌, post 데이터에 post 정보를 줌
        console.log(post.title);
        console.log(post.description);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
          response.writeHead(302, {Location: `/?id=${title}`});  // 파일을 만든 후 리다이렉션을 통해 바로 확인하기, 302는 페이지를 리다이렉션 시키라는 것
          response.end('success'); 
        })
      });
    } else if(pathname === '/update') {
      fs.readdir('./data', function(error, filelist){
        var filteredID = path.parse(queryData.id).base;  // 보안을 위해
        fs.readFile(`data/${filteredID}`, 'utf8', function(err, description) {
          var title = queryData.id;  
          var list = template.list(filelist);
          // 사용자가 수정하고자하는 파일과 우리가 수정해야하는 파일을 구분해주기 위해서 hidden인 input 추가 (타이틀 이름이 바뀔수도 있으므로)
          var html = template.html(title, list, `
            <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}"> 
              <p><input type="text" name="title" value="${title}"></p>
              <p>
                <textarea name="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>`, 
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
        response.writeHead(200); 
        response.end(html);
        });
      });
    } else if(pathname === '/update_process') {
      var body = '';
      request.on('data', function(data) { 
        body = body + data; 
      });
      request.on('end', function() {  
        var post = qs.parse(body);  
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(error) {
          fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
            response.writeHead(302, {Location: `/?id=${title}`}); 
            response.end(); 
          })
        });
      });
    } else if(pathname === '/delete_process') {
      var body = '';
      request.on('data', function(data) { 
        body = body + data; 
      });
      request.on('end', function() {  
        var post = qs.parse(body);  
        var id = post.id;
        var filteredID = path.parse(id).base;  // 보안을 위해
        fs.unlink(`data/${filteredID}`, function(error) {
          response.writeHead(302, {Location: `/`}); // 삭제 후 홈으로 돌아감
          response.end(); 
        })
      });
    }
    else {
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