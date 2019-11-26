//<![CDATA[

"use strict";

//// All of the following code was written by David A. Madore
////   (<URL: http://www.madore.org/~david/ >),
//// around 2013-08-27, and is hereby placed in the Public Domain.
////   (I would appreciate getting some thanks/recognition if it
////   is used elsewhere, but this is not a legal requirement,
////   just a polite request.)
//// It comes with no warranty whatsoever, of course.

var xsize = 24;
var ysize = 24;
var zsize = 8;

// For each maze cell, an integer indicating which directions one can go from here
// (bit 0 = east (x+1), bit 1 = north (y+1), bit 2 = west (x-1), bit 3 = south (y-1)),
// plus extra bits for slopes (bits 4&5 the offset _downwards_ in thirds (1 through 3),
// bits 6&7 the downwards slope direction (0=E, 1=N, 2=W, 3=S),
// and bit 8 whether this is the bottom half/layer of the stairs).
var maze;

// The color theme.
var mazeDeco;

function allocMaze() {
    "use strict";
    maze = new Array(xsize);
    mazeDeco = new Array(xsize);
    for ( var x=0 ; x<xsize ; x++ ) {
        maze[x] = new Array(ysize);
        mazeDeco[x] = new Array(ysize);
        for ( var y=0 ; y<ysize ; y++ ) {
            maze[x][y] = new Array(zsize);
            mazeDeco[x][y] = new Array(zsize);
        }
    }
}

function digMaze() {
    "use strict";
//    console.log("Digging the maze...");
    // Construct the maze by digging it as a tree:
    var stack = [];  // Visited positions (not really a stack: we fetch items at random)
    var xpos = Math.floor(xsize/2);
    var ypos = Math.floor(ysize/2);
    var zpos = 0;
    maze[xpos][ypos][zpos] = 0;
    stack.push({x:xpos,y:ypos,z:zpos,
                d:[],preferDir:1,forceDir:true}); // Force initial dir to north
    while (stack.length>0) {
        // Choose a visited position at random:
        var idx = Math.floor(Math.random()*stack.length);
        var t = stack[idx];  stack[idx] = stack[stack.length-1];  stack[stack.length-1] = t;
        xpos = t.x;  ypos = t.y;  zpos = t.z;
        if ( typeof(maze[xpos][ypos][zpos]) != "number" )
            throw new Error("This is impossible");
        if ( t.d.length < 4 ) { // There is still a direction we haven't dug from here.
            var dir;
            do { // Choose direction to dig into:
                if ( typeof(t.preferDir) == "undefined" || ( Math.random()<0.2 && ! t.forceDir ) )
                    dir = Math.floor(Math.random()*4);  // Change direction.
                else
                    dir = t.preferDir;  // Continue in previous direction.
            } while (t.d.indexOf(dir)>=0);
            var dx = ([1,0,-1,0])[dir];
            var dy = ([0,1,0,-1])[dir];
            var dz = 0;
            if ( Math.random()<0.05 ) {  // Maybe dig a slope?
                var free = true;
                // Choose whether we dig up or down:
                if ( typeof(t.preferDz) == "undefined" || Math.random()<0.4 )
                    dz = Math.random()<0.5 ? 1 : -1;
                else
                    dz = t.preferDz;
                // Now check whether we have some free squares to dig this slope:
                if ( zpos+dz < 0 || zpos+dz >= zsize ) {
                    dz = 0;
                    free = false;
                } else {
                    for ( var ii=1 ; ii<=4 ; ii++ ) {
                        var x2 = xpos + dx*ii;
                        var y2 = ypos + dy*ii;
                        if ( x2<0 || x2>=xsize || y2<0 || y2>=ysize
                             || ( ii<4 && typeof(maze[x2][y2][zpos]) != "undefined" )
                             || typeof(maze[x2][y2][zpos+dz]) != "undefined" ) {
                            dz = 0;
                            free = false;
                            break;
                        }
                    }
                }
            }
            if ( dz ) {  // Dig a slope:
                t.d.push(dir);  // Mark this direction as done from this visited source.
                t.preferDir = undefined;
                var opdir = ([2,3,0,1])[dir];  // Opposite direction
                var slope = dz<0 ? dir : opdir;  // Direction of downwards slope
                var walls = ([5,10,5,10])[dir];  // (Never branch off a slope!)
                for ( var ii=1 ; ii<4 ; ii++ ) {  // The three slope squares proper
                    var x2 = xpos + dx*ii;
                    var y2 = ypos + dy*ii;
                    var voff = dz<0 ? ii : 4-ii;
                    if ( typeof(maze[x2][y2][zpos]) != "undefined"
                         || typeof(maze[x2][y2][zpos+dz]) != "undefined" )
                        throw new Error("This is impossible");
                    maze[x2][y2][zpos] = walls | (voff<<4) | (slope<<6) | ((dz>0)<<8);
                    maze[x2][y2][zpos+dz] = walls | (voff<<4) | (slope<<6) | ((dz<0)<<8);
                }
                // The square at the end of the slope:
                var xnpos = xpos + dx*4;
                var ynpos = ypos + dy*4;
                maze[xpos][ypos][zpos] |= (1<<dir);
                if ( typeof(maze[xnpos][ynpos][zpos+dz]) != "undefined" )
                    throw new Error("This is impossible");
                maze[xnpos][ynpos][zpos+dz] = (1<<opdir);
                stack.push({x:xnpos,y:ynpos,z:zpos+dz,d:[opdir],preferDir:dir,preferDz:dz});
            } else {  // Dig horizontally:
                t.d.push(dir);  // Mark this direction as done from this visited source.
                t.preferDir = undefined;
                // The new square to dig into:
                var xnpos = xpos + dx;
                var ynpos = ypos + dy;
                var opdir = ([2,3,0,1])[dir];  // Opposite direction
                if ( xnpos >= 0 && ynpos >= 0 && xnpos < xsize && ynpos < ysize
                     && typeof(maze[xnpos][ynpos][zpos]) == "undefined" ) {
                    // A new square has been dug into.
                    maze[xpos][ypos][zpos] |= (1<<dir);
                    maze[xnpos][ynpos][zpos] = (1<<opdir);
                    stack.push({x:xnpos,y:ynpos,z:zpos,d:[opdir],preferDir:dir,preferDz:t.preferDz});
                }
            }
        } else {
            // Stuck: backtrack from here.
            stack.pop();
        }
    }
}

