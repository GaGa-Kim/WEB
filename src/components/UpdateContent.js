import React, { Component } from 'react';

class UpdateContent extends Component {
    constructor(props) { // 가변적으로 사용하기 위하여 state화 시켜줌
      super(props);
      this.state = {
        id:this.props.data.id,
        title:this.props.data.title,
        desc:this.props.data.desc
      }
      this.inputFormHandler = this.inputFormHandler.bind(this);
    }
    inputFormHandler(e) {
      this.setState({[e.target.name]:e.target.value});  // [e.target.name]은 title 또는 desc
    }
    render() {
      console.log(this.props.data);
      return(
        <article>
          <h2>Update</h2>
          <form action="/update_process" method="POST"
            onSubmit={function(e) {
              e.preventDefault(); // 페이지가 바뀌지 않도록
              this.props.onSubmit(
                this.state.id, 
                this.state.title, 
                this.state.desc
                );
            }.bind(this)}
            >
            <input type="hidden" name="id" value={this.state.id}></input>
            <p><input 
                  type="text" 
                  name="title" 
                  placeholder="title" 
                  value={this.state.title}
                  // 내용을 변경하여 입력할 수 있도록
                  onChange={this.inputFormHandler}> 
                </input>
            </p>
            <p>
              <textarea 
                name="desc" 
                placeholder="description"
                value={this.state.desc}
                onChange={this.inputFormHandler}> 
              </textarea>
            </p>
            <p><input type="submit"></input></p>
          </form>
        </article>
      );
    }
  }

  export default UpdateContent;