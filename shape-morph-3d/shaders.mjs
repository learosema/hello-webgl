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
float sphere(vec3 p, float r) {
  return length(p) - r;
}

float box(vec3 p, vec3 b)
{
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float plane(vec3 p) {
	return p.y;
}

float addToScene(float a, float b) {
  return min(a, b);
}

float deformation(in vec3 pos) {
  return .00625 *
    sin(-time * .3 + pos.x * 15.0) * 
    sin(-time * .3 + pos.z * 15.0) *  
    sin(-time * .3 - pos.y * 15.0);
}

vec3 repeatXZ(in vec3 pos) {
  return vec3( fract(pos.x+0.5)-0.5, pos.y, fract(pos.z+0.5) - 0.5);
}

float scene(in vec3 pos) {
  float t = 1e7;
  float b1 = box(pos - vec3(-1.5, 1.2, 0), vec3(.8));
  float s1 = sphere(pos - vec3(-1.5, 1.2, 0), .5);
  float b2 = box(pos - vec3(1.5, 1.2, 0), vec3(.8));
  float s2 = sphere(pos - vec3(1.5, 1.2, .6), .5);

  t = addToScene(t, mix(b1, s1, .5 + .5 * sin(time * .2)) + deformation(pos));
  t = addToScene(t, mix(b2, s2, .5 + .5 * cos(time * .2)) + deformation(pos));

  //t = addToScene(t, sphere(repeatXZ(pos - vec3(0, .6 + sin(time*.5 + pos.x / 4.0 + pos.x / 4.0) * .5, 0)), .3 + deformation(pos) + .1 * sin(time * .1)));   
  //t = addToScene(t, box(pos - vec3(0, 1.2, 0), vec3(.8)) + deformation(pos));
  t = addToScene(t, plane(pos));
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
    if (res < (0.0005*t))
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
  return vec3(0.2, 0.1, 0.00) * (sin(time *.1 + rayDir.x * rayDir.z * 10.0) * 
     sin(time *.2 + rayDir.y * rayDir.z * 15.0) * .1 + rayDir.y * .7) * .5;
}

// calculate normal:
vec3 calcNormal(vec3 pos) {
  // Center sample
  float c = scene(pos);
  // Use offset samples to compute gradient / normal
  vec2 eps_zero = vec2(0.001, 0.0);
  return normalize(vec3( scene(pos + eps_zero.xyy), scene(pos + eps_zero.yxy), scene(pos + eps_zero.yyx) ) - c);
}

// gamma correction
vec3 gammaCorrect(vec3 col) {
  return pow(col, vec3(1.0 / 2.2));
}

// https://www.iquilezles.org/www/articles/rmshadows/rmshadows.htm
float softshadow(in vec3 ro, in vec3 rd, float mint, float maxt, float k) {
  float res = 1.0;
  float ph = 1e10;
  float t = mint;
  for (int i=0; i < ITERS; i++) {
    float h = scene(ro + rd * t);
    float y = h * h / (2.0 * ph);
    float d = sqrt(h * h - y * y);
    res = min(res, k * d / max(0.0, t - y) );
    ph = h;
    if (res < 5e-4 || t >= maxt) {
      break;
    }
    t += h;
  }
  return clamp(res, 0.0, 1.0);
}

// calculate ambient occlusion
float ambientOcclusion( in vec3 pos, in vec3 nor )
{
	float occ = 0.0;
  float sca = 1.0;
  for(int i=0; i<5; i++)
  {
    float h = 0.001 + 0.15*float(i)/4.0;
    float d = scene( pos + h*nor );
    occ += (h-d)*sca;
    sca *= 0.95;
  }
  return clamp( 1.0 - 1.5*occ, 0.0, 1.0 );    
}


// Visualize depth based on the distance
vec3 render(vec3 rayOrigin, vec3 rayDir)
{
  float t = castRay(rayOrigin, rayDir);
  if (t == -1.0) {
    return background(rayDir);
  }
  
  vec3 material = vec3(0.7, 0.6, 1.0);
  
  // key light
  vec3 pos = rayOrigin + rayDir * t;
  vec3 nor = calcNormal(pos);
  vec3 lig = normalize(vec3(5.0, 10.0, 5.6));
  float dif = clamp(dot(nor, lig), 0.0, 1.0) * softshadow(pos, lig, 0.00001, 3.0, 32.0);
  
  vec3 col = material * 4.0 * dif * vec3(1.00,0.70,0.5);
  
  // ambient light
  float occ = ambientOcclusion(pos, nor);
  float amb = clamp( 0.5+0.5*nor.y, 0.0, 1.0 );
  col += material * amb * occ * vec3(0.08, 0.04, 0);

  // fog
  col *= exp( -0.0005*t*t*t );
  return col;
}

// normalize coords and correct for aspect ratio
vec2 normalizeScreenCoords() {
  float aspectRatio = width / height;
  vec2 result = 2.0 * (gl_FragCoord.xy / vec2(width, height) - 0.5);
  result.x *= aspectRatio; 
  return result;
}

float rand() {
  return fract(sin(dot(gl_FragCoord.xy + sin(time),vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec3 camPos = vec3(3.5 + sin(time * .1) * 2.0, 3.0, 3.0 + .5 * cos(time *.1) * 1.0);
  vec3 camTarget = vec3(0);
  vec2 uv = normalizeScreenCoords();
  vec3 rayDir = getCameraRayDir(uv, camPos, camTarget);
  vec3 col = render(camPos, rayDir);
  gl_FragColor = vec4(gammaCorrect(mix(col, vec3(rand()), .0125)), 1.0);
}
`

export const vert = glsl`
precision highp float;
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`