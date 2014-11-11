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

    $("#temp_canvas").off("mousedown").off("mouseup").off("mousemove");
    $("#temp_canvas").remove();
    var isDrawing = false;
    if(currentIndex.length > 1 || currentIndex.length == 0){
      alert("Action not permitted - "+currentIndex.length+" layer(s) selected");
    }else{
      var points = [], startX, startY, endX, endY;
      var tempW = $("#Canvas0").attr("width");
      var tempH = $("#Canvas0").attr("height");
      var tempL = $("#Canvas0").offset().left;
      var tempT = $("#Canvas0").offset().top;

      $(".containerMain").append("<canvas id='temp_canvas' style='position:fixed;z-index:500;display:block;left:"+tempL+"px;top:"+tempT+"px' width="+tempW+" height="+tempH+"></canvas>");
      var tempCtx = document.getElementById("temp_canvas").getContext("2d");
      var correctLeft = $("#temp_canvas").offset().left;
      var correctTop = $("#temp_canvas").offset().top;
      $("#temp_canvas").on("mousedown",function(ev){
        $(".contextMenu").remove();
        isDrawing = true;
        points.push({ 
          x: ev.pageX - correctLeft, 
          y: ev.pageY- correctTop
        });
        lasso.prototype.drawSelection(tempCtx, points, 'start');
      });

      $("#temp_canvas").on("mousemove",function(ev){
        if(!isDrawing) return;

        $(".contextMenu").remove();
        points.push({ 
          x: ev.pageX - correctLeft, 
          y: ev.pageY- correctTop
        });
        lasso.prototype.drawSelection(tempCtx, points, 'move');
      });

      $("#temp_canvas").on("mouseup",function(ev){
        isDrawing = false;
        lasso.prototype.drawSelection(tempCtx, points, 'end');
        var xpos = ev.clientX - correctLeft;
        var ypos = ev.clientY;
        lasso.prototype.contextmenu(xpos,ypos, points);
      });

      $("#temp_canvas").on("contextmenu",function(){
        return false;
      });
    }

}

lasso.prototype.contextmenu = function(xpos,ypos, points) {
  $(".contextMenu").remove();
  $(".containerMain").append("<div class='contextMenu'><ul><li id='layerViaCopy'>Layer Via Copy</li><li id='layerViaCut'>Layer Via Cut</li><li id='fillSelection'>Fill Selection</li><li id='strokeSelection'>Stroke Selection</li><li id='clearSelection'>Clear Selection</li></ul></div>");
  $(".contextMenu").css({
    "top": ypos+"px",
    "left": xpos+"px",
    "z-index": $("#temp_canvas").css("z-index") + 100
  });

  $("#layerViaCopy").click(function(){
      lasso.prototype.doLasso('copy', points);
  });
  $("#layerViaCut").click(function(){
      lasso.prototype.doLasso('cut', points);
  });

  $("#fillSelection").click(function(){
      lasso.prototype.doLasso('fill', points);
  });
  $("#strokeSelection").click(function(){
      lasso.prototype.doLasso('stroke', points);
  });
  $("#clearSelection").click(function(){
      lasso.prototype.doLasso('clear', points);
  });

  init.prototype.history("push","Select-custom");
};

lasso.prototype.drawSelection = function(tempCtx, points, act){
  
  var len = points.length;
  var ctx = tempCtx;
  
  ctx.clearRect(0,0,$("#temp_canvas").width(),$("#temp_canvas").height());
  ctx.strokeStyle = "#fff";
  ctx.lineWidth   = .6;
  ctx.setLineDash([4]);

  ctx.beginPath();
  ctx.moveTo(points[0].x,points[0].y);
    for(var i=1;i<len;i++){
        ctx.lineTo(points[i].x, points[i].y);
    }
    if(act == "end"){
      ctx.lineTo(points[0].x,points[0].y);
      ctx.closePath();
    }
    ctx.stroke();
}

lasso.prototype.doLasso = function(action, points) {
  
  $(".contextMenu").remove();

  if(action == 'cut' || action == 'copy')
    lasso.prototype.lassoCopyCut(action, points);

  



  /*if(maxY < orgY0 || maxX < orgX0 ){
      alert("No Pixels Selected");
  }else if(minX < orgX0 || minY < orgY0 || maxX > orgX1 || maxY > orgY1){
    if(action == "copy" || action == "cut"){
      //alert("Oops! Make selection inside the image, we are working on this");
      //Recreate points
      var l = points.length;
      for(var i=1;i<l;i++){
        if(points[i-1].x < orgX0 ){
          points[i-1].x = orgX0;
        }else if(points[i-1].x > orgX1){
          points[i-1].x = orgX1;
        }
        if(points[i-1].y < orgY0 ){
          points[i-1].y = orgY0;
        }else if(points[i-1].y > orgY1){
          points[i-1].y = orgY1;
        }
      }
      //var  =  

    }else if(action == "fill" || action == "stroke"){
      //Create New canvas of this size
    }
  }else{
    console.log(currentIndex);
    var can = document.getElementById("Canvas"+currentIndex);
    var ctx = can.getContext("2d");
  }*/
/*
  var corrL = $("#Canvas"+currentIndex).offset().left - $("#Canvas0").offset().left;
  var corrT = $("#Canvas"+currentIndex).offset().top - $("#Canvas0").offset().top;

  if(action == "stroke" || action == "fill"){
    var len = points.length;
    ctx.strokeStyle = foregroundColor;
    ctx.fillStyle = foregroundColor;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(points[0].x - corrL,points[0].y - corrT);
      for(var i=1;i<len;i++){
          ctx.lineTo(points[i-1].x - corrL, points[i-1].y - corrT);
      }
    ctx.lineTo(points[0].x - corrL,points[0].y - corrT);
    ctx.closePath();
    if(action == "fill"){
      ctx.fill();
    }else if(action == "stroke"){
      ctx.stroke();  
    }
  }*/

  


  /*switch(action){
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
  }*/
  $("#temp_canvas").remove();
  /*saveState();
  setTimeout(function(){

  });*/
}

