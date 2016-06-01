'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = MockData;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _hoek = require('hoek');

var _hoek2 = _interopRequireDefault(_hoek);

var _ParsersParser = require('./Parsers/Parser');

var _ParsersParser2 = _interopRequireDefault(_ParsersParser);

var parser = new _ParsersParser2['default']();

function MockData(definition) {
  var schema = definition.schema;

  if (!schema) return null;

  return parser.parse(schema);
}

;
module.exports = exports['default'];
//# sourceMappingURL=MockData.js.map