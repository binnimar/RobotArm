function initTut() {
	var wrapper = document.getElementById('test');
	canvas = document.getElementById('simCanvas');
	canvas.style.width = '100%';
	canvas.style.height = '100%';
	canvas.width  = wrapper.clientWidth; // canvas.offsetWidth;
  	canvas.height = wrapper.clientHeight; // canvas.offsetHeight;

	context = canvas.getContext("2d");
	startTime = (new Date()).getTime();
	xMove = canvas.width/10;
	yMove = canvas.height/10;
	gripper = new Gripper(["0,9"]);
	
	animate();
}

function executeTut(operationList){
	if(tut0TxtNumber<3){
		alert("Oak's words echoed... There's a time and place for everything, but not now.");
		return;
	} 
	if(tut0TxtNumber==4){
		if(operationList.length!=0){
		alert("This is not the right moment... You should now clear the grid!");
		return;
		}
	}
	for(i=0; i < operationList.length; ++i) {
			gripper.Move(operationList[i]);
		}
}

var lblTut0 = 'Welcome to Robotic Arm Game! Here you will learn the basic concepts of programming! To achieve this goal, you will be using a robotic gripper to move blocks in the grid!';
var lblTut1 = 'Let us show you the game! In the green grid you can see a black circle: that is your gripper! In the pink box, instead, you can see the possible moves in the first row.';
var lblTut2 = 'In order to move the gripper, you have first to press the movements button in the order you prefer, then press simulate to see what happens to see what happens to the gripper! Then clicking save&reset will check if the solution you put is correct!'
var lblTut3 = 'I pressed the UP button for you! Now you should simulate the operation and see if the solution is correct!'
var lblTut4 = 'As you can see, the gripper moved up! Now it is your turn! First of all, try to clear the grid! You should drag the UP button to the DELETE space, and then save! You can also use the clear button to remove all tiles from your grid!'
var lblTut5 = 'Perfect! Now it is the time to move the gripper to its initial position! Put your solution, simulate it and then save it!'
var lblTut6 = 'Well done! You finished your first tutorial!!! Click next to go to the next tutorial'
var tut0TxtNumber = 0;

function next_text(){
	tut0TxtNumber++;
	switch(tut0TxtNumber){
		case 1:
			document.getElementById('tut0Text').innerHTML = lblTut1;
			break;
		case 2:
			document.getElementById('tut0Text').innerHTML = lblTut2;
			break;
		case 3: {
			$.fn.addOperation("up");
			document.getElementById("btn-tut").disabled = false; 
			document.getElementById("btn-check").disabled = false; 
			document.getElementById('tut0Text').innerHTML = lblTut3;
			break;
		}
		case 4:
			tut0TxtNumber--;
			break;
		case 5:
			tut0TxtNumber--;
			break;
		case 6:
			tut0TxtNumber--;
			break;
		case 7:
			//TODO Change showGUI with the next level/tutorial show
			window.location.replace("showTutorial1");
			break;
		default:
			break;
	}
}


function check_sequence(operationList){
	if(tut0TxtNumber==3){
		if(!(gripper.x==17 && gripper.y==337)){
			alert("It looks like you made some mistakes! Try again!");
			gripper.x=17;
			gripper.y=377;
			$('#mainsortable').empty();
			document.getElementById('btn-up').click();
			return;
		}
		//Check position
		tut0TxtNumber++;
		document.getElementById("btn-clear").disabled = false; 
		document.getElementById('tut0Text').innerHTML = lblTut4;
		return;
	}
	if(tut0TxtNumber==4){
		if(operationList == null){
			tut0TxtNumber++;
			document.getElementById("btn-up").disabled = false;
			document.getElementById("btn-down").disabled = false; 
			document.getElementById('tut0Text').innerHTML = lblTut5;
			return;
		}
		if(operationList.length == 0){
			tut0TxtNumber++;
			document.getElementById("btn-up").disabled = false;
			document.getElementById("btn-down").disabled = false; 
			document.getElementById('tut0Text').innerHTML = lblTut5;
			return;
		} 
		alert("You should now clear the operation list, save it and try to simulate the empty list! Clear your grid :)");
		return;
	}
	if(tut0TxtNumber!=5){
	alert("Oak's words echoed... There's a time and place for everything, but not now.");
		return;
	}
	if(operationList == null) {
		alert("You should use the movements buttons to create your script, and then SAVE it!");
		return;
	}
	if(operationList.length != 1) {
		alert("Ooops... It looks like you did not use the right number of operators!\n ... Okay, you should use just one block here! :)");
		original_setup();
		return;
	}
	if(operationList[0] != "down") {
		alert("Are you sure that is the correct movement?!? :)\nRemember: you can edit your list by deleting some of your blocks!");
		original_setup();
		return;
	}
	if(!(gripper.x==17 && gripper.y==377)) {
		alert("Are you sure you pressed the simulate button?");
		return;
	}
	tut0TxtNumber++;
	document.getElementById('tut0Text').innerHTML = lblTut6;
	return;
}

function original_setup(){
	gripper.x=17;
	gripper.y=337;
	$('#mainsortable').empty();
}
