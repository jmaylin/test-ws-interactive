import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Viewport from './components/Viewport';

class App extends Component {
  render() {
    return <Viewport></Viewport>;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