var nbdecos = 16;  // Number of seeds for maze deco

function decorateMaze() {
    "use strict";
//    console.log("Decorating the maze...");
    // Decorating is very similar to digging, except that we start from a few "seeds".
    var stack = [];  // Pool of visited (i.e., decorated) positions
    var xpos, ypos, zpos;
    var deco;
    for ( deco=0 ; deco<nbdecos ; deco++ ) {  // Place our seeds at random.
        do {
            xpos = Math.floor(Math.random()*xsize);
            ypos = Math.floor(Math.random()*ysize);
            zpos = Math.floor(Math.random()*zsize);
        } while ( ! ( typeof(mazeDeco[xpos][ypos][zpos]) == "undefined"
                      && typeof(maze[xpos][ypos][zpos]) != "undefined"
                      && ((maze[xpos][ypos][zpos]>>4)&3) == 0 ) );
        mazeDeco[xpos][ypos][zpos] = deco;
        stack.push({x:xpos,y:ypos,z:zpos,d:[],deco:deco});
    }
    var wantDeco = 0;  // Try hard to extend this deco.
    while (stack.length>0) {
        var idx;
        do {  // Find a decorated position to extend:
            idx = Math.floor(Math.random()*stack.length);
        } while ( stack[idx].deco != wantDeco && Math.random() < .9 );
        var t = stack[idx];  stack[idx] = stack[stack.length-1];  stack[stack.length-1] = t;
        xpos = t.x;  ypos = t.y;  zpos = t.z;  deco = t.deco;
        if ( typeof(mazeDeco[xpos][ypos][zpos]) != "number"
             || mazeDeco[xpos][ypos][zpos] != deco )
            throw new Error("This is impossible");
        if ( t.d.length < 4 ) { // There is still a direction we haven't extended from here.
            var dir;
            do {
                dir = Math.floor(Math.random()*4);
            } while (t.d.indexOf(dir)>=0);
            var dx = ([1,0,-1,0])[dir];
            var dy = ([0,1,0,-1])[dir];
            t.d.push(dir);
            var xnpos = xpos + dx;
            var ynpos = ypos + dy;
            var opdir = ([2,3,0,1])[dir];
            if ( (maze[xpos][ypos][zpos]&(1<<dir))
                 && typeof(mazeDeco[xnpos][ynpos][zpos]) == "undefined" ) {
                var voff = (maze[xnpos][ynpos][zpos]>>4)&3;
                var isbothalf = (maze[xnpos][ynpos][zpos]>>8)&1;
                mazeDeco[xnpos][ynpos][zpos] = deco;
                if ( voff ) // Slopes function as vertical pairs: always do both together!
                    mazeDeco[xnpos][ynpos][zpos+(isbothalf?1:-1)] = deco;
                if ( voff == 1 && isbothalf ) // Top of slope
                    zpos++
                else if ( voff == 3 && ! isbothalf ) // Bottom of slope
                    zpos--;
                stack.push({x:xnpos,y:ynpos,z:zpos,d:[opdir],deco:deco});
            }
        } else {
            // Stuck: backtrack from here.
            stack.pop();
        }
        wantDeco = (wantDeco+1)%nbdecos;
    }
}

