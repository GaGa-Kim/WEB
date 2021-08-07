import React, { Component } from 'react';

class Subject extends Component {
  render() {  // function render에서 function 생략
    return (  // Component를 만들 때는 하나의 최상위 태그만 사용하여 시작, props : 특성
      <header>  
        <h1>{this.props.title}</h1>
        {this.props.sub}
      </header>
    );
  }
}

export default Subject;