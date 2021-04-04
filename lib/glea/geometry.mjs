/**
 * Create a square (2 triangles)
 * 
 * @name square
 * @param {number} size 
 */
export function square(size = 1) {
  const s = size * .5;
  return [
    -s, -s, 0,
     s, -s, 0,
    -s,  s, 0,
    -s,  s, 0,
     s, -s, 0,
     s,  s, 0];
}

/**
 * Create a box with the sizes a * b * c, 
 * centered at (0, 0, 0), 2 triangles per side.
 * 
 * @name box
 * @param {number} sizeA 
 * @param {number} sizeB 
 * @param {number} sizeC 
 */
export function box(sizeA = 1.0, sizeB = 1.0, sizeC = 1.0) {
  const a = sizeA * .5;
  const b = sizeB * .5;
  const c = sizeC * .5;
  const vertices = [
    [-a, -b, -c], 
    [ a, -b, -c],
    [-a,  b, -c],
    [ a,  b, -c],
    [-a, -b,  c], 
    [ a, -b,  c],
    [-a,  b,  c],
    [ a,  b,  c]
  ];
  //     0______1
  //   4/|____5/| 
  //   |2|____|_|3
  //   |/ ____|/ 
  //  6       7 

  const faces = [
    // back
    [0, 2, 1], [2, 3, 1],
    // front
    [5, 7, 4], [7, 6, 4],
    // left
    [4, 6, 0], [6, 2, 0],
    // right
    [7, 5, 1], [1, 3, 7],
    // top
    [1, 5, 0], [5, 4, 0],
    // bottom
    [2, 6, 3], [6, 7, 3]
  ];
  const result = faces.flat().map(vertexIndex => vertices[vertexIndex]).flat();
  return result;
}

export function cube(size = 1.0) {
  return box(size, size, size);
}