function extraCarveMaze() {
    "use strict";
    // Now remove a few more random walls, but only within a deco region:
    for ( var i=0 ; i<xsize ; i++ ) {
        for ( var j=0 ; j<ysize ; j++ ) {
            for ( var k=0 ; k<zsize ; k++ ) {
                if ( typeof(maze[i][j][k]) != "undefined" && (maze[i][j][k]>>4)==0
                     && i<xsize-1 && typeof(maze[i+1][j][k]) != "undefined"
                     && (maze[i+1][j][k]>>4)==0
                     && (mazeDeco[i][j][k] == mazeDeco[i+1][j][k])
                     && Math.random()<(0.03*(zsize-1-k)) ) {
                    maze[i][j][k] |= 1;
                    maze[i+1][j][k] |= 4;
                }
                if ( typeof(maze[i][j][k]) != "undefined" && (maze[i][j][k]>>4)==0
                     && j<ysize-1 && typeof(maze[i][j+1][k]) != "undefined"
                     && (maze[i][j+1][k]>>4)==0
                     && (mazeDeco[i][j][k] == mazeDeco[i][j+1][k])
                     && Math.random()<(0.03*(zsize-1-k)) ) {
                    maze[i][j][k] |= 2;
                    maze[i][j+1][k] |= 8;
                }
            }
        }
    }
}

// The maze's exit is on the south wall of the top layer (y==0, z==zsize-1)
var exitX = Math.floor(Math.random()*xsize);

do {  // Sometimes digMaze() can get stuck and not reach the top level: try until it does.
    allocMaze();
    digMaze();
} while ( typeof(maze[exitX][0][zsize-1]) == "undefined" || (maze[exitX][0][zsize-1]>>4) != 0 );
decorateMaze();
extraCarveMaze();

var canvas;  // canvas node element
var gl;  // WebGL context
var fragmentShader, vertexShader, shaderProg;  // Shaders and program
var pmatUniform, rmatUniform, oposUniform;  // Uniform variables
var vposAttribute, vcolAttribute;  // Attributes
var vposBuffer, vcolBuffer;  // Buffers for attribute data

var fScale = 0.95;  // Determines angle of vision
var dNear = 0.05;  // Near clipping plane of vision frustrum
var dFar = 10;  // Far clipping plane of vision frustrum

function initWebGL() {
    "use strict";

    // Canvas and WebGL context
    canvas = document.getElementById("main-canvas");
    if ( ! canvas || ! canvas.getContext ) {
        alert("Your navigator does not support the HTML5 canvas element!");
        throw new Error("Canvas not supported");
    }
    gl = canvas.getContext("webgl");
    if ( ! gl )
        gl = canvas.getContext("experimental-webgl");
    if ( ! gl || ! gl.createShader ) {
        alert("Your navigator does not support the HTML5 WebGL context!");
        throw new Error("WebGL not supported");
    }

    // Create the shaders.
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, document.getElementById("fragment-shader").textContent);
    gl.compileShader(fragmentShader);
    if ( !gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS) ) {
        alert("An error occurred while compiling the fragment shader: " + gl.getShaderInfoLog(fragmentShader));
        throw new Error("Failed to compile fragment shader");
    }
    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, document.getElementById("vertex-shader").textContent);
    gl.compileShader(vertexShader);
    if ( !gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS) ) {
        alert("An error occurred while compiling the vertex shader: " + gl.getShaderInfoLog(vertexShader));
        throw new Error("Failed to compile vertex shader");
    }
    shaderProg = gl.createProgram();
    gl.attachShader(shaderProg, fragmentShader);
    gl.attachShader(shaderProg, vertexShader);
    gl.linkProgram(shaderProg);
    if ( !gl.getProgramParameter(shaderProg, gl.LINK_STATUS) ) {
        alert("An error occurred while linking the shaders");
        throw new Error("Failed to link shaders");
    }
    gl.useProgram(shaderProg);

    // Clear the canvas.
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0., 0., 0., 1.);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set up uniforms.
    pmatUniform = gl.getUniformLocation(shaderProg, "pmat");  // Projection matrix
    gl.uniformMatrix4fv(pmatUniform, false, new Float32Array([
      fScale*canvas.height/canvas.width,0.,0.,0.,
      0.,0.,(dFar+dNear)/(dFar-dNear),1.,
      0.,fScale,0.,0.,
      0.,0.,-2*dFar*dNear/(dFar-dNear),0.,
    ]));
    rmatUniform = gl.getUniformLocation(shaderProg, "rmat");  // Rotation matrix
    gl.uniformMatrix4fv(rmatUniform, false, new Float32Array([
      1.,0.,0.,0.,
      0.,1.,0.,0.,
      0.,0.,1.,0.,
      0.,0.,0.,1.,
    ]));
    oposUniform = gl.getUniformLocation(shaderProg, "opos");
    gl.uniform3fv(oposUniform, [0., 0., 0.]);

    // Set up attributes.
    vposAttribute = gl.getAttribLocation(shaderProg, "vpos");
    gl.enableVertexAttribArray(vposAttribute);
    vposBuffer = gl.createBuffer();
    vcolAttribute = gl.getAttribLocation(shaderProg, "vcol");
    gl.enableVertexAttribArray(vcolAttribute);
    vcolBuffer = gl.createBuffer();
}

initWebGL();

