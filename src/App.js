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
      subject:{title:'WEB', sub:'World Wide Web!'},
      contents: [ 
        {id:1, title:'HTML', desc:'HTML is for information'},
        {id:2, title:'CSS', desc:'CSS is for design'},
        {id:3, title:'JavaScript', desc:'JavaScript is for interactive'}
      ]
    }
  }
  render() {
    return (
      <div className="App">
      <Subject 
        title={this.state.subject.title} 
        sub={this.state.subject.sub}></Subject>
      <TOC data={this.state.contents}></TOC>
      <Content title="HTML" desc="HTML is HyperText Markup Language."></Content>
    </div>
    );
  }
}

export default App;