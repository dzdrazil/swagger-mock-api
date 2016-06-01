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

var BooleanParser = (function () {
    function BooleanParser() {
        _classCallCheck(this, BooleanParser);
    }

    _createClass(BooleanParser, [{
        key: 'canParse',
        value: function canParse(node) {
            return node.type === 'boolean';
        }
    }, {
        key: 'parse',
        value: function parse(node) {
            return chance.bool(node['x-type-options']);
        }
    }]);

    return BooleanParser;
})();

exports['default'] = BooleanParser;
module.exports = exports['default'];