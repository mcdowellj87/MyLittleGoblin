var constructionGraphicsVisibility = true;
var pointVisibility = true;
var fillToggle = false;
var subjectVisible = true;

var svgProperties = /*@@@*/'[{"x":524,"y":40.03750228881836,"theta":330,"d":"M 75 170 l 25 180"},{"x":595.7999877929688,"y":292.0375061035156,"theta":1,"radius":15}]'/*@@@*/;
var rotation = 0;

var masterCxCyDimension = getCxCyDimension();
var svgIdCounter = 0;
var lastSvgClickedOn = "";
var lineThickness = 1;

function toggleSubject(){
    if(subjectVisible == true){
        document.getElementById("subject").style.visibility = "hidden";
    }
    else{
        document.getElementById("subject").style.visibility = "visible";
    }
    subjectVisible = !subjectVisible;
}

$(function() {
    $( "svg" ).draggable();
});

$("svg").click(function(){
    //Go through all the SVGs that are curves and rid them of IDs.

    //clear all IDs pertaining to path elements.
    $("svg").each(function(){
        $(this).children('path').each(function () {
            $(this).removeAttr("id");
        });
    });

    //clear all IDs pertaining to g elements and their children.
    $("svg").each(function(){
        $(this).children('g').each(function () {
            $(this).removeAttr("id");
            $(this).children("circle").each(function(){
                $(this).removeAttr("id");
            });
            $(this).children("text").each(function(){
                $(this).removeAttr("id");
            });
        });
    });

    //Repopulate Ids pertaining to path elements.
    var pathCount = 0;
    pathId1 = "lineAB";
    pathId2 = "lineBC";
    pathId3 = "bezierCurve";
    $(this).children('path').each(function () {
        if(pathCount == 0){
            $(this).attr('id', pathId1);
        }
        else if(pathCount == 1){
            $(this).attr("id", pathId2);
        }
        else if(pathCount == 2){
            $(this).attr("id", pathId3);
        }
        pathCount += 1;
    });

    //Repopulate Ids pertaining to g elements and their children.
    var gCount = 0;
    var circleCount = 0;
    var textCount = 0;
    gId1 = "points";
    gId2 = "labels";
    circleId1 = "pointA";
    circleId2 = "pointB";
    circleId3 = "pointC";
    textId1 = "pointALabel";
    textId2 = "pointBLabel";
    textId3 = "pointCLabel";
    $(this).children('g').each(function () {
        if(gCount == 0){
            $(this).attr('id', gId1);
            $(this).children('circle').each(function () {
                if(circleCount == 0){
                    $(this).attr("id", circleId1);
                }
                else if(circleCount == 1){
                    $(this).attr("id", circleId2);
                }
                else if(circleCount == 2){
                    $(this).attr("id", circleId3);
                }
                circleCount += 1;
            });
        }
        else if(gCount == 1){
            $(this).attr("id", gId2);
            $(this).children('text').each(function () {
                if(textCount == 0){
                    $(this).attr("id", textId1);
                }
                else if(textCount == 1){
                    $(this).attr("id", textId2);
                }
                else if(textCount == 2){
                    $(this).attr("id", textId3);
                }
                textCount += 1;
            });
        }
        gCount += 1;
    });
});

jQuery.fn.rotate = function(degrees) {
    $(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                 '-moz-transform' : 'rotate('+ degrees +'deg)',
                 '-ms-transform' : 'rotate('+ degrees +'deg)',
                 'transform' : 'rotate('+ degrees +'deg)'});
    return $(this);
};
$("svg").bind('mousewheel', function(event) {
    if (event.originalEvent.wheelDelta >= 0) {
        rotation += 1;
        $(this).rotate(rotation);
    }
    else {
        rotation -= 1;
        $(this).rotate(rotation);
    }
});

