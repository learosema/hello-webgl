// identity function for the glsl-literal vscode extension
// enables code highlighting for glsl code.
const glsl = x => x

export const frag = glsl`
precision highp float;
#define ITERS 64

uniform float width;
uniform float height;
uniform float time;

// Calculate cameras "orthonormal basis", i.e. its transform matrix components
vec3 getCameraRayDir(vec2 uv, vec3 camPos, vec3 camTarget) {
  vec3 camForward = normalize(camTarget - camPos);
  vec3 camRight = normalize(cross(vec3(0.0, 1.0, 0.0), camForward));
  vec3 camUp = normalize(cross(camForward, camRight));
     
  float fPersp = 2.0;
  vec3 vDir = normalize(uv.x * camRight + uv.y * camUp + camForward * fPersp);
 
  return vDir;
}

// distance function for a sphere
float sphere(vec3 p, float r)
{
    return length(p) - r;
}

float deformation(vec3 pos) {
  return sin(time * .1) * 0.4 * sin(time * .3 + pos.x * 4.0) * 
    sin(time *.2 + pos.y * 3.0) * 
    sin(time * .3 + pos.z * 2.0);
}

float scene(vec3 pos)
{
  float t = sphere(pos - vec3(0.0, 0.0, 10.0), 3.0) + deformation(pos);   
  return t;
}

// cast a ray along a direction and return 
// the distance to the first thing it hits
// if nothing was hit, return -1
float castRay(vec3 rayOrigin, vec3 rayDir)
{
  float t = 0.0; // Stores current distance along ray
  for (int i = 0; i < ITERS; i++)
  {
    float res = scene(rayOrigin + rayDir * t);
    if (res < (0.001*t))
    {
        return t;
    }
    t += res;
  }
  return -1.0;
}

// I tried to achieve a somewhat cloudy background
// maybe better with perlin noise.
vec3 background(vec3 rayDir) {
  return vec3(0.30, 0.36, 0.60) - 
    (sin(time *.1 + rayDir.x * rayDir.z * 10.0) * 
     sin(time *.2 + rayDir.y * rayDir.z * 15.0) * .1 + rayDir.y * .7);
}

// Visualize depth based on the distance
vec3 render(vec3 rayOrigin, vec3 rayDir)
{
  float t = castRay(rayOrigin, rayDir);
  if (t == -1.0) {
    return background(rayDir);
  }
  vec3 col = vec3(4.0 - t * 0.35) * vec3(.7, 0, 1.0);
  return col;
}

// calculate normal:
vec3 calcNormal(vec3 pos)
{
  // Center sample
  float c = scene(pos);
  // Use offset samples to compute gradient / normal
  vec2 eps_zero = vec2(0.001, 0.0);
  return normalize(vec3( scene(pos + eps_zero.xyy), scene(pos + eps_zero.yxy), scene(pos + eps_zero.yyx) ) - c);
}

// normalize coords and correct for aspect ratio
vec2 normalizeScreenCoords()
{
  float aspectRatio = width / height;
  vec2 result = 2.0 * (gl_FragCoord.xy / vec2(width, height) - 0.5);
  result.x *= aspectRatio; 
  return result;
}

void main() {
  vec3 camPos = vec3(0, 0, -1.0);
  vec3 camTarget = vec3(0);
  vec2 uv = normalizeScreenCoords();
  vec3 rayDir = getCameraRayDir(uv, camPos, camTarget);
  vec3 col = render(camPos, rayDir);
  gl_FragColor = vec4(col, 1.0);
}
`

export const vert = glsl`
precision highp float;
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`