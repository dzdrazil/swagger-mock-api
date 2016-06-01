'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _StringParser = require('./StringParser');

var _StringParser2 = _interopRequireDefault(_StringParser);

var _ObjectParser = require('./ObjectParser');

var _ObjectParser2 = _interopRequireDefault(_ObjectParser);

var _ArrayParser = require('./ArrayParser');

var _ArrayParser2 = _interopRequireDefault(_ArrayParser);

var _NumberParser = require('./NumberParser');

var _NumberParser2 = _interopRequireDefault(_NumberParser);

var _DateParser = require('./DateParser');

var _DateParser2 = _interopRequireDefault(_DateParser);

var _BooleanParser = require('./BooleanParser');

var _BooleanParser2 = _interopRequireDefault(_BooleanParser);

var _AllOfParser = require('./AllOfParser');

var _AllOfParser2 = _interopRequireDefault(_AllOfParser);

var _EnumParser = require('./EnumParser');

var _EnumParser2 = _interopRequireDefault(_EnumParser);

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var chance = new _chance2['default']();

var Parser = (function () {
    function Parser() {
        _classCallCheck(this, Parser);
    }

    _createClass(Parser, [{
        key: 'getParser',
        value: function getParser(node) {
            var parser = this.parsers.find(function (p) {
                return p.canParse(node);
            });

            if (!parser) throw new Error('Can\'t handle ' + (node.type || 'Unknown') + ' type.');

            return parser;
        }
    }, {
        key: 'parse',
        value: function parse(node) {
            if (node['x-chance-type'] === 'fixed') {
                return node['x-type-value'];
            }

            if (node['x-chance-type']) return chance[node['x-chance-type']](node['x-type-options']);

            return this.getParser(node).parse(node);
        }
    }, {
        key: 'parsers',
        get: function get() {
            return this._parsers || (this._parsers = [new _EnumParser2['default'](), new _StringParser2['default'](), new _ObjectParser2['default'](this), new _ArrayParser2['default'](this), new _AllOfParser2['default'](this), new _NumberParser2['default'](), new _BooleanParser2['default'](), new _DateParser2['default'](), new _BooleanParser2['default']()]);
        }
    }]);

    return Parser;
})();

exports['default'] = Parser;
module.exports = exports['default'];
//# sourceMappingURL=Parser.js.map