function getRotationDegrees(obj) {
    var matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    return (angle < 0) ? angle + 360 : angle;
}
$("#capturePositions").click(function(){
    var tempRotationStack = [];
	var i = 0;
	$("svg").each(function(){
	    var theta = getRotationDegrees($(this));
        tempRotationStack.push(theta);
		$(this).rotate(0);
	});
    svgProperties = '[';
    $("svg").each(function(){
        var coordinate = $(this).offset();
        svgProperties += '{"x":' + coordinate.left + ',' + '"y":' + coordinate.top + ',' + '"theta":' + tempRotationStack[i];
        
        //If the svg is a circle.
        if($(this).find(">:first-child").attr("r") != null){
            svgProperties += ',"radius":' + $("svg > circle").attr("r");
        }

        svgProperties += '},';
		$(this).rotate(tempRotationStack[i]);
		i++;
    });
    svgProperties = svgProperties.slice(0, -1);
    svgProperties += ']';
    var myWindow = window.open("", "", "toolbar=no, scrollbars=no, resizable=yes, top=500, left=500, width=640, height=480");
    myWindow.document.write("<p>" + svgProperties + "</p>");
});
function capturePositions(){
    var tempRotationStack = [];
	var i = 0;
	$("svg").each(function(){
	    var theta = getRotationDegrees($(this));
        tempRotationStack.push(theta);
		$(this).rotate(0);
	});
    svgProperties = '[';
    $("svg").each(function(){
        var coordinate = $(this).offset();
        svgProperties += '{"x":' + coordinate.left + ',' + '"y":' + coordinate.top + ',' + '"theta":' + tempRotationStack[i];
        
        //If the svg is a circle.
        if($(this).find(">:first-child").attr("r") != null){
            svgProperties += ',"radius":' + $(this).find(">:first-child").attr("r");
        }
        else if($(this).find(">:nth-child(2)").attr("d") != null){
            svgProperties += ',"d":"' + $(this).find(">:nth-child(2)").attr("d") + '"';
        }

        svgProperties += '},';
		$(this).rotate(tempRotationStack[i]);
		i++;
    });
    svgProperties = svgProperties.slice(0, -1);
    svgProperties += ']';
    var myWindow = window.open("", "", "toolbar=no, scrollbars=no, resizable=yes, top=500, left=500, width=640, height=480");
    myWindow.document.write("<p>" + svgProperties + "</p>");
}
function getCxCyDimension(){
    //Gets the master dimension of each container andd calculates the center point of SVG squares, circles, etc.
    //Also calculates the width and height of each shape.
    var containerDimension = $("svg").css("width");
    containerDimension = containerDimension.substring(0, containerDimension.length - 2); //remove "px"
    containerDimension = parseInt(containerDimension, 0);
    return containerDimension / 2;
}
$(document).ready(function() {
    var i = 0;
    var jsonObjectArray = JSON.parse(svgProperties);
    $("svg").each(function(){
        $(this).offset({ top: jsonObjectArray[i].y, left: jsonObjectArray[i].x});
        $(this).rotate(jsonObjectArray[i].theta);

        //If the svg is a circle.
        if(jsonObjectArray[i].radius != null){
            $(this).find(">:first-child").attr("r", jsonObjectArray[i].radius);
        }
        //If the svg is a curve.
        else if(jsonObjectArray[i].d != null){
            $(this).find(">:nth-child(2)").attr("d", jsonObjectArray[i].d);
        }

        i++;
    });

    defineCurve(50, 350, 250, 170);

    var cxCyDimmension = getCxCyDimension();

    $("circle").each(function(){
        if($(this).attr("id") != "pointA" && $(this).attr("id") != "pointB" && $(this).attr("id") != "pointC"){
            $(this).attr("cx", cxCyDimmension);
            $(this).attr("cy", cxCyDimmension);
            //$(this).attr("r", cxCyDimmension);

            $(this).attr("id", "circle" + svgIdCounter);
            //lastSvgClickedOn = "circle" + svgIdCounter;
            svgIdCounter += 1;
        }
    });

    //Correct the curve for demo purposes.
    for(var i = 0; i < 175; i++){
        reDefineCurve('tighter');
    }
    for(var i = 0; i < 120; i++){
        modifyCurve('down');
    }
    for(var i = 0; i < 20; i++){
        modifyCurve('right');
    }
});
$("circle").click(function (){
    lastSvgClickedOn = $(this).attr("id");
});
//SVG Curve Related Functions
function calculateSlope(tempFirstPoint, tempSecondPoint){
    var tempSlope = [];
    tempSlope.push(tempSecondPoint[0] - tempFirstPoint[0]);
    tempSlope.push(tempSecondPoint[1] - tempFirstPoint[1]);
    return tempSlope;
}
function fillCurve(color){
    var pathCount = 2;
    if(fillToggle == false){
        fillToggle = true;
        //Throws an error because not all SVGs have paths.
        $("svg").each(function(){
            document.getElementsByTagName("path")[pathCount].setAttribute('fill', color);
            pathCount += 3;
        });
    }
    else{
        fillToggle = false;
        //Throws an error because not all SVGs have paths.
        $("svg").each(function(){
            document.getElementsByTagName("path")[pathCount].setAttribute('fill', "none");
            pathCount += 3;
        });
    }
}
function defineCurve(p1X, p1Y, p2X, p2Y){
    var firstPoint = [];
    var secondPoint = [];
    var slope = [];
    var pointCounter = 0;

    firstPoint.push(parseInt(p1X, 10));
    firstPoint.push(parseInt(p1Y, 10));

    secondPoint.push(parseInt(p2X, 10));
    secondPoint.push(parseInt(p2Y, 10));
    slope = calculateSlope(firstPoint, secondPoint);

    //Set lineAB with Point A (first point) and 2pB (the slope)
    var newLineAB = "M "+firstPoint[0]+" "+firstPoint[1]+" l "+slope[0]+" "+slope[1];
    document.getElementById("lineAB").setAttribute("d", newLineAB);

    var newLineBC = "M "+secondPoint[0]+" "+secondPoint[1]+" l "+slope[0]+" "+-slope[1];
    document.getElementById("lineBC").setAttribute("d", newLineBC);

    //------------pA--------2pB----2pC-->
    var newBezierCurve = "M "+firstPoint[0]+" "+firstPoint[1]+" q "+slope[0]+" "+slope[1]+" "+(slope[0]+slope[0])+" "+(slope[1]+-slope[1]);
    document.getElementById("bezierCurve").setAttribute("d", newBezierCurve);

    document.getElementById("pointA").setAttribute("cx", firstPoint[0]);
    document.getElementById("pointA").setAttribute("cy", firstPoint[1]);
    document.getElementById("pointALabel").setAttribute("x", firstPoint[0]);
    document.getElementById("pointALabel").setAttribute("y", firstPoint[1]);

    document.getElementById("pointB").setAttribute("cx", secondPoint[0]);
    document.getElementById("pointB").setAttribute("cy", secondPoint[1]);
    document.getElementById("pointBLabel").setAttribute("x", secondPoint[0]);
    document.getElementById("pointBLabel").setAttribute("y", secondPoint[1]);

    document.getElementById("pointC").setAttribute("cx", calculatePoint("C")[0]);
    document.getElementById("pointC").setAttribute("cy", calculatePoint("C")[1]);
    document.getElementById("pointCLabel").setAttribute("x", calculatePoint("C")[0]);
    document.getElementById("pointCLabel").setAttribute("y", calculatePoint("C")[1]);

    firstPoint = [];
    secondPoint = [];
}

