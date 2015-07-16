'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = ConfigureRouter;

var _routes = require('routes');

var _routes2 = _interopRequireDefault(_routes);

var _MockData = require('./MockData');

var _MockData2 = _interopRequireDefault(_MockData);

function correctPath(path) {
  var uri = path.replace(/^\/?|\/?$/, '');
  var segments = uri.split('/');

  return '/' + segments.map(function (s) {
    var segment = s;
    if (segment.charAt(0) === '{' && segment.charAt(segment.length - 1) === '}') {
      segment = segment.slice(1, -1);
      return ':' + segment;
    }

    return segment;
  }).join('/');
}

// wrapped MockData to satisfy eslint's no funciton definitions inside of loops
function mock(schema) {
  return (0, _MockData2['default'])(schema);
}

function generateResponse(potentialResponses) {
  for (var k in potentialResponses) {
    if (k === 'default') continue;

    var responseSchema = potentialResponses[k];
    var responseCode = parseInt(k, 10);
    if (responseCode > 199 && responseCode < 300) {
      return mock.bind(null, responseSchema);
    }
  }

  if (potentialResponses['default']) {
    return mock.bind(null, potentialResponses['default']);
  }
}

function ConfigureRouter(paths) {
  var router = new _routes2['default']();

  for (var pk in paths) {
    if (!paths.hasOwnProperty(pk)) continue;

    var path = paths[pk];
    var route = correctPath(pk);

    for (var mk in path) {
      if (!path.hasOwnProperty(mk)) continue;

      var method = path[mk];

      if (process.env.debug) {
        console.log('ADDING ROUTE: ', mk.toUpperCase() + ' ' + pk);
      }

      var respond = generateResponse(method.responses, pk);
      router.addRoute('/' + mk + route, respond);
    }
  }

  return router;
}

module.exports = exports['default'];