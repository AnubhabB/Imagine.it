function cropBase(){// variables
    cleanCanv();
    var canvas, ctx;
    var image;
    var iMouseX, iMouseY = 1;
    var theSelection;
    var elementId = "Canvas"+currentIndex;
    var indX = currentIndex;

    // define Selection constructor
    function Selection(x, y, w, h){
        this.x = x; // initial positions
        this.y = y;
        this.w = w; // and size
        this.h = h;

        this.px = x; // extra variables to dragging calculations
        this.py = y;

        this.csize = 6; // resize cubes size
        this.csizeh = 10; // resize cubes size (on hover)

        this.bHow = [false, false, false, false]; // hover statuses
        this.iCSize = [this.csize, this.csize, this.csize, this.csize]; // resize cubes sizes
        this.bDrag = [false, false, false, false]; // drag statuses
        this.bDragAll = false; // drag whole selection
    }

    // define Selection draw method
    Selection.prototype.draw = function(){

        ctx.strokeStyle = '#999';
        ctx.lineWidth = .5;
        ctx.strokeRect(this.x, this.y, this.w, this.h);

        // draw part of original image
        if (this.w > 0 && this.h > 0) {
            ctx.drawImage(image, this.x, this.y, this.w, this.h, this.x, this.y, this.w, this.h);
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
        // and make it darker
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
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
        $(".containerMain").append("<canvas id='crop_canvas' width="+$("#Canvas"+indX).attr("width")+" height="+$("#Canvas"+indX).attr("height")+"></canvas>");
        $("#crop_canvas").css("position","absolute").css('margin-left',($(window).innerWidth() - $("#Canvas"+indX).width())/3 +"px").css("margin-top",($(window).innerHeight() - $("#Canvas"+indX).height())/3 +"px").css("display","block").css("z-index",2000);

        // creating canvas and context objects
        canvas = document.getElementById('crop_canvas');
        ctx = canvas.getContext('2d');
        for(z=canvaslist+1;z>=1;z--){
            if($("#layer"+(z-1)).length != 0){
                var id = $(".layersBody li:nth-child("+z+")").attr("id");
                id     = id.replace("layer","");
                var cnvt = document.getElementById("Canvas"+id);
                ctx.drawImage(cnvt,0,0);
            }
        }

        // create initial selection
        theSelection = new Selection(50, 50, 50, 50);

        $("#crop_canvas").mousemove(function(e) { // binding mouse move event
            //$("#cropMe").remove();
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

        $("#crop_canvas").mousedown(function(e) { // binding mousedown event
            $("#cropMe").remove();
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

        $("#crop_canvas").mouseup(function(e) { // binding mouseup event
            theSelection.bDragAll = false;

            for (i = 0; i < 4; i++) {
                theSelection.bDrag[i] = false;
            }
            theSelection.px = 0;
            theSelection.py = 0;
            $(".containerMain").append("<button id='cropMe' style='position:fixed;left:"+e.pageX+"px;top:"+e.pageY+"px;z-index:5000'>Crop</button>");
            $("#cropMe").click(function(){
                //FOR MULTIPLE FUNCTIIONS
                $("#cropMe").remove();
                getCropResults(theSelection.x,theSelection.y,theSelection.w,theSelection.h);
            });
        });

        drawScene();
    });


}

function getCropResults(theSelectionX,theSelectionY,theSelectionW,theSelectionH) {
    $("#crop_canvas").remove();
    $("#cropMe").remove();
    var  canTop, canLeft;
    var wdth  = $("#Canvas0").width();
    var hght= $("#Canvas0").height();
    canTop = ($(window).innerHeight() - hght)/3 +"px";  
    canLeft= ($(window).innerWidth() - wdth)/3 +"px";
    for(var i=0;i<canvaslist;i++){
            if($("#Canvas"+i).length !== 0){
                var temp_ctx, temp_canvas, zIndx;   
                zIndx  = $("#Canvas"+i).css("z-index");
                temp_canvas = document.getElementById('Canvas'+i);
                temp_ctx = temp_canvas.getContext('2d');
                temp_canvas.width = theSelectionW;
                temp_canvas.height = theSelectionH;
                var sw = theSelectionW;
                var sh = theSelectionH;
                if((theSelectionX+theSelectionW) >layers[i].width)
                    sw = theSelectionW - (theSelectionX+theSelectionW -layers[i].width);
                if((theSelectionY+theSelectionH) >layers[i].height)
                    sh = theSelectionH - ((theSelectionY+theSelectionH) -layers[i].height);
                temp_ctx.drawImage(layers[i], theSelectionX, theSelectionY, sw, sh, 0, 0, sw, sh);
                $("#Canvas"+i).css("display","block").css('z-index',zIndx); 
            } 
    }

}
