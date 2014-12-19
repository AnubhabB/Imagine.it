/************************
*
*
Author Anubhab
August 2014
Developed Heavily on existing libraries
Function: Square selection
To Do: Circular selection
*
****************/

function crop(){// variables

    var canvas, ctx;
    var image;
    var iMouseX, iMouseY = 1;
    var theSelection;
    var indX = currentIndex;

    // define Selection constructor
    function Selection(x, y, w, h){
        this.x = x; // initial positions
        this.y = y;
        this.w = w; // and size
        this.h = h;

        this.px = x; // extra variables to dragging calculations
        this.py = y;

        this.csize = 2; // resize cubes size
        this.csizeh = 6; // resize cubes size (on hover)

        this.bHow = [false, false, false, false]; // hover statuses
        this.iCSize = [this.csize, this.csize, this.csize, this.csize]; // resize cubes sizes
        this.bDrag = [false, false, false, false]; // drag statuses
        this.bDragAll = false; // drag whole selection
    }

    // define Selection draw method
    Selection.prototype.draw = function(){

        ctx.strokeStyle = 'rgb(245,222,179)';
        ctx.lineWidth = .3;
        ctx.setLineDash([3]);
        ctx.strokeRect(this.x, this.y, this.w, this.h);

        // draw part of original image
        if (this.w > 0 && this.h > 0) {
            ctx.clearRect(this.x, this.y, this.w, this.h);
        }

        // draw resize cubes
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x - this.iCSize[0], this.y - this.iCSize[0], this.iCSize[0] * 2, this.iCSize[0] * 2);
        ctx.fillRect(this.x + this.w - this.iCSize[1], this.y - this.iCSize[1], this.iCSize[1] * 2, this.iCSize[1] * 2);
        ctx.fillRect(this.x + this.w - this.iCSize[2], this.y + this.h - this.iCSize[2], this.iCSize[2] * 2, this.iCSize[2] * 2);
        ctx.fillRect(this.x - this.iCSize[3], this.y + this.h - this.iCSize[3], this.iCSize[3] * 2, this.iCSize[3] * 2);
    }

    function drawScene() { // main drawScene function
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clear canvas

        // draw source image
        // and make it darker
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // draw selection
        theSelection.draw();
    }

        // loading source image
        delete window.temp_canvas;
        $("#temp_canvas").remove();
        image = imageLayers[indX].imageObj;
        //create temp canvas
        
        $(".containerMain").append("<canvas id='temp_canvas' width="+$(window).innerWidth()+" height="+$(window).innerHeight()+"></canvas>");
        $("#temp_canvas").css({
            "position":"fixed",
            "left"    :0,
            "top"     :0,
            "display" :"block",
            "z-index" : 1000
        });
        // creating canvas and context objects
        canvas = document.getElementById('temp_canvas');
        ctx = canvas.getContext('2d');

        // create initial selection
        var lf = $("#temp_canvas").width()/3;
        var tp = $("#temp_canvas").height()/3;
        var wd = hg = $("#temp_canvas").height()/3;
        theSelection = new Selection(lf,tp,wd,hg);

        $('#temp_canvas').mousemove(function(e) { // binding mouse move event
            $(".contextMenu").remove();$("#cropButton").remove();
            var canvasOffset = $(canvas).offset();
            iMouseX = Math.floor(e.pageX - canvasOffset.left);
            iMouseY = Math.floor(e.pageY - canvasOffset.top);

            // in case of drag of whole selector
            if (theSelection.bDragAll) {
                theSelection.x = iMouseX - theSelection.px;
                theSelection.y = iMouseY - theSelection.py;
            }

            for (i = 0; i < 4; i++) {
                theSelection.bHow[i] = false;
                theSelection.iCSize[i] = theSelection.csize;
            }

            // hovering over resize cubes
            if (iMouseX > theSelection.x - theSelection.csizeh && iMouseX < theSelection.x + theSelection.csizeh &&
                iMouseY > theSelection.y - theSelection.csizeh && iMouseY < theSelection.y + theSelection.csizeh) {

                theSelection.bHow[0] = true;
                theSelection.iCSize[0] = theSelection.csizeh;
            }
            if (iMouseX > theSelection.x + theSelection.w-theSelection.csizeh && iMouseX < theSelection.x + theSelection.w + theSelection.csizeh &&
                iMouseY > theSelection.y - theSelection.csizeh && iMouseY < theSelection.y + theSelection.csizeh) {

                theSelection.bHow[1] = true;
                theSelection.iCSize[1] = theSelection.csizeh;
            }
            if (iMouseX > theSelection.x + theSelection.w-theSelection.csizeh && iMouseX < theSelection.x + theSelection.w + theSelection.csizeh &&
                iMouseY > theSelection.y + theSelection.h-theSelection.csizeh && iMouseY < theSelection.y + theSelection.h + theSelection.csizeh) {

                theSelection.bHow[2] = true;
                theSelection.iCSize[2] = theSelection.csizeh;
            }
            if (iMouseX > theSelection.x - theSelection.csizeh && iMouseX < theSelection.x + theSelection.csizeh &&
                iMouseY > theSelection.y + theSelection.h-theSelection.csizeh && iMouseY < theSelection.y + theSelection.h + theSelection.csizeh) {

                theSelection.bHow[3] = true;
                theSelection.iCSize[3] = theSelection.csizeh;
            }

            // in case of dragging of resize cubes
            var iFW, iFH;
            if (theSelection.bDrag[0]) {
                var iFX = iMouseX - theSelection.px;
                var iFY = iMouseY - theSelection.py;
                iFW = theSelection.w + theSelection.x - iFX;
                iFH = theSelection.h + theSelection.y - iFY;
            }
            if (theSelection.bDrag[1]) {
                var iFX = theSelection.x;
                var iFY = iMouseY - theSelection.py;
                iFW = iMouseX - theSelection.px - iFX;
                iFH = theSelection.h + theSelection.y - iFY;
            }
            if (theSelection.bDrag[2]) {
                var iFX = theSelection.x;
                var iFY = theSelection.y;
                iFW = iMouseX - theSelection.px - iFX;
                iFH = iMouseY - theSelection.py - iFY;
            }
            if (theSelection.bDrag[3]) {
                var iFX = iMouseX - theSelection.px;
                var iFY = theSelection.y;
                iFW = theSelection.w + theSelection.x - iFX;
                iFH = iMouseY - theSelection.py - iFY;
            }

            if (iFW > theSelection.csizeh * 2 && iFH > theSelection.csizeh * 2) {
                theSelection.w = iFW;
                theSelection.h = iFH;

                theSelection.x = iFX;
                theSelection.y = iFY;
            }

            drawScene();
        });

        $('#temp_canvas').mousedown(function(e) { // binding mousedown event
            $("#cropButton").remove();
            var canvasOffset = $(canvas).offset();
            iMouseX = Math.floor(e.pageX - canvasOffset.left);
            iMouseY = Math.floor(e.pageY - canvasOffset.top);

            theSelection.px = iMouseX - theSelection.x;
            theSelection.py = iMouseY - theSelection.y;

            if (theSelection.bHow[0]) {
                theSelection.px = iMouseX - theSelection.x;
                theSelection.py = iMouseY - theSelection.y;
            }
            if (theSelection.bHow[1]) {
                theSelection.px = iMouseX - theSelection.x - theSelection.w;
                theSelection.py = iMouseY - theSelection.y;
            }
            if (theSelection.bHow[2]) {
                theSelection.px = iMouseX - theSelection.x - theSelection.w;
                theSelection.py = iMouseY - theSelection.y - theSelection.h;
            }
            if (theSelection.bHow[3]) {
                theSelection.px = iMouseX - theSelection.x;
                theSelection.py = iMouseY - theSelection.y - theSelection.h;
            }
            

            if (iMouseX > theSelection.x + theSelection.csizeh && iMouseX < theSelection.x+theSelection.w - theSelection.csizeh &&
                iMouseY > theSelection.y + theSelection.csizeh && iMouseY < theSelection.y+theSelection.h - theSelection.csizeh) {

                theSelection.bDragAll = true;
            }

            for (i = 0; i < 4; i++) {
                if (theSelection.bHow[i]) {
                    theSelection.bDrag[i] = true;
                }
            }
        });

        $('#temp_canvas').mouseup(function(e) { // binding mouseup event
            theSelection.bDragAll = false;

            for (i = 0; i < 4; i++) {
                theSelection.bDrag[i] = false;
            }
            theSelection.px = 0;
            theSelection.py = 0;
            $(".containerMain").append("<button id='cropButton' style='position:fixed;z-index:5001;top:"+e.clientY+"px;left:"+e.clientX+"px'>Crop</button>");

            $("#cropButton").click(function(){
                crop.prototype.getResults(theSelection.x,theSelection.y,theSelection.w,theSelection.h);
            });
        });

        drawScene();


}
/************
*
*
Actions on selection menu
Author: Anubhab
Steps:
    1. Get selection area data
    2. Change canvas data for all the canvas in loop checking if to crop or expand
    3. Update all canvas size and position
*
*
***********/

