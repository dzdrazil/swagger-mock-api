'use strict';

import Routes from 'routes';
import MockData from './MockData';

export default function ConfigureRouter(paths) {
  let router = new Routes();

  for (let pk in paths) {
    let path = paths[pk];
    let route = correctPath(pk);

    for (let mk in path) {
      let method = path[mk];
      console.log('ADDING ROUTE: ', mk.toUpperCase() + ' ' + pk);

      let respond = generateResponse(method.responses, pk);
      router.addRoute('/' + mk + route, respond);
    }
  }

  return router;
}

function correctPath(path) {
  let uri = path.replace(/^\/?|\/?$/, '');
  let segments = uri.split('/');

  return '/' +
    segments
    .map(s => {
      if (s.charAt(0) === '{' && s.charAt(s.length - 1) === '}') {
        s = s.slice(1, -1);
        return ':' + s;
      }

      return s;
    })
    .join('/');
}

function generateResponse(potentialResponses, pk) {
  for (let k in potentialResponses) {
    if (k === 'default') continue;

    let responseSchema = potentialResponses[k];

    if (parseInt(k) < 300) {
// console.log('----------------------');
// console.log(pk);
// try {console.log(MockData(responseSchema)); }
// catch(e) {console.log(e);}
      return () => MockData(responseSchema);
    }
  }

  if (potentialResponses['default']) {
    return () => MockData(potentialResponses['default']);
  }
}
