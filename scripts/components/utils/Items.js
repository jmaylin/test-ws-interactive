var React = require('react');

var Items = React.createClass({
  render: function() {
    var items = '';
    if (this.props.visible) {
      var nbResults = this.props.nbResults;
      items = ' item';
      if (this.props.nbResults > 1) {
        items += 's';
      }
      if (this.props.nbResults < this.props.totalResults) {
        nbResults = this.props.nbResults + ' / ' + this.props.totalResults;
      }
      items = nbResults + items;
    }
    return (
      <span className="nb-result">{items}</span>
    );
  }

});

module.exports = Items;
