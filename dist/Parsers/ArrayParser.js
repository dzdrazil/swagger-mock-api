'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
        value: function generateArray(schema) {
            var items = schema.items;
            var options = schema['x-type-options'] || { min: 0, max: 10 };
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
//# sourceMappingURL=ArrayParser.js.map