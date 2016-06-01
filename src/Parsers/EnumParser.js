import Chance from 'chance';
const chance = new Chance();

export default class EnumParser {
    canParse(node) {
        return !!node.enum;
    }
    
    parse(node) {
        return this.parseEnum(node.enum);
    }
    
    parseEnum(enumNode) {
        let index = chance.integer({min: 0, max: enumNode.length - 1});
        return enumNode[index];
    }
}