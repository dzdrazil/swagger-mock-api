import Chance from 'chance';
const chance = new Chance();

export default class StringParser {
    canParse(node) {
        return node.type === 'string';
    }
    
    parse(node) {
        if(node.enum)
            return this.parseEnum(node.enum);
        
        return this.parseString(node);
    }
    
    parseString(node) {
        let chanceType = node['x-chance-type'] || 'string';
        return chance[chanceType](node['x-type-options']);
    }
    
    parseEnum(nodeEnum) {
        let index = chance.integer({min: 0, max: nodeEnum.length - 1});
        return nodeEnum[index];
    }
}