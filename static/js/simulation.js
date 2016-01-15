window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || 
	window.webkitRequestAnimationFrame || 
	window.mozRequestAnimationFrame || 
	window.oRequestAnimationFrame || 
	window.msRequestAnimationFrame ||
	function(callback) {
	window.setTimeout(callback, 1000 / 60);
	};
})();


var blocks = new Array();
var canvas;
var context;
var startTime;
var gripper;
var xMove;
var yMove;
var releasability = new Array();

// function init() {
// 	var wrapper = document.getElementById('test');
// 	canvas = document.getElementById('simCanvas');
// 	canvas.style.width = '100%';
// 	canvas.style.height = '100%';
// 	canvas.width  = wrapper.clientWidth;
//   	canvas.height = wrapper.clientHeight;

// 	context = canvas.getContext("2d");
// 	startTime = (new Date()).getTime();
// 	xMove = canvas.width/10;
// 	yMove = canvas.height/10;
// 	gripper = new Gripper();
	
// 	addBlocks();
// 	animate();
// }

function init(gripperInit, blocksInit, blocksEnd) {
	var wrapper = document.getElementById('test');
	canvas = document.getElementById('simCanvas');
	canvas.style.width = '100%';
	canvas.style.height = '100%';
	canvas.width  = wrapper.clientWidth;
  	canvas.height = wrapper.clientHeight;

	context = canvas.getContext("2d");
	startTime = (new Date()).getTime();
	xMove = canvas.width/10;
	yMove = canvas.height/10;
	gripper = new Gripper(gripperInit);
	var blockArray = parseBlocks(blocksInit);
	addBlocks(blockArray);
	animate();
}

function execute(operationList) {
	for(i=0; i < operationList.length; ++i) {
		gripper.Move(operationList[i]);
	}
}

Array.prototype.compare = function(testArr) {
	this.sort();
	testArr.sort();
    if (this.length != testArr.length) return false;
    for (var i = 0; i < testArr.length; i++) {
        if (this[i].compare) { 
            if (!this[i].compare(testArr[i])) return false;
        }
        if (this[i] !== testArr[i]) return false;
    }
    return true;
}

function isCorrect(userSolution, correctSolution) {
	var userBlockArray = parseBlocks(userSolution);
	var correctBlockArray = parseBlocks(correctSolution);

	console.log("This is what the user says: ", userBlockArray);
	console.log("Computer says fuckoff: ", correctBlockArray);

	if(userBlockArray.compare(correctBlockArray)) {
	    console.log("YAAAAY!");
	    return true;
	} else {
	    console.log("NOOOOO!");
	    return false;
	}
}

function addBlocksToForm(finalPositions) // no ';' here
{
    var elem = document.getElementById("finalBlockPositions");
    elem.value = finalPositions;
    // console.log("finalTEST: ", elem.value);
}

function checkFinalPositions(correctSolution) {
	var blockFinalPositions = [];
	for(i=0; i<blocks.length; i++) {
		var x = blocks[i].x/xMove;
		var y = blocks[i].y/yMove;
		var color = blocks[i].color
		var blockString = String(x) + "," + String(y) + ',' + String(color);
		blockFinalPositions[i] = blockString;
	}
	var formattedFinalPositions = [blockFinalPositions.join(";")];

	if(isCorrect(formattedFinalPositions,correctSolution)) {
		addBlocksToForm(formattedFinalPositions);
		check_releases();
		releasability = new Array();
		var currentLevel = parseInt($('#output').val());
		if(currentLevel<levelNumber){
			compute_score();
			alert("Congratulations! You found the solution! Click to go to the next level;");
		}
		else{
			compute_score();
			alert("Congratulations! You finished the game!");
		}
	}else{
		addBlocksToForm(["incorrect"]);
		document.getElementById("userScore").value = 0;
		alert("I am sorry, but this is not a valid solution!");
		console.log("This is not a correct solution!");
	}
}

function check_releases(){
	c = releasability.length - 1;
	for(i=solution.length -1 ;i>=0;i--){
		if(solution[i]=="release"){
			if(releasability[c]==false){
				solution.splice(i,1);

			}	
		c--;
		}
	}
}

function compute_score(){
	var score = getSolution().length;
	if(score<=perfectScore){
		alert("You did the perfect score! 3/3");
		document.getElementById("userScore").value = 3;
		return;
	}
	if(score<=goodScore){
		alert("You got a good score! 2/3");
		document.getElementById("userScore").value = 2;
		return;
	}
	alert("You got the minimum score! 1/3");
	document.getElementById("userScore").value = 1;
	return;
}

