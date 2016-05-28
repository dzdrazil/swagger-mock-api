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

    generateArray(schema) {
        let items = schema.items;
        var options = schema['x-type-options'] || { min: 0, max: 10 };
        let iterations = chance.integer(options);
        let ret = [];

        for (let i = 0; i < iterations; i++) {
            ret.push(this.parser.parse(items));
        }

        return ret;
    }
}