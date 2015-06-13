'use strict';

import fs from 'fs';
import url from 'url';
import yaml from 'js-yaml';
import hoek from 'hoek';
import Routes from 'routes';
import Chance from 'chance';

const router = new Routes();
const chance = new Chance();

const debug = ::console.log;

module.exports = function(config) {
  let doc;
  if (config.yamlPath) {
    doc = yaml.load(fs.readFileSync(config.yamlPath, 'utf8'));
  } else if (config.jsonPath) {
    doc = require(jsonPath);
  } else {
    throw new Error('swagger-mock-api conifg requires either a json or yaml file');
  }

  let basepath = doc.basePath;

  let definitions = parseDefinitions(doc.definitions, {});
  let paths = parsePaths(doc.paths, definitions);

  configureRouter(router, paths);

  // return connect function
  return function(req, res, next) {
    let method = req.method.toLowerCase();

    let path = url.parse(req.url).pathname;
    path = path.replace(basepath + '/', '');
    if (path.charAt(0) !== '/') {
      path = '/' + path;
    }

    debug('Request: %s %s', req.method, path);
    let matchingRoute = router.match('/' + method + path);

    if (!matchingRoute) return next();

    res.setHeader('Content-Type', 'application/json');
    let response = matchingRoute.fn();

    res.write(response !== null ? JSON.stringify(response) : '');
    res.end();
  }
}

///
/// Definition parsing, flattening and mapping
///

function parseDefinitions(defMap, definitions) {
  let count = Object.keys(defMap).length;

  for (let k in defMap) {
    if (definitions[k]) {
      count--;
      continue;
    }

    let definition = parseDefinition(k, defMap, definitions);
    if (definition === null) {
      continue;
    } else {
      definitions[k] = definition;
      count--;
    }
  }

  if (count === 0) {
    return definitions;
  }
  return parseDefinitions(defMap, definitions);
}

function parseDefinition(key, defMap, definitions) {
  let propDef = defMap[key];
  let ref = {};

  if (propDef.allOf) {
    try {
      return propDef.allOf.reduce((acc, def) => {
        if (def.$ref) {
          return hoek.merge(acc, getRef(def.$ref, definitions));
        } else {
          return hoek.merge(acc, def.properties);
        }
      }, {});
    } catch(e) {
      return null;
    }
  } else {
    for (let k in propDef.properties) {
      let prop = propDef.properties[k];
      if (prop.type === 'array' && prop.items.$ref) {
        try {
          ref[k] = prop;
          ref[k].items = getRef(prop.items.$ref, definitions);
        } catch(e) {
          return null;
        }
      } else {
        ref[k] = hoek.merge({}, prop);
      }
    }
  }

  return ref;
}

function getRef(path, definitions) {
  let segments = path.split('/');
  let ref = segments[segments.length - 1];

  if (!definitions[ref]) throw new Error('no definition found');
  return definitions[ref];
}

///
/// Path parsing, flattening and mapping
///

function parsePaths(pathDefs, definitions) {
  let ret = {};

  for (let k in pathDefs) {
    ret[k] = flattenPathResponseDefs(
      hoek.clone(pathDefs[k]),
      definitions
    );
  }

  return ret;
}

function flattenPathResponseDefs(pathDef, definitions) {
  for (let mK in pathDef) {
    let methodDef = pathDef[mK].responses;

    for (let rK in methodDef) {
      if (methodDef[rK].schema &&
          methodDef[rK].schema.items
          && methodDef[rK].schema.items.$ref) {

        methodDef[rK].schema.items = getRef(methodDef[rK].schema.items.$ref, definitions);
      } else if (methodDef[rK].schema && methodDef[rK].schema.$ref) {
        methodDef[rK].schema = getRef(methodDef[rK].schema.$ref, definitions);
      }
    }
  }

  return pathDef;
}

function configureRouter(router, paths) {
  var pk;
  var mk;
  var pathDef;
  var method;

  for (let pk in paths) {
    let pathDef = paths[pk];
    for (let mk in pathDef) {
      let method = pathDef[mk];
      let path = correctPath(pk);
      debug('ADDING ROUTE: ', mk.toUpperCase() + ' ' + pk);

      router.addRoute('/' + mk + path, function(method) {
        return respond(method.responses);
      }.bind(router, method));
    }
  }
}

function correctPath(path) {
  let uri = path.replace(/^\/?|\/?$/, '');
  let segments = uri.split('/');

  return '/' +
    segments
    .map(s => {
      if (s.charAt(0) === '{' && s.charAt(s.length - 1) === '}') {
        s = s.slice(1, -1);
        return ':' + s;
      }

      return s;
    })
    .join('/');
}

///
/// Response generation
///

function respond(possibleResponseTypes) {
  for (let k in possibleResponseTypes) {
    if (k === 'default') continue;
    if (parseInt(k) < 300) {
      return generateResponse(possibleResponseTypes[k]);
    }
  }
  if (possibleResponseTypes['default']) {
    return generateResponse(possibleResponseTypes['default']);
  }
  return null;
}

function generateResponse(definition) {
  let schema = definition.schema;
  if (!schema) {
    return null;
  }

  if (schema.type === 'array') {
    return generateArray(schema);
  }

  return generateObject(schema);
}

function generateObject(schema) {
  let ret = {};
  for (let k in schema) {
    if (schema[k].type === 'array') {
      ret[k] = generateArray(schema[k]);
      continue;
    }
    ret[k] = swaggerToChance(schema[k]);
  }
  return ret;
}

function generateArray(schema) {
  let options = hoek.merge({min: 0, max: 10}, schema['x-type-options']);
  let iterations = chance.integer(options);
  let ret = [];
  let method;

  if (schema.type && !schema.type.type) { // schema.type.type indicates that type is a param key, not swagger type
    method = swaggerToChance;
  } else {
    method = generateObject;
  }
  for (let i = 0; i < iterations; i++) {
    ret.push(method(schema.items));
  }

  return ret;
}

function swaggerToChance(typedef) {
  let method;
  if (typedef['x-chance-type']) {
    method = typedef['x-chance-type'];
  } else if (typedef.type === 'array') {
    return generateArray(typedef);
  } else if (typedef.type) {
    method = mapToChance(typedef.type, typedef);
  } else {
    return generateObject(typedef);
  }

  if (typedef['x-type-options']) {
   return chance[method](typedef['x-type-options']);
  } else {
    return chance[method]();
  }
}

function mapToChance(type) {
  let method;
  switch (type) {
    case 'integer': method = 'integer'; break;
    case 'long': method = 'integer'; break;
    case 'float': method = 'floating'; break;
    case 'double': method = 'floating'; break;
    case 'string': method = 'string'; break;
    case 'byte': return new Buffer('' + chance.integer({min: 0, max: 255})).toString('base64'); break;
    case 'boolean': method = 'bool'; break;
    case 'date': method = 'date'; break;
    case 'dateTime': method = 'date'; break;
    default:
      if (chance[type]) {
         method = type;
         break;
      }
      debug('unfound type!');
      debug(type);
      throw new Error('No chance equivalent for type: ' + type);
  }
  return method;
}
