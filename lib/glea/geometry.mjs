export function square(s = 1) {
  return [
    s, s, 0,
    -s, s, 0,
    s,-s, 0,
    -s,-s, 0];
}

export function cube(size = 1.0) {
  const result = []
  const faces = "013321126651236673374403014145546674".split('').map(x => x|0);
  const vertices = "000100110010001101111011".split('').map(x => x|0);
  for(let i = faces.length; i--;) {
    Array.prototype.push.apply(result, (j => {
      return [
        vertices[  j  ] === 1 ? size : -size,
        vertices[j + 1] === 1 ? size : -size,
        vertices[j + 2] === 1 ? size : -size,
      ]
    })(faces[i] * 3));
  }
  return result;
}