function Block(x, y, color) {
	this.x = x;
	this.y = y;
	this.width = canvas.width/10;
	this.height = canvas.height/10;
	this.color = color;
}

Block.prototype.update = function() {
	context.beginPath();
	context.rect(this.x, this.y, this.width, this.height);
	context.fillStyle = this.color;
	context.fill();
	context.strokeStyle = this.color;
	context.stroke();
	context.closePath();
}

Block.prototype.updateX = function(value) {
	// boundary check
	if (this.x + value < canvas.width - this.width &&
		this.x + value >= 0 + this.width) {
		this.x += value;
	}
}

Block.prototype.updateY = function(value) {
	// boundary check
	if(this.y + value <= canvas.height - this.height &&
	   this.y + value > 0) {

		this.y += value;
	}
}

function parseGripper(gripper) {
	var gripperString = gripper[0];
	var gripperAttributes = gripperString.split(',');
	return gripperAttributes;
}

function Gripper(gripperInit) {
	var gripperAttributes = parseGripper(gripperInit);
	var xInit = gripperAttributes[0];
	var yInit = gripperAttributes[1];
	this.width = Math.floor((canvas.width/20));
	this.x = this.width + xMove*xInit;
	this.y = this.width + yMove*yInit;
	this.speed = 1;
	this.color = 'black';
	this.blockID = null;
	this.hold = false;
}

Gripper.prototype.update = function() {
	context.beginPath();
	context.arc(this.x,
                this.y, 
                this.width, 
                0, 
                Math.PI * 2,
                false);
	context.closePath();
	context.fillStyle = this.color;
	context.fill();
}

Gripper.prototype.updateX = function(value) {
	// Gripper + block collision detection
	var collision = false;
	if(this.hold == true) {
		collision = this.CollisionDetection(value);
	}

	// Cannot move block if it collides with another block
	if(collision == false) {
		// boundary check
		if(this.x + value < canvas.width - this.width &&
		   this.x + value >= 0 + this.width) {
			this.x += value;
		}

		// if gripper is holding a block, move the block
		if(this.hold == true && this.blockID != null) {
			blocks[this.blockID].updateX(value);
		}
	}
}

Gripper.prototype.updateY = function(value) {
// Gripper + block collision detection
	var collision = false;
	if(this.hold == true) {
		collision = this.CollisionDetection(value);
	}

	// Cannot move block if it collides with another block
	if(collision == false) {
		// boundary check
		if(this.y + value < canvas.height - this.width &&
		    this.y + value >= 0 + this.width) {
			this.y += value;
		}

		// if gripper is holding a block, move the block
		if(this.hold == true && this.blockID != null) {
			blocks[this.blockID].updateY(value);
		}
	}
}

// Graps blocks
Gripper.prototype.Grap = function() {
	// Must be the top block, cannot grap 
	// a block under another block
	if(gripper.canGrap()) {
		this.color = 'pink';
		this.hold = true;
	}
}

// Releases blocks
Gripper.prototype.Release = function() {
	// Gripper cannot release over empty space
	if(gripper.canRelease()) {
		this.color = 'black';
		this.hold = false;
		this.blockID = null;
		releasability.push(true);
		return;
	}
	releasability.push(false);
}

Gripper.prototype.SetBlockID = function(value) {
	this.blockID = value;
}

Gripper.prototype.Move = function(value) {
	switch(value) {
		case 'right':
			gripper.updateX(xMove);
			break;
		case 'left':
			gripper.updateX(-xMove);
			break;
		case 'up':
			gripper.updateY(-yMove);
			break;
		case 'down':
			gripper.updateY(yMove);
			break
		case 'grab':
			gripper.Grap();
			gripper.grabBlock();
			break;
		case 'release':
			gripper.Release();
			break;
		default:
			break;
	}
}

