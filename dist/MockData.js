'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

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

  return generateSchema(schema);
}

;

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
      console.log('unfound type:', type);
      throw new Error('No chance equivalent for type: ' + type);
  }
  return method;
}

function generateSchema(definition) {
  if (definition.items) {
    return generateArray(definition);
  }

  // if (definition.type === 'object' && !definition.properties) {
  //   return {};
  // }

  if (definition.properties) {
    return generateObject(definition);
  }

  if (definition.allOf) {
    return definition.allOf.reduce(function (s, o) {
      return _Object$assign(s, generateSchema(o));
    }, {});
  }

  var type = definition['x-chance-type'] || definition.type;

  if (type === 'fixed') {
    return definition['x-type-value'];
  }

  return definition['x-type-options'] ? chance[mapToChance(type)](definition['x-type-options']) : chance[mapToChance(type)]();
}

function generateArray(schema) {
  var items = schema.items;
  var options = schema['x-type-options'] || { min: 0, max: 10 };
  var iterations = chance.integer(options);

  var ret = [];
  for (var i = 0; i < iterations; i++) {
    ret.push(generateSchema(items));
  }

  return ret;
}

function generateObject(definition) {
  var ret = {};
  var schema = _hoek2['default'].clone(definition);
  if (schema.properties) {
    schema = schema.properties;
  }

  for (var k in schema) {
    ret[k] = generateSchema(schema[k]);
  }
  return ret;
}
module.exports = exports['default'];