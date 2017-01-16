var React = require('react');

require('jquery.iframe-transport');
require('blueimp-file-upload');

var UploadButton = React.createClass({
  displayName: 'UploadButton',
  componentDidMount: function() {
    this.initUploader();
  },
  initUploader: function() {
    $(this.refs.uploader.getDOMNode()).fileupload({
        dataType: 'json',
        url: '/utils/services.php?ctrl=customlayers&function=add',
        replaceFileInput: false,
        done: this.processUpload
    });
  },
  processUpload: function(e, data) {
    this.refs.uploader.getDOMNode().value = '';
    this.props.onUpload(data);
  },
  render: function() {
    return (
      <span className="file-upload">
        <input ref="uploader" className="file-upload--btn" type="file" name="customLayerFile" />
      </span>
    );
  }

});

module.exports = UploadButton;
