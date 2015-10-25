w=a.width=innerWidth
h=a.height=innerHeight
g=a.getContext('webgl')||a.getContext('experimental-webgl')
g.enable(g.DEPTH_TEST)
g.depthFunc(g.LEQUAL)

$prog(g, [vertexShader, fragmentShader])
posBuf = $buf([1,1,0,-1,1,0,1,-1,0,-1,-1,0])
pos = $attr("pos")


~function scene(time) {
	time=time*1e-3

	// clear screen
	g.clearColor(1/5, 1/5, 1/5, 1)
	g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT)

	// bind attributes to buffers
	$bind(pos, posBuf, 3)
	
	// set uniforms
	$uni("time", time)
	$uniV("resolution", [w,h])

	// draw
	g.drawArrays(g.TRIANGLE_STRIP,0,4)
	requestAnimationFrame(scene)
}(0)
