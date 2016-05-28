import Chance from 'chance';
import hoek from 'hoek';

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
        return nodeEnum[Math.floor(Math.random() * nodeEnum.length)];
    }
}