'use strict';

exports.__esModule = true;
exports['default'] = PrunePaths;

function PrunePaths(paths, passthroughPaths, keep) {
  var replacement = {};

  var _loop = function (i) {
    var p = passthroughPaths[i];

    var _p$split$reverse = p.split(' ').reverse();

    var path = _p$split$reverse[0];

    var methods = _p$split$reverse.slice(1);

    if (methods.length) {
      methods = methods.map(function (x) {
        return x.toLowerCase();
      });
      methods.forEach(function (m) {
        if (keep) {
          replacement[path] ? replacement[path][m] = paths[path][m] : (replacement[path] = {}) && (replacement[path][m] = paths[path][m]);
        } else {
          delete paths[path][m];
        }
      });
    } else if (keep) {
      replacement[path] = paths[path];
    } else {
      delete paths[path];
    }
  };

  for (var i = 0; i < passthroughPaths.length; i++) {
    _loop(i);
  }

  return keep ? replacement : paths;
}

module.exports = exports['default'];