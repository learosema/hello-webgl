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
diceBuf=$buf(qb())
P=perspective(45,w/h,0.1,100)

~function scene(time,m) {
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
	// create transformation/rotation matrix
	// mX is matrix multiplication, mT is transformation, mR* is rotatio
	$uniM("M",mX(P,mX(mT(sin(time*2)*3,cos(time*3)*1.5,sin(time)*5-10),
	          mX(mX(mRx(time*0.1),mRy(time*4)),mRz(time*0.6)))))
	g.drawArrays(g.TRIANGLES,0,36)
	$attrOff("pos")

	requestAnimationFrame(scene)
}(0)
