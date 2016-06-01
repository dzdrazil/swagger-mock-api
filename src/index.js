import url from 'url';
import fs from 'fs';

import parser from 'swagger-parser';

import ConfigureRouter from './ConfigureRouter';
import PrunePaths from './PrunePaths';

export default function(config) {
  if (!config.swaggerFile) {
    throw new Error('Config is missing `swaggerFile` parameter');
  }

  if (config.ignorePaths && config.mockRoutes) {
    throw new Error('Cannot specify both ignorePaths and mockPaths in config');
  }

  let basePath;
  let router;

  let parserPromise = new Promise((resolve) => {
    parser.dereference(config.swaggerFile, function(err, api) {
      if (err) throw err;

      init(api);
      resolve();
    });
  });

  if (config.watch) {
    fs.watchFile(config.swaggerFile, function() {
      parser.dereference(config.swaggerFile, function(err, api) {
        if (err) throw err;

        init(api);
      });
    });
  }

  function init(api) {
    if (config.ignorePaths) {
      api.paths = PrunePaths(api.paths, config.ignorePaths);
    } else if (config.mockPaths) {
      api.paths = PrunePaths(api.paths, config.mockPaths, true);
    }

    basePath = api.basePath || '';
    router = ConfigureRouter(api.paths);
  }

  return function(req, res, next) {
    parserPromise.then(() => {
      const method = req.method.toLowerCase();

      let path = url.parse(req.url).pathname;
      path = path.replace(basePath + '/', '');
      if (path.charAt(0) !== '/') {
        path = '/' + path;
      }

      const matchingRoute = router.match('/' + method + path);

      if (!matchingRoute) return next();

      if (process.env.debug) {
        console.log('Request: %s %s', req.method, path);
      }

      try {
        const response = matchingRoute.fn();
        res.setHeader('Content-Type', 'application/json');
        res.write(response !== null ? JSON.stringify(response) : '');
      } catch(e) {
        res.statusCode = 500;
        res.write(JSON.stringify({message: e.message}, null, 4));
      }

      res.end();
    });
  };
};
