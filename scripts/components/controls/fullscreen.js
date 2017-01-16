var React = require('react');
var ShowCoordinates = require('./coordinates');

function exitFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function launchIntoFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

var FullscreenControl = React.createClass({
  displayName: 'FullscreenControl',
  getInitialState: function() {
    return {isFullScreen: false};
  },
  componentDidMount: function() {
    /**
     * Watch DOM events to detect manual exit of fullscreen
     */
    var that = this;
    document.addEventListener('fullscreenchange', function () {
      that.setState({isFullScreen: document.fullscreen});
    }, false);

    document.addEventListener('mozfullscreenchange', function () {
      that.setState({isFullScreen: document.mozFullScreen});
    }, false);

    document.addEventListener('webkitfullscreenchange', function () {
      that.setState({isFullScreen: document.webkitIsFullScreen});
    }, false);

    document.addEventListener('msfullscreenchange', function () {
      that.setState({isFullScreen: document.msFullscreenElement});
    }, false);
  },
  handleClick: function() {
    this.setState({isFullScreen: !this.state.isFullScreen});
    if(this.state.isFullScreen) {
      exitFullscreen();
    }
    else {
      launchIntoFullscreen(document.documentElement);
    }
  },
  render: function() {
    return (
      <div>
        <ShowCoordinates />
        <button type="button" onClick={this.handleClick} className="toggle-fullscreen">Fullscreen</button>
      </div>
    );
  }
});

module.exports = FullscreenControl;