// Checks if there is a collision between a moving block
// and another block
Gripper.prototype.CollisionDetection = function(value) {
	// Gets the direction of the move
	var sign = 1;
	if(value < 0) {
		sign = -1;
	}

	// Collision detection for x and y moves
	if(Math.abs(value) == xMove) {
		for(a=0; a<blocks.length; ++a) {
			if(a!=this.blockID) {
				if(blocks[this.blockID].x + (xMove * sign) == blocks[a].x &&
				   blocks[this.blockID].y == blocks[a].y) {
					// console.log("BLOCKED");
					alert("Illegal Move: Your move is blocked");
					return true;
				}
			}
		}
	} else if (Math.abs(value) == yMove) {
		for(a=0; a<blocks.length; ++a) {
			if(a!=this.blockID) {
				if(blocks[this.blockID].x == blocks[a].x &&
			 	   blocks[this.blockID].y + (yMove * sign) == blocks[a].y) {
					// console.log("BLOCKED");
					alert("Illegal Move: Your move is blocked");
					return true;
				}
			}
		}
	}

	return false;
}

// Check if there is a empty space beneath the moving block
// Gripper not allowed to realese over empty space
Gripper.prototype.canRelease = function() {
	// Check if the block is on the floor
	// Allowed to release on the floor
	if(blocks[this.blockID].y == canvas.height - yMove) {
		return true;
	} else {
		// Check if there is empty space under the moving block
		// Cannot drop a block on empty space
		return hasBlockUnder(this.blockID);
	}
}

// Checks if there is another block on top of the block
// that the gripper is trying to grap
Gripper.prototype.canGrap = function() {
	for(b=0; b<blocks.length; ++b) {
		if((blocks[b].x + this.width) == this.x && 
		   ((blocks[b].y + this.width) == (this.y - yMove))) {
		   	alert("Illegal Move: Cannot grab block under another block");
		   	return false;
		}
	}
	return true;
}

// Checks if there is a block under the moving block before release
// Gripper is not allowed to release over empty space
function hasBlockUnder(id) {
	for(x=0; x<blocks.length; ++x) {
		if(x != id) {
			if(blocks[x].y == blocks[id].y + yMove && 
			   blocks[x].x == blocks[id].x) {
				return true
			} else {
				alert("Illegal Move: Cannot release block over empty space");
				return false;
			}
		}
	}
}

// Checks if there is a block at the gripper location
// Sets the blockID for the gripper so the block can be moved
Gripper.prototype.grabBlock = function() {
	for(k=0; k < blocks.length; ++k) {
		if((gripper.x == blocks[k].x + gripper.width ||
		    gripper.x == blocks[k].x - gripper.width) &&
		   (gripper.y == blocks[k].y - gripper.width ||
		    gripper.y == blocks[k].y + gripper.width)) {
				gripper.SetBlockID(k);
		}
	}
}

function parseBlocks(blocks) {
	// console.log("Before: ", blocks[0]);
	var blocksString = blocks[0];
	var blockArray = blocksString.split(';');
	// console.log("After: ", blockArray);
	return blockArray;
}

function parseBlock(block) {
	var blockAttributes = block.split(',');
	return blockAttributes;
}

function addBlocks(blockArray) {
	// var a = new Block(0, yMove*2, 'blue');
	// var b = new Block(xMove*2, 0, 'blue');
	// var c = new Block(xMove*4, yMove*2, 'blue');
	// var d = new Block(xMove*2, yMove*4, 'blue');
	// var e = new Block(xMove*2, yMove*2, 'white');
	// blocks.push(a);
	// blocks.push(b);
	// blocks.push(c);
	// blocks.push(d);
	// blocks.push(e);
	for (var i = 0; i < blockArray.length; i++) {
    	var blockAttributes = parseBlock(blockArray[i]);
    	var x = parseInt(blockAttributes[0]);
    	var y = parseInt(blockAttributes[1]);
    	var color = blockAttributes[2];

    	var block = new Block(xMove*x, yMove*y, color);
    	blocks.push(block);
	}
}

function drawGrid() {
	var bw = canvas.width;
	var bh = canvas.height;

	var inc = bw/10;
	for (var x = 0; x <= bw; x += inc) {
	    context.moveTo(0.5 + x, 0);
	    context.lineTo(0.5 + x, bh);
	}

	inc = bh/10;
	for (var x = 0; x <= bh; x += 40) {
	    context.moveTo(0, 0.5 + x);
	    context.lineTo(bw, 0.5 + x);
	}
	context.strokeStyle = "black";
	context.stroke();
}

function animate() {
	// clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
	
	// draw the 2D gridlines
	drawGrid();

	// update the block positions
    for(i=0; i<blocks.length; ++i) {
    	blocks[i].update();
    }
    
    // update the gripper position	
	gripper.update();

    // request new frame
    requestAnimFrame(animate);
}
