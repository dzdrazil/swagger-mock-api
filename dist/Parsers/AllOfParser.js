'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var chance = new _chance2['default']();

var AllOfParser = (function () {
    function AllOfParser(parser) {
        _classCallCheck(this, AllOfParser);

        this.parser = parser;
    }

    _createClass(AllOfParser, [{
        key: 'canParse',
        value: function canParse(node) {
            return !!node.allOf;
        }
    }, {
        key: 'parse',
        value: function parse(node) {
            return this.generateObject(node);
        }
    }, {
        key: 'generateObject',
        value: function generateObject(node) {
            var _this = this;

            return node.allOf.reduce(function (s, o) {
                return _Object$assign(s, _this.parser.parse(o));
            }, {});
        }
    }]);

    return AllOfParser;
})();

exports['default'] = AllOfParser;
module.exports = exports['default'];