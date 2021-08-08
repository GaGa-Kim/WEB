var db = require('./db');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');

// mysql을 읽어와서 목록 보여주기
exports.home = function(request, response) {
    db.query(`SELECT * FROM topic`, function(err, topics){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
}

// mysql을 읽어와서 상세보기 보여주기 + join을 이용해서 저자 출력
exports.page = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function(err, topics){
        if(err) {
          throw err;  // 에러 발생 시 콘솔 출력 및 애플리케이션 중지
        }
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function(err2, topic) {
          if(err2) {
            throw err2;  
          }
          var title = topic[0].title;
          var description = topic[0].description;
          var list = template.list(topics);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description} <p>by ${topic[0].name}</p>`,
            `<a href="/create">create</a>
            <a href="/update?id=${queryData.id}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="delete">
              </form>`
          );
          response.writeHead(200);
          response.end(html);
        })
      });
}

// mysql을 읽어와서 글 생성하기 + join을 이용해서 저자 적용
exports.create = function(request, response) {
    db.query(`SELECT * FROM topic`, function(err, topics){
        db.query(`SELECT * FROM author`, function(err2, authors) {
          var title = 'Create';
          var list = template.list(topics);
          var html = template.HTML(title, list,
            `<form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
            ${template.authorSelect(authors)}
            <p>
              <input type="submit">
            </p>
          </form>`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
}

// mysql을 읽어와서 글 생성하기 + join을 이용해서 저자 선택하기
exports.create_process = function(request, response) {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`
        INSERT INTO topic (title, description, created, author_id) 
        VALUES(?, ?, NOW(), ?)`, 
        [post.title, post.description, post.author], 
        function(err, result) {
            if(err) {
            throw err;
            }
        response.writeHead(302, {Location: `/?id=${result.insertId}`});
        response.end();
        }
      )  
    });
}

// mysql을 읽어와서 글 수정하기 + join을 이용해서 저자 출력
exports.update = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function(err, topics){
        if(err) {
          throw err;  
        }
        db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(err2, topic) {
          if(err2) {
            throw err2;  
          }
          db.query(`SELECT * FROM author`, function(err2, authors) {
            var list = template.list(topics);
            var html = template.HTML(topic[0].title, list,
              `
              <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${topic[0].id}">
                <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                <p>
                  <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                </p>
                <p>
                ${template.authorSelect(authors, topic[0].author_id)}
                <p>
                <p>
                  <input type="submit">
                </p>
              </form>
              `,
              `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
            );
            response.writeHead(200);
            response.end(html);
          });
        });
      });
}
       
// mysql을 읽어와서 글 수정하기 + join을 이용해서 저자 수정
exports.update_process = function(request, response) {
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        db.query(`
        UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`, 
        [post.title, post.description, post.author, post.id], function(err, result) { // <select name="author"> 이므로 post.author
            response.writeHead(302, {Location: `/?id=${post.id}`});
            response.end();
        })
    });
}

// mysql을 읽어와서 글 삭제하기
exports.delete_process = function(request, response) {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(err, result) {
          if(err) {
            throw err;
          }
          response.writeHead(302, {Location: `/`});
          response.end();
        });
    });
}