'use strict';

import hoek from 'hoek';

export default function(pathDefs, definitions) {
  let paths = clonePaths(pathDefs, definitions);

  return flattenRefs(
    paths,
    definitions
  );
};

function clonePaths(pathDefs, definitions) {
  let paths = {};

  for (let k in pathDefs) {
    paths[k] = hoek.clone(pathDefs[k])
  }

  return paths;
}

function flattenRefs(paths, definitions) {
  for (let pk in paths) {
    let path = paths[pk];
    for (let mk in path) {
      let method = path[mk].responses;
      for (let rk in method) {
        let response = method[rk];
        if (response.schema &&
          response.schema.items &&
          response.schema.items.$ref) {

          response.schema.items = definitions[
            fixRef(response.schema.items.$ref)
          ];
        } else if (response.schema &&
          response.schema.$ref) {

          response.schema = definitions[
            fixRef(response.schema.$ref)
          ];
        }
      }
    }
  }
  return paths;
}

function fixRef(path) {
    let segments = path.split('/');
    let ref = segments[segments.length - 1];
    return ref;
}
