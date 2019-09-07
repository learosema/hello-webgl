/* More modelling in ASCII art :)

  x--x--x
  | /| /|
  |/ |/ |
  x--x--x
  | /| /|
  |/ |/ |
  x--x--x
*/

/**
 * Create 2D grid geometry
 * 
 * @param delta {number} point distance, default 0.1
 * @returns {Array} flattened array of 2D coordinates
 */
export function grid(deltaX = 0.1, deltaY = 0.1, xMin = -1, yMin = -1, xMax = 1, yMax = 1) {
  const dimX = Math.round((xMax - xMin) / deltaX);
  const dimY = Math.round((yMax - yMin) / deltaY);
  const squares = Array(dimX * dimY).fill(0).map((_, idx) => {
    const col = idx % dimX;
    const row = (idx / dimX)|0;
    const x0 = xMin + deltaX * col;
    const y0 = yMin + deltaY * row;
    const x1 = x0 + deltaX;
    const y1 = y0 + deltaY;
    // return two triangles per square
    return [
      x0, y0, x1, y0, x0, y1,
      x0, y1, x1, y0, x1, y1
    ];
  });
  // for MS Edge support, let's do a slightly more complicated
  // thing than just 
  // return squares.flat();
  return Array.prototype.concat.apply([], squares);
}
