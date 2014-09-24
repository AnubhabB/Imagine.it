/************************
*
*
Author Anubhab
August 2015
Developed Heavily on existing libraries
Function: Paint, Erase, Move
Catch: tried separating move but somee conflict with event handelling
*
****************/

function marqueue_square(){// variables
/*   delete window.temp_canvas;
    $("#temp_canvas").remove();
    $(".containerMain").off();
    $("#Canvas"+currentIndex).off();
    delete window.temp_canvas;
    $("#crop_canvas").remove();*/
    cleanCanv();
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
            //console.log(this.x, this.y, this.w, this.h, this.x, this.y, this.w, this.h);
            //ctx.drawImage(image, this.x, this.y, this.w, this.h, this.x, this.y, this.w, this.h);
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
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // draw selection
        theSelection.draw();
    }

    $(function(){
        // loading source image
        delete window.temp_canvas;
        $("#temp_canvas").remove();
        image = layers[indX];
        //create temp canvas
        
        $(".containerMain").append("<canvas id='temp_canvas' width="+$("#Canvas"+indX).width()+" height="+$("#Canvas"+indX).height()+"></canvas>");
        $("#temp_canvas").css("position","absolute").css('margin-left',($(window).innerWidth() - $("#Canvas"+indX).width())/3 +"px").css("margin-top",($(window).innerHeight() - $("#Canvas"+indX).height())/3 +"px").css("display","block").css("z-index",1000);
        // creating canvas and context objects
        canvas = document.getElementById('temp_canvas');
        ctx = canvas.getContext('2d');

        // create initial selection
        theSelection = new Selection(50, 50, 50, 50);

        $('#temp_canvas').mousemove(function(e) { // binding mouse move event
            $(".contextMenu").remove();
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
            $(".contextMenu").remove();
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
        });

        var contxtC = document.getElementById('temp_canvas');
        contxtC.oncontextmenu = function(e){
            $(".contextMenu").remove();
            var xpos = e.clientX;
            var ypos = e.clientY;
            $(".containerMain").append("<div class='contextMenu'><ul><li id='layerViaCopy'>Layer Via Copy</li><li id='layerViaCut'>Layer Via Cut</li><li id='fillSelection'>Fill Selection</li><li id='strokeSelection'>Stroke Selection</li><li id='clearSelection'>Clear Selection</li></ul></div>");
            $(".contextMenu").css("top",ypos).css("left",xpos).css("z-index",($("#temp_canvas").css("z-index"))+1);

            $("#layerViaCopy").click(function(){
                getResults(ctx,layers[0],theSelection.x,theSelection.y,theSelection.w,theSelection.h,'copy');
            });
            $("#layerViaCut").click(function(){
                getResults(ctx,layers[0],theSelection.x,theSelection.y,theSelection.w,theSelection.h,'cut');
            });

            $("#fillSelection").click(function(){
                getResults(ctx,layers[0],theSelection.x,theSelection.y,theSelection.w,theSelection.h,'fill');
            });
            $("#strokeSelection").click(function(){
                getResults(ctx,layers[0],theSelection.x,theSelection.y,theSelection.w,theSelection.h,'stroke');
            });
            $("#clearSelection").click(function(){
                getResults(ctx,layers[0],theSelection.x,theSelection.y,theSelection.w,theSelection.h,'clear');
            });
            return false;
        };

        drawScene();

    });


}
/************
*
*
Actions on selection menu
Author: Anubhab
Steps:
    1. Get selection area data
    2. Add a new canvas layer if 'layer via' else simply paint the region
    3. Remove selection
    4. add layer to layers panel
*
*
***********/

