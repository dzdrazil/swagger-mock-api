'use strict';

import stripJsonComments from 'strip-json-comments';

import Parser from './Parsers/Parser'

let parser = new Parser();

export default function MockData(definition, configMock) {
  let schema = definition.schema;

  if (!schema) return null;

  let mock = null;

  if (configMock.useExamples) {
    if (configMock.useExamples && definition.examples) {
      let keys = Object.keys(definition.examples);
      let key = keys.find(function(obj) {
        return obj.includes('json');
      });
      if (key) {
        mock = definition.examples[key];
        if (typeof(mock) === 'string') {
          mock = stripJsonComments(mock);
          mock = JSON.parse(mock);
        }
      }
      if (configMock.extendExamples) {
        mock = Object.assign(parser.parse(schema), mock);
      }
    }
  }

  if (!mock) {
    mock = parser.parse(schema);
  }

  return mock;
};
