import Routes from 'routes';
import MockData from './MockData';

function correctPath(path) {
  let uri = path.replace(/^\/?|\/?$/, '');
  let segments = uri.split('/');

  return '/' +
    segments
    .map(s => {
      let segment = s;
      if (segment.charAt(0) === '{' && segment.charAt(segment.length - 1) === '}') {
        segment = segment.slice(1, -1);
        return ':' + segment;
      }

      return segment;
    })
    .join('/');
}

// wrapped MockData to satisfy eslint's no funciton definitions inside of loops
function mock(schema) {
  return MockData(schema);
}

function generateResponse(potentialResponses) {
  for (let k in potentialResponses) {
    if (k === 'default') continue;

    let responseSchema = potentialResponses[k];
    let responseCode = parseInt(k, 10);
    if (responseCode > 199 && responseCode < 300) {
      return mock.bind(null, responseSchema);
    }
  }

  if (potentialResponses.default) {
    return mock.bind(null, potentialResponses.default);
  }
}

export default function ConfigureRouter(paths) {
  let router = new Routes();

  for (let pk in paths) {
    if (!paths.hasOwnProperty(pk)) continue;

    let path = paths[pk];
    let route = correctPath(pk);

    for (let mk in path) {
      if (!path.hasOwnProperty(mk)) continue;

      let method = path[mk];
      console.log('ADDING ROUTE: ', mk.toUpperCase() + ' ' + pk);

      let respond = generateResponse(method.responses, pk);
      router.addRoute('/' + mk + route, respond);
    }
  }

  return router;
}
