'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Number$MIN_SAFE_INTEGER = require('babel-runtime/core-js/number/min-safe-integer')['default'];

var _Number$MAX_SAFE_INTEGER = require('babel-runtime/core-js/number/max-safe-integer')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var chance = new _chance2['default']();

var NumberParser = (function () {
    function NumberParser() {
        _classCallCheck(this, NumberParser);
    }

    _createClass(NumberParser, [{
        key: 'canParse',
        value: function canParse(node) {
            return this.isInteger(node) || this.isFloating(node);
        }
    }, {
        key: 'parse',
        value: function parse(node) {
            if (this.isInteger(node)) return this.generateInteger(node);

            if (this.isFloating(node)) return chance.floating(node['x-type-options']);
        }
    }, {
        key: 'generateInteger',
        value: function generateInteger(node) {
            var bounds = this.resolveBounds(node);
            return chance.integer(bounds) * (node.multipleOf || 1);
        }
    }, {
        key: 'resolveBounds',
        value: function resolveBounds(node) {
            var bounds = { min: _Number$MIN_SAFE_INTEGER, max: _Number$MAX_SAFE_INTEGER };

            _Object$assign(bounds, node['x-type-options']);

            if (node.multipleOf < 1) {
                throw new Error('The value of "multipleOf" MUST be a JSON number. This number MUST be strictly greater than 0.');
            }

            if (node.maximum) {
                bounds.max = node.maximum + (node.exclusiveMaximum ? -1 : 0);
            }

            if (node.minimum) {
                bounds.min = node.minimum + (node.exclusiveMinimum ? 1 : 0);
            }

            //http://mathforum.org/library/drmath/view/60913.html
            if (node.multipleOf) {
                bounds.min = bounds.min / node.multipleOf;
                bounds.max = bounds.max / node.multipleOf;
            }

            return bounds;
        }
    }, {
        key: 'isInteger',
        value: function isInteger(node) {
            return node.type === 'integer' || node.type === 'long';
        }
    }, {
        key: 'isFloating',
        value: function isFloating(node) {
            return node.type === 'number' || node.type === 'float' || node.type === 'double';
        }
    }]);

    return NumberParser;
})();

exports['default'] = NumberParser;
module.exports = exports['default'];