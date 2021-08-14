// 라우터를 만들어서 파일로 분리
var express = require('express');
var router = express.Router();  // express의 Router 메소드 호출
var path = require('path'); 
var fs = require('fs');  
var sanitizeHtml = require('sanitize-html');  
var template = require('../lib/template.js');

// 글 생성 폼
router.get('/create', function(request, response) {
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
  router.post('/create_process', function(request, response) {  
    /* 
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
    }); */
  
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
  router.get('/update/:pageId', function(request, response) {
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
  router.post('/update_process', function(request, response) {
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
  router.post('/delete_process', function(request, response) { 
    var post = request.body;  
    var id = post.id;
    var filteredID = path.parse(id).base;  
    fs.unlink(`data/${filteredID}`, function(error) {
       response.redirect('/'); 
    });
  });
  
  // 글 목록 클릭 시 보여주기
  // querystring 대신 requeset.params 사용
  router.get('/:pageId', function(request, response, next) {
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
  });
  module.exports = router;