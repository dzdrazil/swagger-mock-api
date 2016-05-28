import Chance from 'chance';
const chance = new Chance();

export default class NumberParser {
    canParse(node) {
        return this.isInteger(node) || this.isFloating(node);
    }

    parse(node) {
        if (this.isInteger(node))
            return this.generateInteger(node);

        if (this.isFloating(node))
            return chance.floating(node['x-type-options']);
    }

    generateInteger(node) {
        let bounds = this.resolveBounds(node);
        return chance.integer(bounds) * (node.multipleOf || 1);
    }

    resolveBounds(node) {
        let bounds = { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER };

        Object.assign(bounds, node['x-type-options']);

        if (node.multipleOf < 1) {
            throw new Error(`The value of "multipleOf" MUST be a JSON number. This number MUST be strictly greater than 0.`);
        }

        if (node.maximum) {
            bounds.max = node.maximum + (node.exclusiveMaximum ? -1 : 0);
        }

        if (node.minimum) {
            bounds.min = node.minimum + (node.exclusiveMinimum ? 1 : 0);
        }

        if (node.multipleOf) {
            bounds.min = bounds.min / node.multipleOf;
            bounds.max = bounds.max / node.multipleOf;
        }

        return bounds;
    }

    isInteger(node) {
        return node.type === 'integer' || node.type === 'long';
    }

    isFloating(node) {
        return node.type === 'number' || node.type === 'float' || node.type === 'double';
    }
}