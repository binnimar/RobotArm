//operationList used by simulator
var operationList = [];
//solution to database
var solution = [];

function parseNormalOperations() {
    var result = [];
    $('#mainsortable li').each(function(i, elem) {
        var operation = $(elem).text();
        result.push($(elem).text());
    });
    return result;
}

function parseFunction1() {
    var result = [];
    $('#function1-sortable li').each(function(i, elem) {
        var operation = $(elem).text();
        result.push($(elem).text());
    });
    return result;
}

function parseFunction2() {
    var result = [];
    $('#function2-sortable li').each(function(i, elem) {
        var operation = $(elem).text();
        result.push($(elem).text());
    });
    return result;
}

function parseLoop() {
    var result = [];
    $('#loop-sortable li').each(function(i, elem) {
        var operation = $(elem).text();
        result.push($(elem).text());
    });
    var numberOfLoops = $('#loopOutput').val()
    // console.log("TESTING! loops ", numberOfLoops);

    result.push(numberOfLoops);
    return result;
}

function parseSolution () {
    var normalOperations = parseNormalOperations();
    var function1 = parseFunction1();
    var function2 = parseFunction2();
    var loop = parseLoop();

    var normalOperationsString = normalOperations.join(",");
    var function1String = function1.join(",");
    var function2String = function2.join(",");
    var loopString = loop.join(",");

    var everything = [normalOperationsString,function1String,function2String,loop];
    var everythingString = everything.join(";");

    solution = everythingString;

    console.log("normal: ", normalOperationsString);
    console.log("f1: ", function1String);
    console.log("f2: ", function2String);
    console.log("loop: ", loop);
    console.log(everythingString);
}

function getFunctionOperations(operation) {
    if(operation == "function1") {
        $('#function1-sortable li').each(function(i, elem) {
            operationList.push($(elem).text());
        });
    }else {
        $('#function2-sortable li').each(function(i, elem) {
            operationList.push($(elem).text());
        });
    }
}

function getLoopOperations(operation) {
    var numberOfLoops = $('#loopOutput').val();
    // console.log("This is the number of loops: ", numberOfLoops);
    for(var i=0; i<numberOfLoops; i++) {
        $('#loop-sortable li').each(function(i, elem) {
            operationList.push($(elem).text());
        });
    }
}

function parseOperationList() {
    $('#mainsortable li').each(function(i, elem) {
        var operation = $(elem).text();
        if(operation == "function1") {
            getFunctionOperations(operation);
        }else if(operation == "function2") {
            getFunctionOperations(operation);
        }else if(operation == "loop") {
            getLoopOperations(operation);
            // console.log("loop");
        }else {
            operationList.push($(elem).text());
        }
    });
}

function getOperationList () {
    parseSolution();
    parseOperationList();

    // operationList = [];
    // $('#mainsortable li').each(function(i, elem) {
    //     operationList.push($(elem).text());
    // });
    
    console.log("This is the solution: ", solution);
    console.log("This is the operationList: ", operationList);
    return operationList;
}

function getSolution () {
    return solution;
}

function tryParseJSON (jsonString){
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns 'null', and typeof null === "object", 
        // so we must check for that, too.
        if (o && typeof o === "object" && o !== null) {
            return o;
        }
    }
    catch (e) { }

    return false;
};

