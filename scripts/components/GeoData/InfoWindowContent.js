var React = require('react');

var InfoWindowContent = React.createClass({
  displayName: 'InfoWindowContent',
  render: function() {
    var content = Object.keys(this.props.informations).map(function (key) {
      if (typeof this.props.informations[key] === 'object') {
        var subcontent = Object.keys(this.props.informations[key]).map(function (cle) {
          return (
            <li key={'subcontent' + cle}>{cle} : {this.props.informations[key][cle]}</li>
          );
        }, this);
        return (
          <div>
            <li key={'content' + key}>{key} :</li>
            <ul>
              {subcontent}
            </ul>
          </div>
        );
      }
      return (
        <li key={'main' + key}>{key} : {this.props.informations[key]}</li>
        );
    }, this);
    return (
      <div>
        <ul>
          {content}
        </ul>
      </div>
    );
  }
});

module.exports = InfoWindowContent;
