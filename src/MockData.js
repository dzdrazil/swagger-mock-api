'use strict';

import Parser from './Parsers/Parser'
let parser = new Parser();

export default function MockData(definition, configMock) {
  let schema = definition.schema;

  if (!schema) return null;

  let mock = {};
  if (configMock.useExamples) {
    if (configMock.useExamples && definition.examples && definition.examples['application/json']) {
      mock = definition.examples['application/json'];
    }

    if (configMock.extendExamples) {
      mock = Object.assign(parser.parse(schema), mock);
    }
  }
  else {
    mock = parser.parse(schema);
  }


  return mock;
};
