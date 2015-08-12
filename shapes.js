w=a.width=innerWidth
h=a.height=innerHeight
g=a.getContext('webgl')||a.getContext('experimental-webgl')
g.enable(g.DEPTH_TEST)
g.depthFunc(g.LEQUAL)

$prog(g, [vertexShader, fragmentShader])
pos = $attr("pos")
triBuf = $buf([0,1,0,-1,-1,0,1,-1,0])
quadBuf = $buf([1,1,0,-1,1,0,1,-1,0,-1,-1,0])
uP=perspective(45,w/h,0.1,100)
uMV=mI()



~function scene(time) {
	time/=1e3
	unis=function(){
		$uni("time", time)
		$uniV("resolution", [w,h])
		$uniM("uMV", uMV)
		$uniM("uP", uP)
	}
	// clear screen
	g.clearColor(1/5, 1/5, 1/5, 1)
	g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT)

	// draw trigon
	uMV=mT(-1.5,0,-7)
	$bind(pos,triBuf,3)
	unis()
	g.drawArrays(g.TRIANGLE_STRIP,0,3)

	// draw square
	uMV=mT(1.5,0,-7)
	$bind(pos,quadBuf,3)
	unis()
	g.drawArrays(g.TRIANGLE_STRIP,0,4)

	requestAnimationFrame(scene)
}(0)
