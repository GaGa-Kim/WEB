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
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
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
      tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`
      i++;
    }
    return `
    <select name="author">
    ${tag}
    </select>
    `
  } 
}
