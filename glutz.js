// glutz.js - minimal gl utils - (c)2015 Lutz Rosema
// License: WTFPL v2.0
//
// Provides some simple helper functions for webgl.
//
// Includes sugar around the WebGL API, 
// vector/matrix operations and perspective
// utility functions.
//
// Notice:
// 1. Fun project with esoteric coding style. 
//    Mean ugly dirty code by design :D
// 2. Excerpts out of it might be useful.
//    In #js1k/#js13kgames projects, for example.
// 3. Work in progress, far from complete.

// Laziness
Object.getOwnPropertyNames(Math).map(function(p) {
  window[p] = Math[p];
});

// a square
function sq(s){
	s=s||1
	return[s,s,0,-s,s,0,s,-s,0,-s,-s,0]
}

// a cube
function qb(s,r,f,v,i,j){ 
	f="013321126651236673374403014145546674"
	v="000100110010001101111011"
	for(r=[],s=s||1,i=f.length;i--;)
		Array.prototype.push.apply(r,function(j){return[
			v[ j ]==1?s:-s,
			v[j+1]==1?s:-s,
			v[j+2]==1?s:-s,
		]}(f[i]*3))
	return r
}

// Identity Matrix
function mI(){
	return[1,0,0,0,
	       0,1,0,0,
	       0,0,1,0,
	       0,0,0,1]
}

// Transformation matrix
function mT(x,y,z,r){
	return r=mI(),r.splice(12,3,x,y,z),r
}

// Scale matrix
function mS(x,y,z){
	return[x,0,0,0,
	       0,y,0,0,
	       0,0,z,0,
	       0,0,0,1]
}

// Matrix multiplication
function mX(a,b,c,i,j,k,l){c=[]
	for(i=l=sqrt(a.length)|0;i--;)
		for(k=l;k--;)
			for(j=l;j--;){
				if (!c[i+k*l])c[i+k*l]=0
				c[i+k*l]+=a[i+j*l]*b[j+k*l]
			}
	return c
}

// Matrix determinant (until 3x3), todo: gaussian elimination for >3x3 ;)
function mDet(a,n){
	if(n=sqrt(a)<4)
		return[1,a[0],a[0]*a[3]-a[2]*a[1],
			a[0]*a[4]*a[8]+a[3]*a[7]*a[2]+a[6]*a[1]*a[5]-
			a[6]*a[1]*a[5]-a[3]*a[1]*a[8]-a[0]*a[7]*a[5]][n|0]
}

// Matrix for rotation around x-axis
function mRx(a){
	return[1,0,0,0,
	       0,cos(a),sin(a),0,
	       0,-sin(a),cos(a),0,
	       0,0,0,1]
}

// Matrix for rotation around y-axis
function mRy(a){
	return[cos(a),0,-sin(a),0,
	       0,1,0,0,
	       sin(a),0,cos(a),0,
	       0,0,0,1]
}

// Matrix for rotation around z-axis
function mRz(a){
	return[cos(a),sin(a),0,0,
	      -sin(a),cos(a),0,0,
	       0,0,1,0,
	       0,0,0,1]
}


// Vector cross product
function vX(a,b){
	return[a[1]*b[2]-a[2]*b[1],
	       a[2]*b[0]-a[0]*b[2],
	       a[0]*b[1]-a[1]*b[0]]
}

// Vector length
function vL(v){
	return sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2])
}

// Unit vector
function v1(v){
	return l=vL(v),[v[0]/l,v[1]/l,v[2]/l]
}

// glOrtho(left, right, bottom, top, zNear, zFar)
function ortho(l,r,b,t,zn,zf,tx,ty,tz){
	return tx=-(r+l)/(r-l),
	       ty=-(t+b)/(t-b),
	       tz=-(zf+zn)/(zf-zn),
	       [2/(r-l),0,0,
	        0,0,2/(t-b),0,
	        0,0,0,-2/(zf-zn),
	        0,tx,ty,tz,1]
}

// glFrustum(left, right, bottom, top, zNear, zFar)
function frustum(l,r,b,t,zn,zf,t1,t2,t3,t4){
	return t1=2*zn,t2=r-l,t3=t-b,t4=zf-zn,
	       [t1/t2,0,0,0,
	        0,t1/t3,0,0,
	        (r+l)/t2,(t+b)/t3,(-zf-zn)/t4,-1,
	        0,0,(-t1*zf)/t4,0]
}