var obsx, obsy, obsz;  // Observer position (including fractional part)
var xs, ys, zs;  // Integer part (floor) of observer position, determines square of maze
var obsth;  // Observer orientation, in degrees counterclockwise from north
var obsu, obsv;  // Cosine and sine of the above
var exited;  // Left the maze?

obsx = Math.floor(xsize/2) + 0.5;
obsy = Math.floor(ysize/2) + 0.5;
obsz = 0.5;
xs = Math.floor(obsx);
ys = Math.floor(obsy);
zs = Math.floor(obsz);
obsth = 0;
exited = false;

function computeUV() {  // Compute obsu and obsv.
    "use strict";
    obsu = Math.cos(obsth*Math.PI/180);
    obsv = Math.sin(obsth*Math.PI/180);
}
computeUV();

function loadViewPoint() {  // Load observer position and angle into WebGL uniforms.
    "use strict";
    gl.uniformMatrix4fv(rmatUniform, false, new Float32Array([
      obsu,-obsv,0.,0.,
      obsv,obsu,0.,0.,
      0.,0.,1.,0.,
      0.,0.,0.,1.,
    ]));
    gl.uniform3fv(oposUniform, [obsx, obsy, obsz]);
}
loadViewPoint();

// Color themes for floors, ceilings and walls:
var floorColors = [[.6,.4,.2], [.35,.3,.3], [.3,.0,.0], [.4,.5,.0], [.6,.0,.0], [.6,.0,.4], [.4,.3,.1], [.1,.0,.0]];
var ceilColors = [[.2,.2,.9], [.7,.7,.75], [.2,.3,.4], [.1,.1,.7], [.5,.5,.7], [.2,.6,.6], [.6,.6,.75], [.4,.4,.4]];
var wallColors = [[.5,.5,.5], [.5,.5,.5], [.4,.5,.45], [.6,.5,.4], [.4,.5,.5], [.45,.55,.45], [.5,.55,.65], [.6,.6,.4]];

// Precompute wall color modulation as function of x and y:
var wallSineX, wallSineY;
function computeWallSine() {
    wallSineX = new Float32Array(2*xsize+1);
    for ( var i=0 ; i<2*xsize+2 ; i++ )
        wallSineX[i] = Math.sin(i*Math.PI/16)
    wallSineY = new Float32Array(2*ysize+1);
    for ( var i=0 ; i<2*ysize+2 ; i++ )
        wallSineY[i] = Math.sin(i*Math.PI/16)
}
computeWallSine();

// The triangles fed to OpenGL: we examine 21*21*5 cells, 6 walls per cell, 2 triangles per wall.
var maxtriangles = 21*21*5*6*2;
var nbtriangles;

// Coordinates and colors of triangles:
var vpos = new Float32Array(maxtriangles*9);
var vcol = new Float32Array(maxtriangles*9);

