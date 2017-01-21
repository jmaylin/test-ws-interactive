import React, { Component } from 'react';
import Viewport from './components/Viewport';

class App extends Component {
  render() {
    return <Viewport></Viewport>;
  }
}

React.render(<App />, document.getElementById('app'));
