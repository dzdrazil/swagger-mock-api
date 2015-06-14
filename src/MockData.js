'use strict';

import Chance from 'chance';
import hoek from 'hoek';

const chance = new Chance();

export default function MockData(definition) {
    let schema = definition.schema;

    if (!schema) return null;

    if (schema.type === 'array') {
        return generateArray(schema);
    } else {
        return generateObject(schema);
    }
};

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
      console.log('unfound type!');
      console.log(type);
      throw new Error('No chance equivalent for type: ' + type);
  }
  return method;
}