function loadTriangles() {  // Load nearby geometry in WebGL arrays.
    "use strict";
    nbtriangles = 0;
    function addSquare(x0,y0,z0,d1x,d1y,d1z,d2x,d2y,d2z,r,g,b) {
        "use strict";
        // Try to make this function easily optimizable...
        x0 = +x0;  y0 = +y0;  z0 = +z0;
        d1x = +d1x;  d1y = +d1y;  d1z = +d1z;
        d2x = +d2x;  d2y = +d2y;  d2z = +d2z;
        r = +r;  g = +g;  b = +b;
        var nbt = nbtriangles|0;
        vpos[nbt*9] = x0;
        vpos[nbt*9+1] = y0;
        vpos[nbt*9+2] = z0;
        vpos[nbt*9+3] = x0+d1x;
        vpos[nbt*9+4] = y0+d1y;
        vpos[nbt*9+5] = z0+d1z;
        vpos[nbt*9+6] = x0+d2x;
        vpos[nbt*9+7] = y0+d2y;
        vpos[nbt*9+8] = z0+d2z;
        vpos[nbt*9+9] = x0+d2x;
        vpos[nbt*9+10] = y0+d2y;
        vpos[nbt*9+11] = z0+d2z;
        vpos[nbt*9+12] = x0+d1x;
        vpos[nbt*9+13] = y0+d1y;
        vpos[nbt*9+14] = z0+d1z;
        vpos[nbt*9+15] = x0+d1x+d2x;
        vpos[nbt*9+16] = y0+d1y+d2y;
        vpos[nbt*9+17] = z0+d1z+d2z;
        for ( var i=0 ; i<6 ; i++ ) {
            vcol[nbt*9+i*3] = r;
            vcol[nbt*9+i*3+1] = g;
            vcol[nbt*9+i*3+2] = b;
        }
        nbtriangles = nbt + 2;
    }
    function lc(l,x) {
        "use strict";
        // A helper function for modulating wall color
        l = +l;
        x = +x;
        if ( l<0. )
            return +(x*(1.+l));
        else
            return +(1. - (1.-x)*(1.-l));
    }
    // The cell region we scan:
    var imin = Math.max(0,xs-10);  var imax=Math.min(xsize,xs+11);
    var jmin = Math.max(0,ys-10);  var jmax=Math.min(ysize,ys+11);
    var kmin = Math.max(0,zs-2);   var kmax=Math.min(zsize,zs+3);
    for ( var i=imin ; i<imax ; i++ ) {
        for ( var j=jmin ; j<jmax ; j++ ) {
            for ( var k=kmin ; k<kmax ; k++ ) {
                var voff = (maze[i][j][k]>>4)&3;  // Vertical offset downwards
                var slant = !!voff;
                var slope = (maze[i][j][k]>>6)&3;  // Direction of downwards slope
                var isbothalf = (maze[i][j][k]>>8)&1;  // Is this a bottom half?
                var swdz = slant ? -(voff-(slope<2))/3 : 0;  // Vertical offset of SW corner
                var edz = slant ? (([-1,0,1,0])[slope])/3 : 0;  // Vertical diff east
                var ndz = slant ? (([0,-1,0,1])[slope])/3 : 0;  // Vertical diff north
                var deco = mazeDeco[i][j][k] % (floorColors.length);  // Decoration
                if ( ! deco )
                    deco = 0;
                // Floor:
                if ( ! isbothalf )
                    addSquare(i,j,k+swdz,
                              1,0,edz,0,1,ndz,
                              floorColors[deco][0]+([0,.05])[(i+j)%2],
                              floorColors[deco][1]+([0,.05,.05])[i%3],
                              floorColors[deco][2]+([0,.05,.05])[j%3]);
                // Ceiling:
                if ( ! isbothalf )
                    addSquare(i,j,k+1+swdz,
                              0,1,ndz,1,0,edz,
                              ceilColors[deco][0]+([0,.05])[i%2],
                              ceilColors[deco][1]+([0,.05])[j%2],
                              ceilColors[deco][2]+([0,0,.05])[(i+j)%3]);
                // Walls:
                var l;
                var sideColor = wallColors[deco];
                // East wall
                l = wallSineX[2*i+2] * wallSineY[2*j+1];
                if ( (i<xsize) ? (! (maze[i][j][k]&1)) : 1 )
                    addSquare(i+1,j,k,0,0,1,0,1,0,
                              lc(l,sideColor[0]),lc(l,sideColor[1]),lc(l,sideColor[2]));
                // North wall
                l = wallSineX[2*i+1] * wallSineY[2*j+2];
                if ( (j<ysize) ? (! (maze[i][j][k]&2)) : 1 )
                    addSquare(i,j+1,k,1,0,0,0,0,1,
                              lc(l,sideColor[0]),lc(l,sideColor[1]),lc(l,sideColor[2]));
                // West wall
                l = wallSineX[2*i] * wallSineY[2*j+1];
                if ( (i<xsize) ? (! (maze[i][j][k]&4)) : 1 )
                    addSquare(i,j,k,0,1,0,0,0,1,
                              lc(l,sideColor[0]),lc(l,sideColor[1]),lc(l,sideColor[2]));
                // South wall
                l = wallSineX[2*i+1] * wallSineY[2*j];
                if ( i==exitX && j==0 && k==zsize-1 )
                    addSquare(i,j,k,0,0,1,1,0,0, .3,.7,1.);
                else if ( (j<ysize) ? (! (maze[i][j][k]&8)) : 1 )
                    addSquare(i,j,k,0,0,1,1,0,0,
                              lc(l,sideColor[0]),lc(l,sideColor[1]),lc(l,sideColor[2]));
            }
        }
    }
    // Feed the triangles to WebGL:
    gl.bindBuffer(gl.ARRAY_BUFFER, vposBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vpos, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vposAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vcolBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vcol, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vcolAttribute, 3, gl.FLOAT, false, 0, 0);
}

loadTriangles();

function redraw() {  // Redraw canvas (from triangles having already been loaded).
    "use strict";
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, nbtriangles*3);
}
redraw();
    

var headings = ["N", "NNW", "NW", "WNW", "W", "WSW", "SW", "SSW",
                "S", "SSE", "SE", "ESE", "E", "ENE", "NE", "NNE"];

var mazeVisited;
function markOneVisited(x,y,z) {  // Mark one square as seen for the map.
    "use strict";
    if ( ! mazeVisited )
        mazeVisited = new Array(xsize);
    if ( ! (mazeVisited[x]) )
        mazeVisited[x] = new Array(ysize);
    if ( ! (mazeVisited[x][y]) )
        mazeVisited[x][y] = new Array(zsize);
    mazeVisited[x][y][z] = true;
}

function markAroundVisited() {  // Mark square and adjacent ones as seen.
    "use strict";
    markOneVisited(xs,ys,zs);
    var voff = (maze[xs][ys][zs]>>4)&3;
    var isbothalf = (maze[xs][ys][zs]>>8)&1;
    if ( voff )
        markOneVisited(xs,ys,zs+(isbothalf?1:-1));
    if ( (maze[xs][ys][zs])&1 )
        markOneVisited(xs+1,ys,zs);
    if ( (maze[xs][ys][zs])&2 )
        markOneVisited(xs,ys+1,zs);
    if ( (maze[xs][ys][zs])&4 )
        markOneVisited(xs-1,ys,zs);
    if ( (maze[xs][ys][zs])&8 )
        markOneVisited(xs,ys-1,zs);
}
markAroundVisited();

