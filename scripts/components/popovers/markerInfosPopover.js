
/*
 * Require
 */
var React = require('react');


/*
 * CONFIG
 */


/*
 * POPUP
 *
 * Describe :
 */
// Export object
var PopOverMarker = function() {};

/*
 * fn :
 * description :
 */
PopOverMarker.prototype.create = function(_id, _info) {
  var popover_info = document.createElement("DIV");
  React.render((
    <div style={{ }} className='popover-info-marker '>
        {{_info}}
    </div>
  ), popover_info);

  return popover_info;
};

PopOverMarker.prototype.getPopOver = function(_id, _info) {
  return this.create(_id, _info);
};

// Eports Times
module.exports = new PopOverMarker ();
