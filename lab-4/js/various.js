"use strict";

var canvas;
var gl;

var variousIndex;
var maxNum = 100;

// draw triangle
var triangleIndex = 0;
var Tmove = [];
// draw square
var squareIndex = 0;
var Smove = [];
// draw cube
var cubeIndex = 0;
var Cmove = [];
// draw circle
var circleIndex = 0;
var sideNum;
var Rmove = [];
var rRmove = [];
var circleVertex = [];
var circleColors = [];

var moveLoc;
var zoom = 0.0;
var zoomLoc;
var theta = 0.0;
var thetaLoc;

var points = [
	// triangle points
	0.0, 0.2, 0.0,
	-0.17, -0.1, 0.0,
	0.17, -0.1, 0.0,	
	
	// square points
	0.0, 0.2, 0.0, 
	-0.2, 0.0, 0.0,
	0.2, 0.0, 0.0,
	0.0, -0.2, 0.0,
	
	// cube points makeCube()
];
var colors = [
	// triangle colors
	0.9, 0.4, 0.7, 1.0,
	0.3, 0.6, 0.5, 1.0,
	0.7, 0.8, 0.3, 1.0,
	
	// square colors
	0.9, 0.4, 0.5, 1.0,
	0.6, 0.8, 0.5, 1.0,
	0.8, 0.3, 0.4, 1.0,
	0.6, 0.7, 0.7, 1.0,
	
	//cube colors makeCube()
];


window.onload = function initWindow(){
	var controls = document.getElementById("controls");
	for(var i=0;i<controls.length;i++){
		if(controls[i].selected){
			console.log(i);
			variousIndex = i;
			break;
		}
	}
	
	sideNum = document.getElementById("sideSel").value * 3;
	
	canvas = document.getElementById("various-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
	    alert("WebGL isn't available");
	}
	
	makeCube();
	
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.7, 0.7, 0.7, 1.0);
	
	gl.enable(gl.DEPTH_TEST);
	
	var program = initShaders(gl, "v-shader", "f-shader");
	gl.useProgram(program);
	
	zoomLoc = gl.getUniformLocation(program, "zoom");
	moveLoc = gl.getUniformLocation(program, "move");
	thetaLoc = gl.getUniformLocation(program, "theta");
	
	reBuffer();
			
	function reBuffer(){
		var vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points.concat(circleVertex)), gl.STATIC_DRAW);
		
		var vPosition = gl.getAttribLocation(program, "vPosition");
		gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);
		
		var cBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors.concat(circleColors)), gl.STATIC_DRAW);
		
		var vColor = gl.getAttribLocation(program, "vColor");
		gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vColor);		
	}
	
	document.getElementById("controls").onchange = function(event){
		var id = parseInt(event.target.value);
		switch(id){
		  case 0:
			// console.log("0");
			variousIndex = 0;
			break;
		  case 1:
			// console.log("1");
			variousIndex = 1;
			break;
		  case 2:
			// console.log("2");
			variousIndex = 2;
			break;  
		  case 3:
			// console.log("3");
			variousIndex = 3;
			break;
		}
	};
	
	canvas.addEventListener("mousedown", function(event){
		var rect = canvas.getBoundingClientRect();
		var cx = event.clientX - rect.left;
		var cy = event.clientY - rect.top; // offset
		var NCx = 2 * cx / canvas.width - 1;
		var NCy = 2 * (canvas.height - cy) / canvas.height - 1;
		if(variousIndex == 0){
			triangleCreate(NCx, NCy);	
		}else if(variousIndex == 1){
			squareCreate(NCx, NCy);
		}else if(variousIndex == 2){
			cubeCreate(NCx, NCy);
		}else if(variousIndex == 3){
			Rmove.push([NCx, NCy]);
			rRmove.push([NCx, NCy]);
			circleCreate();
		}
	});
	
	document.getElementById("clearButton").onclick = function(){
		Tmove = [];
		Smove = [];
		Cmove = [];
		Rmove = [];
		rRmove = [];
		triangleIndex = 0;
		squareIndex = 0;
		cubeIndex = 0;
		circleIndex = 0;
	};
	
	document.getElementById("sideSel").onchange = function(){
		sideNum = document.getElementById("sideSel").value * 3;
		circleIndex--;
		circleCreate();
	}
	
	render();

	function triangleCreate(x, y){
		Tmove.push([x, y]);
		triangleIndex++;
	}
	
	function squareCreate(x, y){
		Smove.push([x, y]);
		squareIndex++;
	}

	function cubeCreate(x, y){
		Cmove.push([x, y]);
		cubeIndex++;
	}
	
	function circleCreate(){
		circleIndex++;
		circleVertex = [];
		circleColors = [];
		var alpha = 2 * Math.PI / sideNum;
		circleVertex.push(0.0, 0.0, 0.0);
		circleColors.push(1.0, 0.9, 0.5, 1.0);
		for(var i=0;i<=sideNum;i++){
			circleVertex.push(0.2 * Math.cos(Math.PI-alpha*i), 0.2 * Math.sin(Math.PI-alpha*i), 0.0);
			circleColors.push(1.0, 0.9, 0.5, 1.0);
		}
		reBuffer();
	}
}

