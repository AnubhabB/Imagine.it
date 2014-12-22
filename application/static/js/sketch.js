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

function sketch(action){
 
  var points = [], isDrawing = false, ctx, cnv, corL, corT, cvRef, oldln= 0, newln = 0, cursorUrl = '', state, brush = 'round';
  $("Canvas").off("mousedown").off("mouseup").off("mousemove");
  $("#temp_canvas").remove();
  $(".containerMain").append("<canvas id='temp_canvas' width="+$("#Canvas0").width()+" height="+$("#Canvas0").height()+" style='z-index:600;position:fixed;top:"+$("#Canvas0").offset().top+"px;left:"+$("#Canvas0").offset().left+"px;'></canvas>");

  sketch.prototype.bindEvents = function() {
    cvRef.on("mousedown",function(e){
      isDrawing = true;
      $(".brushDetails").css('display','none');
      points.push({ x: e.pageX - corL, y: e.pageY - corT });
    });

    cvRef.on("mousemove",function(e){
      if(!isDrawing) return;

      points.push({ x :  e.pageX - corL, y: e.pageY - corT });
      sketch.prototype.render(points,action, ctx);
    });

    cvRef.on("mouseup",function(e){
      isDrawing = false;
      if(action !== "eraser")
        sketch.prototype.createNewLayer();
      else
        points.length = 0;
      init.history("push",state);
    });
  };

  sketch.prototype.prepareMousePointer = function() {
    
    $("#mousePointer").remove();

    $("body").append("<canvas id='mousePointer' width="+brushWidth+" height="+brushWidth+" hidden></canvas>");
    var cursorCnv = document.getElementById("mousePointer");
    var cursorCtx = cursorCnv.getContext('2d');
    cursorCtx.strokeStyle = "#ccc";
    cursorCtx.lineWidth = 1;
    cursorCtx.strokeRect(0,0,brushWidth,brushWidth);
    cursorUrl = cursorCnv.toDataURL();
    sketch.prototype.updatePointer();
  };

  sketch.prototype.createNewLayer = function() {

    var minMax = sketch.prototype.minMax(points);
    var minX   = minMax[0];
    var minY   = minMax[1];
    var maxX   = minMax[2];
    var maxY   = minMax[3];    

    var curX0   = $("#Canvas"+currentIndex).offset().left - $("#Canvas0").offset().left;
    var curY0   = $("#Canvas"+currentIndex).offset().top - $("#Canvas0").offset().top;
    var curX1    = curX0 + parseInt($("#Canvas"+currentIndex).attr("width"));
    var curY1    = curY0 + parseInt($("#Canvas"+currentIndex).attr("height"));
    
    var newX0, newY0, newX1, newY1;
    if(minX < curX0){
      newX0 = minX - brushWidth;
    }else{
      newX0 = curX0;
    }
    if(minY < curY0){
      newY0 = minY - brushWidth;
    }else{
      newY0 = curY0;
    }
    if(curX1 < maxX){
      newX1 = maxX + brushWidth;
    }else{
      newX1 = curX1;
    }
    if(curY1 < maxY){
      newY1 = maxY + brushWidth;
    }else{
      newY1 = curY1;
    }

    sketch.prototype.newLayerRedraw(newX0,newY0,newX1,newY1);
  };
  

  
  sketch.prototype.render = function(points,action,ctx) {
    if(action == "eraser")
      ctx.globalCompositeOperation = "destination-out";
    else
      ctx.globalCompositeOperation = "source-over";

    if(brush != "spray"){
      var len = points.length;
      ctx.lineWidth = brushWidth;
      ctx.lineJoin = ctx.lineCap = brush;
      ctx.shadowBlur = featherWidth;
      ctx.shadowColor = foregroundColor;
      ctx.strokeStyle = foregroundColor;

      ctx.beginPath();
      ctx.moveTo(points[len-2].x, points[len-2].y);
      ctx.lineTo(points[len-1].x, points[len-1].y);
      ctx.stroke();
    }
  };


  sketch.prototype.newLayerRedraw = function(newX0,newY0,newX1,newY1) {

    var calcL = $("#Canvas0").offset().left + newX0;
    var calcT = $("#Canvas0").offset().top + newY0;
    var calcW = newX1 - newX0;
    var calcH = newY1 - newY0;
    $(".containerMain").append("<canvas id='t_cnv' style='position:fixed;z-index:1000;left:"+calcL+"px;top:"+calcT+"px' width="+calcW+" height="+calcH+"></canvas>");
    //GET ALL VALUES OF CURRENT CANVAS - image, z-index and draw it on to t_cnv
    var cv = document.getElementById("Canvas"+currentIndex);
    var z  = $("#Canvas"+currentIndex).css("z-index");
    var ctx = document.getElementById("t_cnv").getContext("2d");

    //GET TOP LEFT for draw
    var t_left= parseInt($("#Canvas"+currentIndex).offset().left) - parseInt($("#t_cnv").offset().left);
    var t_top = parseInt($("#Canvas"+currentIndex).offset().top) -  parseInt($("#t_cnv").offset().top);
    ctx.drawImage(cv,t_left,t_top);

    t_left= parseInt($("#temp_canvas").offset().left) - parseInt($("#t_cnv").offset().left);
    t_top = parseInt($("#temp_canvas").offset().top) -  parseInt($("#t_cnv").offset().top);
    cv = document.getElementById("temp_canvas");
    ctx.drawImage(cv,t_left,t_top);

    $("#Canvas"+currentIndex).remove();
    $("#temp_canvas").remove();
    $("#t_cnv").css("z-index",z).attr("id","Canvas"+currentIndex);
  };


  sketch.prototype.secondPanel = function(action) {
    $("#thumbActions").off("click");
    $("#thumbActions").off("click",".thumbAct");
    $(".brushType").off("click",".brushThumb");
    $(".thumbAct").remove();

    $("#thumbActions").html("<div class='left thumbAct'></div>");

    $("#thumbActions .thumbAct").html("<img src='static/img/eraser.png'/>");
    $("#thumbActions").on("click",".thumbAct",function(){
      if($(".brushDetails").css('display') == 'none'){
        $(".brushDetails").css('display','block');
        $("#brushHeading").html('Eraser Details - '+brush);
      }else{
        $(".brushDetails").css('display','none');
      }
    });

    $(".brushType").on("click",".brushThumb",function(){
      brush = this.id;
      $("#brushHeading").html('Eraser Details - '+brush);
    });
    
    $(".brushDetails .close").on("click",function(){
      $(".brushDetails").css('display','none');
    });

  };

  sketch.prototype.updatePointer = function(first_argument) {
    var crvRef = $("#temp_canvas");
    crvRef.css({
        "cursor":"url("+cursorUrl+")"+(brushWidth/2)+" "+(brushWidth/2)+", auto"
      });
  };


  sketch.prototype.minMax = function(points) {
  
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

  sketch.prototype.secondPanel(action);
  cvRef = $("#temp_canvas");

  if(action == "eraser"){
    cnv = document.getElementById('Canvas'+currentIndex);  
    corL= $("#Canvas"+currentIndex).offset().left;
    corT= $("#Canvas"+currentIndex).offset().top;
    state = "Erase";
  }else if(action == "brush"){
    cnv = document.getElementById("temp_canvas");
    corL= $("#temp_canvas").offset().left;
    corT= $("#temp_canvas").offset().top;
    state= "Brush"
  }
  ctx = cnv.getContext('2d');
  sketch.prototype.bindEvents();
  if(cursorUrl != ''){
    sketch.prototype.updatePointer();
  }else{
    sketch.prototype.prepareMousePointer();
  }
}