$(function(){
    var currentElementID = $('#mainsortable').attr('id');
    var currentElement = $('#mainsortable');
    // var operationList;

    // $.fn.addOperation = function(operationType){ 
    //     currentElement = $('#' + currentElementID);
    //     if(currentElementID == $('#mainsortable').attr('id')) {
    //         $('#mainsortable').append('<li class="ui-state-default" id="'+operationType+'">'+operationType+'</li>');
    //     } else {
    //         $(currentElement.children(":first")).append('<li class="ui-state-default" id="'+operationType+'">'+operationType+'</li>');
    //         $(currentElement.children(":first")).sortable();
    //         $(currentElement.children(":first")).disableSelection();
    //     }
    // }

    $.fn.addOperation = function(operationType){ 
        currentElement = $('#' + currentElementID);
        currentElement.append('<li class="ui-state-default" id="'+operationType+'">'+operationType+'</li>');
    }

    $('#btn-up').click(function() {
        $.fn.addOperation("up");
    });

    $('#btn-down').click(function() {
    	$.fn.addOperation("down");
    });

    $('#btn-left').click(function() {
    	$.fn.addOperation("left");
    });

    $('#btn-right').click(function() {
    	$.fn.addOperation("right");
    });

    $('#btn-grab').click(function() {
    	$.fn.addOperation("grab");
    });

    $('#btn-release').click(function() {
    	$.fn.addOperation("release");
    });

    // $('#btn-function').click(function() {
    //     var list = $('#mainsortable');
    //     var index = list.find('li').length + 1;
        
    //     // TODO take removal into account
    // 	$('#mainsortable').append('<li class="ui-state-default expandable" id="test'+index+'"><ul id="subsortable"></ul></il>')

    //     currentElementID = "test"+index;
    //     currentElement = $('#' + currentElementID);
    // });

    $('#btn-function1').click(function() {
        $.fn.addOperation("function1");

        // $('#gui-function1').append('<ul id="subsortable"></ul>')
        // currentElementID = $('#gui-function1').attr('id');
        // currentElement = $('#' + currentElementID);
    });

    $('#btn-function2').click(function() {
        $.fn.addOperation("function2");
    });

    $('#btn-loop').click(function() {
        $.fn.addOperation("loop");
    });

	// $("#mainsortable").on("click", ".expandable", function(event){
 //        if(currentElementID == "mainsortable") {
 //            currentElementID = $(this).attr('id');
 //            currentElement = $('#' + currentElementID);
 //        }else if (currentElementID == $(this).attr('id')){
 //            currentElementID = $('#mainsortable').attr('id');
 //        }else{
 //            currentElementID = $(this).attr('id');
 //            currentElement = $('#' + currentElementID);
 //        }
	// });

    $('#btn-clear').click(function() {
        $('#mainsortable').empty();
        // for(int i=0; i<operationList.length; i++) {
        //     console.log(operationList[i]);
        // }
    });

    $('#btn-save').click(function() {
        solution = getSolution();
        var solutionString = solution.toString();
        $('#userSolution').val(solutionString);	
        // getOperationList();
    });

    $('#btn-levelDown').click(function() {
        var currentLevel = parseInt($('#output').val());
	if(currentLevel==1){
		return;
	}
        $('#output').val(currentLevel-1);
    });

    $('#btn-levelUp').click(function() {
        var currentLevel = parseInt($('#output').val());
	if(currentLevel==levelNumber){
		return;
	}
        $('#output').val(currentLevel+1);
    });

    $('#btn-loadLevel').click(function() {
        var levelID = parseInt($('#output').val());
        $('#levelID').val(levelID);
    });

    $('#btn-loopDown').click(function() {
        var numberOfLoops = parseInt($('#loopOutput').val());
        $('#loopOutput').val(numberOfLoops-1);
    });

    $('#btn-loopUp').click(function() {
        var numberOfLoops = parseInt($('#loopOutput').val());
        $('#loopOutput').val(numberOfLoops+1);
    });
	
    $('#trash').droppable({
        drop: function(event, ui) {
            ui.draggable.remove();
            currentElementID = "mainsortable";
            currentElement = $('#' + currentElementID);
        }
    });

    // Switching expandables (main, function1, function2, loop)
    $('.gui-operations-grid').on('click', function() {
        currentElementID = $('#mainsortable').attr('id');
        currentElement = $('#' + currentElementID);
    });

    $('.gui-function1').on('click', function() {
        currentElementID = $('#function1-sortable').attr('id');
        currentElement = $('#' + currentElementID);
    });

    $('.gui-function2').on('click', function() {
        currentElementID = $('#function2-sortable').attr('id');
        currentElement = $('#' + currentElementID);
    });

    $('.gui-loop').on('click', function() {
        currentElementID = $('#loop-sortable').attr('id');
        currentElement = $('#' + currentElementID);
    });
});
