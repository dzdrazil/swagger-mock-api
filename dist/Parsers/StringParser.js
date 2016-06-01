'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
//# sourceMappingURL=StringParser.js.map