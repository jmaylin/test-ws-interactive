import React, { Component } from 'react';
import { random } from 'lodash';

import Circle from './Circle';

import './Viewport.scss';

class Viewport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0
    };
  }
  getRandomCoordinates(maxX, maxY) {
    return {
      x: random(this.state.width),
      y: random(this.state.height)
    };
  }
  componentWillMount() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }
  render() {
    return (
      <svg className="viewportWrapper" viewBox={`0 0 ${this.state.width} ${this.state.height}`}>
        <Circle coordinates={this.getRandomCoordinates()} />
      </svg>
    );
  }
}

export default Viewport;
