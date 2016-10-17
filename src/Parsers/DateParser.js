import Chance from 'chance';
const chance = new Chance();

let isDate = RegExp.prototype.test.bind(/^date$/);

export default class DateParser {
    canParse(node) {
        return isDate(node.type) || isDate(node.format);
    }

    parse(node) {
      return chance.date(Object.assign({
        string: true
      }, node['x-type-options']));
    }
}
