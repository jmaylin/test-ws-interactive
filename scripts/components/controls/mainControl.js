var React = require('react');
var customScrollbar = require('../../tools/customScrollbar');

var SearchControl = require('./search');
var ResultManager = require('../resultManager');
var Manager = require('../slotManager');

var VelocityComponent = require('velocity-react/velocity-component');


var MainControl = React.createClass({
  displayName: 'MainControl',
  getInitialState: function() {
    return {
      open: true
    };
  },
  componentDidMount: function () {
    customScrollbar.initScrollbar();

    document.addEventListener('scrollableContentUpdated', function () {
      customScrollbar.refreshScrollbar();
    }, false);
  },
  togglePanel: function() {
    this.setState({open: !this.state.open});
  },
  render: function() {
    var toggleBtnClass = this.state.open ? 'toggle-btn' : 'toggle-btn active';
    var toggleScrollableClass = this.state.open ? 'scrollable scrollable-container' : 'scrollable scrollable-container active';

    return (
      <VelocityComponent animation={{ left: this.state.open ? 0 : '-' + $('div#main-toggle').width() + 'px' }} duration={200}>
        <div className="velocity-toggle">
          <div className={toggleScrollableClass} id="left">
            <div className="toggle-search">
              <div id="search-container"><SearchControl /></div>
              <div id="icr-search-results"><ResultManager /></div>
              <div id="slotmanager-container"><Manager /></div>
            </div>
          </div>
          <button className={toggleBtnClass} onClick={this.togglePanel} />
        </div>
      </VelocityComponent>
    );
  }
});

module.exports = MainControl;
