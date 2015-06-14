'use strict';

import Kefir from 'kefir';
import hoek from 'hoek';

export default function definitionParser(rawDefinitions) {
  ///
  /// HELPER FUNCTIONS
  ///
  function parseDefinition(def) {
    let ref = def.ref;
    let raw = def.raw;
    let stream;

    if (raw.allOf) {
      stream = Kefir
        .stream(e => {
          raw.allOf.forEach(def => {
            if (def.$ref) {
              e.emit(getRef(def.$ref));
            } else {
              e.emit(Kefir.constant(def.properties));
            }
          });
        });
    } else {
      stream = Kefir
        .stream(e => {
          for (let k in raw.properties) {
            let prop = raw.properties[k];
            if (prop.type === 'array' && prop.items.$ref) {
              prop = hoek.clone(prop);
              getRef(prop.items.$ref)
                .onValue(i => {
                  prop.i = i;
                  e.emit(Kefir.constant({[k]: prop}));
                });
            } else {
              e.emit(Kefir.constant({[k]: prop}));
            }
          }
        });
    }

    return stream
        .flatMap(s => s)
        .scan((acc, props) => {
          acc.props = hoek.merge(acc.props, props);
          return acc;
        }, {ref, props: {}});
  }

  function getRef($ref) {
    let $r = fixPath($ref);

    return Kefir.stream(e => {
      definitionStream.onValue(d => {
        if (d.ref === $r) {
          e.emit(hoek.clone(d.props));
          e.end();
        }
      })
    });
  }

  function fixPath(path) {
    let segments = path.split('/');
    let ref = segments[segments.length - 1];
    return ref;
  }

  ///
  /// Definition Streams
  ///

  let rawStream = Kefir.stream(e => {
    for (let k in rawDefinitions) {
      e.emit({
        ref: k,
        raw: rawDefinitions[k]
      });
    }
    e.end();
  });

  let definitionStream = rawStream
    .flatMap(raw => {
      return parseDefinition(raw);
    });

  let definitions = definitionStream
    .scan((map, definition) => {
      map[definition.ref] = definition.props;
      return map;
    }, {});

    return definitions;
};
