"use strict";

const{ vec3, vec4, mat3, mat4, quat } = glMatrix;

var canvas;
var gl;
var fileInput;

var meshdata;
var mesh;

var points = [];
var colors = [];
var acolor = [];
var lineIndex = [];

var clearColor = vec4.fromValues( 0.0, 1.0, 1.0, 1.0 );

var color;

var vBuffer = null;
var vPosition = null;
var cBuffer = null;
var vColor = null;
var iBuffer = null;

var lineCnt = 0;

var oleft = -3.0;
var oright = 3.0;
var oytop = 3.0;
var oybottom = -3.0;
var onear = -5;
var ofar = 10;

var stept =2;

var oradius = 3.0;
var theta = 0.0;
var phi = 0.0;

var pleft = -10.0;
var pright = 10.0;
var pytop = 10.0;
var pybottom = -10.0;
var pnear = 0.01;
var pfar = 20;
var pradius = 3.0;

var fovy = 45.0 * Math.PI/180.0;
var aspect;

/* dx, dy, dz: the position of object */
var dx = 0;
var dy = 0;
var dz = 0;
var step = 0.1;

var dtx = 0;
var dty = 0;
var dtz = 0;

var dxt = 0;
var dyt = 0;
var dzt = 0;
var stept = 2;

// scale
var sx = 1;
var sy = 1;
var sz = 1;

/* cx, cy, cz: the position of camera */
var cx = 0.0;
var cy = 0.0;
var cz = 4.0;
var stepc = 0.1;

var cxt = 0;
var cyt = 0;
var czt = 0;
var stepct = 2;

var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var eye = vec3.fromValues(cx, cy, cz);

var at = vec3.fromValues(0.0, 0.0, 0.0);
var up = vec3.fromValues(0.0, 1.0, 0.0);

var rquat = quat.create();

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

var currentKey = [];


var vertexLoc = null;
var normalLoc = null;

var materialKaLoc = null;
var materialKdLoc = null;
var materialKsLoc = null;

var ambientProdLoc = null;
var diffuseProdLoc = null;
var specularProdLoc = null;

var modelViewMatrixLoc = null;
var projectionMatrixLoc = null;
var normalMatrixLoc = null;

var lightPositionLoc = null;
var shininessLoc = null;

var iBuffer = null;
var nBuffer = null;
var useObjNormal = true;


    var lightPosition = vec4.create();
    var lightAmbient = vec4.create();
    var lightDiffuse = vec4.create();
    var lightSpecular = vec4.create();

    var mka = 1.0;
    var mkd = 1.0;
    var mks = 1.0;
    var mksh = 128;

    var materialAmbient = vec4.create();
    var materialDiffuse = vec4.create();
    var materialSpecular = vec4.create();
    var materialShininess = 1.0;

    var materialKa = 1.0;
    var materialKd = 1.0;
    var materialKs = 1.0;

    var modelViewMatrix = mat4.create();
    var projectionMatrix = mat4.create();
    var normalMatrix = mat3.create(); 


/* variables for interface control */
var projectionType = 1; // default is Orthographic(1), Perspective(2)
var drawType = 1; // default is WireFrame(1), Solid(2)
var viewType = [0]; // default is orthographic frontview(1), leftView(2), topView(3), isoview(4)
var viewcnt = 0; // view count default = 0, in orthographic or perspective mode

var changePos = 1; // default is Object(1), camera(2)

var currentColor = vec4.create();

var program = null;

