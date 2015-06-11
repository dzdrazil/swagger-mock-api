'use strict';

var fs = require('fs');
var url = require('url');
var yaml = require('js-yaml');
var hoek = require('hoek');
var Routes = require('routes');
var router = new Routes();
var Chance = require('chance');
var chance = new Chance();

var debug = console.log.bind(console);

module.exports = function(config) {
    var doc = yaml.load(fs.readFileSync(config.yamlPath, 'utf8'));
    var basepath = doc.basePath;

    var definitions = parseDefinitions(doc.definitions, {});
    var paths = parsePaths(doc.paths, definitions);

    configureRouter(router, paths);

    // return connect function
    return function(req, res, next) {
        var method = req.method.toLowerCase();

        var path = url.parse(req.url).pathname;
        path = path.replace(basepath + '/', '');
        if (path.charAt(0) !== '/') {
            path = '/' + path;
        }

        debug('Request: %s %s', req.method, path);
        var matchingRoute = router.match('/' + method + path);
        if (!matchingRoute) next();

        res.setHeader('Content-Type', 'application/json');
        res.write(matchingRoute.fn());
        res.end();
    }
}

function parseDefinitions(defMap, definitions) {
    var k;
    var count = Object.keys(defMap).length;
    var definition;

    for (k in defMap) {
        if (definitions[k]) {
            count--;
            continue;
        }

        definition = parseDefinition(k, defMap, definitions);
        if (definition === null) {
            continue;
        } else {
            definitions[k] = definition;
            count--;
        }
    }

    if (count === 0) {
        return definitions;
    }
    return parseDefinitions(defMap, definitions);
}

function parseDefinition(key, defMap, definitions) {
    var propDef = defMap[key];
    var ref = {};

    if (propDef.allOf) {
        try {
            return propDef.allOf.reduce(function(acc, def) {
                if (def.$ref) {
                    return hoek.merge(acc, getRef(def.$ref, definitions));
                } else {
                    return hoek.merge(acc, def.properties);
                }
            }, {});
        } catch(e) {
            return null;
        }
    } else {
        //return hoek.merge({}, propDef.properties);
        for (var k in propDef.properties) {
            var prop = propDef.properties[k];
            if (prop.type === 'array' && prop.items.$ref) {
                try {
                    ref[k] = prop;
                    ref[k].items = getRef(prop.items.$ref, definitions);
                } catch(e) {
                    return null;
                }
            } else {
                ref[k] = hoek.merge({}, prop);
            }
        }
    }

    return ref;
}

function getRef(path, definitions) {
    var segments = path.split('/');
    var ref = segments[segments.length - 1];

    if (!definitions[ref]) throw new Error('no definition found');
    return definitions[ref];
}

function parsePaths(pathDefs, definitions) {
    var ret = {};

    var k;
    for (k in pathDefs) {
        ret[k] = flattenPathResponseDefs(
            hoek.clone(pathDefs[k]),
            definitions
        );
    }

    return ret;
}

function flattenPathResponseDefs(pathDef, definitions) {
    var k;
    var path;
    var mK;
    var methodDef;
    var rK;
    var response;

    for (mK in pathDef) {

        methodDef = pathDef[mK].responses;

        for (rK in methodDef) {
            if (methodDef[rK].schema &&
                    methodDef[rK].schema.items
                    && methodDef[rK].schema.items.$ref) {

                methodDef[rK].schema.items = getRef(methodDef[rK].schema.items.$ref, definitions);
            } else if (methodDef[rK].schema && methodDef[rK].schema.$ref) {
                methodDef[rK].schema = getRef(methodDef[rK].schema.$ref, definitions);
            }
        }
    }

    return pathDef;
}

function configureRouter(router, paths) {
    var pk;
    var mk;
    var pathDef;
    var method;

    for (pk in paths) {
        pathDef = paths[pk];
        for (mk in pathDef) {
            method = pathDef[mk];
            var path = correctPath(pk);
            debug('ADDING ROUTE: ', mk.toUpperCase() + ' ' + pk);
            router.addRoute('/' + mk + path, function(method) {
                return  respond(method.responses);
            }.bind(router, method));
        }
    }
}

function correctPath(path) {
    var uri = path.replace(/^\/?|\/?$/, '');
    var segments = uri.split('/');

    return '/' +
        segments
        .map(function(s) {
            if (s.charAt(0) === '{' && s.charAt(s.length - 1) === '}') {
                s = s.slice(1, -1);
                return ':' + s;
            }

            return s;
        })
        .join('/');
}

function respond(possibleResponseTypes) {
    var k;
    for (k in possibleResponseTypes) {
        if (k === 'default') continue;
        if (parseInt(k) < 300) {
            return generateResponse(possibleResponseTypes[k]);
        }
    }
    if (possibleResponseTypes['default']) {
        return generateResponse(possibleResponseTypes['default']);
    }
    return null;
}

function generateResponse(definition) {
    var schema = definition.schema;
    if (!schema) {
        return null;
    }

    if (schema.type === 'array') {
        return generateArray(schema);
    }

    return generateObject(schema);
}

function generateObject(schema) {
    var k;
    var ret = {};
    for (k in schema) {
        if (schema[k].type === 'array') {
            ret[k] = generateArray(schema[k]);
            continue;
        }
        ret[k] = swaggerToChance(schema[k]);
    }
    return ret;
}

function generateArray(schema) {
    var options = hoek.merge({min: 0, max: 10}, schema['x-type-options']);
    var iterations = chance.integer(options);
    var i;
    var ret = [];
    var method;
    if (schema.type && !schema.type.type) { // schema.type.type indicates that type is a param key, not swagger type
        method = swaggerToChance;
    } else {
        method = generateObject;
    }
    for (i = 0; i < iterations; i++) {
        ret.push(method(schema.items));
    }

    return ret;
}

function swaggerToChance(typedef) {
    var method;
    if (typedef['x-chance-type']) {
        method = typedef['x-chance-type'];
    } else if (typedef.type === 'array') {
        return generateArray(typedef);
    } else if (typedef.type) {
        method = mapToChance(typedef.type, typedef);
    } else {
        return generateObject(typedef);
    }

    var options;
    if (typedef['x-type-options']) {
       return chance[method](typedef['x-type-options']);
    } else {
        return chance[method]();
    }
}

function mapToChance(type) {
    var method;
    switch (type) {
        case 'integer': method = 'integer'; break;
        case 'long': method = 'integer'; break;
        case 'float': method = 'floating'; break;
        case 'double': method = 'floating'; break;
        case 'string': method = 'string'; break;
        case 'byte': return new Buffer('' + chance.integer({min: 0, max: 255})).toString('base64'); break;
        case 'boolean': method = 'bool'; break;
        case 'date': method = 'date'; break;
        case 'dateTime': method = 'date'; break;
        default:
            if (chance[type]) {
                 method = type;
                 break;
            }
            console.log('unfound type!');
            console.log(type);
            console.log(arguments[1])
            throw new Error('No chance equivalent for type: ' + type);
    }
    return method;
}
