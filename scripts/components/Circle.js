import React, { Component, PropTypes } from 'react';

import styles from './Circle.scss';

class Circle extends Component {
  render() {
    const { radius, hue, coordinates } = this.props;
    return (<circle
      cx={coordinates.x}
      cy={coordinates.y}
      r={radius}
      fill={`hsl(${hue}, 50%, 50%)`}
    />);
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
