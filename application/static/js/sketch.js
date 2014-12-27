/************************
*
*
Author Anubhab
August 2015
Developed Heavily on existing methods
Function: Paint, Erase
*
****************/

function sketch(action){

  var self = this;
  var points  = [], isDrawing = false, ctx, cnv, corL, corT, cvRef, oldln= 0, newln = 0, cursorUrl = '', state;

  var brushWidth  = window.brushWidth * zoom.zoomfactor;
  var featherWidth= window.featherWidth;

  sketch.prototype.bindEvents = function() {
    cvRef.on("mousedown",function(e){
      isDrawing = true;
      $(".brushDetails").css('display','none').empty();
      points.push({ x :  (e.pageX - corL)/zoom.zoomfactor, y: (e.pageY - corT)/zoom.zoomfactor });
    });

    cvRef.on("mousemove",function(e){
      if(!isDrawing) return;

      points.push({ x :  (e.pageX - corL)/zoom.zoomfactor, y: (e.pageY - corT)/zoom.zoomfactor });
      self.render(points,action, ctx);
    });

    cvRef.on("mouseup",function(e){
      isDrawing = false;
      if(action !== "eraser")
        self.createNewLayer();
      else
        points.length = 0;

      init.history("push",state);
    });
  };

  sketch.prototype.prepareMousePointer = function() {

    var self = this;
    
    $("#mousePointer").remove();
    
    $("body").append("<canvas id='mousePointer' width="+brushWidth+" height="+brushWidth+" hidden style='padding:2px;'></canvas>");
    var cursorCnv = document.getElementById("mousePointer");
    var cursorCtx = cursorCnv.getContext('2d');
    cursorCtx.strokeStyle = "#ccc";
    cursorCtx.lineWidth = 1;
    if(brush == "square"){
      cursorCtx.strokeRect(0,0,brushWidth,brushWidth);
    }else if(brush == "round"){
      cursorCtx.beginPath();
      var val = brushWidth/2;
      cursorCtx.arc(val,val,val,0,2*Math.PI);
      cursorCtx.stroke();
    }else{
      cursorCtx.strokeRect(0,0,brushWidth,brushWidth); //Todo: spray and other brush types
    }
    cursorUrl = cursorCnv.toDataURL();
    self.updatePointer();
  };

  sketch.prototype.createNewLayer = function() {

    var self = this;
    var minMax = this.minMax(points);
    console.log(minMax);

    var minX   = minMax[0];
    var minY   = minMax[1];
    var maxX   = minMax[2];
    var maxY   = minMax[3];    

    var curX0   = ($("#Canvas"+currentIndex).offset().left - globalLeft)/zoom.zoomfactor;
    var curY0   = ($("#Canvas"+currentIndex).offset().top - globalTop)/zoom.zoomfactor  ;


    var curX1    = curX0 + parseInt($("#Canvas"+currentIndex).attr("width"));
    var curY1    = curY0 + parseInt($("#Canvas"+currentIndex).attr("height"));

    var newX0, newY0, newX1, newY1;

    newX0 = curX0;
    newX1 = curX1;
    newY0 = curY0;
    newY1 = curY1;

    if(minX < curX0){
      newX0 = minX - window.brushWidth;
    }

    if(minY < curY0){
      newY0 = minY - window.brushWidth;
    }

    if(curX1 < maxX){
      newX1 = maxX + window.brushWidth;
    }

    if(curY1 < maxY){
      newY1 = maxY + window.brushWidth;
    }

    self.newLayerRedraw(newX0,newY0,newX1,newY1);
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

    var self = this;
    //DRAW A FULL CANVAS, forget zoom n shit for now;
    var calcL = newX0 + globalLeft;
    var calcT = newY0 + globalTop;
    var calcW = newX1 - newX0;
    var calcH = newY1 - newY0;


    $(".containerMain").append("<canvas id='t_cnv' style='position:fixed;z-index:1000;left:"+calcL+"px;top:"+calcT+"px;width:"+calcW+"px;height:"+calcH+"px;border:1px solid #ff0' width="+calcW+" height="+calcH+"></canvas>");
    /*var calcL = globalLeft + newX0;
    var calcT = globalTop + newY0;
    var calcW = newX1 - newX0;
    var calcH = newY1 - newY0;

    $(".containerMain").append("<canvas id='t_cnv' style='position:fixed;z-index:1000;left:"+calcL+"px;top:"+calcT+"px;width:"+calcW+"px;height:"+calcH+"px;border:1px solid #ff0' width="+calcW+" height="+calcH+"></canvas>");

    alert("Yellow");
    //GET ALL VALUES OF CURRENT CANVAS - image, z-index and draw it on to t_cnv
    var cv = document.getElementById("Canvas"+currentIndex);
    var z  = $("#Canvas"+currentIndex).css("z-index");
    var ctx = document.getElementById("t_cnv").getContext("2d");

    //GET TOP LEFT for draw
    var t_left= parseInt($("#Canvas"+currentIndex).offset().left) - parseInt($("#t_cnv").offset().left);
    var t_top = parseInt($("#Canvas"+currentIndex).offset().top) -  parseInt($("#t_cnv").offset().top);
    alert("Post Yellow");*/
    /*
    ctx.drawImage(cv,t_left,t_top);

    t_left= parseInt($("#temp_canvas").offset().left) - parseInt($("#t_cnv").offset().left);
    t_top = parseInt($("#temp_canvas").offset().top) -  parseInt($("#t_cnv").offset().top);
    cv = document.getElementById("temp_canvas");
    ctx.drawImage(cv,t_left,t_top);

    $("#Canvas"+currentIndex).remove();
    $("#temp_canvas").remove();
    $("#t_cnv").css("z-index",z).addClass("canvasClass").attr("id","Canvas"+currentIndex);*/
  };

  sketch.prototype.updateBrushSize = function() {
    var self = this;
    brushWidth = $("#brushSize").slider("value") * zoom.zoomfactor;
    window.brushWidth = $("#brushSize").slider("value");
    $("#sizeLabel").html($("#brushSize").slider("value")+"px");
    sketch.prototype.prepareMousePointer();
  };

  sketch.prototype.updateFeatherSize = function() {
    var self = this;
    featherWidth = $("#blurRadius").slider("value");
    $("#featherLabel").html($("#blurRadius").slider("value")+"px");
  };

  sketch.prototype.brushOperations = function() {
    var self = this;

    $(".brushType").on("click",".brushThumb",function(){
      brush = this.id;
      $("#brushHeading").html('Eraser Details - '+brush);
      self.prepareMousePointer();
    });
    
    $(".brushDetails .close").on("click",function(){
      $(".brushDetails").empty().css('display','none');
    });

    //SLIDERS
    $("#brushSize").slider({
      value:brushWidth,
      min:1,
      max:500,
      animate:true,
      change:self.updateBrushSize,
      slide:self.updateBrushSize,
      step:1
    });


    $("#blurRadius").slider({
      value:featherWidth,
      min:1,
      max:100,
      animate:true,
      change:self.updateFeatherSize,
      slide:self.updateFeatherSize,
      step:1
    });
  };


  sketch.prototype.secondPanel = function(action) {
    var self = this;

    $("#thumbActions").off("click");
    $("#thumbActions").off("click",".thumbAct");
    $(".brushType").off("click",".brushThumb");
    $(".thumbAct").remove();

    $("#thumbActions").html("<div class='left thumbAct'></div>");

    $("#thumbActions .thumbAct").html("<img src='static/img/"+action+".png'/>");

    $("#thumbActions").on("click",".thumbAct",function(){
      if($(".brushDetails").css('display') == 'none'){
        $(".brushDetails").css('display','block');
        $(".brushDetails").html('<div class="row-fluid"><label class="left" id="brushHeading" style="font-size:11px">Brush Details</label><div class="close" style="margin:0" title="Close Brush Panel">x</div></div><div class="row-fluid"><div class="row-fluid"><label class="left">Size:</label><label id="sizeLabel" class="right">'+brushWidth+'px</label></div><div class="row-fluid" style="height:16px"><div class="sliderGroove"><div id="brushSize"></div></div></div></div><div class="row-fluid"><div class="row-fluid"><label class="left">Feather:</label><label id="featherLabel" class="right">'+featherWidth+'px</label></div><div class="row-fluid" style="height:16px"><div class="sliderGroove"><div id="blurRadius"></div></div></div></div><div class="row-fluid" style="border-top:1px solid #444;margin-top:10px"><div class="row-fluid"><label class="left">Brush Type:</label><label id="brushType" class="right">'+brush+'</label></div><div class="row-fluid  brushType"><div class="brushThumb" id="round"><img src="static/img/roundhard.png"/></div><div class="brushThumb" id="square"><img src="static/img/block.png"/></div><div class="brushThumb" id="spray"><img src="static/img/spray.png"/></div></div></div>');
        $("#brushHeading").html(action+' Details - '+brush);

        self.brushOperations();

      }else{
        $(".brushDetails").empty().css('display','none');
      }
    });

  };

  sketch.prototype.updatePointer = function() {
    var crvRef = $("#temp_canvas");
    crvRef.css({
        "cursor":"url("+cursorUrl+")"+(brushWidth/2)+" "+(brushWidth/2)+", auto"
      });
  };


  sketch.prototype.minMax = function(points) {
  
    var minX = points[0].x, minY = points[0].y;
    var maxX = points[points.length - 1].x, maxY = points[points.length - 1].y;
    $.each(points,function(k,v){
      points[k].x = points[k].x;
      points[k].y = points[k].y;
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

  self.secondPanel(action);


  $("Canvas").off("mousedown").off("mouseup").off("mousemove");
  $("#temp_canvas").remove();
  $(".containerMain").append("<canvas id='temp_canvas' width="+$("#Canvas0").attr("width")+" height="+$("#Canvas0").attr("height")+" style='z-index:600;position:fixed;top:"+globalTop+"px;left:"+globalLeft+"px;height:"+$("#Canvas0").height()+"px;width:"+$("#Canvas0").width()+"px'></canvas>");

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
  self.bindEvents();
  if(cursorUrl != ''){
    self.updatePointer();
  }else{
    self.prepareMousePointer();
  }
}