function handleKeyDown(event) {     //键盘事件
    var key = event.keyCode;
    currentKey[key] = true;
    if( changePos === 1 ){    
        switch (key) {
            case 65: //left//a
                dx -= step;
                document.getElementById("xpos").value=dx;
                break;
            case 68: // right//d
                dx += step;
                document.getElementById("xpos").value=dx;
                break;
            case 87: // up//w
                dy += step;
                document.getElementById("ypos").value=dy;
                break;
            case 83: // down//s
                dy -= step;
                document.getElementById("ypos").value=dy;
                break;
            case 90: // a//z
                dz += step;
                document.getElementById("zpos").value=dz;
                break;
            case 88: // d//x
                dz -= step;
                document.getElementById("zpos").value=dz;
                break;
            case 72: // h//ytheta-
                dyt -= stept;
                document.getElementById("yrot").value=dyt;
                break;
            case 75: // k//ytheta+
                dyt += stept;
                document.getElementById("yrot").value = dyt;
                break;
            case 85: // u//xtheta+
                dxt -= stept;
                document.getElementById("xrot").value = dxt;
                break;
            case 74: // j//xtheta-
                dxt += stept;
                document.getElementById("xrot").value = dxt;
                break;
            case 78: // n//ztheta+
                dzt += stept;
                document.getElementById("zrot").value = dzt;
                break;
            case 77: // m//ztheta-
                dzt -= stept;
                document.getElementById("zrot").value = dzt;
                break;
            case 82: // r//reset
                dx = 0;
                dy = 0;
                dz = 0;
                dxt = 0;
                dyt = 0;
                dzt = 0;
                break;
        }
    }
    if( changePos === 2 ){ 
        switch (key) {
            case 65: //left//a
                cx -= stepc;
                document.getElementById("xpos").value = cx;
                break;
            case 68: // right//d
                cx += stepc;
                document.getElementById("xpos").value = cx;
                break;
            case 87: // up//w
                cy += stepc;
                document.getElementById("ypos").value = cy;
                break;
            case 83: // down//s
                cy -= stepc;
                document.getElementById("ypos").value = cy;
                break;
            case 90: // a//z
                cz += stepc;
                document.getElementById("zpos").value = cz;
                break;
            case 88: // d//x
                cz -= stepc;
                document.getElementById("zpos").value = cz;
                break;
            case 72: // h//ytheta-
                cyt -= stepct;
                document.getElementById("yrot").value = cyt;
                break;
            case 75: // k//ytheta+
                cyt += stepct;
                document.getElementById("yrot").value = cyt;
                break;
            case 85: // u//xtheta+
                cxt -= stepct;
                document.getElementById("xrot").value = cxt;
                break;
            case 74: // j//xtheta-
                cxt += stepct;
                document.getElementById("xrot").value = cxt;
                break;
            case 78: // n//ztheta+
                czt += stepct;
                document.getElementById("zrot").value = czt;
                break;
            case 77: // m//ztheta-
                czt -= stepct;
                document.getElementById("zrot").value = czt;
                break;
            case 82: // r//reset
                cx = 0;
                cy = 0;
                cz = 4;
                cxt = 0;
                cyt = 0;
                czt = 0;
                break;
        }
    }
    buildModelViewProj();
}

function handleKeyUp(event) {
    currentKey[event.keyCode] = false; 
}

function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

function handleMouseUp(event) {
    mouseDown = false;
}

function handleMouseMove(event) {   //鼠标事件
    if (!mouseDown)
        return;

    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = (newX - lastMouseX);
    var d = deltaX;
    theta = theta - parseFloat(d);
    
    var deltaY = (newY - lastMouseY);
    d = deltaY;
    phi = phi - parseFloat(d);

    lastMouseX = newX;
    lastMouseY = newY;
    buildModelViewProj();
}

function checkInput(){      
    var ptype = document.getElementById( "ortho" ).checked; 
    if( ptype ) {
        projectionType = 1;
    }else{
        if( document.getElementById( "persp" ).checked )
            projectionType = 2;
    }

    var dtype = document.getElementById( "wire" ).checked; 
    if( dtype ){
        drawType = 1;
    }else{
        if( document.getElementById( "solid" ).checked ) 
            drawType = 2;
    }

    var hexcolor = document.getElementById( "objcolor" ).value.substring(1);
    var rgbHex = hexcolor.match(/.{1,2}/g);
    currentColor = vec4.fromValues( 
        parseInt(rgbHex[0], 16)/255.0,
        parseInt(rgbHex[1], 16)/255.0,
        parseInt(rgbHex[2], 16)/255.0,
        1.0
    );
}

