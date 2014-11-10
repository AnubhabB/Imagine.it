/*****************
*
Author Anubhab
November 2014
*
1. Create full scale empty temp_canvas
2. On mousedown push points to array
3. Draw dotted selection line
4. Get leftmost, topmost, rightmost, bottommost points
5. If any of the above points is greater than the source canvas redraw the canvas with new size
6. Case stoke or fill simply fill, case clear simply clear selection with destination-out, case layer via create new canvas of appropriate size
7. Delete temp canvas
*
*
************/

function lasso(){
    //cleanCanv();
    /*var action = 'draw';

    var layerTempId = $(".selected").attr('id');
    var tempElement = null;
    var elementId   = "Canvas"+(layerTempId.replace("layer",""));

    var el,tempel, ctx = null,tempctx=null, isDrawing=false, correctLeft, correctTop, isDragging=false,prevX,prevY,currentX,currentY,canW=null,canH=null;
    el = document.getElementById("Canvas"+currentIndex);
    ctx = el.getContext('2d');
    var isDrawing = false;
    correctLeft = $("#"+elementId).offset().left;
    correctTop  = $("#"+elementId).offset().top;
    canvW       = $("#"+elementId).width();
    canvH       = $("#"+elementId).height();

    $(".containerMain").append("<canvas id='temp_canvas' style='position:fixed;z-index:500;display:block' width="+$("#Canvas0").attr("width")+" height="+$("#Canvas0").attr("height")+"></canvas>");
    $("#temp_canvas").css('top',correctTop+'px').css('left',correctLeft+'px');

    tempel = document.getElementById("temp_canvas");
    tempctx = tempel.getContext('2d');

    tempel.onmousedown = function(e) {
      $(".contextMenu").remove();
        isDrawing = true;
        tempctx.lineJoin = tempctx.lineCap = 'round';
        ctx.lineJoin = ctx.lineCap = 'round';
        tempctx.shadowBlur = 0;
        ctx.shadowBlur = 0;
        tempctx.shadowColor = foregroundColor;
        ctx.shadowColor = foregroundColor;
        tempctx.strokeStyle = 'rgb(245,222,179)';
        ctx.strokeStyle = 'rgb(245,222,179)';
        tempctx.lineWidth = .3;
        ctx.lineWidth = .3;
        tempctx.setLineDash([3]);
        tempctx.beginPath();
        ctx.beginPath();
        tempctx.moveTo(e.clientX-correctLeft, e.clientY- correctTop);
        ctx.moveTo(e.clientX-correctLeft, e.clientY- correctTop);
    };
    tempel.onmousemove = function(e) {
      $(".contextMenu").remove();
      if (isDrawing) {
        if(action == 'draw')
          tempctx.globalCompositeOperation = "source-over";
        else if(action == 'erase')
          tempctx.globalCompositeOperation = "destination-out";
        else 
          console.log("invalid ops");
        tempctx.lineTo(e.clientX-correctLeft, e.clientY-correctTop);
        ctx.lineTo(e.clientX-correctLeft, e.clientY-correctTop);
        tempctx.stroke();
      }
    };
    tempel.onmouseup = function(e) {
      //$(".contextMenu").remove();
      isDrawing = false;
      tempctx.closePath();
      ctx.closePath();
      tempctx.stroke();
      $(".contextMenu").remove();
      var xpos = e.clientX;
      var ypos = e.clientY;
      $(".containerMain").append("<div class='contextMenu'><ul><li id='layerViaCopy'>Layer Via Copy</li><li id='layerViaCut'>Layer Via Cut</li><li id='fillSelection'>Fill Selection</li><li id='strokeSelection'>Stroke Selection</li><li id='clearSelection'>Clear Selection</li></ul></div>");
      $(".contextMenu").css("top",ypos).css("left",xpos).css("z-index",($("#temp_canvas").css("z-index"))+1);

      $("#layerViaCopy").click(function(){
          doLasso(ctx,'copy');
      });
      $("#layerViaCut").click(function(){
          doLasso(ctx,'cut');
      });

      $("#fillSelection").click(function(){
          doLasso(ctx,'fill');
      });
      $("#strokeSelection").click(function(){
          doLasso(ctx,'stroke');
      });
      $("#clearSelection").click(function(){
          doLasso(ctx,'clear');
      });
    };
    tempel.oncontextmenu = function(e){
      return false;
    }*/

    $("#temp_canvas").remove();
    var isDrawing = false;
    if(currentIndex.length > 1 || currentIndex.length == 0){
      alert("Action not permitted - "+currentIndex.length+" layer(s) selected");
    }else{
      var points = [];
    }

}