// gluPerspective(fieldOfView, aspectRatio, zNear, zFar)
function perspective(fovy,ar,zn,zf,x,y){
	return y=zn*Math.tan(fovy*Math.PI/360),
	       x=y*ar,frustum(-x,x,-y,y,zn,zf)
}

// gluLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ)
function lookAt(ex,ey,ez,cx,cy,cz,ux,uy,uz,c,u,x,y,z){
	return c=[cx,cy,cz],
	       u=[ux,uy,uz],
	       z=v1([ex-cx,ey-cy,ez-cz]),
	       x=v1(vX(u,z)),y=v1(vX(z,x)),
	       [x[0],y[0],z[0],0,
	        x[1],y[1],z[1],0,
	        x[2],y[2],z[2],0,
	        0,0,0,1]
}

// create shader
// $sh(domelement)
function $sh(el,s){
	s=g.createShader(/frag/.test(el.type)?g.FRAGMENT_SHADER:g.VERTEX_SHADER)
	g.shaderSource(s,el.textContent)
	g.compileShader(s)
	if (!g.getShaderParameter(s, g.COMPILE_STATUS)) {
		throw Error(el.id+": "+g.getShaderInfoLog(s))
	}
	return s
}

// create or switch shader program
// define: $prog(glContext, array of shader dom elements, [array of attributes])
// switch: $prog(glContext, program, [obj of uniforms], [obj of buffers])
function $prog(g,s,a,c,p,P,i){
	window.g=g
	P="Program"
	if(/WebGLProgram/.test(s)){
		// switch program
		g["use"+P](window.p=s)
		if(a&&a.length)for(i=a.length;i--;)$attr(a[i])
		return p
	}
	// define program
	p=g["create"+P]()
	s.map(function(s){g.attachShader(p,$sh(s))})
	g["link"+P](p)
	g["use"+P](p)
	// pollute the global namespace a bit.
	window.p=p
	// set attributes
	if(a&&a.length)for(i=a.length;i--;)$attr(a[i])
	return p
}

// create buffer
// $buf([1,0,1,0,...])
function $buf(v,b){
	b=g.createBuffer()
	g.bindBuffer(g.ARRAY_BUFFER, b)
	g.bufferData(g.ARRAY_BUFFER, new Float32Array(v), g.STATIC_DRAW)
	return b
}

// get reference to Attribute
// $attr("name")
function $attr(l,r){
	return r=g.getAttribLocation(p, l),g.enableVertexAttribArray(r),r
}

function $attrOff(l,r){
	return r=g.getAttribLocation(p, l),g.disableVertexAttribArray(r),r
}


// bind attribute to buffer
// $bind(attr, buffer)
function $bind(a,b,s,t,n) {
	t=t||g.FLOAT
	n=n||false
	g.bindBuffer(g.ARRAY_BUFFER,b)
	g.vertexAttribPointer(typeof a=="string"?g.getAttribLocation(p,a):a,s,t,n,0,0)
}

// set uniform matrix
function $uniM(n,d,l){
	l=g.getUniformLocation(p,n)
	g["uniformMatrix"+sqrt(d.length)+"fv"](l,false,new Float32Array(d))
	return l
}

// set uniform vector
function $uniV(n,d,l){
	l=g.getUniformLocation(p,n)
	g["uniform"+d.length+"fv"](l,new Float32Array(d))
	return l
}

// set uniform float
function $uni(n,d,l){
	l=g.getUniformLocation(p,n)
	if(typeof(d)=="number")g.uniform1f(l,d)
	return l
}

// Create texture from image
function $tex2d(img,p,i,t){
	p=p||[
		g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE,
		g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE,
		g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR,
		g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR
	]
	t=g.createTexture()
	g.bindTexture(g.TEXTURE_2D,t)
	for(i=(p.length/3)|0;i--;)gl.texParameteri(p[i*3],p[i*3+1],p[i*3+2])
	g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, img)
}

// load images, call back f(u) when ready
function $load(u,f,i,j,k){
	for(k=j=u.length;j--;)
		i=new Image(),
		i.src=u[j],
		i.onload=function(){if(!--k)f(u)},
		u[j]=i
}

