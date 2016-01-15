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
	gripper = new Gripper(["2,8"]);
	var blockArray = parseBlocks(["2,9,red;3,9,blue;3,8,white;5,9,orange;6,9,blue;6,8,white"]);
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

var lblTut0 = 'Welcome to the last tutorial! Did you know that before the 17th century the red stripe in the Dutch flag was orange?! Your job here is to fix the two flags!';
var lblTut1 = 'As you can see, the two configurations are quiet similar. What if one can write some code and then use it again later?';
var lblTut2 = 'That\'s what functions do! Try to fix the current flag by releasing the blue block on top of the white one! You should six moves!'
var lblTut3 = 'Good job! I moved your code in the red grid, the one of function1! You can use all the code in that function in the main code using the function1 button in the orange grid! Try it!';
var lblTut4 = 'That\'s perfect! Now you should try to use the function1 to fix both the flags with the minimum number of moves! The use of a function is considered as one operation.';
var lblTut5 = 'Congratulations! Here the flags are! You finished the tutorials! Things are equal for function2 and the yellow grid! Click next to go to the levels!';

var tut3TxtNumber = 0;
function next_text(){
	tut3TxtNumber++;
	switch(tut3TxtNumber){
		case 1:
			document.getElementById('tut3Text').innerHTML = lblTut1;
			break;
		case 2:
			document.getElementById('tut3Text').innerHTML = lblTut2;
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
		case 3:
			tut3TxtNumber--;
			break;
		case 4:
			tut3TxtNumber--;
			break;
		case 5:
			tut3TxtNumber--;
			break;
		case 6:
			window.location.replace("showGUI");
			break;
		default:
			break;
	}
}


function check_sequence(operationList){
	normalOperation = getNormalOperationFromSolution(operationList);
	//normalOperation now contains the list of operations
	if(tut3TxtNumber<2){
		alert("Oak's words echoed... There's a time and place for everything, but not now.");
		return false;
	}
	if(tut3TxtNumber==2){
		if(normalOperation.length!=6){
			alert("You should use exactly 6 moves for this task.");
			original_setup();
			return false;			
		}
		if(blocks[0].x!=105 || blocks[0].y!=280){
			alert("The number of moves is right, but it looks like the flag is not fixed. Try again!");
			original_setup();
			return false;				
		}
		tut3TxtNumber++;
		document.getElementById('tut3Text').innerHTML = lblTut3;
		document.getElementById("btn-up").disabled = true; 
		document.getElementById("btn-down").disabled = true;
		document.getElementById("btn-right").disabled = true; 
		document.getElementById("btn-left").disabled = true; 
		document.getElementById("btn-grab").disabled = true; 
		document.getElementById("btn-release").disabled = true;
		document.getElementById("btn-function1").disabled = false;
		original_setup();
		reset_function1();
		return true;
	}
	if(tut3TxtNumber==3){
		function1Operations = parseFunction1();
		if(function1Operations.length!=6){
			alert("You should not change the content of the red grid!");
			original_setup();
			reset_function1();
			return false;
		}
		if(normalOperation.length!=1){
			alert("You should use just one operation, the function1 one!");
			original_setup();
			reset_function1();
			return false;
		}
		if(normalOperation[0]!="function1"){
			alert("You should click the orange grid and then only the function1 button!");
			original_setup();
			reset_function1();
			return false;
		}
		if(blocks[0].x!=105 || blocks[0].y!=280){
			alert("QUI");
			alert(blocks[0].x);
			alert(blocks[0].y);
			alert("You should not change the content of the red grid!");
			original_setup();
			reset_function1();
			return false;
		}
		tut3TxtNumber++;
		document.getElementById('tut3Text').innerHTML = lblTut4;
		original_setup();
		reset_function1();
		document.getElementById("btn-up").disabled = false; 
		document.getElementById("btn-down").disabled = false;
		document.getElementById("btn-right").disabled = false; 
		document.getElementById("btn-left").disabled = false; 
		document.getElementById("btn-grab").disabled = false; 
		document.getElementById("btn-release").disabled = false;
		return true;	
	}
	if(tut3TxtNumber==4){
		function1Operations = parseFunction1();
		if(function1Operations.length!=6){
			alert("You should not change the content of the red grid!");
			original_setup();
			reset_function1();
			return false;
		}
		if(normalOperation.length!=5){
			alert("That's wrong...  Ok, I can tell you that you should use 5 moves but nothing more :)");
			original_setup();
			reset_function1();
			return false;
		}
		if(blocks[0].x!=105 || blocks[0].y!=280 || blocks[3].x!=210 || blocks[3].y!=280 ){
			alert("That's wrong...  Flags are not fixed... Try again!");
			original_setup();
			reset_function1();
			return false;	
		}
	}
	tut3TxtNumber++;
	document.getElementById('tut3Text').innerHTML = lblTut5;
	gripper = new Gripper(["5,5"]);
	return true;
}

function original_setup(){
	gripper = new Gripper(["2,8"]);
	blocks = [];
	var blockArray = parseBlocks(["2,9,red;3,9,blue;3,8,white;5,9,orange;6,9,blue;6,8,white"]);
	addBlocks(blockArray);
	$('#mainsortable').empty();
}

function reset_function1(){
	$('#function1-sortable').empty();
	document.getElementById('function1-sortable').click();
       	$.fn.addOperation("down");
	$.fn.addOperation("grab");
        $.fn.addOperation("up");
        $.fn.addOperation("up");
       	$.fn.addOperation("right");
        $.fn.addOperation("release");
}

