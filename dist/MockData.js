'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = MockData;

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _hoek = require('hoek');

var _hoek2 = _interopRequireDefault(_hoek);

var chance = new _chance2['default']();

function MockData(definition) {
  var schema = definition.schema;

  if (!schema) return null;

  if (schema.type === 'array') {
    return generateArray(schema);
  } else {
    return generateObject(schema);
  }
}

;

function generateArray(def) {
  var schema = _hoek2['default'].clone(def);
  if (schema.items.allOf) {
    schema.items = schema.items.allOf.reduce(function (acc, def) {
      return _hoek2['default'].merge(acc, def);
    }, {});
  }
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

function generateObject(def) {
  var ret = {};
  var schema = _hoek2['default'].clone(def);
  if (schema.properties) {
    schema = schema.properties;
  }

  for (var k in schema) {
    if (schema[k].type === 'array') {
      ret[k] = generateArray(schema[k]);
      continue;
    }

    ret[k] = swaggerToChance(schema[k]);
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
    case 'number':
      method = 'floating';break;
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
      console.log('unfound type!');
      console.log(type);
      throw new Error('No chance equivalent for type: ' + type);
  }
  return method;
}
module.exports = exports['default'];