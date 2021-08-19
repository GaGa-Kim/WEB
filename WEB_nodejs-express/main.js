// express 버전으로 전환
var express = require('express')  // 모듈 로드
var app = express()
var fs = require('fs');  
var bodyParser = require('body-parser');
var compression = require('compression');
var topicRouter = require('./routes/topic');
var indexRouter = require('./routes/index');
var helmet = require('helmet')  // 자동 보안(보호)
app.use(helmet());

// 미들웨어로 정적인 파일 서비스 (이미지, 자바스크립트, CSS와 같은 파일을 서비스을 url을 통해 접근)
app.use(express.static('public'));
// ody-parser를 이용해서 post 방식으로 전송된 form 데이터를 쉽게 가져오는 방법
app.use(bodyParser.urlencoded({ extended: false }));
// compression 미들웨어를 이용해서 컨텐츠를 압축해서 전송
app.use(compression());
// 공통적으로 사용하는 글 목록 로딩하는 부분을 미들웨어로 만들어서 구현
app.get('*', function(request, response, next) {  // get 방식으로 들어오는 요청에 대해서만 파일 목록을 가져옴
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();  // 그 다음에 호출하여야 하는 미들웨어를 불러줌
  });
})

// 라우터를 만들어서 연관된 파일로 분리(복잡도를 낮추는 방법) - /topic으로 시작하는 주소들에게 topicRouter라는 이름의 미들웨어 적용, 홈을 index로 미들웨어 적용 
app.use('/topic', topicRouter);
app.use('/', indexRouter);

/* route의 index.js로 이동
// 홈페이지 처음 부분
// app.get(path, callback) -> route, routing 
app.get('/', function(request, response) {  
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.html(title, list, `<h2>${title}</h2>${description}<img src="/images/hello.png" style="width:300px; display:block; margin:10px;"> 
    `,`<a href="topic/create">create</a>`);
    response.send(html);
});  */
/* -> 위 코드와 같은 코드 
app.get('/', (req, res) => res.send('Hello World!')) */

/* route의 topic.js로 이동
// 글 생성 폼
app.get('/topic/create', function(request, response) {
  var title = 'WEB - create';    
  var list = template.list(request.list);
  var html = template.html(title, list, `
    <form action="/topic/create_process" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
    `, '');
  response.send(html);
});

// 글 생성 프로세스
app.post('/topic/create_process', function(request, response) {  
  //
  var body = ''; 
  request.on('data', function(data) { 
    body = body + data; 
  });
  request.on('end', function() {  
    var post = qs.parse(body);  
    console.log(post.title);
    console.log(post.description);
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
      response.writeHead(302, {Location: `/?id=${title}`});  
      response.end('success'); 
    })
  }); //

  // body-parser(미들웨어)를 이용해서 post 방식으로 전송된 form 데이터를 쉽게 가져오는 방법
  var post = request.body;  // request 객체의 body property에 접근하여 사용
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
    response.writeHead(302, {Location: `/?id=${title}`});  
    response.end('success'); 
  })
});

// 글 수정
app.get('/topic/update/:pageId', function(request, response) {
    var filteredID = path.parse(request.params.pageId).base;  
    fs.readFile(`data/${filteredID}`, 'utf8', function(err, description) {
      var title = request.params.pageId;  
      var list = template.list(request.list);
      var html = template.html(title, list, `
        <form action="/topic/update_process" method="post">
        <input type="hidden" name="id" value="${title}"> 
          <p><input type="text" name="title" value="${title}"></p>
          <p>
            <textarea name="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>`, 
        `<a href="/topic/create">create</a> <a href="/topic/update?id=${title}">update</a>`);
    response.send(html);
  });
});

// 글 수정 프로세스
app.post('/topic/update_process', function(request, response) {
  var post = request.body;  
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function(error) {
   fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
      // response.redirect(`/?id=${title}`); 
       response.redirect(`/topic/${title}`);
   })
  });    
});

// 삭제
app.post('/topic/delete_process', function(request, response) { 
  var post = request.body;  
  var id = post.id;
  var filteredID = path.parse(id).base;  
  fs.unlink(`data/${filteredID}`, function(error) {
     response.redirect('/'); 
  });
});

// 글 목록 클릭 시 보여주기
// querystring 대신 requeset.params 사용
app.get('/topic/:pageId', function(request, response, next) {
  var filteredID = path.parse(request.params.pageId).base;  
  var list = template.list(request.list);
  fs.readFile(`data/${filteredID}`, 'utf8', function(err, description) {
    // 페이지가 없을 때 에러 발생 예) http://localhost:3000/page/CSS1
    if(err) {
      next(err); // 에러 데이터 전달 (맨 밑의 에러 미들웨어 호출)
    } else {
      var title = request.params.pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags:['h1']
      });
      var list = template.list(request.list);
      var html = template.html(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/topic/create">create</a>
          <a href="/topic/update/${sanitizedTitle}">update</a>
          <form action="/topic/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`
      );
      response.send(html);
    }
  });
}); */

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

// 에러 메시지가 출력되는 모습을 바꾸고 싶다면 (에러를 핸들링하기 위한 미들웨어)
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
