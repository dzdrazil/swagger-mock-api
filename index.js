'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _hoek = require('hoek');

var _hoek2 = _interopRequireDefault(_hoek);

var _routes = require('routes');

var _routes2 = _interopRequireDefault(_routes);

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var router = new _routes2['default']();
var chance = new _chance2['default']();

var debug = console.log.bind(console);

module.exports = function (config) {
  var doc = undefined;
  if (config.yamlPath) {
    doc = _jsYaml2['default'].load(_fs2['default'].readFileSync(config.yamlPath, 'utf8'));
  } else if (config.jsonPath) {
    doc = require(jsonPath);
  } else {
    throw new Error('swagger-mock-api conifg requires either a json or yaml file');
  }

  var basepath = doc.basePath;

  var definitions = parseDefinitions(doc.definitions, {});
  var paths = parsePaths(doc.paths, definitions);

  configureRouter(router, paths);

  // return connect function
  return function (req, res, next) {
    var method = req.method.toLowerCase();

    var path = _url2['default'].parse(req.url).pathname;
    path = path.replace(basepath + '/', '');
    if (path.charAt(0) !== '/') {
      path = '/' + path;
    }

    var matchingRoute = router.match('/' + method + path);

    if (!matchingRoute) return next();
    
    debug('Request: %s %s', req.method, path);

    res.setHeader('Content-Type', 'application/json');
    var response = matchingRoute.fn();

    res.write(response !== null ? JSON.stringify(response) : '');
    res.end();
  };
};

function parseDefinitions(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var defMap = _x,
        definitions = _x2;
    count = k = definition = undefined;
    _again = false;

    var count = _Object$keys(defMap).length;

    for (var k in defMap) {
      if (definitions[k]) {
        count--;
        continue;
      }

      var definition = parseDefinition(k, defMap, definitions);
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
    _x = defMap;
    _x2 = definitions;
    _again = true;
    continue _function;
  }
}

function parseDefinition(key, defMap, definitions) {
  var propDef = defMap[key];
  var ref = {};

  if (propDef.allOf) {
    try {
      return propDef.allOf.reduce(function (acc, def) {
        if (def.$ref) {
          return _hoek2['default'].merge(acc, getRef(def.$ref, definitions));
        } else {
          return _hoek2['default'].merge(acc, def.properties);
        }
      }, {});
    } catch (e) {
      return null;
    }
  } else {
    for (var k in propDef.properties) {
      var prop = propDef.properties[k];
      if (prop.type === 'array' && prop.items.$ref) {
        try {
          ref[k] = prop;
          ref[k].items = getRef(prop.items.$ref, definitions);
        } catch (e) {
          return null;
        }
      } else {
        ref[k] = _hoek2['default'].merge({}, prop);
      }
    }
  }

  return ref;
}

function getRef(path, definitions) {
  var segments = path.split('/');
  var ref = segments[segments.length - 1];

  if (!definitions[ref]) throw new Error('no definition found');
  return definitions[ref];
}

function parsePaths(pathDefs, definitions) {
  var ret = {};

  for (var k in pathDefs) {
    ret[k] = flattenPathResponseDefs(_hoek2['default'].clone(pathDefs[k]), definitions);
  }

  return ret;
}

function flattenPathResponseDefs(pathDef, definitions) {
  for (var mK in pathDef) {
    var methodDef = pathDef[mK].responses;

    for (var rK in methodDef) {
      if (methodDef[rK].schema && methodDef[rK].schema.items && methodDef[rK].schema.items.$ref) {

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

  for (var _pk in paths) {
    var _pathDef = paths[_pk];
    for (var _mk in _pathDef) {
      var _method = _pathDef[_mk];
      var path = correctPath(_pk);
      debug('ADDING ROUTE: ', _mk.toUpperCase() + ' ' + _pk);

      router.addRoute('/' + _mk + path, (function (method) {
        return respond(method.responses);
      }).bind(router, _method));
    }
  }
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

function respond(possibleResponseTypes) {
  for (var k in possibleResponseTypes) {
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
  var schema = definition.schema;
  if (!schema) {
    return null;
  }

  if (schema.type === 'array') {
    return generateArray(schema);
  }

  return generateObject(schema);
}

function generateObject(schema) {
  var ret = {};
  for (var k in schema) {
    if (schema[k].type === 'array') {
      ret[k] = generateArray(schema[k]);
      continue;
    }
    ret[k] = swaggerToChance(schema[k]);
  }
  return ret;
}

function generateArray(schema) {
  var options = _hoek2['default'].merge({ min: 0, max: 10 }, schema['x-type-options']);
  var iterations = chance.integer(options);
  var ret = [];
  var method = undefined;

  if (schema.type && !schema.type.type) {
    // schema.type.type indicates that type is a param key, not swagger type
    method = swaggerToChance;
  } else {
    method = generateObject;
  }
  for (var i = 0; i < iterations; i++) {
    ret.push(method(schema.items));
  }

  return ret;
}

function swaggerToChance(typedef) {
  var method = undefined;
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
  var method = undefined;
  switch (type) {
    case 'integer':
      method = 'integer';break;
    case 'long':
      method = 'integer';break;
    case 'float':
      method = 'floating';break;
    case 'double':
      method = 'floating';break;
    case 'string':
      method = 'string';break;
    case 'byte':
      return new Buffer('' + chance.integer({ min: 0, max: 255 })).toString('base64');break;
    case 'boolean':
      method = 'bool';break;
    case 'date':
      method = 'date';break;
    case 'dateTime':
      method = 'date';break;
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
