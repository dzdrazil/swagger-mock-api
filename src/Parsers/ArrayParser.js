import Chance from 'chance';
const chance = new Chance();

export default class ArrayParser {
    constructor(parser) {
        this.parser = parser;
    }
    
    canParse(node) {
        return node.type === 'array';
    }

    parse(node) {
        return this.generateArray(node);
    }

    generateArray(node) {
        let items = node.items;
        var options = node['x-type-options'] || { min: node.minItems, max: node.maxItems };
        let iterations = chance.integer(options);
        let ret = [];

        for (let i = 0; i < iterations; i++) {
            ret.push(this.parser.parse(items));
        }

        return ret;
    }
}