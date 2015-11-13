concat=function(x,y){return Array.prototype.push.apply(x,y),x}
w=a.width=innerWidth
h=a.height=innerHeight
g=a.getContext('webgl')||a.getContext('experimental-webgl')
g.enable(g.DEPTH_TEST)
p1=$prog(g,[vs1,fs1],["pos","color"])
diceBuf=$buf(qb())
colors=[]
for(i=36;i--;)
	concat(colors,[
		[1,0,0],
		[1,1,0],
		[0,1,0],
		[0,1,1],
		[0,0,1],
		[1,0,1],
		[1,1,1]
	][i%7])
colorBuf=$buf(colors)
P=perspective(45,w/h,0.1,1000)

p2=$prog(g,[vs2,fs2],["pos"])
bkgBuf=$buf(sq())
$bind("pos",bkgBuf,3)
~function scene(time) {
	time/=1e3
	$prog(g,p1)
	$bind("pos",diceBuf,3)
	$bind("color",colorBuf,3)
	// clear screen
	g.clearColor(1/5,1/5,1/5,1)
	g.clear(g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT)
	// create transformation/rotation matrix
	// mX is matrix multiplication, mT is transformation, mR* is rotation 
	M=mX(P,mX(mT(sin(time*2)*3,cos(time*3)*1.5,sin(time)*5-10),
	     mX(mX(mRx(time*3.5),mRy(time*2)),mRz(time*1.6))))

	// set uniforms
	$uni("time",time)
	$uniV("resolution",[w,h])
	$uniM("M",M)
	g.drawArrays(g.TRIANGLES,0,36)
	requestAnimationFrame(scene)
}(0)
