'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var chance = new _chance2['default']();

var ArrayParser = (function () {
    function ArrayParser(parser) {
        _classCallCheck(this, ArrayParser);

        this.parser = parser;
    }

    _createClass(ArrayParser, [{
        key: 'canParse',
        value: function canParse(node) {
            return node.type === 'array';
        }
    }, {
        key: 'parse',
        value: function parse(node) {
            return this.generateArray(node);
        }
    }, {
        key: 'generateArray',
        value: function generateArray(node) {
            var items = node.items;
            var options = node['x-type-options'] || {};

            options.min = options.min || node.minItems || 0;
            options.max = options.max || node.maxItems || 10;

            var iterations = chance.integer(options);
            var ret = [];

            for (var i = 0; i < iterations; i++) {
                ret.push(this.parser.parse(items));
            }

            return ret;
        }
    }]);

    return ArrayParser;
})();

exports['default'] = ArrayParser;
module.exports = exports['default'];