'use strict';

import fs from 'fs';
import url from 'url';
import yaml from 'js-yaml';

import DefinitionParser from './DefinitionParser';
import PathParser from './PathParser';
import ConfigureRouter from './ConfigureRouter';

module.exports = function(config) {
  let doc;
  if (config.yamlPath) {
    doc = yaml.load(fs.readFileSync(config.yamlPath, 'utf8'));
  } else if (config.jsonPath) {
    doc = require(config.jsonPath);
  } else {
    throw new Error('swagger-mock-api conifg requires either a json or yaml file');
  }

  let {definitions, paths, basePath} = doc;
  let router;

  let definitionStream = DefinitionParser(definitions)
    .onValue(definitionMap => {
      router = ConfigureRouter(
        PathParser(paths, definitionMap)
      );
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
  }
};






