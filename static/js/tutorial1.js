function initTut() {
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
	gripper = new Gripper(["3,8"]);
	// xMove*3, yMove*9, 'brown'
	var blockArray = parseBlocks(["3,9,brown"]);
	addBlocks(blockArray);
	animate();
}

function executeTut(operationList) {
	if(tut1TxtNumber<3){
		alert("Oak's words echoed... There's a time and place for everything, but not now.");
		return;
	}
	if(tut1TxtNumber==4){
		alert("Oak's words echoed... There's a time and place for everything, but not now.");
		return;
	}
	for(i=0; i < operationList.length; ++i) {
		gripper.Move(operationList[i]);
	}
}

var lblTut0 = 'Welcome to the second tutorial! Here you will get familiar with blocks! The gripper can grab and release blocks wherever you want!';
var lblTut1 = 'The brown square that you can see under the black circle is a block! Our objective is to move this block one position right. To do that, we must grab it with the gripper and then relase it in the correct position!';
var lblTut2 = 'New commands are available. Left and rigth let you move the gripper one position left or one position right. Grab and release let you grab or release a block in the position where the gripper is!';
var lblTut3 = 'The sequence I put should move the gripper down and grab the block. Note how much is important then the grab operation is used in a position where a block lies. What are you waiting for? Press simulate to see what happens, then save and reset!';
var lblTut4 = 'As you can see the gripper went down and its colour changed from black to pink! This means the gripper correctly grabbed the block!';
var lblTut5 = 'Now it is your turn! Move the block right! You should use the minimum number of necessary moves! Remember that you can clear the list of operations by dragging them to the DELETE box or using the clear button.';
var lblTut6 = 'Fantastic! You got it! I think it\'s time to go to the first level, in which you will have to reach a final configuration! There you will find also other constructs you still don\'t know. Avoid using them :) When you are ready, click next!';
var tut1TxtNumber = 0;
function next_text(){
	tut1TxtNumber++;
	switch(tut1TxtNumber){
		case 1:
			document.getElementById('tut1Text').innerHTML = lblTut1;
			break;
		case 2:
			document.getElementById('tut1Text').innerHTML = lblTut2;
			break;
		case 3: {
			$('#mainsortable').empty();
			$.fn.addOperation("down");
			$.fn.addOperation("grab");		
			document.getElementById("btn-tut").disabled = false; 
			document.getElementById("btn-check").disabled = false; 
			document.getElementById('tut1Text').innerHTML = lblTut3;
			break;
		}
		case 4:
			tut1TxtNumber--;
			break;
		case 5:
			$('#mainsortable').empty();
			document.getElementById("btn-up").disabled = false; 
			document.getElementById("btn-down").disabled = false;
			document.getElementById("btn-right").disabled = false; 
			document.getElementById("btn-left").disabled = false; 
			document.getElementById("btn-grab").disabled = false; 
			document.getElementById("btn-release").disabled = false;
			document.getElementById("btn-clear").disabled = false; 
			document.getElementById('tut1Text').innerHTML = lblTut5;
			break;
		case 6:
			tut1TxtNumber--;
			break;
		case 7:
			//TODO Change showGUI with the next level/tutorial show
			window.location.replace("showGUI");
			break;
		default:
			break;
	}
}


function check_sequence(operationList){
	if(tut1TxtNumber==3){
		tut1TxtNumber++;
		document.getElementById('tut1Text').innerHTML = lblTut4;
		return true;
	}
	if(tut1TxtNumber!=5){
		alert("Oak's words echoed... There's a time and place for everything, but not now.");
		return false;
	}
	if(operationList == null) {
		alert("You should use the movements buttons to create your script, and then SAVE it!");
		return false;
	}
	if(operationList.length != 2) {
		alert("Ooops... It looks like you did not use the right number of operators!\n ... Do you want an hint?...\n Okay, the correct number of moves is 2! :)");
		original_setup();
		return false;
	}
	if(operationList[0] != "right") {
		alert("Nice! You should use two movements... but, are you sure you should begin like this? :)\nI think you would better go right!");
		original_setup();
		return false;
	}
	if(operationList[1] != "release") {
		alert("Very close! The first move put the gripper in the exact position where he should release the block... so...?!");
		original_setup();
		return false;
	}
	if(!(gripper.x==157 && gripper.y==377 && blocks[0].x==140 && blocks[0].y==360)){
		alert("Are you sure you pressed the simulate button?");
		return;
	}
	tut1TxtNumber++;
	document.getElementById('tut1Text').innerHTML = lblTut6;
	return true;
}


function original_setup(){
	gripper.x=122;
	gripper.y=377;
	blocks[0].x=105;
	blocks[0].y=360;
	gripper.Grap();
	gripper.grabBlock();
	$('#mainsortable').empty();
}
