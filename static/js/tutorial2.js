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
	gripper = new Gripper(["2,9"]);
	var blockArray = parseBlocks(["2,9,blue;3,9,yellow"]);
	addBlocks(blockArray);
	animate();
}

function executeTut() {
	//TODO Tell Han how this is working!
	operationList=[]
	getOperationList();
	for(i=0; i < operationList.length; ++i) {
		gripper.Move(operationList[i]);
	}
}

function getNormalOperationFromSolution(solution){
	temp = solution.split(";");
	op = temp[0];
	return op.split(",");
}

function getLoopOperationFromSolution(solution){
	temp = solution.split(";");
	op = temp[3];
	return op.split(",");
}

var lblTut0 = 'Welcome to the third tutorial! Here you will learn about loops! You can use loops when you want to repeat the same action more than once!';
var lblTut1 = 'Let\'s put the blue block on the top of the yellow one! You must use three moves!';
var lblTut2 = 'Perfect! Now put the blue block on the top of the higher column of yellow blocks!';
var lblTut3 = 'Nice! What about now? You may have noticed that you have to repeat the same combination (Up, Right) a lot of times...';
var lblTut4 = 'You now have to use loops! Click on black grid and then insert Up and Right as usual!';
var lblTut5 = 'Perfect! You can use the combination in the black grid on your main code by using the operator \'Loop\'. You can also change the number of iterations with the buttons + and -! Let\'s now put the blue block in the top of the mountain! :)';
var lblTut6 = 'Congratulations! You finished also this tutorial! Click next to go on!';

var tut2TxtNumber = 0;
function next_text(){
	tut2TxtNumber++;
	switch(tut2TxtNumber){
		case 1:
			document.getElementById('tut2Text').innerHTML = lblTut1;
			document.getElementById("btn-up").disabled = false; 
			document.getElementById("btn-down").disabled = false;
			document.getElementById("btn-right").disabled = false; 
			document.getElementById("btn-left").disabled = false; 
			document.getElementById("btn-grab").disabled = false; 
			document.getElementById("btn-release").disabled = false;
			document.getElementById("btn-clear").disabled = false;
			document.getElementById("btn-tut").disabled = false; 
			document.getElementById("btn-check").disabled = false; 
			break;
		case 2:
			tut2TxtNumber--;
			break;
		case 3: 
			tut2TxtNumber--;
			break;
		case 4:
			document.getElementById('tut2Text').innerHTML = lblTut4;
			document.getElementById("btn-up").disabled = false; 
			document.getElementById("btn-right").disabled = false; 
			break;
		case 5:
			loopOperation = parseLoop();
			if(loopOperation.length!=3){
				alert("You should put exactly two operations in the black grid! Try again!");
				$('#loop-sortable').empty();
				tut2TxtNumber--;
				break;
			}
			if(loopOperation[0]!="up" || loopOperation[1]!="right"){
				alert("This is not the combination you should loop.. Try up and right instead :)");
				$('#loop-sortable').empty();
				tut2TxtNumber--;
				break;		
			}
			$('#mainsortable').empty();
			document.getElementById("btn-up").disabled = false; 
			document.getElementById("btn-down").disabled = false;
			document.getElementById("btn-right").disabled = false; 
			document.getElementById("btn-left").disabled = false; 
			document.getElementById("btn-grab").disabled = false; 
			document.getElementById("btn-release").disabled = false;
			document.getElementById("btn-clear").disabled = false;
			document.getElementById("btn-tut").disabled = false; 
			document.getElementById("btn-check").disabled = false; 
			document.getElementById("btn-loop").disabled = false;
			document.getElementById("btn-loopUp").disabled = false;
			document.getElementById("btn-loopDown").disabled = false;
			document.getElementById("loopOutput").disabled = false;
			document.getElementById('tut2Text').innerHTML = lblTut5;
			break;
		case 6:
			tut2TxtNumber--;
			break;
		case 7:
			window.location.replace("showTutorial3");
			break;
		default:
			break;
	}
}


