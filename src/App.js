import './App.css';
import TOC from "./components/TOC";
import Content from "./components/Content";
import Subject from "./components/Subject";
import React, { Component } from 'react';

/* function type
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
} */

/* state 전 props 사용
class App extends Component {
  render() {
    return (
      <div className="App">
        <Subject title="WEB" sub="world wide web!"></Subject>
        <TOC></TOC>
        <Content title="HTML" desc="HTML is HyperText Markup Language."></Content>
      </div>
    );
} */

// class type
class App extends Component {
  //  컴포넌트를 외부에서 조작할 때는 props를, 내부적으로 상태를 관리할 때는 state를 사용
  constructor(props) {  // state 값을 초기화 -> 이를 통해 외부에서 알 수 없도록 은닉 (내부적으로 사용할 때는 state를 사용)
    super(props);
    this.state = {
      mode:'read',
      selected_content_id:2,
      subject:{title:'WEB', sub:'World Wide Web!'},
      welcome:{title:'Welcome', desc:'Hello, React!!'},
      contents: [ 
        {id:1, title:'HTML', desc:'HTML is for information'},
        {id:2, title:'CSS', desc:'CSS is for design'},
        {id:3, title:'JavaScript', desc:'JavaScript is for interactive'}
      ]
    }
  }
  render() { // props, state가 바뀌면 render가 호출되어 다시 그려짐 (다시 실행) - 연결되는 하위 component들이 모두 rendering
    var _title, _desc = null; 
    if(this.state.mode === 'welcome') {
      _title = this.state.welcome.title;
      _desc = this.state.welcome.desc;
    } else if (this.state.mode === 'read') {
      var i = 0;
      while(i < this.state.contents.length) {
        var data = this.state.contents[i];
        if(data.id === this.state.selected_content_id) {
          _title = data.title;
          _desc = data.desc;
          break;
        }
        i = i + 1;
      }
    }
    return (
      <div className="App">
      <Subject // 링크 클릭 시 onChangePage 이벤트를 호출하여 mode 바꾸기
        title={this.state.subject.title} 
        sub={this.state.subject.sub}
        onChangePage={function() {
          this.setState({mode:'welcome'});
        }.bind(this)}>
      </Subject>

      {/* <header>  
        <h1><a href="/" onClick={function(e) {
          console.log(e);
          e.preventDefault(); // 이벤트를 걸 때 태그가 가지고 있는 기본적인 동작 방식을 하지 못하도록 함 (원래 태그가 하는 동작을 하지 못하도록 하여 바뀐 이벤트를 보여줄 수 있게 되는 것)
          // this.state.mode = 'welcome'; -> 2가지 문제가 있음 
          // 1. 이벤트가 호출되었을 때의 function 함수 안에서는 this를 찾을 수 없어서 -> bind 사용하여 강제로 주입
             2. state 대신 setState가 필요하며, 변경하고 싶은 값을 넣어줌 //
          this.setState({
            mode:'welcome'
          });
        }.bind(this)}>{this.state.subject.title}</a></h1>
        {this.state.subject.sub}
      </header> */}
      <TOC onChangePage={function(id) {
          this.setState({
            mode:'read',
            selected_content_id:Number(id)
          });
        }.bind(this)}
      data={this.state.contents}></TOC>
      <Content title={_title} desc={_desc}></Content>
    </div>
    );
  }
}

export default App;