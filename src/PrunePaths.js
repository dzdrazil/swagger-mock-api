export default function PrunePaths(paths, passthroughPaths, keep) {
  let replacement = {};

  for (let i = 0; i < passthroughPaths.length; i++) {
    const p = passthroughPaths[i];
    let [path, ...methods] = p.split(' ').reverse();

    if (methods.length) {
      methods = methods.map(x => x.toLowerCase());
      methods.forEach(m => {
        if (keep) {
          replacement[path]
            ? (replacement[path][m] = paths[path][m])
            : ((replacement[path] = {}) && (replacement[path][m] = paths[path][m]));
        } else {
          delete paths[path][m];
        }
      });
    } else if (keep) {
      replacement[path] = paths[path];
    } else {
      delete paths[path];
    }
  }

  return keep ? replacement : paths;
}
