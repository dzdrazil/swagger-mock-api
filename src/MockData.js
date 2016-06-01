'use strict';

import Chance from 'chance';
import hoek from 'hoek';
import Parser from './Parsers/Parser'
let parser = new Parser();

export default function MockData(definition) {
  let schema = definition.schema;

  if (!schema) return null;

  return parser.parse(schema);
};