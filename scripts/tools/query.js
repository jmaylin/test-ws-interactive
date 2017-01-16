/* global ActiveXObject */
/*eslint-disable eqeqeq*/
var Promise = require('es6-promise').Promise;

function get(url, returnXhr) {
  returnXhr = typeof returnXhr !== 'undefined' ? returnXhr : false;
  // Return a new promise.
  return new Promise(function(resolve, reject) {

    // Do the usual XHR stuff
    var req = null;
    if(window.ActiveXObject) { req = new ActiveXObject('Microsoft.XMLHTTP'); }
    else if(window.XMLHttpRequest) { req = new XMLHttpRequest(); }

    req.open('GET', url);

    req.onreadystatechange = function(){

      if(req.readyState == 4 && req.status == 200) {
        if(returnXhr) {
          resolve(req);
        }
        else {
          resolve(req.responseText);
        }
      } else if(req.readyState == 4) {
        reject(Error(req.statusText));
      }
    };

    // Make the request
    req.send();
  });
}
function getJSON(url) {
  return get(url).then(JSON.parse);
}

function post(url, parameters) {
  return new Promise(function(resolve, reject) {

    // Do the usual XHR stuff
    var req = null;
    if(window.ActiveXObject) { req = new ActiveXObject('Microsoft.XMLHTTP'); }
    else if(window.XMLHttpRequest) { req = new XMLHttpRequest(); }

    req.open('POST', url, true);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.setRequestHeader('Accept', 'application/json');

    req.onreadystatechange = function(){

      if(req.readyState == 4 && req.status == 200) {
        resolve(req.responseText, req);
      } else if(req.readyState == 4) {
        reject(Error(req.statusText));
      }
    };

    // Make the request
    req.send($.param(parameters));
  });
}

function postJSON(url, parameters) {
  return post(url, parameters).then(JSON.parse);
}

var Query = {
  get: get,
  getJSON: getJSON,
  post: post,
  postJSON: postJSON
};

module.exports = Query;
