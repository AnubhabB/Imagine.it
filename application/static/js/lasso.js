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

  init.history("push","Select-custom");
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
  lasso.prototype.lassoCopyCut(action, points);

  $("#temp_canvas").remove();
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
  }else {
      
      if(action == "copy" || action == "cut"){
        console.log("cp")
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
        var zIndx   = $("#Canvas"+currentIndex).css("z-index"); 
        if($("#Canvas"+canvaslist).length == 0)
          $(".containerMain").append("<canvas id='Canvas"+canvaslist+"' width="+newWidth+" height="+newHeight+" style='position:fixed;top:"+(newminY+$("#Canvas0").offset().top)+"px;left:"+(newminX+$("#Canvas0").offset().left)+"px;z-index:"+(parseInt(zIndx)+1)+"'></canvas>");
        else
          alert("WTF");

        var ctx = document.getElementById("Canvas"+canvaslist).getContext('2d');
        var drawX = $("#Canvas"+currentIndex).offset().left - $("#Canvas"+canvaslist).offset().left;
        var drawY = $("#Canvas"+currentIndex).offset().top - $("#Canvas"+canvaslist).offset().top;

        //
        var cnv = document.getElementById("Canvas"+currentIndex);
        ctx.drawImage(cnv,drawX,drawY);
        var correctX = $("#Canvas"+canvaslist).offset().left - $("#Canvas0").offset().left;
        var correctY = $("#Canvas"+canvaslist).offset().top - $("#Canvas0").offset().top;
        lasso.prototype.doCanvasAction(ctx,points,correctX,correctY,"destination-in",function(){
          
          imageLayers[canvaslist] = {};
          imageLayers[canvaslist].imageObj = new Image();
          imageLayers[canvaslist].name = imageLayers[currentIndex].name+" Copy";
          imageLayers[canvaslist].imageObj.src = cnv.toDataURL();
          imageLayers[canvaslist].identity = "Canvas"+canvaslist;
          canvaslist++;

          if(action == "cut"){
            var ctx = document.getElementById("Canvas"+currentIndex).getContext("2d");
            var correctX = $("#Canvas"+currentIndex).offset().left - $("#Canvas0").offset().left;
            var correctY = $("#Canvas"+currentIndex).offset().top - $("#Canvas0").offset().top;
            lasso.prototype.doCanvasAction(ctx,points,correctX,correctY,"destination-out",function(){});
          }

          fileOps.prototype.composeLayers();
        });
      }else if(action == 'clear'){

        var ctx = document.getElementById("Canvas"+currentIndex).getContext("2d");
        var correctX = $("#Canvas"+currentIndex).offset().left - $("#Canvas0").offset().left;
        var correctY = $("#Canvas"+currentIndex).offset().top - $("#Canvas0").offset().top;
        lasso.prototype.doCanvasAction(ctx,points,correctX,correctY,"destination-out",function(){});

      }else if(action == 'fill' || action == 'stroke'){
        //console.log("fill stroke called");
        var img = new Image();

        if(minX < orgX0){
          var newLeft = minX;
        }else{
          var newLeft = orgX0;
        }
        if(maxX > orgX1){
          var newEndLeft = maxX ;
        }else{
          var newEndLeft = orgX1 ;
        }
        if(minY < orgY0){
          var newTop = minY;
        }else{
          var newTop = orgY0;
        }
        if(maxY > orgY1){
          var newEndTop = maxY ;
        }else{
          var newEndTop = orgY1 ;
        }

        var dimenX = newLeft;
        var dimenY = newTop;
        var dimenW = newEndLeft - dimenX;
        var dimenH = newEndTop - dimenY;
        if(minX < orgX0)
          var corImLeft = orgX0 - minX;
        else
          var corImLeft = orgX0;

        if(minY < orgY0)
          var corImTop  = orgY0 - minY;
        else
          var corImTop  = orgY0;

        //var ctx = document.getElementById("Canvas"+currentIndex).getContext("2d");
        var url = document.getElementById("Canvas"+currentIndex).toDataURL();

        img.onload = function(){
          $(".containerMain").append("<canvas id='temp2_canvas' width="+dimenW+" height="+dimenH+" style='position:fixed;top:"+(dimenY+$("#Canvas0").offset().top)+"px;left:"+(dimenX + $("#Canvas0").offset().left)+"px;z-index:1000;'></canvas>");
          var cntx = document.getElementById("temp2_canvas").getContext('2d');
          cntx.drawImage(img,corImLeft,corImTop);

          var correctX = $("#temp2_canvas").offset().left - $("#Canvas0").offset().left;
          var correctY = $("#temp2_canvas").offset().top - $("#Canvas0").offset().top;

          lasso.prototype.doCanvasAction(cntx,points,correctX,correctY,"source-over",function(){
            var zIndx = $("#Canvas"+currentIndex).css("z-index");
            $("#Canvas"+currentIndex).attr("id","interM");
            $("#temp2_canvas").attr("id","Canvas"+currentIndex).css("z-index",zIndx);
            $("#interM").remove();
          },action);          
        }
        img.src = url;
      }
    }
    init.history("push",action);
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

lasso.prototype.doCanvasAction = function(ctx,points,correctLeft,correctTop,composite,callback, action) {
  // body...
  var len = points.length;
  ctx.fillStyle = foregroundColor;
  ctx.strokeStyle = foregroundColor;
  ctx.globalCompositeOperation = composite;
  ctx.beginPath();
  ctx.moveTo(points[0].x - correctLeft,points[0].y - correctTop);
  for(var i=1;i<len;i++){
      ctx.lineTo(points[i-1].x - correctLeft, points[i-1].y - correctTop);
  }
  ctx.lineTo(points[0].x - correctLeft,points[0].y - correctTop);
  ctx.closePath();
  
  if(action != "stroke")
    ctx.fill();
  else
    ctx.stroke();

  callback();
};