function render(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	triangleRender();
	squareRender();
	cubeRender();
	circleRender();
	requestAnimFrame(render);
}

function triangleRender(){
	zoom -= 0.01;
	if(zoom < -0.5) zoom = 0.0;
	gl.uniform2fv(zoomLoc, [zoom, zoom]);
	gl.uniform2fv(thetaLoc, [0.0, 0.0]);
	for(var i=0;i<triangleIndex;i++){
		gl.uniform2fv(moveLoc, Tmove[i]);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}	
}

function squareRender(){
	theta += 0.1;
	if(theta>2 * Math.PI)
		theta -= (2 * Math.PI);
	gl.uniform2fv(thetaLoc, [0.0, theta]);
	gl.uniform2fv(zoomLoc, [0.0, 0.0]);
	for(var i=0;i<squareIndex;i++){
		gl.uniform2fv(moveLoc, Smove[i]);
		gl.drawArrays(gl.TRIANGLE_STRIP, 3, 4);
	}
}

function cubeRender(){
	theta += 0.02;
	gl.uniform2fv(thetaLoc, [theta, theta]);
	gl.uniform2fv(zoomLoc, [0.0, 0.0]);
	for(var i=0;i<cubeIndex;i++){
		gl.uniform2fv(moveLoc, Cmove[i]);
		gl.drawArrays(gl.TRIANGLES, 7, 36);
	}
}

function circleRender(){
	gl.uniform2fv(thetaLoc, [0.0, 0.0]);
	gl.uniform2fv(zoomLoc, [0.0, 0.0]);
	for(var i=0;i<circleIndex;i++){
		rRmove[i][0] += Math.random()/10 - 0.05;
		rRmove[i][1] += Math.random()/10 - 0.05;		
		if(rRmove[i][0] > 1 || rRmove[i][0] < -1 || rRmove[i][1] > 1 || rRmove[i][1] < -1){
			rRmove[i][0] -= rRmove[i][0]/5;
			rRmove[i][1] -= rRmove[i][1]/5;
		}
		gl.uniform2fv(moveLoc, rRmove[i]);
		gl.drawArrays(gl.TRIANGLE_FAN, 43, sideNum+2);
	}
}

function makeCube(){
	var vertices = [
		glMatrix.vec4.fromValues(-0.1, -0.1,  0.1, 1.0),
		glMatrix.vec4.fromValues(-0.1,  0.1,  0.1, 1.0),
		glMatrix.vec4.fromValues( 0.1,  0.1,  0.1, 1.0),
		glMatrix.vec4.fromValues( 0.1, -0.1,  0.1, 1.0),
		glMatrix.vec4.fromValues(-0.1, -0.1, -0.1, 1.0),
		glMatrix.vec4.fromValues(-0.1,  0.1, -0.1, 1.0),
		glMatrix.vec4.fromValues( 0.1,  0.1, -0.1, 1.0),
		glMatrix.vec4.fromValues( 0.1, -0.1, -0.1, 1.0)
	];
	
	var vertexColors = [
		glMatrix.vec4.fromValues(0.0, 0.0, 0.0, 1.0),  
		glMatrix.vec4.fromValues(1.0, 0.0, 0.0, 1.0),
		glMatrix.vec4.fromValues(1.0, 1.0, 0.0, 1.0), 
		glMatrix.vec4.fromValues(0.0, 1.0, 0.0, 1.0), 
		glMatrix.vec4.fromValues(0.0, 0.0, 1.0, 1.0),  
		glMatrix.vec4.fromValues(1.0, 0.0, 1.0, 1.0),
		glMatrix.vec4.fromValues(1.0, 1.0, 1.0, 1.0),  
		glMatrix.vec4.fromValues(0.0, 1.0, 1.0, 1.0)   
	];
	
	var faces = [
			1, 0, 3, 3, 2, 1,
			
			2, 3, 7, 7, 6, 2,
			
			3, 0, 4, 4, 7, 3,
			
			6, 5, 1, 1, 2, 6,
			
			4, 5, 6, 6, 7, 4,
			
			5, 4, 0, 0, 1, 5
			
	];

	for (var i = 0; i < faces.length; i++) {
		points.push(vertices[faces[i]][0], vertices[faces[i]][1], vertices[faces[i]][2]);
		colors.push(vertexColors[Math.floor(i / 6)][0], vertexColors[Math.floor(i / 6)][1], vertexColors[Math.floor(i / 6)][2], vertexColors[Math.floor(i / 6)][3]);
	}	
}