function restoreSliderValue(changePos){     
    if (changePos === 1) {
        document.getElementById("xpos").value = dx;
        document.getElementById("ypos").value = dy;
        document.getElementById("zpos").value = dz;
        document.getElementById("xrot").value = Math.floor(dxt);
        document.getElementById("yrot").value = Math.floor(dyt);
        document.getElementById("zrot").value = Math.floor(dzt);
    }
    if (changePos === 2) {
        document.getElementById("xpos").value = cx;
        document.getElementById("ypos").value = cy;
        document.getElementById("zpos").value = cz;
        document.getElementById("xrot").value = Math.floor(cxt);
        document.getElementById("yrot").value = Math.floor(cyt);
        document.getElementById("zrot").value = Math.floor(czt);
    }
}

window.onload = function initWindow(){      
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.clearColor(0.1, 0.2, 0.1, 0.5);
    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    initInterface();

    checkInput();
}

function initBuffers(){
    vBuffer = gl.createBuffer();
    cBuffer = gl.createBuffer();
}

function initInterface(){       
    fileInput = document.getElementById("fileInput");
    fileInput.addEventListener("change", function (event) { 
        var file = fileInput.files[0];
        var reader = new FileReader();

        reader.onload = function (event) {
            meshdata = reader.result;
            initObj();
        }
        reader.readAsText(file);
    });

    var projradios = document.getElementsByName("projtype");
    for (var i = 0; i < projradios.length; i++) {
        projradios[i].addEventListener("click", function (event) {
            var value = this.value;
            if (this.checked) {
                projectionType = parseInt(value);
            }
            buildModelViewProj();
        });
    }

    var drawradios = document.getElementsByName("drawtype");
    for (var i = 0; i < drawradios.length; i++) {
        drawradios[i].onclick = function () {
            var value = this.value;
            if (this.checked) {
                drawType = parseInt(value);
            }
            updateModelData();
        }
    }

    document.getElementById("objcolor").addEventListener("input", function (event) {
        var hexcolor = this.value.substring(1);
        var rgbHex = hexcolor.match(/.{1,2}/g);
        currentColor = vec4.fromValues(
            parseInt(rgbHex[0], 16) * 1.0 / 255.0,
            parseInt(rgbHex[1], 16) * 1.0 / 255.0,
            parseInt(rgbHex[2], 16) * 1.0 / 255.0,
            1.0
        );
        updateColor();
    });

    document.getElementById("xpos").addEventListener("input", function(event){
        if(changePos===1)
            dx = this.value;
        else if(changePos===2)
            cx = this.value;
        buildModelViewProj();
    });
    document.getElementById("ypos").addEventListener("input", function(event){
        if(changePos===1)
            dy = this.value;
        else if(changePos===2)
            cy = this.value;
        buildModelViewProj();
    });
    document.getElementById("zpos").addEventListener("input", function(event){
        if(changePos===1)
            dz = this.value;
        else if(changePos===2)
            cz = this.value;
        buildModelViewProj();
    });

    document.getElementById("xrot").addEventListener("input", function(event){
        if(changePos===1)
            dxt = this.value;
        else if(changePos===2)
            cxt = this.value;
        buildModelViewProj();
    });
    document.getElementById("yrot").addEventListener("input", function(event){
        if(changePos===1)
            dyt = this.value;
        else if(changePos===2)
            cyt = this.value;
        buildModelViewProj();
    });
    document.getElementById("zrot").addEventListener("input",function(event){
        if (changePos === 1)
            dzt = this.value;
        else if (changePos === 2)
            czt = this.value;
        buildModelViewProj();
    });

    var postypeRadio = document.getElementsByName("posgrp");
    for (var i = 0; i < postypeRadio.length; i++) {
        postypeRadio[i].addEventListener("click", function (event) {
            var value = this.value;
            if (this.checked) {
                changePos = parseInt(value);
                restoreSliderValue(changePos);
            }
        });
    }

    
    document.getElementById("slider-ka").addEventListener("input", function(event){
        var vka = event.target.value;
        materialKa = parseFloat(vka);
        document.getElementById("slider-ka-value").innerHTML = materialKa;
    });

    document.getElementById("slider-kd").addEventListener("input", function(event){
        var vkd = event.target.value;
        materialKd = parseFloat(vkd);
        document.getElementById("slider-kd-value").innerHTML = materialKd;
    });

    document.getElementById("slider-ks").addEventListener("input", function(event){
        var vks = event.target.value;
        materialKs = parseFloat(vks);
        document.getElementById("slider-ks-value").innerHTML = materialKs;
    });

    document.getElementById("slider-sh").addEventListener("input", function(event){
        var vksh = event.target.value;
        materialShininess = parseInt(vksh);
        document.getElementById("slider-sh-value").innerHTML = materialShininess;
    });

    document.getElementById("ka-color").addEventListener("input", function(event){
        var hexcolor = event.target.value.substring(1);
        var rgbHex = hexcolor.match(/.{1,2}/g);
        materialAmbient = vec4.fromValues(
            parseInt(rgbHex[0], 16) * 1.0 / 255.0,
            parseInt(rgbHex[1], 16) * 1.0 / 255.0,
            parseInt(rgbHex[2], 16) * 1.0 / 255.0,
            1.0
        );
    });

    document.getElementById("kd-color").addEventListener("input", function (event) {
        var hexcolor = event.target.value.substring(1);
        var rgbHex = hexcolor.match(/.{1,2}/g);
        materialDiffuse = vec4.fromValues(
            parseInt(rgbHex[0], 16) * 1.0 / 255.0,
            parseInt(rgbHex[1], 16) * 1.0 / 255.0,
            parseInt(rgbHex[2], 16) * 1.0 / 255.0,
            1.0
        );
    });

    document.getElementById("ks-color").addEventListener("input", function (event) {
        var hexcolor = event.target.value.substring(1);
        var rgbHex = hexcolor.match(/.{1,2}/g);
        materialSpecular = vec4.fromValues(
            parseInt(rgbHex[0], 16) * 1.0 / 255.0,
            parseInt(rgbHex[1], 16) * 1.0 / 255.0,
            parseInt(rgbHex[2], 16) * 1.0 / 255.0,
            1.0
        );
    });

    document.getElementById("bk-color").addEventListener("input", function (event) {
        //var hexcolor = document.getElementById("bk-color").value.substring(1);
        var hexcolor = event.target.value.substring(1);
        var rgbHex = hexcolor.match(/.{1,2}/g);
        clearColor = vec4.fromValues(
            parseInt(rgbHex[0], 16) * 1.0 / 255.0,
            parseInt(rgbHex[1], 16) * 1.0 / 255.0,
            parseInt(rgbHex[2], 16) * 1.0 / 255.0,
            1.0
        );
    });

    document.getElementById("lt-ambient-color").addEventListener("input", function(event){
        var hexcolor = event.target.value.substring(1);
        var rgbHex = hexcolor.match(/.{1,2}/g);
        lightAmbient = vec4.fromValues(
            parseInt(rgbHex[0], 16) * 1.0 / 255.0,
            parseInt(rgbHex[1], 16) * 1.0 / 255.0,
            parseInt(rgbHex[2], 16) * 1.0 / 255.0,
            1.0
        );
    });

    document.getElementById("lt-diffuse-color").addEventListener("input", function (event) {
        var hexcolor = event.target.value.substring(1);
        var rgbHex = hexcolor.match(/.{1,2}/g);
        lightDiffuse = vec4.fromValues(
            parseInt(rgbHex[0], 16) * 1.0 / 255.0,
            parseInt(rgbHex[1], 16) * 1.0 / 255.0,
            parseInt(rgbHex[2], 16) * 1.0 / 255.0,
            1.0
        );
    });

    document.getElementById("lt-specular-color").addEventListener("input", function (event) {
        var hexcolor = event.target.value.substring(1);
        var rgbHex = hexcolor.match(/.{1,2}/g);
        lightSpecular = vec4.fromValues(
            parseInt(rgbHex[0], 16) * 1.0 / 255.0,
            parseInt(rgbHex[1], 16) * 1.0 / 255.0,
            parseInt(rgbHex[2], 16) * 1.0 / 255.0,
            1.0
        );
    });

    document.getElementById("slider-x").addEventListener("input", function(event){
        var lx = parseFloat(event.target.value);
        lightPosition[0] = lx;
        document.getElementById("slider-x-value").innerHTML = lx;
    });

    document.getElementById("slider-y").addEventListener("input", function (event) {
        var ly = parseFloat(event.target.value);
        lightPosition[1] = ly;
        document.getElementById("slider-y-value").innerHTML = ly;
    });

    document.getElementById("slider-z").addEventListener("input", function (event) {
        var lz = parseFloat(event.target.value);
        lightPosition[2] = lz;
        document.getElementById("slider-z-value").innerHTML = lz;
    });

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
}