function check_sequence(operationList){
	normalOperation = getNormalOperationFromSolution(operationList);
	//normalOperation now contains the list of operations
	if(tut2TxtNumber==1){
		if(normalOperation.length!=3){
			alert("Hey, you should have used three moves! Try again!");
			first_setup();
			return false;
		}
		if(normalOperation[0]!="grab" || normalOperation[1]!="up" || normalOperation[2]!="right"){
			alert("Ok.. Three moves...But not these ones! First grab, then up, and eventually...?");
			first_setup();
			return false;
		}
		tut2TxtNumber++;
		document.getElementById('tut2Text').innerHTML = lblTut2;
		second_setup();
		return true;
	}
	if(tut2TxtNumber==2){
		if(normalOperation.length!=5){
			alert("Hey, you should have used five moves! Try again!");
			second_setup();
			return false;
		}
		if(blocks[0].x!=140 || blocks[0].y!=280){
			alert("Close! But the blue block is not on the top of the second column!");
			second_setup();
			return false;
		}
		tut2TxtNumber++;
		document.getElementById('tut2Text').innerHTML = lblTut3;
		$('#mainsortable').empty();
		third_setup();
		document.getElementById("btn-up").disabled = true; 
		document.getElementById("btn-down").disabled = true;
		document.getElementById("btn-right").disabled = true; 
		document.getElementById("btn-left").disabled = true; 
		document.getElementById("btn-grab").disabled = true; 
		document.getElementById("btn-release").disabled = true;
		document.getElementById("btn-clear").disabled = true;
		document.getElementById("btn-tut").disabled = true; 
		document.getElementById("btn-check").disabled = true; 
		return true;
	}
	if(tut2TxtNumber!=5){
		alert("Oak's words echoed... There's a time and place for everything, but not now.");
		return false;
	}
	loopOperation = parseLoop();
	if(loopOperation.length!=3){
		alert("You should have not changed the loop grid! Up and right was the correct combo! Try again!");
		third_setup();
		return false;
	}
	if(loopOperation[2]<4){
		alert("You should change the amount of iteration for your loop...It should be more!");
		third_setup();
		return false;	
	}
	if(loopOperation[2]>4){
		alert("You should change the amount of iteration for your loop...It should be less!");
		third_setup();
		return false;	
	}
	if(normalOperation.length != 2) {
		alert("Sorry, but your main code must contain exactly two moves! You can do that! Exploit the loop!");
		$('#mainsortable').empty();
		third_setup();
		return false;
	}
	if(normalOperation[0] != "grab") {
		alert("Nice! You should use two moves... but, of course the first thing to be done is grab the block! :)");
		third_setup();
		$('#mainsortable').empty();
		return false;
	}
	if(normalOperation[1] != "loop") {
		alert("Very close! This is the LOOP tutorial... First you grab, then ...? :)");
		third_setup();
		$('#mainsortable').empty();
		return false;
	}
	tut2TxtNumber++;
	document.getElementById('tut2Text').innerHTML = lblTut6;
	return true;
}


function first_setup(){
	gripper = new Gripper(["2,9"]);
	blocks = [];
	var blockArray = parseBlocks(["2,9,blue;3,9,yellow"]);
	addBlocks(blockArray);
	$('#mainsortable').empty();
}

function second_setup(){
	gripper = new Gripper(["2,9"]);
	blocks = [];
	var blockArray = parseBlocks(["2,9,blue;3,9,yellow;4,9,yellow;4,8,yellow"]);
	addBlocks(blockArray);
	$('#mainsortable').empty();
}

function third_setup(){
	gripper = new Gripper(["2,9"]);
	blocks = [];
	var blockArray = parseBlocks(["2,9,blue;3,9,yellow;4,9,yellow;4,8,yellow;5,9,yellow;5,8,yellow;5,7,yellow;6,9,yellow;6,8,yellow;6,7,yellow;6,6,yellow;"]);
	addBlocks(blockArray);
}
