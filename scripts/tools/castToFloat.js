// polyfill for String.endsWith
require('string.prototype.endswith');

var castToFloat = function castToFloat(value) {
  // replace commas with points if needed
  value = value ? value.replace(',', '.') : '0';
  // to allow users to input a decimal separator
  if(value.endsWith('.')) {
    return value;//value = value + '0';
  }
  var endsWithNumber = /[0-9]$/;
  var zeroDecimal = /^[0]+\./;
  if(!endsWithNumber.test(value)) {
    value = value.substring(0, value.length - 1);
  }
  if(value != '0') {
    if(!zeroDecimal.test(value)) {

      value = value.replace(/^[0]+/, '');
    }
  }
  return !isNaN(parseFloat(value, 10)) ? value : null;
};

module.exports = castToFloat;
