import Chance from 'chance';
import hoek from 'hoek';

const chance = new Chance();

export default class NumberParser {
    canParse(node) {
        return this.isInteger(node) || this.isFloating(node);
    }
    
    parse(node) {
        return chance.bool(node['x-type-options']);
    }
    
    isInteger(node) {
        return node.type === 'integer' || node.type === 'long';
    }
    
    isFloating(node) {
        return node.type === 'number' || node.type === 'float' || node.type === 'double';
    }
}