function buildMultiViewProj(type){
    if( type[0] === 0 )
        render();
    else
        rendermultiview();
}

function initObj(){    
    mesh = new OBJ.Mesh( meshdata );
    // mesh.normalBuffer, mesh.textureBuffer, mesh.vertexBuffer, mesh.indexBuffer
    OBJ.initMeshBuffers( gl, mesh );

    gl.bindBuffer( gl.ARRAY_BUFFER, mesh.vertexBuffer );

    vertexLoc = gl.getAttribLocation(program, "vPosition");
    normalLoc = gl.getAttribLocation(program, "vNormal");

    // retrieve the location of the uniform variables of the shader
    ambientProdLoc = gl.getUniformLocation(program, "ambientProduct");
    diffuseProdLoc = gl.getUniformLocation(program, "diffuseProduct");
    specularProdLoc = gl.getUniformLocation(program, "specularProduct");

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");

    lightPositionLoc = gl.getUniformLocation(program, "lightPosition");
    shininessLoc = gl.getUniformLocation(program, "shininess");

    materialKaLoc = gl.getUniformLocation(program, "materialKa");
    materialKdLoc = gl.getUniformLocation(program, "materialKd");
    materialKsLoc = gl.getUniformLocation(program, "materialKs");

    gl.vertexAttribPointer(vertexLoc, mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexLoc);
    gl.bindBuffer( gl.ARRAY_BUFFER, mesh.normalBuffer);
    gl.vertexAttribPointer(normalLoc, mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(normalLoc);
    useObjNormal = true;

    dx = -1.0 * (parseFloat(mesh.xmax) + parseFloat(mesh.xmin))/2.0;
    dy = -1.0 * (parseFloat(mesh.ymax) + parseFloat(mesh.ymin))/2.0;
    dz = -1.0 * (parseFloat(mesh.zmax) + parseFloat(mesh.zmin))/2.0;

    var maxScale;
    var scalex = Math.abs(parseFloat(mesh.xmax)-parseFloat(mesh.xmin));
    var scaley = Math.abs(parseFloat(mesh.ymax)-parseFloat(mesh.ymin));
    var scalez = Math.abs(parseFloat(mesh.zmax)-parseFloat(mesh.zmin));

    maxScale = Math.max(scalex, scaley, scalez);

    sx = 2.0/maxScale;
    sy = 2.0/maxScale;
    sz = 2.0/maxScale;

    dx = 0;
    dy = 0;
    dz = 0;

    updateModelData();
    buildModelViewProj();

    render();
}

function updateModelData(){     
    if( vBuffer === null)
        vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vBuffer );
    lineIndex = [];
    for( var i = 0; i < mesh.indices.length; i+=3 ){
        lineIndex.push(mesh.indices[i], mesh.indices[i+1]);
        lineIndex.push(mesh.indices[i+1], mesh.indices[i + 2]);
        lineIndex.push(mesh.indices[i+2], mesh.indices[i]);
    }
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lineIndex), gl.STATIC_DRAW );
}



