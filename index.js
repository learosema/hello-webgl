g=a.getContext('webgl')
g.clearColor(0,0,0,1)
g.enable(g.DEPTH_TEST)
g.depthFunc(g.LEQUAL)
//See also: http://www.displayhack.org/2011/superpacking-js-demos/

//gluPerspective
function gP(fovy, ar,zn, zf, x,y){
	return y=zn*Math.tan(fovy*Math.PI/360),x=y*ar,gF(-x,x,-y,y,zn,zf)
}
//glFrustum
function gF(l,r,b,t,zn,zf,t1,t2,t3,t4){
	return t1=2*zn,t2=r-l,t3=t-b,t4=zf-zn,[t1/t2,0,0,0,0,t1/t3,0,0,(r+l)/t2,(t+b)/t3,(-zf-zn)/t4,-1,0,0,(-t1*zf)/t4,0]
}
//glOrtho
function gO(l,r,b,t,zn,zf,tx,ty,tz){
    return tx=-(r+l)/(r-l),ty=-(t+b)/(t-b),tz=-(zf+zn)/(zf-zn),[2/(r-l),0,0,0,0,2/(t-b),0,0,0,0,-2/(zf-zn),0,tx,ty,tz,1]
}
//Identity Matrix
function I(x){
	return ((x=1e4+"")+x+x+1).split('')
}
//Transformation Matrix
function T(x,y,z,r){
	return r=I(),r.splice(12,3,x,y,z),r;
}
//Matrix multiplication
function MX(a,b,c,i,j,k){
	c=[]
	for(i=4;i--;)
		for(k=4;k--;)
			for(j=4;j--;){
				if (!c[i+k*4])c[i+k*4]=0
				c[i+k*4]+=a[i+j*4]*b[j+k*4]
			}
	return c
}
//Vector cross product
function VX(a,b){
	return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
}
//Vector length
function VL(v){
	return Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2])
}
//Unit vector
function V1(v){
	return l=VL(v),[v[0]/l,v[1]/l,v[2]/l]
}

//gluLookAt
function gLA(ex,y,ez,cx,cy,cz,ux,uy,uz,c,u,x,y,z){
	return c=[cx,cy,cz],u=[ux,uy,uz],z=V1([ex-cx,ey-cy,ez-cz]),x=V1(VX(u,z)),y=V1(VX(z,x)),[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,0,0,0,1]
}

function $(el,s){
	s=g.createShader(/frag/.test(el.type)?g.FRAGMENT_SHADER:g.VERTEX_SHADER)
	g.shaderSource(s,el.textContent)
	g.compileShader(s)
	if (!g.getShaderParameter(s, g.COMPILE_STATUS)) {
		throw Error(g.getShaderInfoLog(s))
	}
	return s
}
function B(v,b){
	b=g.createBuffer()
	g.bindBuffer(g.ARRAY_BUFFER, b)
	g.bufferData(g.ARRAY_BUFFER, new Float32Array(v), g.STATIC_DRAW)
	return b
}
p=g.createProgram()
g.attachShader(p,$(vs))
g.attachShader(p,$(fs))
g.linkProgram(p)
g.useProgram(p)
vp=g.getAttribLocation(p, "aVertexPosition")
g.enableVertexAttribArray(vp)
vc=g.getAttribLocation(p, "aVertexColor")
g.enableVertexAttribArray(vc)
b=B([1,1,0,-1,1,0,1,-1,0,-1,-1,0])
c=B("1111100101010011".split(""))
g.clear(g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT)
pM = gP(45,4/3,.1,100)
mVM = T(0,0,-6)
g.bindBuffer(g.ARRAY_BUFFER, b)
g.vertexAttribPointer(vp,3,g.FLOAT,false,0,0)
g.bindBuffer(g.ARRAY_BUFFER, c)
g.vertexAttribPointer(vc, 4, g.FLOAT,false,0,0)
g.uniformMatrix4fv(uPM=g.getUniformLocation(p,"uPMatrix"), false, new Float32Array(pM))
g.uniformMatrix4fv(uMVM=g.getUniformLocation(p,"uMVMatrix"), false, new Float32Array(mVM))
g.drawArrays(g.TRIANGLE_STRIP,0,4)