function formatNumber(n, siz) {  // Prepend n with zeros until siz in length.
    "use strict";
    n = n.toString();
    var s = "";
    for ( var i=0 ; n.length+i<siz ; i++ )
        s += "0";
    s += n;
    return s;
}

function removeSaveLink() {  // Remove download link (and delete its blob).
    "use strict";
    var elts = document.querySelectorAll("a.download-link");
    for ( var i=0 ; i<elts.length ; i++ ) {
        // Note to self: list returned by .querySelectorAll() is NOT live.
        URL.revokeObjectURL(elts[i]);
        elts[i].parentNode.removeChild(elts[i]);
    }
}

function makeSaveLink() {  // Create download link.
    "use strict";
    if ( exited )
        return;
    removeSaveLink();
    var dump = JSON.stringify({maze:maze, mazeDeco:mazeDeco, mazeVisited:mazeVisited, obsx:obsx, obsy:obsy, obsz:obsz, obsth:obsth, exitX:exitX})
    var blob = new Blob([dump], {type: "application/json"})
    var url = URL.createObjectURL(blob)
    var saveP = document.getElementById("save-p");
    var link = document.createElement("a");
    saveP.appendChild(link);
    var d = new Date();
    link.download = ("maze-"+formatNumber(d.getFullYear(),4)
                     +formatNumber(d.getMonth()+1,2)
                     +formatNumber(d.getDate(),2)+".json");
    link.href = url;
    link.appendChild(document.createTextNode("click to download"));
    link.className = "download-link";
}

function loadFile() {  // Load a file provided by user.
    "use strict";
    var elt = document.getElementById("load-widget");
    if ( elt.files.length == 0 )
        return;
    var file = elt.files[0];
    if ( ! ( file.type == "application/json"
             || file.type == "application/javascript"
             || /\.json$/.test(file.name) ) ) {
        alert("Please select a JSON file");
        return;
    }
    var fr = new FileReader();
    fr.onload = function(e) {
        // Called by .readAsText() when content is available
        "use strict";
        var errstr = "bad data";
        var size = [ xsize, ysize, zsize ];
        function validateArray(obj, depth, endType, maybeNull) {
            // Validate the array as maze-sized consisting of endType
            // (throws an Error if this fails).
            "use strict";
            if ( depth == size.length ) {
                if ( maybeNull && obj === null )
                    return;
                if ( typeof(obj) != endType )
                    throw new Error(errstr);
                return;
            }
            var l = size[depth];
            if ( typeof(obj) != "object" )
                throw new Error(errstr);
            if ( maybeNull && obj === null )
                return;
            if ( ! ( obj instanceof Array
                     && obj.length == l ) )
                throw new Error(errstr);
            for ( var i=0 ; i<l ; i++ )
                validateArray(obj[i], depth+1, endType, maybeNull);
        }
        try {
            var data = JSON.parse(fr.result);
            // Perform extremely minimal sanity check.
            if ( ! ( typeof(data.obsx) == "number"
                     && typeof(data.obsy) == "number"
                     && typeof(data.obsz) == "number"
                     && typeof(data.obsth) == "number"
                     && typeof(data.exitX) == "number" ) )
                throw new Error(errstr);
            if ( ! ( data.obsx >= 0 && data.obsx < xsize
                     && data.obsy >= 0 && data.obsy < ysize
                     && data.obsz >= 0 && data.obsz < zsize
                     && data.obsth >= 0 && data.obsth < 360
                     && data.exitX >= 0 && data.exitX < xsize
                     && data.maze.length == xsize
                     && data.mazeDeco.length == xsize ) )
                throw new Error(errstr);
            validateArray(data.maze, 0, "number", false);
            validateArray(data.mazeDeco, 0, "number", false);
            validateArray(data.mazeVisited, 0, "boolean", true);
            /* These checks to not guarantee that the file is valid
             * (e.g., no check is done to see if the edges have
             * walls), but if the player wishes to cheat or shoot
             * themselves in the foot, it's none of our business.
             * There is no security involved here. */
            // Now load the data:
            maze = data.maze;
            mazeDeco = data.mazeDeco;
            mazeVisited = data.mazeVisited;
            obsx = data.obsx;
            obsy = data.obsy;
            obsz = data.obsz;
            obsth = data.obsth;
            xs = Math.floor(obsx);
            ys = Math.floor(obsy);
            zs = Math.floor(obsz);
            exitX = data.exitX;
            exited = false;
            // Act accordingly:
            computeUV();
            loadTriangles();
            removeSaveLink();
            loadViewPoint();
            redraw();
//            alert("File loaded successfully");
        } catch (e) {
            if  (e instanceof SyntaxError)
                alert("This is not a valid JSON file");
            else if (e instanceof Error && e.message == errstr)
                alert("This JSON file contains bad data");
            else // When in doubt, don't catch the exception. :-(
                throw e;
        }
    }
    fr.readAsText(file);
}

