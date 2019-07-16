export function square(s = 1) {
  return [
    s, s, 0,
    -s, s, 0,
    s,-s, 0,
    -s,-s, 0];
}

export function cube(s = 1) {
  const result = []
  const faces = "013321126651236673374403014145546674".split('').map(x => x|0);
  const vertices = "000100110010001101111011".split('').map(x => x|0);
  for(let i = faces.length; i--;) {
    result.push((j => {
      return [
        vertices[  j  ] ===1?s:-s,
        vertices[j + 1] ===1?s:-s,
        vertices[j + 2] ===1?s:-s,
      ]
    })(faces[i] * 3));
  }
  return result;
}
