import Chance from 'chance';
const chance = new Chance();

export default class NumberParser {
    canParse(node) {
        return this.isInteger(node) || this.isFloating(node);
    }

    parse(node) {
        if (this.isInteger(node))
            return chance.integer(node['x-type-options']);

        if (this.isFloating(node))
            return chance.floating(node['x-type-options']);
    }

    isInteger(node) {
        return node.type === 'integer' || node.type === 'long';
    }

    isFloating(node) {
        return node.type === 'number' || node.type === 'float' || node.type === 'double';
    }
}