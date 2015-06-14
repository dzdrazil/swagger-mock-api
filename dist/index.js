'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _swaggerParser = require('swagger-parser');

var _swaggerParser2 = _interopRequireDefault(_swaggerParser);

var _ConfigureRouter = require('./ConfigureRouter');

var _ConfigureRouter2 = _interopRequireDefault(_ConfigureRouter);

module.exports = function (config) {
  var router = undefined;
  var basePath = undefined;

  _swaggerParser2['default'].parse(config.swaggerFile, function (err, api, metadata) {
    if (err) throw err;

    basePath = api.basePath || '';
    router = (0, _ConfigureRouter2['default'])(api.paths);
  });

  return function (req, res, next) {
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
  };
};