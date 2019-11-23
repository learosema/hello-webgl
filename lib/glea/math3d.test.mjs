import { describe, test, shouldThrow } from '../test-framework/test.mjs';
import { Vec2, Vec3 } from './math3d.mjs';

describe('2D Vector arithmetics', () => {
  test('Vec2 constructor', (assert) => {
    const vector = new Vec2(1, 2);
    assert(vector.x === 1, 'vector.x equals 1');
    assert(vector.y === 2, 'vector.y equals 2');
  });

  test('Vec2 constructor with invalid args', (assert) => {
    shouldThrow(assert, 'invalid vector should throw an exception.', () => {
      const invalidVector = new Vec2(1, null);
    });
  });

  test('Vec2 addition', (assert) => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, 5);
    const v3 = v1.add(v2);
    assert(v3.x === 4, '(1 + 3, 2 + 5).x equals 4');
    assert(v3.y === 7, '(1 + 3, 2 + 5).y equals 7');
  });

  test('Vec2 substraction', (assert) => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, 5);
    const v3 = v1.sub(v2);
    assert(v3.x === -2, '(1 - 3, 2 - 5).x equals -2');
    assert(v3.y === -3, '(1 - 3, 2 - 5).y equals -3');
  });

  test('Vec2 length', (assert) => {
    const vector = new Vec2(3, 4);
    assert(vector.length === 5, 'Vec2(3,4).length equals 5.');
  });

});

describe('3D Vector arithmetics', () => {
  test('Vec3 constructor', (assert) => {
    const vector = new Vec3(1, 2, 3);
    assert(vector.x === 1, 'vector.x equals 1');
    assert(vector.y === 2, 'vector.y equals 2');
    assert(vector.z === 3, 'vector.y equals 3');
  });
});