function togglePoints(){
    $("svg").each(function(){
        $(this).children('g').each(function () {
            if(pointVisibility == true){
                $(this).hide();
            }
            else{
                $(this).show();
            }
        });
    });
    pointVisibility = !pointVisibility;
}

function toggleConstructionGraphics() {
    var pathCount = 0;
    if(constructionGraphicsVisibility == true){
        constructionGraphicsVisibility = false;
        $("svg").each(function(){
            $(this).css({"border-style":"none"});
        });
        //Throws an error because not all SVGs have paths.
        $("svg").each(function(){
            document.getElementsByTagName("path")[pathCount].style.visibility = "hidden";
            document.getElementsByTagName("path")[pathCount + 1].style.visibility = "hidden";
            pathCount += 3;
        });
    }
    else{
        constructionGraphicsVisibility = true;
        $("svg").each(function(){
            $(this).css({"border-style":"dashed"});
        });
        //Throws an error because not all SVGs have paths.
        $("svg").each(function(){
            document.getElementsByTagName("path")[pathCount].style.visibility = "visible";
            document.getElementsByTagName("path")[pathCount + 1].style.visibility = "visible";
            pathCount += 3;
        });
    }
}

$('body').on('keydown keyup',function(e){
    if(e.which==65){
        modifyCurve('left');
    }
    else if(e.which==68){
        modifyCurve('right');
    }
    else if(e.which==87){
        modifyCurve('up');
    }
    else if(e.which==83){
        modifyCurve('down');
    }
    else if(e.which==69){
        reDefineCurve('wider');
    }
    else if(e.which==81){
        reDefineCurve('tighter');
    }
    else if(e.which==67){
        reDefineCurve('taller');
    }
    else if(e.which==90){
        reDefineCurve('shorter');
    }
    if(e.which==82){
        //grow
        masterCxCyDimension += 1;
        $("#"+lastSvgClickedOn).attr("r", masterCxCyDimension);
    }
    else if(e.which==86){
        //shrink
        masterCxCyDimension -= 1;
        $("#"+lastSvgClickedOn).attr("r", masterCxCyDimension);
    }
    //thinner line.
    else if(e.which==88){
        lineThickness -= 1;
        document.getElementById("bezierCurve").setAttribute("stroke-width", lineThickness);
        document.getElementById("bezierCurve").setAttribute("stroke-linecap", "round");
    }
    //thicker line.
    else if(e.which==70){
        lineThickness += 1;
        document.getElementById("bezierCurve").setAttribute("stroke-width", lineThickness);
        document.getElementById("bezierCurve").setAttribute("stroke-linecap", "round");
    }
    else if(e.which==71){
        capturePositions();
    }
});
function reDefineCurve(width){
    //curveWidth = 100;
    var lineABArray = getDAttributeAsArray("lineAB");
    var lineBCArray = getDAttributeAsArray("lineBC");
    var curveHeight = lineABArray[1];
    var curveWidth = lineBCArray[0];

    if(width == "wider"){
        curveWidth += 1;
        defineCurve(50, curveHeight, curveWidth, 170);
    }
    else if(width == "tighter"){
        curveWidth -= 1;
        defineCurve(50, curveHeight, curveWidth, 170);
    }
    else if(width == "taller"){
        curveHeight += 1;
        defineCurve(50, curveHeight, curveWidth, 170);
    }
    else if(width == "shorter"){
        curveHeight -= 1;
        defineCurve(50, curveHeight, curveWidth, 170);
    }
}
function modifyCurve(direction){
    var lineArray = getDAttributeAsArray("bezierCurve");
    if(direction == "left"){
        lineArray[2] = lineArray[2] - 1;
    }
    else if(direction == "right"){
        lineArray[2] = lineArray[2] + 1;
    }
    else if(direction == "up"){
        lineArray[3] = lineArray[3] - 1;
    }
    else if(direction == "down"){
        lineArray[3] = lineArray[3] + 1;
    }
    document.getElementById("bezierCurve").setAttribute("d", "M "+lineArray[0]+" "+lineArray[1]+" q "+lineArray[2]+" "+lineArray[3]+" "+lineArray[4]+" "+lineArray[5]);
}

