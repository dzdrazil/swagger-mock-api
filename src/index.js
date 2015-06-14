'use strict';

import url from 'url';
import parser from 'swagger-parser';

import ConfigureRouter from './ConfigureRouter';

module.exports = function(config) {
  let router;
  let basePath;

  parser.parse(config.swaggerFile, function(err, api, metadata) {
    if (err) throw err;

    basePath = api.basePath || '';
    router = ConfigureRouter(api.paths);
  });


  return function(req, res, next) {
    let method = req.method.toLowerCase();

    let path = url.parse(req.url).pathname;
    path = path.replace(basePath + '/', '');
    if (path.charAt(0) !== '/') {
      path = '/' + path;
    }

    console.log('Request: %s %s', req.method, path);
    let matchingRoute = router.match('/' + method + path);

    if (!matchingRoute) return next();

    res.setHeader('Content-Type', 'application/json');
    let response = matchingRoute.fn();

    res.write(response !== null ? JSON.stringify(response) : '');
    res.end();
  };
}