function buildModelViewProj(){
    /* ModelViewMatrix & ProjectionMatrix */
    //eye = vec3.fromValues(cx, cy, cz);
    var localRadius;

    if( projectionType == 1 ){
        mat4.ortho( pMatrix, oleft, oright, oybottom, oytop, onear, ofar );
        localRadius = oradius;
    }else{
        aspect = 1;
        mat4.perspective(pMatrix, fovy, aspect, pnear, pfar);
        //mat4.frustum( pMatrix, pleft, pright, pybottom, pytop, pnear, pfar );
        localRadius = pradius;
    }
    
    var rthe = theta * Math.PI / 180.0;
    var rphi = phi * Math.PI / 180.0;

    if(changePos==1){   //物体或相机位置改变
        vec3.set(eye, localRadius * Math.sin(rthe) * Math.cos(rphi), localRadius * Math.sin(rthe) * Math.sin(rphi), localRadius * Math.cos(rthe)); 

    mat4.lookAt( mvMatrix, eye, at, up );

    mat4.translate( mvMatrix, mvMatrix, vec3.fromValues( dx, dy, dz ) );
    
    mat4.rotateZ(mvMatrix, mvMatrix, dzt * Math.PI / 180.0);
    mat4.rotateY(mvMatrix, mvMatrix, dyt * Math.PI / 180.0);
    mat4.rotateX(mvMatrix, mvMatrix, dxt * Math.PI / 180.0);
    }else{      //相机应该和物体移动相反
        vec3.set(eye, localRadius * Math.sin(rthe) * Math.cos(rphi), localRadius * Math.sin(rthe) * Math.sin(rphi), localRadius * Math.cos(rthe)); 

    mat4.lookAt( mvMatrix, eye, at, up );

    mat4.translate( mvMatrix, mvMatrix, vec3.fromValues( -1*cx, -1*cy, -1*cz ) );
    
    mat4.rotateZ(mvMatrix, mvMatrix, czt * Math.PI / 180.0);
    mat4.rotateY(mvMatrix, mvMatrix, cyt * Math.PI / 180.0);
    mat4.rotateX(mvMatrix, mvMatrix, cxt * Math.PI / 180.0);
    }

    //mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(dx, dy, dz));
    mat4.scale(mvMatrix, mvMatrix, vec3.fromValues(sx, sy, sz));

    // material
    var mka = parseFloat( document.getElementById("slider-ka").value );
    materialKa = mka;

    var mkd = parseFloat( document.getElementById( "slider-kd" ).value );
    materialKd = mkd;

    var mks = parseFloat( document.getElementById( "slider-ks" ).value );
    materialKs = mks;

    materialShininess = parseInt( document.getElementById( "slider-sh" ).value );

    // set material color
    var ambhexcolor = document.getElementById( "ka-color" ).value.substring(1).match(/.{1,2}/g);
    materialAmbient = vec4.fromValues(
        parseInt(ambhexcolor[0], 16) * 1.0 / 255.0,
        parseInt(ambhexcolor[1], 16) * 1.0 / 255.0,
        parseInt(ambhexcolor[2], 16) * 1.0 / 255.0,
        1.0
    );

    var difhexcolor = document.getElementById( "kd-color" ).value.substring(1).match(/.{1,2}/g);
    materialDiffuse = vec4.fromValues(
        parseInt(difhexcolor[0], 16) * 1.0 / 255.0,
        parseInt(difhexcolor[1], 16) * 1.0 / 255.0,
        parseInt(difhexcolor[2], 16) * 1.0 / 255.0,
        1.0
    );

    var spehexcolor = document.getElementById( "ks-color" ).value.substring(1).match(/.{1,2}/g);
    materialSpecular = vec4.fromValues(
        parseInt(spehexcolor[0], 16) * 1.0 / 255.0,
        parseInt(spehexcolor[1], 16) * 1.0 / 255.0,
        parseInt(spehexcolor[2], 16) * 1.0 / 255.0,
        1.0
    );

    var ltx = parseFloat( document.getElementById( "slider-x" ).value );
    var lty = parseFloat( document.getElementById( "slider-y" ).value );
    var ltz = parseFloat( document.getElementById( "slider-z" ).value );
    lightPosition = vec4.fromValues( ltx, lty, ltz, 1.0 );

    // set light color
    var lambhexcolor = document.getElementById("lt-ambient-color").value.substring(1).match(/.{1,2}/g);
    lightAmbient = vec4.fromValues(
        parseInt(lambhexcolor[0], 16) * 1.0 / 255.0,
        parseInt(lambhexcolor[1], 16) * 1.0 / 255.0,
        parseInt(lambhexcolor[2], 16) * 1.0 / 255.0,
        1.0
    );

    var ldifhexcolor = document.getElementById("lt-diffuse-color").value.substring(1).match(/.{1,2}/g);
    lightDiffuse = vec4.fromValues(
        parseInt(ldifhexcolor[0], 16) * 1.0 / 255.0,
        parseInt(ldifhexcolor[1], 16) * 1.0 / 255.0,
        parseInt(ldifhexcolor[2], 16) * 1.0 / 255.0,
        1.0
    );

    var lspehexcolor = document.getElementById("lt-specular-color").value.substring(1).match(/.{1,2}/g);
    lightSpecular = vec4.fromValues(
        parseInt(lspehexcolor[0], 16) * 1.0 / 255.0,
        parseInt(lspehexcolor[1], 16) * 1.0 / 255.0,
        parseInt(lspehexcolor[2], 16) * 1.0 / 255.0,
        1.0
    );

    var cchexcolor = document.getElementById("bk-color").value.substring(1).match(/.{1,2}/g);
    clearColor = vec4.fromValues(
        parseInt(cchexcolor[0], 16) * 1.0 / 255.0,
        parseInt(cchexcolor[1], 16) * 1.0 / 255.0,
        parseInt(cchexcolor[2], 16) * 1.0 / 255.0,
        1.0
    );

    var ambientProduct = vec4.create();
    vec4.multiply(ambientProduct, lightAmbient, materialAmbient);

    var diffuseProduct = vec4.create();
    vec4.multiply(diffuseProduct, lightDiffuse, materialDiffuse);

    var specularProduct = vec4.create();
    vec4.multiply(specularProduct, lightSpecular, materialSpecular);
    
    //复制
    mat3.fromMat4(normalMatrix, mvMatrix);

    gl.uniform4fv(ambientProdLoc, new Float32Array(ambientProduct));
    gl.uniform4fv(diffuseProdLoc, new Float32Array(diffuseProduct));
    gl.uniform4fv(specularProdLoc, new Float32Array(specularProduct));
    gl.uniform4fv(lightPositionLoc, new Float32Array(lightPosition));
    gl.uniform1f(shininessLoc, materialShininess);
    gl.uniform1f(materialKaLoc, materialKa);
    gl.uniform1f(materialKdLoc, materialKd);
    gl.uniform1f(materialKsLoc, materialKs);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, new Float32Array(mvMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, new Float32Array(pMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, new Float32Array(normalMatrix));
}

var interval = setInterval(timerFunc, 30);      //绘制

function timerFunc() {
    render();
}

function render(){
    gl.viewport( 0, 0, canvas.width, canvas.height );
    aspect = canvas.width / canvas.height;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderType( drawType );
}

function renderType(type){
    if (type == 1) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vBuffer);
        gl.drawElements(gl.LINES, lineIndex.length, gl.UNSIGNED_SHORT, 0);
    } else {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
        gl.drawElements(gl.TRIANGLES, mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}
