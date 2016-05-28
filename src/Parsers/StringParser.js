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
        let options = node['x-type-options'] || {};

        if (node.maxLength && node.minLength)
            options.length = chance.integer({ max: node.maxLength, min: node.minLength });
        else
            options.length = options.length || node.maxLength || node.minLength;

        return chance.string(options);
    }
}