function doLasso(ctx,action){
  $(".contextMenu").remove();
  switch(action){
    case 'copy':
      var indX = currentIndex;
      var canvaslistOld, canvaslistNew;
      var height = $("#Canvas0").height();
      var width  = $("#Canvas0").width();
      var zIndx = $("#Canvas"+indX).css("z-index"); //Get current canvas z-index
      var el    = document.getElementById("Canvas"+indX);
       //Create a new canvas 'canvasNew' below the current canvas
       $(".containerMain").append("<canvas id='CanvasNew' height='"+height+"' width='"+width+"'></canvas>").css("display","block");
       $("#CanvasNew").css("position","absolute").css('margin-left',($(window).innerWidth() - width)/3 +"px").css("margin-top",($(window).innerHeight() - height)/3 +"px").css("display","block").css('z-index',parseInt(zIndx)-1);
       var mainC = document.getElementById("CanvasNew");
       var cntx = mainC.getContext("2d"); 
       //Assign full image to new canvas
       cntx.drawImage(el,0,0);
       //layer via copy on old canvas
       ctx.globalCompositeOperation = "destination-in";
       ctx.fill();
       //change id of newCanvas
       canvaslistOld = "Canvas"+indX;
       canvaslistNew = "Canvas"+canvaslist;
       $("#"+canvaslistOld).attr("id","ttmp");
       $("#CanvasNew").attr("id",canvaslistOld);
       $("#ttmp").attr("id",canvaslistNew);
       $("#Canvas"+canvaslist).css("background","none");
       $("#Canvas0").css("background","url(static/img/bg.jpg)");
       layers[canvaslist].l = 0;
       layers[canvaslist].t  = 0;
       canvaslist++;
       currentIndex = canvaslist-1;
       saveState();
       composeLayers();
    break;
    case 'cut':
      var indX = currentIndex;
      var canvaslistOld, canvaslistNew;
      var height = $("#Canvas0").height();
      var width  = $("#Canvas0").width();
      var zIndx = $("#Canvas"+indX).css("z-index"); //Get current canvas z-index
      var el    = document.getElementById("Canvas"+indX);
       //Create a new canvas 'canvasNew' below the current canvas
       $(".containerMain").append("<canvas id='CanvasNew' height='"+height+"' width='"+width+"'></canvas>").css("display","block");
       $("#CanvasNew").css("position","absolute").css('margin-left',($(window).innerWidth() - width)/3 +"px").css("margin-top",($(window).innerHeight() - height)/3 +"px").css("display","block").css('z-index',parseInt(zIndx)-1);
       var mainC = document.getElementById("CanvasNew");
       var cntx = mainC.getContext("2d"); 
       //Assign full image to new canvas
       cntx.drawImage(el,0,0);
       //layer via copy on old canvas
       ctx.globalCompositeOperation = "destination-in";
       ctx.fill();
       //change id of newCanvas
       canvaslistOld = "Canvas"+indX;
       canvaslistNew = "Canvas"+canvaslist;
       $("#"+canvaslistOld).attr("id","ttmp");
       $("#CanvasNew").attr("id",canvaslistOld);
       $("#ttmp").attr("id",canvaslistNew);
       $("#Canvas"+canvaslist).css("background","none");
       $("#Canvas0").css("background","url(static/img/bg.jpg)");

       canvaslist++;
       currentIndex = canvaslist-1;
       saveState();
       composeLayers();
       alert("To do");
    break;
    case 'fill':
      ctx.fillStyle = foregroundColor;
      ctx.fill();
    break;
    case 'stroke':
      ctx.setLineDash = null;
      ctx.strokeStyle = foregroundColor;
      ctx.stroke();
    break;
    case 'clear':
      ctx.globalCompositeOperation = "destination-out";
      ctx.fill();
    break;
    default:
      alert("to do");
    break;
  }
  $("#temp_canvas").remove();
  saveState();
  setTimeout(function(){

  });
}