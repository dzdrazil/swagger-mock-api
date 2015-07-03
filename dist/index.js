'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _swaggerParser = require('swagger-parser');

var _swaggerParser2 = _interopRequireDefault(_swaggerParser);

var _ConfigureRouter = require('./ConfigureRouter');

var _ConfigureRouter2 = _interopRequireDefault(_ConfigureRouter);

var _PrunePaths = require('./PrunePaths');

var _PrunePaths2 = _interopRequireDefault(_PrunePaths);

module.exports = function (config) {
  if (!config.swaggerFile) {
    throw new Error('Config is missing `swaggerFile` parameter');
  }

  if (config.ignorePaths && config.mockRoutes) {
    throw new Error('Cannot specify both ignorePaths and mockPaths in config');
  }

  var basePath = undefined;
  var router = undefined;

  var parserPromise = new _Promise(function (resolve) {
    _swaggerParser2['default'].parse(config.swaggerFile, function (err, api) {
      if (err) throw err;

      if (config.ignorePaths) {
        api.paths = _PrunePaths2['default'](api.paths, config.ignorePaths);
      } else if (config.mockPaths) {
        api.paths = _PrunePaths2['default'](api.paths, config.mockPaths, true);
      }

      basePath = api.basePath || '';
      router = _ConfigureRouter2['default'](api.paths);
      resolve();
    });
  });

  return function (req, res, next) {
    parserPromise.then(function () {
      var method = req.method.toLowerCase();

      var path = _url2['default'].parse(req.url).pathname;
      path = path.replace(basePath + '/', '');
      if (path.charAt(0) !== '/') {
        path = '/' + path;
      }

      console.log('Request: %s %s', req.method, path);
      var matchingRoute = router.match('/' + method + path);

      if (!matchingRoute) return next();

      res.setHeader('Content-Type', 'application/json');
      var response = matchingRoute.fn();

      res.write(response !== null ? JSON.stringify(response) : '');
      res.end();
    });
  };
};