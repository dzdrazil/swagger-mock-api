/* eslint no-loop-func:0*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = PrunePaths;

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function PrunePaths(paths, passthroughPaths, keep) {
  var replacement = {};

  var _loop = function (i) {
    var p = passthroughPaths[i];

    var _p$split$reverse = p.split(' ').reverse();

    var _p$split$reverse2 = _toArray(_p$split$reverse);

    var path = _p$split$reverse2[0];

    var methods = _p$split$reverse2.slice(1);

    if (methods.length) {
      methods = methods.map(function (x) {
        return x.toLowerCase();
      });
      methods.forEach(function (m) {
        if (keep && replacement[path]) {
          replacement[path][m] = paths[path][m];
        } else if (keep) {
          replacement[path] = replacement[path] || {};
          replacement[path][m] = paths[path][m];
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
//# sourceMappingURL=PrunePaths.js.map