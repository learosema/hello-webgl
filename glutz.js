// glutz.js - minimal gl utils - (c)2015 Lutz Rosema
// License: WTFPL v2.0
//
// Provides some simple helper functions for webgl.
//
// Includes sugar around the WebGL API, vector/matrix operations
// and perspective utility functions.
//
// Notice:
// 1. Fun project with esoteric coding style. Mean ugly dirty code by design :D
// 2. Excerpts of it might be useful for #js1k/#js13kgames projects.
// 3. Work in progress, far from complete.

// Square Root
sR=Math.sqrt

// Identity Matrix
function mI(x){
	return ((x=1e4+"")+x+x+1).split('')
}

// Transformation Matrix
function mT(x,y,z,r){
	return r=mI(),r.splice(12,3,x,y,z),r
}

// Matrix multiplication
function mX(a,b,c,i,j,k,l){c=[]
	for(i=l=sR(a.length)|0;i--;)
		for(k=l;k--;)
			for(j=l;j--;){
				if (!c[i+k*l])c[i+k*l]=0
				c[i+k*l]+=a[i+j*l]*b[j+k*l]
			}
	return c
}

// Vector cross product
function vX(a,b){
	return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
}

// Vector length
function vL(v){
	return sR(v[0]*v[0]+v[1]*v[1]+v[2]*v[2])
}

// Unit vector
function v1(v){
	return l=vL(v),[v[0]/l,v[1]/l,v[2]/l]
}

// glOrtho(left, right, bottom, top, zNear, zFar)
function ortho(l,r,b,t,zn,zf,tx,ty,tz){
	return tx=-(r+l)/(r-l),ty=-(t+b)/(t-b),tz=-(zf+zn)/(zf-zn),
		[2/(r-l),0,0,0,0,2/(t-b),0,0,0,0,-2/(zf-zn),0,tx,ty,tz,1]
}

// glFrustum(left, right, bottom, top, zNear, zFar)
function frustum(l,r,b,t,zn,zf,t1,t2,t3,t4){
	return t1=2*zn,t2=r-l,t3=t-b,t4=zf-zn,
		[t1/t2,0,0,0,0,t1/t3,0,0,(r+l)/t2,(t+b)/t3,(-zf-zn)/t4,-1,0,0,(-t1*zf)/t4,0]
}

// gluPerspective(fieldOfView, aspectRatio, zNear, zFar)
function perspective(fovy,ar,zn,zf,x,y){
	return y=zn*Math.tan(fovy*Math.PI/360),x=y*ar,frustum(-x,x,-y,y,zn,zf)
}

// gluLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ)
function lookAt(ex,ey,ez,cx,cy,cz,ux,uy,uz,c,u,x,y,z){
	return c=[cx,cy,cz],u=[ux,uy,uz],z=v1([ex-cx,ey-cy,ez-cz]),
		x=v1(vX(u,z)),y=v1(vX(z,x)),
		[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,0,0,0,1]
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

// create program
// $prog(glContext, [array of shader dom elements])
function $prog(g,s,p,P){
	P="Program"
	p=g["create"+P]()
	s.map(function(s){g.attachShader(p,$sh(s))})
	for(i=s.length;i--;)
	g["link"+P](p)
	g["use"+P](p)
	// pollute the global namespace a bit.
	// yes, this is dirty. ;)
	window.g=g
	window.p=p
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

// bind attribute to buffer
// $bind(attr, buffer)
function $bind(a,b,s,t,n) {
	t=t||g.FLOAT
	n=n||false
	g.bindBuffer(g.ARRAY_BUFFER,b)
	g.vertexAttribPointer(a,s,t,n,0,0)
}

// set uniform matrix
function $uniM(n,d,l){
	l=g.getUniformLocation(p,n)
	g["uniformMatrix"+sR(d.length)+"fv"](l,false,new Float32Array(d))
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