function extractLineDataAsArray(lineName){
    var lineString = document.getElementById(lineName).getAttribute("d");
    lineString = lineString.replace("M ", "");
    lineString = lineString.replace("l ", "");
    lineString = lineString.replace("q ", "");
    return lineString.split(" ");
}
function getDAttributeAsArray(lineName) {
    var lineArray = extractLineDataAsArray(lineName);
    for (var i = 0; i < lineArray.length; i++) {
        lineArray[i] = parseInt(lineArray[i], 10);
    }
    return lineArray;
}
function calculatePoint(pointName) {
    var lineName = "";
    if (pointName == "B") {
        lineName = "lineA" + pointName;
    }
    else if (pointName == "C") {
        lineName = "lineB" + pointName;
    }
    var lineArray = getDAttributeAsArray(lineName);
    var p0x = lineArray[0];
    var p0y = lineArray[1];
    var to_p1x = lineArray[2];
    var to_p1y = lineArray[3];
    //pB=pA+2pB
    // or (the math is the same for both cases)
    //pC=pB+2pC
    var p1x = p0x + to_p1x;
    var p1y = p0y + to_p1y;
    return [p1x, p1y];
}
function fillCurve(color){
/*
    if(document.getElementById('bezierCurve').getAttribute('fill') != "none"){
        document.getElementById('bezierCurve').setAttribute('fill', "none");
    }
    else{
        document.getElementById('bezierCurve').setAttribute('fill', color);
    }
*/
    var pathCount = 2;
    if(fillToggle == false){
        fillToggle = true;
        //Throws an error because not all SVGs have paths.
        $("svg").each(function(){
            document.getElementsByTagName("path")[pathCount].setAttribute('fill', color);
            pathCount += 3;
        });
    }
    else{
        fillToggle = false;
        //Throws an error because not all SVGs have paths.
        $("svg").each(function(){
            document.getElementsByTagName("path")[pathCount].setAttribute('fill', "none");
            pathCount += 3;
        });
    }
}