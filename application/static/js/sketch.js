/************************
*
*
Author Anubhab
August 2015
Developed Heavily on existing methods
Function: Paint, Erase, Move
Catch: tried separating move but somee conflict with event handelling
*
****************/

function draw(elemId,action){
    cleanCanv();
    var indX = currentIndex;
    $(".containerMain").append("<canvas id='temp_canvas' width="+$("#Canvas"+indX).attr("width")+" height="+$("#Canvas"+indX).attr("height")+"></canvas>");
    $("#temp_canvas").css("position","absolute").css('margin-left',($(window).innerWidth() - $("#Canvas"+indX).width())/3 +"px").css("margin-top",($(window).innerHeight() - $("#Canvas"+indX).height())/3 +"px").css("display","block").css("z-index",1000);

    var layerTempId = $(".selected").attr('id');
    var elementId = "Canvas"+(layerTempId.replace("layer",""));

    var el, ctx = null, isDrawing=false, correctLeft, correctTop, isDragging=false,prevX,prevY,currentX,currentY,ctxTemp = null;
    var moveXAmount=0;
    var moveYAmount=0;
    var canMouseY=0;
    var canMouseX=0;
    prevX = 0;
    prevY = 0;
    currentX = 0;
    currentY = 0;


    //TARGET CONTEXT
    elMain = document.getElementById("Canvas"+currentIndex);
    ctxMain = elMain.getContext('2d');
    //TEMP CONTEXT
    el = document.getElementById("temp_canvas");
    ctx = el.getContext('2d');


    isDrawing;
    correctLeft = $("#"+elementId).offset().left;
    correctTop  = $("#"+elementId).offset().top;
    el.onmousedown = function(e) {
      $(".actionButton").remove();
      if(action != 'move'){
        isDrawing = true;
        if(brushType!=='spray'){
            ctx.lineWidth = brushWidth;
            ctxMain.lineWidth = brushWidth;
            ctx.lineJoin = ctx.lineCap = 'round';
            ctxMain.lineJoin = ctx.lineCap = 'round';
            ctx.shadowBlur = featherWidth;
            ctxMain.shadowBlur = featherWidth;
            ctx.shadowColor = foregroundColor;
            ctxMain.shadowColor = foregroundColor;
            ctx.strokeStyle = foregroundColor;
            ctxMain.strokeStyle = foregroundColor;
            ctx.moveTo(e.clientX-correctLeft, e.clientY- correctTop);
            ctxMain.moveTo(e.clientX-correctLeft, e.clientY- correctTop);
          }else{
            ctx.lineJoin = ctx.lineCap = 'round';
            ctxMain.lineJoin = ctxMain.lineCap = 'round';
            clientX = e.clientX;
            clientY = e.clientY;
            
            timeout = setTimeout(function draw() {
              for (var i = sprayDensity; i--; ) {
                var angle = getRandomFloat(0, Math.PI * 2);
                var radius = getRandomFloat(0, 30);
                ctx.globalAlpha = Math.random();
                ctxMain.globalAlpha = Math.random();
                ctx.fillStyle = foregroundColor;
                ctxMain.fillStyle = foregroundColor;
                ctx.fillRect(
                  clientX + radius * Math.cos(angle),
                  clientY + radius * Math.sin(angle), 
                  getRandomFloat(1, 2), getRandomFloat(1, 2));
                ctxMain.fillRect(
                  clientX + radius * Math.cos(angle),
                  clientY + radius * Math.sin(angle), 
                  getRandomFloat(1, 2), getRandomFloat(1, 2));
              }
              if (!timeout) return;
              timeout = setTimeout(draw, 50);
            }, 50);
          }
      }else if(action == 'move'){
        canMouseX=parseInt(e.clientX-correctLeft);
        canMouseY=parseInt(e.clientY-correctTop);
      // set the drag flag
        isDragging=true;
      }
    };
    el.onmousemove = function(e) {
      if (isDrawing) {
        if(action == 'draw'){
                  ctx.globalCompositeOperation = "source-over";
                  ctxMain.globalCompositeOperation = "source-over";
        }else if(action == 'erase'){
          ctx.globalCompositeOperation = "destination-out";
          ctxMain.globalCompositeOperation = "destination-out";
        }else {
          console.log("invalid ops");
        }
        if(brushType!=='spray'){
          ctxMain.lineTo(e.clientX-correctLeft, e.clientY-correctTop);
          ctxMain.stroke();
        }else{
          clientX = e.clientX-correctLeft;
          clientY = e.clientY-correctTop;
        }
      }else if(isDragging){
        moveXAmount = parseInt(e.clientX-correctLeft) - canMouseX;// prevX -canMouseX;
        moveYAmount = parseInt(e.clientY-correctTop) - canMouseY;// prevX -canMouseX;

          ctxMain.clearRect(0,0,$("#Canvas0").width(),$("#Canvas0").height());
          ctxMain.drawImage(layers[currentIndex],moveXAmount,moveYAmount);
          layers[currentIndex].t = moveYAmount;
          layers[currentIndex].l = moveXAmount;
          //console.log(layers[currentIndex].t + " assign at move "+layers[currentIndex].l)
        }
    };
    el.onmouseup = function(e) {
      isDrawing = false;
      isDragging= false;
      if(action=='move'){
        canMouseX=parseInt(e.clientX-correctLeft);
        canMouseY=parseInt(e.clientY-correctTop);
      // clear the drag flag
        isDragging=false;
      }
      if(action!='move'){
        console.log("Brush type in mouse up not move"+brushType);
        if(brushType == 'spray'){
          //console.log("spray called from mouseup")
          clearTimeout(timeout);
        }
        saveState();
        setTimeout(function(){
          draw(elementId,action);
        },500);
      }else if(action == 'move'){
        $(".containerMain").append("<button id='moveButton' class='actionButton' onclick='saveState()' style='position:fixed'>Save</button>");
        $("#moveButton").css('top',e.clientY +"px").css('left',e.clientX -50+"px").css('z-index',1000);
        $(".tools").removeClass("active");
        toolSelected = '';
        //console.log(layers[currentIndex].l+" "+layers[currentIndex].t+" "+layers[currentIndex].w+" "+layers[currentIndex].h+" this from move");
      }
    };


}

function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
}