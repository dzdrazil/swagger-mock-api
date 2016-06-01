'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _randexp = require('randexp');

var _randexp2 = _interopRequireDefault(_randexp);

var chance = new _chance2['default']();

var StringParser = (function () {
    function StringParser() {
        _classCallCheck(this, StringParser);
    }

    _createClass(StringParser, [{
        key: 'canParse',
        value: function canParse(node) {
            return node.type === 'string';
        }
    }, {
        key: 'parse',
        value: function parse(node) {
            return this.parseString(node);
        }
    }, {
        key: 'parseString',
        value: function parseString(node) {
            if (node.pattern) return new _randexp2['default'](node.pattern).gen();

            var options = this.resolveChanceOptions(node);
            return chance.string(options);
        }
    }, {
        key: 'resolveChanceOptions',
        value: function resolveChanceOptions(node) {
            var options = node['x-type-options'] || {};

            if (node.maxLength && node.minLength) options.length = chance.integer({ max: node.maxLength, min: node.minLength });else options.length = options.length || node.maxLength || node.minLength;

            return options;
        }
    }]);

    return StringParser;
})();

exports['default'] = StringParser;
module.exports = exports['default'];