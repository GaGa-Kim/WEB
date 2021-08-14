var sanitizeHtml = require('sanitize-html'); // 입력되는 자바스크립트문을 깨끗하게 세탁

module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${sanitizeHtml (topics[i].title)}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },authorSelect:function(authors, author_id) {
    var tag = '';
    var i = 0;
    while(i < authors.length) {
      var selected ='';
      if(authors[i].id === author_id) {  // while문을 돌면서의 저자의 이름과 현재 상세보기의 저자가 같을 때
        selected = ' selected'; // 이처럼 되도록 <option value="1" selected>egoing</option>
      }
      tag += `<option value="${authors[i].id}"${selected}>${sanitizeHtml (authors[i].name)}</option>`
      i++;
    }
    return `
    <select name="author">
    ${tag}
    </select>
    `
  },authorTable:function(authors) {
    var tag = '<table>';
    var i = 0;
    while(i < authors.length) {
        tag += `
            <tr>
                <td>${sanitizeHtml (authors[i].name)}</td>
                <td>${sanitizeHtml (authors[i].profile)}</td>
                <td><a href="/author/update?id=${authors[i].id}">update</td>
                <td>
                  <form action="/author/delete_process" method="post">
                    <input type="hidden" name="id" value="${authors[i].id}">
                    <input type="submit" value="delete">
                  </form>
                </td>
            </tr>
            `
        i++;
    }
    tag += `</table>`
    return tag;
  }
}

