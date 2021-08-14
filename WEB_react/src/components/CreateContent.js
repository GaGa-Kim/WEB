import React, { Component } from 'react';

class CreateContent extends Component {
    render() {
      return(
        <article>
          <h2>Create</h2>
          <form action="/create_process" method="POST"
            onSubmit={function(e) {
              e.preventDefault(); // 페이지가 바뀌지 않도록
              this.props.onSubmit(e.target.title.value, e.target.desc.value);
            }.bind(this)}
            >
            <p><input type="text" name="title" placeholder="title"></input></p>
            <p>
              <textarea name="desc" placeholder="description"></textarea>
            </p>
            <p><input type="submit"></input></p>
          </form>
        </article>
      );
    }
  }

  export default CreateContent;