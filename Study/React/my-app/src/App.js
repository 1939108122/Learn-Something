import React from 'react';
import State from './components/state';
import NotControl from './components/not-control';

class App extends React.Component {
  state = { value: '' }
  handleChange(e) {
    this.setState({
      value: e.target.value
    })
  }
  render() {
    return (
      <div>
        <NotControl />
        <State />
        <input value={this.state.value} onChange={(e) => this.handleChange(e)}></input>
      </div>
    );
  }
}

export default App;