lasso.prototype.lassoCopyCut = function(action, points) {
    
  var orgX0 = $("#Canvas"+currentIndex).offset().left - $("#Canvas0").offset().left;
  var orgY0 = $("#Canvas"+currentIndex).offset().top - $("#Canvas0").offset().top;
  var orgX1 = orgX0 + $("#Canvas"+currentIndex).width();
  var orgY1 = orgY0 + $("#Canvas"+currentIndex).height();

  var minmax = lasso.prototype.minMax(points);

  var minX = minmax[0];
  var minY = minmax[1];
  var maxX = minmax[2];
  var maxY = minmax[3];

  if(maxY < orgY0 || maxX < orgX0 ){
      alert("No Pixels Selected");
  }else if(minX < orgX0 || minY < orgY0 || maxX > orgX1 || maxY > orgY1){
      //Recreate points
      var l = points.length;
      for(var i=1;i<l;i++){
        if(points[i-1].x < orgX0 ){
          points[i-1].x = orgX0;
        }else if(points[i-1].x > orgX1){
          points[i-1].x = orgX1;
        }
        if(points[i-1].y < orgY0 ){
          points[i-1].y = orgY0;
        }else if(points[i-1].y > orgY1){
          points[i-1].y = orgY1;
        }
      }

      var newminmax = lasso.prototype.minMax(points);
      var newminX = newminmax[0];
      var newminY = newminmax[1];
      var newmaxX = newminmax[2];
      var newmaxY = newminmax[3];
      var newWidth = newmaxX - newminX;
      var newHeight= newmaxY - newminY;

      if($("#fly_canvas").length == 0)
        $(".containerMain").append("<canvas id='fly_canvas' width="+newWidth+" height="+newHeight+" style='position:fixed;border:1px solid #ccc;top:"+(newminY+$("#Canvas0").offset().top)+"px;left:"+(newminX+$("#Canvas0").offset().left)+"px;z-index:1000'></canvas>");
      else
        alert("WTF");

      var ctx = document.getElementById("fly_canvas").getContext('2d');
      var drawX = $("#Canvas"+currentIndex).offset().left - $("#fly_canvas").offset().left;
      var drawY = $("#Canvas"+currentIndex).offset().top - $("#fly_canvas").offset().top;

      //
      var cnv = document.getElementById("Canvas"+currentIndex);
      
      ctx.drawImage(cnv,drawX,drawY);

      var correctX = $("#fly_canvas").offset().left - $("#Canvas0").offset().left;
      var correctY = $("#fly_canvas").offset().top - $("#Canvas0").offset().top;
      if(action == "copy"){
        lasso.prototype.doCanvasAction(ctx,points,correctX,correctY,"destination-in",function(){
          console.log("Do new Layer addition here");
        });
      }

  }else{
    console.log(currentIndex);
    var can = document.getElementById("Canvas"+currentIndex);
    var ctx = can.getContext("2d");
  }

};

lasso.prototype.minMax = function(points) {
  
  var minX = points[0].x, minY = points[0].y;
  var maxX = points[points.length - 1].x, maxY = points[points.length - 1].y;
  $.each(points,function(k,v){
    if(points[k].x < minX){
      minX = points[k].x;
    }
    if(points[k].y < minY){
      minY = points[k].y
    }
    if(points[k].x > maxX){
      maxX = points[k].x;
    }
    if(points[k].y > maxY){
      maxY = points[k].y;
    }
  });
  var minMaxArray = [minX,minY,maxX,maxY];
  return minMaxArray;
};

lasso.prototype.doCanvasAction = function(ctx,points,correctLeft,correctTop,composite,callback) {
  // body...
  var len = points.length;
  ctx.fillStyle = "#fff";
  ctx.globalCompositeOperation = composite;
  ctx.beginPath();
  ctx.moveTo(points[0].x - correctLeft,points[0].y - correctTop);
  for(var i=1;i<len;i++){
      ctx.lineTo(points[i-1].x - correctLeft, points[i-1].y - correctTop);
  }
  ctx.lineTo(points[0].x - correctLeft,points[0].y - correctTop);
  ctx.closePath();
  ctx.fill();

  callback();
};

