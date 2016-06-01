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

var EnumParser = (function () {
    function EnumParser() {
        _classCallCheck(this, EnumParser);
    }

    _createClass(EnumParser, [{
        key: 'canParse',
        value: function canParse(node) {
            return !!node['enum'];
        }
    }, {
        key: 'parse',
        value: function parse(node) {
            return this.parseEnum(node['enum']);
        }
    }, {
        key: 'parseEnum',
        value: function parseEnum(enumNode) {
            var index = chance.integer({ min: 0, max: enumNode.length - 1 });
            return enumNode[index];
        }
    }]);

    return EnumParser;
})();

exports['default'] = EnumParser;
module.exports = exports['default'];