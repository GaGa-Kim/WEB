var http = require('http');
var url = require('url');
const { authorSelect } = require('./lib/template');
var topic = require('./lib/topic');
var author = require('./lib/author');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        /* 파일을 읽어와서 목록 보여주기
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(filelist);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        }); */

        /* mysql을 읽어와서 목록 보여주기
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
        }); */
        topic.home(request, response);
      } else {
        /* 파일을 읽어와서 상세보기 보여주기
        fs.readdir('./data', function(error, filelist){
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1']
            });
            var list = template.list(filelist);
            var html = template.HTML(sanitizedTitle, list,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              ` <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`
            );
            response.writeHead(200);
            response.end(html);
          });
        }); */

        /* mysql을 읽어와서 상세보기 보여주기 + join을 이용해서 저자 출력
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
        }); */
        topic.page(request, response);
      }
    } else if(pathname === '/create'){
      /* 파일을 읽어와서 글 생성하기 
      fs.readdir('./data', function(error, filelist){
        var title = 'WEB - create';
        var list = template.list(filelist);
        var html = template.HTML(title, list, `
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
      }); */

      /* mysql을 읽어와서 글 생성하기 + join을 이용해서 저자 적용
      db.query(`SELECT * FROM topic`, function(err, topics){
        db.query(`SELECT * FROM author`, function(err2, authors) {
          // template.js로 빼내기 - authorSelect
          var tag = '';
          var i = 0;
          while(i < authors.length) {
            tag += `<option value="${authors[i].id}">${authors[i].name}</option>`
            i++;
          } //
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
      }); */
      topic.create(request, response);
    } else if(pathname === '/create_process'){
      /* var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          // 파일을 읽어와서 글 생성하기
          var title = post.title;
          var description = post.description;
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          }) //

          // mysql을 읽어와서 글 생성하기 + join을 이용해서 저자 선택하기
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
      }); */
      topic.create_process(request, response);
    } else if(pathname === '/update'){
      /* 파일을 읽어와서 글 수정하기
      fs.readdir('./data', function(error, filelist){
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = template.list(filelist);
          var html = template.HTML(title, list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      }); */

      /* mysql을 읽어와서 글 수정하기 + join을 이용해서 저자 출력
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
        }); */
        topic.update(request, response);
    } else if(pathname === '/update_process'){
      /* 
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          // 파일을 읽어와서 글수정하기
          var id = post.id;
          var title = post.title;
          var description = post.description;
          fs.rename(`data/${id}`, `data/${title}`, function(error){
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            })
          }); //

          // mysql을 읽어와서 글 수정하기 + join을 이용해서 저자 수정
          db.query(`
          UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`, 
          [post.title, post.description, post.author, post.id], function(err, result) { // <select name="author"> 이므로 post.author
            response.writeHead(302, {Location: `/?id=${post.id}`});
            response.end();
          })
      }); */
      topic.update_process(request, response);
    } else if(pathname === '/delete_process'){
      /*
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          // mysql을 읽어와서 글 삭제하기
          db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(err, result) {
            if(err) {
              throw err;
            }
            response.writeHead(302, {Location: `/`});
            response.end();
          });
          // 파일을 읽어와서 글 삭제하기
          var id = post.id;
          var filteredId = path.parse(id).base;
          fs.unlink(`data/${filteredId}`, function(error){
            response.writeHead(302, {Location: `/`});
            response.end();
          }) //
      }); */
      topic.delete_process(request, response);
    } else if(pathname === '/author') {
      author.home(request, response);
    }
    else if(pathname === '/author/create_process') {
      author.create_process(request, response);
    }
    else if(pathname === '/author/update') {
      author.update(request, response);
    }
    else if(pathname === '/author/update_process') {
      author.update_process(request, response);
    }
    else if(pathname === '/author/delete_process'){
      author.delete_process(request, response);
    }
    else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
