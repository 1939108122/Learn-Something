import React from 'react';

class NotControl extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }
  handleClick = () => {
    console.log(this.inputRef.current.value);
  }
  render() {
    return (
      <>
        <input type="text" ref={this.inputRef} />
        <button onClick={this.handleClick}>获取用户输入的内容</button>
      </>
    );
  }
}

export default NotControl;