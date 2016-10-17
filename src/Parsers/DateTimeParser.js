import Chance from 'chance';
const chance = new Chance();

let isDate = RegExp.prototype.test.bind(/^date-?[Tt]ime$/);

export default class DateTimeParser {
  canParse(node) {
    return isDate(node.type) || isDate(node.format);
  }

  parse(node) {
    return chance.date(node['x-type-options']);
  }
}
