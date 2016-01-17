'use strict';

import Chance from 'chance';
import hoek from 'hoek';

const chance = new Chance();

export default function MockData(definition) {
  let schema = definition.schema;

  if (!schema) return null;

  return generateSchema(schema);
};

function mapToChance(type) {
  let method;

  switch (type) {
    case 'integer': method = 'integer'; break;
    case 'long': method = 'integer'; break;
    case 'number': method = 'floating'; break;
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
    return definition.allOf
      .reduce((s, o) => Object.assign(s, generateSchema(o)), {});
  }

  let type = definition['x-chance-type'] || definition.type;

  if (type === 'fixed') {
    return definition['x-type-value'];
  }

  return definition['x-type-options']
    ? chance[mapToChance(type)](definition['x-type-options'])
    : chance[mapToChance(type)]();
}

function generateArray(schema) {
  let items = schema.items;
  let options = schema.options || {min: 0, max: 10};
  let iterations = chance.integer(options);


  let ret = [];
  for (let i = 0; i < iterations; i++) {
    ret.push(generateSchema(items));
  }

  return ret;
}

function generateObject(definition) {
  let ret = {};
  let schema = hoek.clone(definition);
  if (schema.properties) {
    schema = schema.properties;
  }

  for (let k in schema) {
    ret[k] = generateSchema(schema[k]);
  }
  return ret;
}
