var D = document;

rand = function(n){
	return 0|(Math.random()*n);
};

D.title = 'slit images';

PI = Math.PI;
si = Math.sin;
M = Math.max;
N = Math.min;
Q = Math.sqrt;

var b = D.body;
var Ms = b.style;
Ms.margin='0px';
var blackcolor = Ms.background = "#000";
Ms.overflow = 'hidden';
b.innerHTML = '';
var c = D.createElement('canvas');
b.appendChild(c);
c.style.background = "transparent";

//
// request animation frame, from random place on the internet
//

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = M(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var img_dir = 'gfx/';
var img_ref = [];

function ImageLoader(Images, Callback){
    // Keep the count of the verified images
    var allLoaded = 0;

    // The object that will be returned in the callback
    var _log = {
        success: [],
        error: []
    };

    // Executed everytime an img is successfully or wrong loaded
    var verifier = function(){
        allLoaded++;

        // triggers the end callback when all images has been tested
        if(allLoaded == Images.length){
			//console.log(_log);
            Callback.call(undefined, _log);
        }
    };

    // Loop through all the images URLs
    for (var index = 0; index < Images.length; index++) {
        // Prevent that index has the same value by wrapping it inside an anonymous fn
        (function(i){
            // Image path providen in the array e.g image.png
            var imgSource = Images[i];
            var img = new Image();
            
            img.addEventListener("load", function(){
                _log.success.push(imgSource);
                verifier();
            }, false); 
            
            img.addEventListener("error", function(err){
                _log.error.push(imgSource);
                verifier();
            }, false); 
           //console.log(img_dir + imgSource);
            img.src = img_dir + imgSource;
			
			img_ref.push(img);
        })(index);
    }
}

b.onload = function() {
	
	ImageLoader(["6a8c475c1ca295ce2ea124fd5cf30ceeaa31ae30.jpg", "51fd74aa826ee476acdcfa9ec197080a20301d9f.jpg", "80e0f8fd0b4eb67a1ce295b578dc3957bb62056c.jpg", "871846d2bd4ad184a5a57bc4f8130e770e89765b.jpg"],
		function(result){
			if(result.error.length != 0){
				// outputs: ["example.png", "example.jpg"]
				console.log("The following images couldn't be properly loaded: ", result.error);
			}

			// outputs: ["http://i.imgur.com/fHyEMsl.jpg"]
			console.log("The following images were succesfully loaded: ", result.success);
			drawCanvas();
	});
	
}

var w;
var h;
var ctx;
var values = [];

var tc = ['rgba(164,36,59,1)', 'rgba(216, 201, 155, 1)', 'rgba(216, 151, 160, 1)', 'rgba(189, 99, 47, 1)', 'rgba(39, 62, 71, 1)'];
var img_dir = 'gfx/';
/*function loadBackgroundImage(image_filename, cb) {
	bg_img = new Image();
	bg_img.onload = cb;
	bg_img.src = img_dir + image_filename;
}*/

var init_time = (new Date()).getTime();

var ext = {'num_lines': 20, 'cos_width': 10};

var shapedrom = [[50,20],[100,20],[150,200],[50,200],[50,300],[10,300]];
var extruss = [];

var extruder = 2;

function drawCanvas() {

	resize();

	var num_nodes = 120;
//	var angle = (Math.PI*2)/num;

	var sync = 100;
	var csync = 0;
	var bsync = 0;

	var bgcolor = 'rgba(0,0,0,1.0)';
	
	//console.log(img_ref);
	var bg_img = img_ref[2];
	
	function drawThis(milis) {
		
	let num_lines = ext['num_lines'];
	let cos_width = ext['cos_width'];
						
		if (bg_img != undefined) {
			
			d2 = new Date();
			n2 = d2.getTime(); 
			timer = (n2-init_time);

			let len = Math.floor(w / num_lines);
			let iw = bg_img.width;
			let ih = bg_img.height;
			let ilen = Math.floor(iw / num_lines);
			//let iwww = iw/ilen;
			//console.log(ilen);
			
			for (let i=0; i < num_lines; i++) {
				
				for (let j=0.0; j<Math.PI*2; j+=Math.PI*0.1) {
					
					let top_elev = 0.5+Math.sin((i/num_lines+Math.cos(i*0.5)*cos_width)*0.01+j+timer*0.0001)*0.5; //(Math.sin( Math.abs(num_lines-i) + timer*0.001) + 1.0) * 0.5;
				
					let imid = top_elev * ih;
					let mid = top_elev * h;
					
					ctx.drawImage(bg_img, i*ilen, imid, ilen, ilen*ih/iw, i*len, mid, len, len*h/w);
				}
				
				//ctx.drawImage(bg_img, i*ilen, imid, i*ilen+ilen, ih-imid, i*len, 0,   i*len+len, h-mid);
				
				//ctx.drawImage(bg_img, i*ilen, 0,    i*ilen+ilen, imid,    i*len, h-mid, i*len+len, h);
				
				//ctx.drawImage(bg_img, i*ilen, imid, i*ilen+ilen, ih-imid, i*len, mid, i*len+len, h-mid);
			}
		}
		
		
	}
	
	function drawScreen(milis) {
		
		// draw shape
		ctx.save();
		ctx.lineWidth = 0;
		ctx.strokeStyle = "transparent";
		ctx.beginPath();
		ctx.moveTo(shapedrom[0][0],shapedrom[0][1]);
		for (var i=1; i<shapedrom.length; i++) {
			ctx.lineTo(shapedrom[i][0],shapedrom[i][1]);
		}
		ctx.clip();
		ctx.drawImage(img_ref[2],0,0,w,h);
		ctx.restore();
		
		// draw extruder face
		ctx.save();
		ctx.lineWidth = 5;
		ctx.strokeStyle = "rgba(105,0,255,1.0)";
		ctx.beginPath();
		ctx.moveTo(shapedrom[extruder][0],shapedrom[extruder][1]);
		var lout = extruder+1;
		if (lout >= shapedrom.length) lout = 0;
		ctx.lineTo(shapedrom[lout][0],shapedrom[lout][1]);
		ctx.stroke();
		ctx.restore();
		
		if (extruding && (extruss.length != 0)) {
			ctx.save();
			ctx.lineWidth = 2;
			ctx.strokeStyle = "rgba(205,205,255,0.5)";
			ctx.beginPath();
			ctx.moveTo(extruss[0][0],extruss[0][1]);
			for (var i=1; i<extruss.length; i++) {
				ctx.lineTo(extruss[i][0],extruss[i][1]);
			}
			ctx.stroke();
			ctx.restore();
		}
		
	}
	
	var extMove = (new Date()).getTime();
	
	function updateMovement(milis) {
		if (extruding == true) {
		//	console.log('move up');
		
			// define growth area between extruder and lout, grow outwards.
			if (extruss.length == 0) {
				extruss[0] = shapedrom[extruder];
				var lout = extruder+1;
				if (lout >= shapedrom.length) lout = 0;
				extruss[1] = shapedrom[lout];
				extMove = (new Date()).getTime();
			} else {
			
				var breakingPoint = (new Date()).getTime();
				if (extMove + 500 <= breakingPoint) {
					extMove = (new Date()).getTime();
					//TODO: break joints
				} else {
					//TODO: keep extruding outwards
					// for all sections of extruss, get normal
				}
				
				//TODO: if growth sections touch other parts of shapedrom: end growth and assimilate void
			}
		
		} else {
			extruss = [];
			var thisMove = (new Date()).getTime();
			//console.log('move: ' + thisMove);
			//console.log('last: ' + lastMove);
			if (lastMove + 500 <= thisMove) {
				extruder++;
				if (extruder >= shapedrom.length) extruder = 0;
				lastMove = (new Date()).getTime();
			}
		}
	}
	
	requestAnimationFrame( animate );

	function animate() {
		requestAnimationFrame( animate );
		let milis = (new Date()).getTime() - init_time;
		ctx.clearRect(0,0,w,h);
		//ctx.drawImage(img_ref[1],0,0,w,h);
		//drawThis(milis);
		drawScreen(milis);
		updateMovement(milis);
	}
}

window.onresize = resize;

function resize() {
	w = window.innerWidth;
	h = window.innerHeight;
	
	c.setAttribute("width", w);
	c.setAttribute("height", h);
	
	ctx = c.getContext("2d");
	ctx.width = w;
	ctx.height = h;
}

document.addEventListener("keydown", keyDownTextField, false);

document.addEventListener("keyup", keyUp, false);

var controls;
var moveUp = false;
var moveDown = false;
var moveLeft = false;
var moveRight = false;
var extruding = false;

function keyDownTextField(e) {
	var keyCode = e.keyCode;
	//console.log('key down: ' + keyCode);

	switch(keyCode) {
		case 32: // space
			//ext = {'num_lines': 30, 'cos_width': 20};
			noMoves();
			extruding = true;
		break;
		case 38: // up
			noMoves();
			moveUp = true;
		case 40: // down
			noMoves();
			moveDown = true;
		break;
		case 37: // right
			noMoves();
			moveRight = true;
		break;
		case 39: // left
			noMoves();
			moveLeft = true;
		break;
	}
}

function noMoves() {
	moveUp = false;
	moveDown = false;
	moveLeft = false;
	moveRight = false;
	extruding = false;
}

var lastMove = (new Date()).getTime();

function keyUp(e) {
	var keyCode = e.keyCode;
	//console.log('key up: ' + keyCode);
	switch(keyCode) {
		case 32: // space
			noMoves();
			lastMove = (new Date()).getTime();
		break;
		case 38: // up
			moveUp = false;
			lastMove = (new Date()).getTime();
		break;
		case 40: // down
			moveDown = false;
		break;
		case 37: // right
			moveRight = false;
		break;
		case 39: // left
			moveLeft = false;
		break;
	}
}