import url from 'url';
import parser from 'swagger-parser';

import ConfigureRouter from './ConfigureRouter';
import PrunePaths from './PrunePaths';

module.exports = function(config) {
  if (!config.swaggerFile) {
    throw new Error('Config is missing `swaggerFile` parameter');
  }

  if (config.ignorePaths && config.mockRoutes) {
    throw new Error('Cannot specify both ignorePaths and mockPaths in config');
  }

  let basePath;
  let router;

  let parserPromise = new Promise((resolve) => {
    parser.parse(config.swaggerFile, function(err, api) {
      if (err) throw err;

      if (config.ignorePaths) {
        api.paths = PrunePaths(api.paths, config.ignorePaths);
      } else if (config.mockPaths) {
        api.paths = PrunePaths(api.paths, config.mockPaths, true);
      }

      basePath = api.basePath || '';
      router = ConfigureRouter(api.paths);
      resolve();
    });
  });

  return function(req, res, next) {
    parserPromise.then(() => {
      const method = req.method.toLowerCase();

      let path = url.parse(req.url).pathname;
      path = path.replace(basePath + '/', '');
      if (path.charAt(0) !== '/') {
        path = '/' + path;
      }

      console.log('Request: %s %s', req.method, path);
      const matchingRoute = router.match('/' + method + path);

      if (!matchingRoute) return next();

      try {
        const response = matchingRoute.fn();
        res.setHeader('Content-Type', 'application/json');
        res.write(response !== null ? JSON.stringify(response) : '');
      } catch(e) {
        res.statusCode = 500;
        res.write(JSON.stringify({message: e.message}));
      }

      res.end();
    });
  };
};
