'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _hoek = require('hoek');

var _hoek2 = _interopRequireDefault(_hoek);

var chance = new _chance2['default']();

var ObjectParser = (function () {
    function ObjectParser(parser) {
        _classCallCheck(this, ObjectParser);

        this.parser = parser;
    }

    _createClass(ObjectParser, [{
        key: 'canParse',
        value: function canParse(node) {
            return !!node.properties;
        }
    }, {
        key: 'parse',
        value: function parse(node) {
            return this.generateObject(node);
        }
    }, {
        key: 'generateObject',
        value: function generateObject(node) {
            var ret = {};
            var schema = _hoek2['default'].clone(node);
            schema = schema.properties || schema;

            for (var k in schema) {
                ret[k] = this.parser.parse(schema[k]);
            }

            return ret;
        }
    }]);

    return ObjectParser;
})();

exports['default'] = ObjectParser;
module.exports = exports['default'];