function rotateLeft() {  // Turn 15 degrees left.
    "use strict";
    if ( exited )
        return;
    obsth += 15;
    obsth = obsth%360;
    computeUV();  
    loadViewPoint();
    redraw();
}

function rotateRight() {  // Turn 15 degrees right.
    "use strict";
    if ( exited )
        return;
    obsth += 345;
    obsth = obsth%360;
    computeUV();
    loadViewPoint();
    redraw();
}

function move(stepfw, steprg) {  // Move forward and/or right by a small step.
    "use strict";
    if ( exited )
        return;
    var newx = obsx - obsv*stepfw + obsu*steprg;
    var newy = obsy + obsu*stepfw + obsv*steprg;
    var fracx = newx - xs;
    var fracy = newy - ys;
    // Avoiding bumping into walls of this square:
    if ( fracx > 0.85 && ! (maze[xs][ys][zs]&1) )
        fracx = 0.85;
    if ( fracy > 0.85 && ! (maze[xs][ys][zs]&2) )
        fracy = 0.85;
    if ( fracx < 0.15 && ! (maze[xs][ys][zs]&4) )
        fracx = 0.15;
    if ( fracy < 0.15 && ! (maze[xs][ys][zs]&8) )
        fracy = 0.15;
    // Also avoiding bumping into walls in the corners:
    var tfracx = fracx;  var tfracy = fracy;
    if ( tfracx > 0.85 && tfracy > 0.85  // NE corner
         && ( xs>=xsize-1 || ! (maze[xs+1][ys][zs]&2)
              || ys>=ysize-1 || ! (maze[xs][ys+1][zs]&1) ) ) {
        if ( tfracx >= tfracy )
            fracy = 0.85;
        else
            fracx = 0.85;
    }
    if ( tfracx < 0.15 && tfracy > 0.85  // NW corner
         && ( xs<1 || ! (maze[xs-1][ys][zs]&2)
              || ys>=ysize-1 || ! (maze[xs][ys+1][zs]&4) ) ) {
        if ( 1-tfracx >= tfracy )
            fracy = 0.85;
        else
            fracx = 0.15;
    }
    if ( tfracx < 0.15 && tfracy < 0.15  // SW corner
         && ( xs<1 || ! (maze[xs-1][ys][zs]&8)
              || ys<1 || ! (maze[xs][ys-1][zs]&4) ) ) {
        if ( 1-tfracx >= 1-tfracy )
            fracy = 0.15;
        else
            fracx = 0.15;
    }
    if ( tfracx > 0.85 && tfracy < 0.15  // SE corner
         && ( xs>=xsize-1 || ! (maze[xs+1][ys][zs]&8)
              || ys<1 || ! (maze[xs][ys-1][zs]&1) ) ) {
        if ( tfracx >= 1-tfracy )
            fracy = 0.15;
        else
            fracx = 0.85;
    }
    // Now actually move:
    obsx = xs + fracx;  obsy = ys + fracy;
    var changedSquare = false;
    if ( fracx < 0 || fracy < 0 || fracx >= 1 || fracy >= 1 ) {
        xs = Math.floor(obsx);
        ys = Math.floor(obsy);
        fracx = obsx-xs;
        fracy = obsy-ys;
        changedSquare = true;
    }
    // Vertical handling:
    var voff = (maze[xs][ys][zs]>>4)&3;  // Vertical offset downwards
    var slant = !!voff;
    var slope = (maze[xs][ys][zs]>>6)&3;  // Direction of downwards slope
    var isbothalf = (maze[xs][ys][zs]>>8)&1;  // Is this a bottom half?
    var swdz = slant ? -(voff-(slope<2))/3 : 0;  // Vertical offset of SW corner
    var edz = slant ? (([-1,0,1,0])[slope])/3 : 0;  // Vertical diff east
    var ndz = slant ? (([0,-1,0,1])[slope])/3 : 0;  // Vertical diff north
    obsz = zs + 0.5 + isbothalf + swdz + edz*fracx + ndz*fracy;
    var oldzs = zs;
    zs = Math.floor(obsz);
    // Act accordingly:
    if ( changedSquare ) {  // We've moved to a different square
        loadTriangles();
        markAroundVisited();
        removeSaveLink();
    }
    loadViewPoint();
    redraw();
    if ( xs == exitX && ys == 0 && zs == zsize-1 && fracy<0.3 ) {
        exited = true;
        alert("Congratulations!  You found the exit!");
        window.location = "http://www.google.com/images?q=freedom";
    }
}

var showWholeMap = false;

