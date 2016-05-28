import Chance from 'chance';
const chance = new Chance();

export default class ByteParser {
    canParse(node) {
        return node.type === 'byte';
    }
    
    parse(node) {
        return new Buffer('' + chance.integer({ min: 0, max: 255 })).toString('base64');
    }
}