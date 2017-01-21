import React, { Component } from 'react';

import Circle from './Circle';

import styles from './Viewport.css';

class Viewport extends Component {
  render() {
    return (
      <div>
        <h2>Viewport</h2>
        <Circle></Circle>
      </div>);
  }
}

export default Viewport;