function popupMap() {  // Summon a popup map.
    "use strict";
    var div = document.createElement("div");
    document.body.appendChild(div);
    div.className = "map-overlay";
    var map = document.createElement("canvas");
    div.appendChild(map);
    map.width = "640";
    map.height = "480";
    var ctx = map.getContext("2d");
    ctx.lineCap = "round";  ctx.lineJoin = "round";
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,640,480);
    ctx.strokeStyle = "black";
    ctx.translate(320,240);
    var sc = Math.min(600/xsize,440/ysize);  ctx.scale(sc, -sc);
    ctx.translate(-xsize/2, -ysize/2);
    ctx.lineWidth = .1;
    // Draw missing squares and slopes:
    for ( var i=0 ; i<xsize ; i++ ) {
        for ( var j=0 ; j<ysize ; j++ ) {
            if ( ! ( showWholeMap || mazeVisited && mazeVisited[i] && mazeVisited[i][j] && mazeVisited[i][j][zs] ) ) {
                ctx.fillStyle = "rgb(192,192,192)";
                ctx.fillRect(i,j,1,1);
            } else if ( (maze[i][j][zs]&15) == 0 ) {
                ctx.fillStyle = "rgb(64,64,64)";
                ctx.fillRect(i,j,1,1);
            } else if ( (maze[i][j][zs]>>4)&3 ) {
                ctx.fillStyle = ((maze[i][j][zs]>>8)&1) ? "rgb(153,243,243)" : "rgb(243,204,166)";
                ctx.fillRect(i,j,1,1);
            }
        }
    }
    // Draw walls:
    for ( var i=0 ; i<xsize ; i++ ) {
        for ( var j=0 ; j<ysize ; j++ ) {
            if ( ( showWholeMap || mazeVisited && mazeVisited[i] && mazeVisited[i][j] && mazeVisited[i][j][zs] )
                 && typeof(maze[i][j][zs]) == "number" ) {
                if ( ! (maze[i][j][zs]&1) ) {
                    ctx.beginPath();  ctx.moveTo(i+1,j);  ctx.lineTo(i+1,j+1);  ctx.stroke();
                }
                if ( ! (maze[i][j][zs]&2) ) {
                    ctx.beginPath();  ctx.moveTo(i,j+1);  ctx.lineTo(i+1,j+1);  ctx.stroke();
                }
                if ( ! (maze[i][j][zs]&4) ) {
                    ctx.beginPath();  ctx.moveTo(i,j);  ctx.lineTo(i,j+1);  ctx.stroke();
                }
                if ( ! (maze[i][j][zs]&8) ) {
                    ctx.beginPath();  ctx.moveTo(i,j);  ctx.lineTo(i+1,j);  ctx.stroke();
                }
            }
        }
    }
    // The exit:
    if ( zs == zsize-1 ) {
        ctx.strokeStyle = "rgb(166,217,255)";
        ctx.beginPath();
        ctx.moveTo(exitX, 0);
        ctx.lineTo(exitX+1, 0);
        ctx.stroke();
    }
    // Player location and orientation:
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(obsx-obsu*0.3, obsy-obsv*0.3);
    ctx.lineTo(obsx-obsv*0.5, obsy+obsu*0.5);
    ctx.lineTo(obsx+obsu*0.3, obsy+obsv*0.3);
    ctx.stroke();
    // Dismiss the map on click or keypress.
    div.addEventListener("click", function(e) {
        div.parentNode.removeChild(div);
        e.preventDefault();
    }, true);
    div.addEventListener("keydown", function(e) {
        div.parentNode.removeChild(div);
        e.preventDefault();
    }, true);
    div.tabIndex = 0;
    div.focus();
}


// Chrome doesn't define KeyEvent. :-(
var KE;
if ( typeof(KeyEvent) == "undefined" )
    KE = {};
else
    KE = KeyEvent;
if ( typeof(KE.DOM_VK_SPACE) == "undefined" ) {
    KE.DOM_VK_LEFT = 37;
    KE.DOM_VK_RIGHT = 39;
    KE.DOM_VK_UP = 38;
    KE.DOM_VK_DOWN = 40;
    KE.DOM_VK_INSERT = 45;
    KE.DOM_VK_DELETE = 46;
    KE.DOM_VK_F1 = 112;
}

var keyListener = function(e) {
    "use strict";
//    alert("Debug: "+e.keyCode);
    if ( e.keyCode == KE.DOM_VK_LEFT ) {
        rotateLeft();
        e.preventDefault();
    } else if ( e.keyCode == KE.DOM_VK_RIGHT ) {
        rotateRight();
        e.preventDefault();
    } else if ( e.keyCode == KE.DOM_VK_UP ) {
        move(0.1,0.);
        e.preventDefault();
    } else if ( e.keyCode == KE.DOM_VK_DOWN ) {
        move(-0.1,0.);
        e.preventDefault();
    } else if ( e.keyCode == KE.DOM_VK_INSERT ) {
        move(0.,-0.1);
        e.preventDefault();
    } else if ( e.keyCode == KE.DOM_VK_DELETE ) {
        move(0.,0.1);
        e.preventDefault();
    } else if ( e.keyCode == KE.DOM_VK_F1 ) {
        popupMap();
        e.preventDefault();
    }
};

// Chrome doesn't send keypress events for special keys. :-(
document.addEventListener("keydown", keyListener, false);

//]]>