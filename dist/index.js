'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _swaggerParser = require('swagger-parser');

var _swaggerParser2 = _interopRequireDefault(_swaggerParser);

var _ConfigureRouter = require('./ConfigureRouter');

var _ConfigureRouter2 = _interopRequireDefault(_ConfigureRouter);

var _PrunePaths = require('./PrunePaths');

var _PrunePaths2 = _interopRequireDefault(_PrunePaths);

exports['default'] = function (config) {
  if (!config.swaggerFile) {
    throw new Error('Config is missing `swaggerFile` parameter');
  }

  if (config.ignorePaths && config.mockRoutes) {
    throw new Error('Cannot specify both ignorePaths and mockPaths in config');
  }

  var basePath = undefined;
  var router = undefined;

  var parserPromise = new _Promise(function (resolve) {
    _swaggerParser2['default'].dereference(config.swaggerFile, function (err, api) {
      if (err) throw err;

      init(api);
      resolve();
    });
  });

  if (config.watch) {
    _fs2['default'].watchFile(config.swaggerFile, function () {
      _swaggerParser2['default'].dereference(config.swaggerFile, function (err, api) {
        if (err) throw err;

        init(api);
      });
    });
  }

  function init(api) {
    if (config.ignorePaths) {
      api.paths = (0, _PrunePaths2['default'])(api.paths, config.ignorePaths);
    } else if (config.mockPaths) {
      api.paths = (0, _PrunePaths2['default'])(api.paths, config.mockPaths, true);
    }

    basePath = api.basePath || '';
    router = (0, _ConfigureRouter2['default'])(api.paths);
  }

  return function (req, res, next) {
    parserPromise.then(function () {
      var method = req.method.toLowerCase();

      var path = _url2['default'].parse(req.url).pathname;
      path = path.replace(basePath + '/', '');
      if (path.charAt(0) !== '/') {
        path = '/' + path;
      }

      var matchingRoute = router.match('/' + method + path);

      if (!matchingRoute) return next();

      if (process.env.debug) {
        console.log('Request: %s %s', req.method, path);
      }

      try {
        var response = matchingRoute.fn();
        res.setHeader('Content-Type', 'application/json');
        res.write(response !== null ? JSON.stringify(response) : '');
      } catch (e) {
        res.statusCode = 500;
        res.write(JSON.stringify({ message: e.message }, null, 4));
      }

      res.end();
    });
  };
};

;
module.exports = exports['default'];