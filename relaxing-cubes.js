concat=function(x,y){return Array.prototype.push.apply(x,y),x}
w=a.width=innerWidth
h=a.height=innerHeight
g=a.getContext('webgl')||a.getContext('experimental-webgl')
g.enable(g.DEPTH_TEST)

// background	
p1=$prog(g,[vs1,fs1])
bkgBuf=$buf(sq(32))

// foreground
p2=$prog(g,[vs2,fs2])
diceBuf=$buf(qb(0.44))
P=perspective(45,w/h,0.1,100)

~function scene(time,m,i,j) {
	time/=1e3
	// clear screen
	g.clearColor(1/5,1/5,1/5,1)
	g.clear(g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT)

	// program 1
	$prog(g,p1)
	$attr("pos")
	$bind("pos",bkgBuf,3)
	$uni("time",time)
	$uniV("resolution",[w,h])
	$uniM("M",mX(P, mT(0,0,-15)))
	g.drawArrays(g.TRIANGLE_STRIP,0,4)
	$attrOff("pos")
	
	// program 2
	$prog(g,p2) 
	$attr("pos")
	$bind("pos", diceBuf,3)
	// set uniforms
	$uni("time",time)
	$uniV("resolution",[w,h])
	for(i=10;i--;)for(j=10;j--;) // 10x10 cubes
		m=mX(P,mT(0,0,-10)),// translate
		m=mX(m,mT((-5+i)*2+sin(time+(i+j)*0.3)+sin(time),(-5+j)*2+cos(time+(i+j)*0.3),sin(i+j+time)*4.5)), // translate
		m=mX(m,mRz(time+(i+j)*0.2)), // rotate around z-axis
		m=mX(m,mRy((time+i+j)*0.2)), // rotate around y-axis
		$uniM("M",m),
		g.drawArrays(g.TRIANGLES,0,36)
	$attrOff("pos")
	requestAnimationFrame(scene)
}(0)
