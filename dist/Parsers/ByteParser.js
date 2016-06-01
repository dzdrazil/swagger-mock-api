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

var ByteParser = (function () {
    function ByteParser() {
        _classCallCheck(this, ByteParser);
    }

    _createClass(ByteParser, [{
        key: 'canParse',
        value: function canParse(node) {
            return node.type === 'byte';
        }
    }, {
        key: 'parse',
        value: function parse(node) {
            return new Buffer('' + chance.integer({ min: 0, max: 255 })).toString('base64');
        }
    }]);

    return ByteParser;
})();

exports['default'] = ByteParser;
module.exports = exports['default'];