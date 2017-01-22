import React, { Component } from 'react';
import { random } from 'lodash';

import AppActions from '../actions/AppActions';
import Circle from './Circle';

import './Viewport.scss';

const numberOfCircles = 500;

class Viewport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0
    };
  }

  generateCircles(numberOfCircles) {
    const circles = [];
    for (var i = 0; i < numberOfCircles; i++) {
      circles.push(<Circle
        hue={i/2}
        key={i}
        coordinates={this.getRandomCoordinates()}
      />);
      // TODO generate ghost circle (using viewport center)
    }
    return circles;
  }

  getRandomCoordinates(maxX, maxY) {
    return {
      x: random(this.state.width),
      y: random(this.state.height)
    };
  }

  setGravityCenter(e) {
    AppActions.setGravityCenter({
      x: e.screenX,
      y: e.screenY
    });
  }

  componentWillMount() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    })
    // TODO calculate viewport center
  }

  render() {
    return (
      <svg className="viewportWrapper" viewBox={`0 0 ${this.state.width} ${this.state.height}`} onClick={this.setGravityCenter}>
        {this.generateCircles(numberOfCircles)}
      </svg>
    );
  }
}

export default Viewport;
