import Chance from 'chance';
const chance = new Chance();

export default class StringParser {
    canParse(node) {
        return node.type === 'string';
    }
    
    parse(node) {
        return this.parseString(node);
    }
    
    parseString(node) {
        let chanceType = node['x-chance-type'] || 'string';
        return chance[chanceType](node['x-type-options']);
    }
}