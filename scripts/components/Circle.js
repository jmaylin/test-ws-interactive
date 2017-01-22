import React, { Component, PropTypes } from 'react';

import AppStore from '../stores/AppStore';

import styles from './Circle.scss';

class Circle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gravityCenter: AppStore.getGravityCenter()
    };
    this.newGravityCenter = this.newGravityCenter.bind(this);
  }

  componentDidMount() {
    AppStore.addChangeListener(this.newGravityCenter);
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this.newGravityCenter);
  }

  newGravityCenter() {
    this.state = {
      gravityCenter: AppStore.getGravityCenter()
    };
  }

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