crop.prototype.getResults = function(theSelectionX,theSelectionY,theSelectionW,theSelectionH) {
  
    $("#cropButton").remove();
    $("#temp_canvas").remove();

    var newX0 = theSelectionX;
    var newY0 = theSelectionY;
    var newW  = theSelectionW;
    var newH  = theSelectionH;
    var newX1 = theSelectionX + theSelectionW;
    var newY1 = theSelectionY + theSelectionH;
    var redrawX0, redrawY0, redrawW, redrawH;

    for(var i=0;i<canvaslist;i++){ //For all canvas
        if($("#Canvas"+i).length >0){ //Check if available
            var thisX0 = $("#Canvas"+i).offset().left;
            var thisY0 = $("#Canvas"+i).offset().top;
            var thisW  = $("#Canvas"+i).width();
            var thisH  = $("#Canvas"+i).height();
            var tisX1  = thisX0 + thisW;
            var tisY1  = thisY0 + thisH;
            //First take care of Canvas0
            //Create new canvas of specific size if greater, else
            if(i == 0){

                $(".containerMain").append("<canvas id='temp_canvas' width="+newW+" height="+newH+" style='position:fixed'></canvas>");
                var ctx = document.getElementById('temp_canvas').getContext('2d');
                var cnv = document.getElementById('Canvas0');
                
                var tempX = $("#Canvas0").offset().left;
                var tempY = $("#Canvas0").offset().top;
                ctx.drawImage(cnv,tempX - newX0,tempY - newY0);
                var tempZi= $("#Canvas0").css("z-index");
                $("#Canvas0").remove();
                $("#temp_canvas").css({
                    "z-index": tempZi,
                    "left"   : newX0,
                    "top"    : newY0,
                    "background": "url(static/img/bg.jpg)"
                }).attr("id","Canvas0");
            }
            
            fileOps.prototype.layerInfoUpdate(i,$("#Canvas"+i).width(),$("#Canvas"+i).height(),'',$("#Canvas"+i).offset().top,$("#Canvas"+i).offset().left,'',cnv.toDataURL());
            init.history("push","Crop");
        }
    }
}
