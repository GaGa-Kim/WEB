var db = require('./db');
var template = require('./template.js');
var qs = require('querystring');
var url = require('url');
var sanitizeHtml = require('sanitize-html'); // 입력되는 자바스크립트문을 깨끗하게 세탁

// mysql을 읽어와서 저자 목록 보여주기 + 저자 생성 폼
exports.home = function(request, response) {
    db.query(`SELECT * FROM topic`, function(err, topics){
        db.query(`SELECT * FROM author`, function(err, authors){
            /* template.js로 가기
            var tag = '<table>';
            var i = 0;
            while(i < authors.length) {
                tag += `
                    <tr>
                        <td>${authors[i].name}</td>
                        <td>${authors[i].profile}</td>
                        <td>update</td>
                        <td>delete</td>
                    </tr>
                    `
                i++;
            }
            tag += `</table>` */

            var title = 'author';
            var list = template.list(topics);
            var html = template.HTML(title, list,
              `
              ${template.authorTable(authors)}
              <style>
                table {
                    border-collapse: collapse;
                }
                td {
                    border:1px solid black;
                }
              </style>
              <form action="/author/create_process" method="post">
                <p>
                    <input type="text" name="name" placeholder="name">
                </p>
                <p>
                    <textarea name="profile" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit" value="create">
                </p>
             </form>
          `,
              ``
            );
            response.writeHead(200);
            response.end(html);
          });
        });
}

// mysql을 읽어와서 저자 생성하기
exports.create_process = function(request, response) {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`
        INSERT INTO author (name, profile) 
        VALUES(?, ?)`, 
        [post.name, post.profile], 
        function(err, result) {
            if(err) {
            throw err;
            }
        response.writeHead(302, {Location: `/author`});
        response.end();
        }
      )  
    });
}

// mysql을 읽어와서 저자 수정하기
exports.update = function(request, response) {
    db.query(`SELECT * FROM topic`, function(err, topics){
        db.query(`SELECT * FROM author`, function(err, authors){
            var _url = request.url;
            var queryData = url.parse(_url, true).query;
            db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], function(err2, author){
            /* template.js로 가기
            var tag = '<table>';
            var i = 0;
            while(i < authors.length) {
                tag += `
                    <tr>
                        <td>${authors[i].name}</td>
                        <td>${authors[i].profile}</td>
                        <td>update</td>
                        <td>delete</td>
                    </tr>
                    `
                i++;
            }
            tag += `</table>` */
            var title = 'author';
            var list = template.list(topics);
            var html = template.HTML(title, list,
              `
              ${template.authorTable(authors)}
              <style>
                table {
                    border-collapse: collapse;
                }
                td {
                    border:1px solid black;
                }
              </style>
              <form action="/author/update_process" method="post">
                <p>
                    <input type="hidden" name="id" value="${queryData.id}">
                </p>
                <p>
                    <input type="text" name="name" value="${sanitizeHtml (author[0].name)}" placeholder="name">
                </p>
                <p>
                    <textarea name="profile" placeholder="profile">${sanitizeHtml (author[0].profile)}</textarea>
                </p>
                <p>
                    <input type="submit" value="update">
                </p>
             </form>
          `,
              ``
            );
            response.writeHead(200);
            response.end(html);
          });
        });
            });
            
}

// mysql을 읽어와서 저자 수정 반영하기
exports.update_process = function(request, response) {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`
        UPDATE author SET name=?, profile=? WHERE id=?`, 
        [post.name, post.profile, post.id], 
        function(err, result) {
            if(err) {
            throw err;
            }
        response.writeHead(302, {Location: `/author`});
        response.end();
        }
      )  
    });
}

// mysql을 읽어와서 저자 삭제하기 + 저자가 쓴 topic도 지워지기 (topic 먼저 삭제 -> author 정보 삭제)
exports.delete_process = function(request, response) {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`DELETE FROM topic WHERE id=?`, 
        [post.id],
        function(err1, result1) {
            if(err1) {
                throw err1;
            }
            db.query(`
                DELETE FROM author WHERE id=?`, 
                [post.id], 
                function(err, result) {
                    if(err) {
                    throw err;
                    }
                    response.writeHead(302, {Location: `/author`});
                    response.end();
                }
            )  
         });
    });
}
