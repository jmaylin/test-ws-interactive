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
      height: 0,
      gravityCenter: {
        x: 0,
        y: 0
      }
    };
    this.circlesAlreadyGenerated = false;
    this.setGravityCenter = this.setGravityCenter.bind(this);
  }

  generateCircles(numberOfCircles) {
    if (this.circlesAlreadyGenerated) {
      return this.circles;
    }
    this.circlesAlreadyGenerated = true;
    this.circles = [];
    for (var i = 0; i < numberOfCircles; i++) {
      this.circles.push(<Circle
        hue={i/2}
        key={i}
        coordinates={this.getRandomCoordinates()}
      />);
      // TODO generate ghost circle (using viewport center)
    }
    return this.circles;
  }

  getRandomCoordinates(maxX, maxY) {
    return {
      x: random(this.state.width),
      y: random(this.state.height)
    };
  }

  setGravityCenter(e) {
    AppActions.setGravityCenter({
      x: e.pageX,
      y: e.pageY
    });
    this.setState({
      gravityCenter: {
        x: e.pageX,
        y: e.pageY
      }
    });
  }

  componentWillMount() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
      gravityCenter: {
        x: window.innerWidth / 2,
        y: window.innerHeight /2
      }
    })
    // TODO calculate viewport center
  }

  render() {
    const { gravityCenter } = this.state;
    return (
      <svg className="viewportWrapper" viewBox={`0 0 ${this.state.width} ${this.state.height}`} onClick={this.setGravityCenter}>
        <circle cx={gravityCenter.x} cy={gravityCenter.y} r="3" fill="black"/>
        { this.generateCircles(numberOfCircles) }
      </svg>
    );
  }
}

export default Viewport;