function getResults(ctx,image,theSelectionX,theSelectionY,theSelectionW,theSelectionH,action) {
    var x = currentIndex.length;
    var indX = currentIndex;
    //console.log(indX+' '+currentIndex);
    //alert(action);
    if(x>1 || x==0){

    }else{
        switch(action){
            case 'fill':
                    var cnv = document.getElementById("Canvas"+indX);
                    var cntx = cnv.getContext('2d');
                    
                    cntx.fillStyle = foregroundColor;
                    cntx.fillRect(theSelectionX,theSelectionY,theSelectionW,theSelectionH);
            break;
            case 'stroke':
                    var cnv = document.getElementById("Canvas"+indX);
                    var cntx = cnv.getContext('2d');
                    cntx.strokeStyle = foregroundColor;
                    cntx.strokeRect(theSelectionX,theSelectionY,theSelectionW,theSelectionH);
            break;
            case 'clear':
                    var cnv = document.getElementById("Canvas"+indX);
                    var cntx = cnv.getContext('2d');
                    cntx.clearRect(theSelectionX,theSelectionY,theSelectionW,theSelectionH);
            break;
            case 'copy':
                var currentCanvas = "Canvas"+indX;
                var zInd= $("#Canvas"+indX).css('z-index'); 
                var cnv = document.getElementById(currentCanvas);
                var tempSrc= cnv.toDataURL();
                var height = $("#Canvas0").height();
                var width  = $("#Canvas0").width();
                layers[canvaslist] = new Image();
                layers[canvaslist].onload = function(){
                    $(".containerMain").append("<canvas id='Canvas"+canvaslist+"' height='"+height+"' width='"+width+"'></canvas>").css("display","block");
                    var mainC = document.getElementById("Canvas"+canvaslist);
                    var cntx = mainC.getContext("2d");
                    $("#Canvas"+canvaslist).css("position","absolute").css('margin-left',($(window).innerWidth() - width)/3 +"px").css("margin-top",($(window).innerHeight() - height)/3 +"px").css("display","block").css('z-index',parseInt(zInd)+1);
                    var sw = theSelectionW;
                    var sh = theSelectionH;
                    if((theSelectionX+theSelectionW) >layers[canvaslist].width)
                        sw = theSelectionW - (theSelectionX+theSelectionW -layers[canvaslist].width);
                    if((theSelectionY+theSelectionH) >layers[canvaslist].height)
                        sh = theSelectionH - ((theSelectionY+theSelectionH) -layers[canvaslist].height);
                    cntx.drawImage(layers[canvaslist], theSelectionX, theSelectionY, sw, sh, 0, 0, sw, sh);
                    
                    canvaslist++;
                    currentIndex = canvaslist-1;
                    layers[currentIndex].w = sw;
                    layers[currentIndex].h = sh;
                    console.log(sw+" gettinng the heights "+sh);
                    //layers[currentIndex] = 
                    saveState();
                    composeLayers();
                }
                layers[canvaslist].src = tempSrc;
            break;
            case 'cut':
                var currentCanvas = "Canvas"+indX;
                var zInd= $("#Canvas"+indX).css('z-index'); 
                var cnv = document.getElementById(currentCanvas);
                var tempSrc= cnv.toDataURL();
                var height = $("#Canvas0").height();
                var width  = $("#Canvas0").width();
                layers[canvaslist] = new Image();
                layers[canvaslist].onload = function(){
                    //$("#Canvas"+indX).remove();
                    $(".containerMain").append("<canvas id='Canvas"+canvaslist+"' height='"+height+"' width='"+width+"'></canvas>").css("display","block");
                    var mainC = document.getElementById("Canvas"+canvaslist);
                    var cntx = mainC.getContext("2d");
                    $("#Canvas"+canvaslist).css("position","absolute").css('margin-left',($(window).innerWidth() - width)/3 +"px").css("margin-top",($(window).innerHeight() - height)/3 +"px").css("display","block").css('z-index',parseInt(zInd)+1);
                    var sw = theSelectionW;
                    var sh = theSelectionH;
                    if((theSelectionX+theSelectionW) >layers[canvaslist].width)
                        sw = theSelectionW - (theSelectionX+theSelectionW -layers[canvaslist].width);
                    if((theSelectionY+theSelectionH) >layers[canvaslist].height)
                        sh = theSelectionH - ((theSelectionY+theSelectionH) -layers[canvaslist].height);
                    cntx.drawImage(layers[canvaslist], theSelectionX, theSelectionY, sw, sh, theSelectionX, theSelectionX, sw, sh);

                    canvaslist++;
                    currentIndex = canvaslist-1;
                    layers[currentIndex].w = sw;
                    layers[currentIndex].h = sh;
                    console.log(sw+" gettinng the heights "+sh);
                    saveState();
                    composeLayers();
                }
                layers[canvaslist].src = tempSrc;
                var cnv = document.getElementById("Canvas"+indX);
                var cntx = cnv.getContext('2d');
                cntx.clearRect(theSelectionX,theSelectionY,theSelectionW,theSelectionH);
            break;
        }
    }
        $("#temp_canvas").remove();
        saveState();
        $(".tools").removeClass("active");
        $(".contextMenu").remove();
}
