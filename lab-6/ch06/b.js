"use strict";

const { vec3, vec4, mat3, mat4 } = glMatrix;

var canvas;
var gl;
var lightPosition = vec4.fromValues(1.0, 1.0, 1.0, 0.0);
var lightAmbient = vec4.fromValues(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4.fromValues(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4.fromValues(0.5, 0.0, 0.8, 1.0);
var materialDiffuse = vec4.fromValues(0.5, 1.0, 0.8, 1.0);
var materialSpecular = vec4.fromValues(0.0, 0.8, 1.0, 1.0);
var materialShininess = 100.0;
var numOfSubdivides = 2;

var points = [];
var index = 0;

var va = vec4.fromValues(0.0, 0.0, -1.0,1);
var vb = vec4.fromValues(0.0, 0.942809, 0.333333, 1);
var vc = vec4.fromValues(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4.fromValues(0.816497, -0.471405, 0.333333,1);

var vertexLoc = 0;
var normalLoc = 0;

var ambientProdLoc = 0;
var diffuseProdLoc = 0;
var specularProdLoc = 0;

var modelViewMatrix = mat4.create();
var projectionMatrix = mat4.create();
var modelViewMatrixLoc = 0;
var projectionMatrixLoc = 0;

var lightPositionLoc = 0;
var shininessLoc = 0;

var normalMatrix = mat3.create()
var normalMatrixLoc = 0;

var near = -10;
var far = 10;
var radius = 1.5;
var theta = 0.0;
var phi = 0.0;
var stept = 5.0 * Math.PI / 180.0;
var stepm = 0.1;

var left = -5.0;
var right = 5.0;
var ytop = 5.0;
var bottom = -5.0;

var eye = vec3.create();
var at = vec3.fromValues(0.0, 0.0, 0.0);
var up = vec3.fromValues(0.0, 1.0, 0.0);

var program;

var points = [];
var normals = [];
var index = 0;

var vBuffer = null;
var nBuffer = null;
var currentKey = [];
// move object
function handleKeyDown() {
    var key = event.keyCode;
    currentKey[key] = true;
    //console.log(key);
    switch (key) {
        case 65: //left//a
            theta += stept;
            break;
        case 68: // right//d
            theta -= stept;
            break;
        case 87: // up//w
            phi += stept;
            break;
        case 83: // down//s
            phi -= stept;
            break;
        case 90: // a//z
            radius += stepm;
            break;
        case 88: // d//x
            radius -= stepm;
            break;
        case 82: // r//reset
            theta = 0.0;
            phi = 0.0;
            radius = 0.0;
            break;
        case 86: // v //increase divide
            numOfSubdivides++;
            index = 0;
            points = [];
            normals = [];
            initSphere();
            initShaderBuffers();
            break;
        case 66: // b  //decrease divide
            if (numOfSubdivides)
                numOfSubdivides--;
            index = 0;
            points = [];
            normals = [];
            initSphere();
            initShaderBuffers();
            break;
    }
    requestAnimFrame(render);
}

function handleKeyUp() {
    currentKey[event.keyCode] = false;
}

function triangle(a, b, c) {
    points.push(a[0], a[1], a[2], a[3]);
    points.push(b[0], b[1], b[2], b[3]);
    points.push(c[0], c[1], c[2], c[3]);
    normals.push( a[0], a[1], a[2], 0.0 );
    normals.push( b[0], b[1], b[2], 0.0 );
    normals.push( c[0], c[1], c[2], 0.0 );
    index += 3;
    // var t1 = vec4.create();
    // vec4.subtract(t1, b, a);
    // var t2 = vec4.create();
    // vec4.subtract(t2, c, a)
    
    // var n = vec4.create();
    // var n1 = vec3.create();
    // vec3.cross(n1, vec3.fromValues(t1[0], t1[1], t1[2]), vec3.fromValues(t2[0], t2[1], t2[3]));
    // vec3.normalize(n1, n1);
    // vec4.set(n, n1[0], n1[1], n1[2], 0.0);

    // normals.push(n[0], n[1], n[2], 0.0);
    // normals.push(n[0], n[1], n[2], 0.0);
    // normals.push(n[0], n[1], n[2], 0.0);
    // index += 3;
    index += 3;
}

function divideTriangle(a, b, c, n) {
    if (n > 0) {
        var ab = vec4.create();
        vec4.lerp(ab, a, b, 0.5);
        var abt = vec3.fromValues(ab[0], ab[1], ab[2]);
        vec3.normalize(abt, abt);
        vec4.set(ab, abt[0], abt[1], abt[2], 1.0);

        var bc = vec4.create();
        vec4.lerp(bc, b, c, 0.5);
        var bct = vec3.fromValues(bc[0], bc[1], bc[2]);
        vec3.normalize(bct, bct);
        vec4.set(bc, bct[0], bct[1], bct[2], 1.0);

        var ac = vec4.create();
        vec4.lerp(ac, a, c, 0.5);
        var act = vec3.fromValues(ac[0], ac[1], ac[2]);
        vec3.normalize(act, act);
        vec4.set(ac, act[0], act[1], act[2], 1.0);

        divideTriangle(a, ab, ac, n - 1);
        divideTriangle(ab, b, bc, n - 1);
        divideTriangle(bc, c, ac, n - 1);
        divideTriangle(ab, bc, ac, n - 1);
    } else {
        triangle(a, b, c);
    }
}

function divideTetra(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}

function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.width);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    vertexLoc = gl.getAttribLocation(program, "vPosition");
    normalLoc = gl.getAttribLocation(program, "vNormal");

    ambientProdLoc = gl.getUniformLocation(program, "ambientProduct");
    diffuseProdLoc = gl.getUniformLocation(program, "diffuseProduct");
    specularProdLoc = gl.getUniformLocation(program, "specularProduct");

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");

    lightPositionLoc = gl.getUniformLocation(program, "lightPosition");
    shininessLoc = gl.getUniformLocation(program, "shininess");
    //setupShaders();
    initSphere();
    initBuffers();
    initShaderBuffers();

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    render();
}
function initSphere() {
    divideTetra(va, vb, vc, vd, numOfSubdivides);
}

function initBuffers() {
    vBuffer = gl.createBuffer();
    nBuffer = gl.createBuffer();
}

function initShaderBuffers() {
    // 初始化着色器内存
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    //vertexLoc = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vertexLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexLoc);

    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    //normalLoc = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(normalLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //gl.linkProgram( program );
    var ambientProduct = vec4.create();
    vec4.multiply(ambientProduct, lightAmbient, materialAmbient);

    var diffuseProduct = vec4.create();
    vec4.multiply(diffuseProduct, lightDiffuse, materialDiffuse);

    var specularProduct = vec4.create();
    vec4.multiply(specularProduct, lightSpecular, materialSpecular);

    vec3.set(eye, radius * Math.sin(theta) * Math.cos(phi),radius * Math.sin(theta) * Math.sin(phi),radius * Math.cos(theta));

    mat4.lookAt(modelViewMatrix, eye, at, up);
    mat4.ortho(projectionMatrix, left, right, bottom, ytop, near, far);

    mat3.fromMat4(normalMatrix, modelViewMatrix);

    gl.uniform4fv(ambientProdLoc, new Float32Array(ambientProduct));
    gl.uniform4fv(diffuseProdLoc, new Float32Array(diffuseProduct));
    gl.uniform4fv(specularProdLoc, new Float32Array(specularProduct));
    gl.uniform4fv(lightPositionLoc, new Float32Array(lightPosition));
    gl.uniform1f(shininessLoc, materialShininess);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, new Float32Array(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, new Float32Array(projectionMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, new Float32Array(normalMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, points.length / 4);
   // requestAnimFrame(render);
}