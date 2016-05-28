'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _hoek = require('hoek');

var _hoek2 = _interopRequireDefault(_hoek);

var chance = new _chance2['default']();
var isDate = RegExp.prototype.test.bind(/^date([Tt]ime)?$/);

var DateParser = (function () {
    function DateParser() {
        _classCallCheck(this, DateParser);
    }

    _createClass(DateParser, [{
        key: 'canParse',
        value: function canParse(node) {
            return isDate(node.type);
        }
    }, {
        key: 'parse',
        value: function parse(node) {
            return chance.date(node['x-type-options']);
        }
    }]);

    return DateParser;
})();

exports['default'] = DateParser;
module.exports = exports['default'];
//# sourceMappingURL=DateParser.js.map