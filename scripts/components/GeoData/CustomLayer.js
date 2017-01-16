var React = require('react');
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Tooltip = require('react-bootstrap/lib/Tooltip');

var Checkbox = require('../forms/checkbox');
var CustomKmlLayer = require('./CustomKmlLayer');

var CustomLayer = React.createClass({
  displayName: 'CustomLayer',
  getInitialState: function() {
    return {
      displayed: false
    };
  },
  render: function() {
    return (
      <div className="custom-layers-content--layer">
        <div className="custom-layers-content--layer-left">
          <span>{this.props.filename}</span>
          <span>{this.props.update}</span>
        </div>
        <div className="custom-layers-content--layer-right">
          <Checkbox checked={this.state.displayed} onChange={this.onChange} />
          <OverlayTrigger placement='left' overlay={<Tooltip>Delete</Tooltip>}>
            <button className="delete" onClick={this.props.onDelete}>Delete</button>
          </OverlayTrigger>
          <CustomKmlLayer visible={this.state.displayed} filepath={this.props.filepath}/>
        </div>
      </div>
    );
  },
  onChange: function() {
    this.setState({displayed: !this.state.displayed});
  }

});

module.exports = CustomLayer;
