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
                return Object.assign(s, _this.parser.parse(o));
            }, {});
        }
    }]);

    return AllOfParser;
})();

exports['default'] = AllOfParser;
module.exports = exports['default'];
//# sourceMappingURL=AllOfParser.js.map