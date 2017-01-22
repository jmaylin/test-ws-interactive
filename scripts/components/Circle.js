import React, { Component, PropTypes } from 'react';
import { uniqueId } from 'lodash';

import AppStore from '../stores/AppStore';

import styles from './Circle.scss';

const areaOfEffect = 200;

class Circle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gravityCenter: null,
      x: props.coordinates.x,
      y: props.coordinates.y
    };

    this.newGravityCenter = this.newGravityCenter.bind(this);
    this.generateCircle = this.generateCircle.bind(this);
  }

  componentDidMount() {
    AppStore.addChangeListener(this.newGravityCenter);
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this.newGravityCenter);
  }

  newGravityCenter() {
    const gravityCenter = AppStore.getGravityCenter();

    this.setState({
      gravityCenter,
    });

    // TODO set the new position when the animation is completed

    // setTimeout(() => {
    //   this.setState({
    //     gravityCenter: null,
    //     x: 0, // TODO new position ?
    //     y: 0  // TODO new position ?
    //   });
    // }, 500);
  }

  isInAreaOfEffect() {
    const { coordinates } = this.props;
    const { gravityCenter } = this.state;

    const fromGravityCenterToHere = Math.sqrt(
      Math.pow((gravityCenter.x-coordinates.x),2) + Math.pow((gravityCenter.y-coordinates.y),2)
    );
    return fromGravityCenterToHere <= areaOfEffect;
  }

  getAnimateTransform(coordinates) {
    // TODO run the animation once, each time it's injected
    return (
      <animateTransform
        attributeType="xml"
        attributeName="transform"
        type="rotate"
        fill="freeze"
        from={`0 ${coordinates.x} ${coordinates.y}`}
        to={`30 ${coordinates.x} ${coordinates.y}`}
        dur="500ms"
        repeatCount="indefinite"/>);
  }

  generateCircle() {
    return (
      <circle cx={this.coordinates.x} cy={this.coordinates.y} r={radius} fill={`hsl(${hue}, 50%, 50%)`}>
        { this.gravityCenter ? this.getAnimateTransform(this.gravityCenter) : null }
      </circle>);
  }

  render() {
    const { radius, hue, coordinates } = this.props;
    const { x, y, gravityCenter } = this.state;

    return (
      <circle cx={x} cy={y} r={radius} fill={`hsl(${hue}, 50%, 50%)`}>
        { gravityCenter && this.isInAreaOfEffect()
          ? this.getAnimateTransform(gravityCenter)
          : null }
      </circle>
    );
  }
}

Component.defaultProps = {
  radius: 10,
  hue: 0,
  coordinates: {
    x: 0,
    y: 0
  }
};

Component.propTypes = {
  radius: PropTypes.number,
  hue: PropTypes.number,
  coordinates: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  })
};

export default Circle;
