w=a.width=innerWidth
h=a.height=innerHeight
g=a.getContext('webgl')||a.getContext('experimental-webgl')
g.enable(g.DEPTH_TEST)
g.enable(g.CULL_FACE)
g.depthFunc(g.LEQUAL)

$prog(g,[vertexShader,fragmentShader])
pos=$attr("pos")
diceBuf=$buf([-1,-1,-1, -1,-1, 1, -1, 1, 1,
               1, 1,-1, -1,-1,-1, -1, 1,-1, 
               1,-1, 1, -1,-1,-1,  1,-1,-1,
               1, 1,-1,  1,-1,-1, -1,-1,-1,
              -1,-1,-1, -1, 1, 1, -1, 1,-1,
               1,-1, 1, -1,-1, 1, -1,-1,-1,
              -1, 1, 1, -1,-1, 1,  1,-1, 1,
               1, 1, 1,  1,-1,-1,  1, 1,-1,
               1,-1,-1,  1, 1, 1,  1,-1, 1,
               1, 1, 1,  1, 1,-1, -1, 1,-1,
               1, 1, 1, -1, 1,-1, -1, 1, 1,
               1, 1, 1, -1, 1, 1,  1,-1, 1])
color=$attr("color")
colors=[]
for(i=36;i--;){
	Array.prototype.push.apply(colors, [
		[1,0,0],
		[1,1,0],
		[0,1,0],
		[0,1,1],
		[0,0,1],
		[1,0,1],
		[1,1,1]
	][i%7])
}
colorBuf=$buf(colors)
P=perspective(45,w/h,0.1,1000)

~function scene(time) {
	time/=1e3

	// clear screen
	g.clearColor(1/5,1/5,1/5,1)
	g.clear(g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT)

	// draw dice
	MV=mT(-1.5,0,-7)
	MR=mX(mX(mRx(time*3),mRy(time*2)),mRz(time*0.2))
	$bind(pos,diceBuf,3)
	$bind(color,colorBuf,3)
	// set uniforms
	$uni("time",time)
	$uniV("resolution",[w,h])
	$uniM("MV",MV)
	$uniM("MR",MR)
	$uniM("P",P)
	g.drawArrays(g.TRIANGLE_STRIP,0,36)
	requestAnimationFrame(scene)
}(0)
