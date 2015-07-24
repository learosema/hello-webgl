w=a.width=innerWidth
h=a.height=innerHeight
g=a.getContext('webgl')
g.enable(g.DEPTH_TEST)
g.depthFunc(g.LEQUAL)

p                    = $prog(g, [vertexShader, fragmentShader])
positionBuffer       = $buf([1,1,0,-1,1,0,1,-1,0,-1,-1,0])
aVertexPosition      = $attr("aVertexPosition")


~function drawScene(time) {
	time=time*1e-3
	pM = perspective(45, 4/3, 0.1, 100)
	mVM = mT(0, 0, -6)
	
	// clear screen
	g.clearColor(1/5, 1/5, 1/5, 1)
	g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT)

	// bind attributes to buffers
	$bind(aVertexPosition, positionBuffer, 3)
	
	// set uniforms
	$uni("time", time)
	$uniV("resolution", [w,h])

	// draw
	g.drawArrays(g.TRIANGLE_STRIP,0,4)
	requestAnimationFrame(drawScene)
}(0)
