/* global translations */
var assign = require('object-assign');

var i18n = function() {};
i18n.prototype = assign({}, i18n.prototype, {
  get: function(key) {
    if(translations.hasOwnProperty(key)) {
      return translations[key];
    }
    console.warn('Unknown translation : ' + key);
    return 'Unknown translation : ' + key;
  },

  getParam: function(key, param) {
    if(translations.hasOwnProperty(key)) {
      return translations[key].replace('$1', param);
    }
    console.warn('Unknown translation : ' + key);
    return 'Unknown translation : ' + key;
  },
  getDictionnary: function(dictionnaryName) {
    if(translations.hasOwnProperty(dictionnaryName)) {
      return translations[dictionnaryName];
    }
    console.warn('Unknown dictionnary : ' + dictionnaryName);
    return [];
  }
});


module.exports = new i18n();
