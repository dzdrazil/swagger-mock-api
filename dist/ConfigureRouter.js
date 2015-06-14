'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = ConfigureRouter;

var _routes = require('routes');

var _routes2 = _interopRequireDefault(_routes);

var _MockData = require('./MockData');

var _MockData2 = _interopRequireDefault(_MockData);

function ConfigureRouter(paths) {
  var router = new _routes2['default']();

  for (var pk in paths) {
    var path = paths[pk];
    var route = correctPath(pk);

    for (var mk in path) {
      var method = path[mk];
      console.log('ADDING ROUTE: ', mk.toUpperCase() + ' ' + pk);

      var respond = generateResponse(method.responses, pk);
      router.addRoute('/' + mk + route, respond);
    }
  }

  return router;
}

function correctPath(path) {
  var uri = path.replace(/^\/?|\/?$/, '');
  var segments = uri.split('/');

  return '/' + segments.map(function (s) {
    if (s.charAt(0) === '{' && s.charAt(s.length - 1) === '}') {
      s = s.slice(1, -1);
      return ':' + s;
    }

    return s;
  }).join('/');
}

function generateResponse(potentialResponses, pk) {
  var _loop = function (k) {
    if (k === 'default') return 'continue';

    var responseSchema = potentialResponses[k];

    if (parseInt(k) < 300) {
      // console.log('----------------------');
      // console.log(pk);
      // try {console.log(MockData(responseSchema)); }
      // catch(e) {console.log(e);}
      return {
        v: function () {
          return (0, _MockData2['default'])(responseSchema);
        }
      };
    }
  };

  for (var k in potentialResponses) {
    var _ret = _loop(k);

    switch (_ret) {
      case 'continue':
        continue;

      default:
        if (typeof _ret === 'object') return _ret.v;
    }
  }

  if (potentialResponses['default']) {
    return function () {
      return (0, _MockData2['default'])(potentialResponses['default']);
    };
  }
}
module.exports = exports['default'];