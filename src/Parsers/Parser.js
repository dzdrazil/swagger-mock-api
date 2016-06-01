import StringParser from './StringParser'
import ObjectParser from './ObjectParser'
import ArrayParser from './ArrayParser'
import NumberParser from './NumberParser'
import DateParser from './DateParser'
import BooleanParser from './BooleanParser'
import AllOfParser from './AllOfParser'
import EnumParser from './EnumParser'
import Chance from 'chance';
const chance = new Chance();

export default class Parser {
    get parsers() {
        return this._parsers || (this._parsers = [
            new EnumParser(),
            new StringParser(),
            new ObjectParser(this),
            new ArrayParser(this),
            new AllOfParser(this),
            new NumberParser(),
            new BooleanParser(),
            new DateParser(),
            new BooleanParser(),
        ]);
    }

    getParser(node) {
        let parser = this.parsers.find(p => p.canParse(node));

        if (!parser)
            throw new Error(`Can't handle ${node.type || 'Unknown'} type.`);

        return parser;
    }

    parse(node) {
        if (node['x-chance-type'] === 'fixed') {
            return node['x-type-value'];
        }

        if (node['x-chance-type'])
            return chance[node['x-chance-type']](node['x-type-options']);

        return this.getParser(node).parse(node);
    }
}