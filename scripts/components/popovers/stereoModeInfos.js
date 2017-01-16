var React = require('react');
var i18n = require('../../tools/i18n');
var Definition = require('../utils/definition');


var propsNames = ['maxViewing', 'latRangeMin', 'latRangeMax', 'longRangeMin', 'longRangeMax'];
var StereoModeInfos = React.createClass({
  displayName: 'StereoModeInfos',
  renderImageInfos: function(element, keyComponent) {
    return propsNames.map(function(propName) {
      return <Definition key={keyComponent + propName} label={i18n.get('stereoMode-' + propName)} value={element[propName]} />;
    });
  },
  render: function() {
    var stereoModeInfos = '';
    switch(this.props.stereoMode.type) {
      case 'mono':
        stereoModeInfos = (
          <ul>
            <Definition label={i18n.get('product-stereoMode')} value={this.props.stereoMode.type} />
            {this.renderImageInfos(this.props.stereoMode, 'mono')}
          </ul>
          );
      break;
      case 'stereo':
        stereoModeInfos = (
          <ul>
            <Definition label={i18n.get('product-stereoMode')} value={this.props.stereoMode.type} />
            <Definition label={i18n.get('stereoMode-minBH')} value={this.props.stereoMode.minBH} />
            <Definition label={i18n.get('stereoMode-maxBH')} value={this.props.stereoMode.maxBH} />
            <li>{i18n.get('stereoMode-firstIM')}</li>
            <ul>
              {this.renderImageInfos(this.props.stereoMode.firstIM, 'firstIM')}
            </ul>
            <li>{i18n.get('stereoMode-secondIM')}</li>
            <ul>
              {this.renderImageInfos(this.props.stereoMode.secondIM, 'secondIM')}
            </ul>
          </ul>
          );
      break;
      case 'tristereo':
        stereoModeInfos = (
          <ul>
            <Definition label={i18n.get('product-stereoMode')} value={this.props.stereoMode.type} />
            <Definition label={i18n.get('stereoMode-minBH')} value={this.props.stereoMode.minBH} />
            <Definition label={i18n.get('stereoMode-maxBH')} value={this.props.stereoMode.maxBH} />
            <li>{i18n.get('stereoMode-firstIM')}</li>
            <ul>
              {this.renderImageInfos(this.props.stereoMode.firstIM, 'firstIM')}
            </ul>
            <li>{i18n.get('stereoMode-secondIM')}</li>
            <ul>
              {this.renderImageInfos(this.props.stereoMode.secondIM, 'secondIM')}
            </ul>
            <li>{i18n.get('stereoMode-quasiNadir')}</li>
            <ul>
              {this.renderImageInfos(this.props.stereoMode.quasiNadir, 'quasiNadir')}
            </ul>
          </ul>
          );
      break;
    }
    return (
      <div className="stereomod-info">
        {stereoModeInfos}
      </div>
    );
  }
});

module.exports = StereoModeInfos;
