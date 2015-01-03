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
/*

*/
  self.secondPanel(action);


  $("Canvas").off("mousedown").off("mouseup").off("mousemove");
  $("#temp_canvas").remove();
  $(".containerMain").append("<canvas id='temp_canvas' width="+$("#Canvas0").attr("width")+" height="+$("#Canvas0").attr("height")+" style='z-index:600;position:fixed;top:"+globalTop+"px;left:"+globalLeft+"px;height:"+$("#Canvas0").height()+"px;width:"+$("#Canvas0").width()+"px'></canvas>");

  cvRef = $("#temp_canvas");

  cnv = document.getElementById('Canvas'+currentIndex);  
  corL= $("#Canvas"+currentIndex).offset().left;
  corT= $("#Canvas"+currentIndex).offset().top;
  if(action=='eraser')
    state = "Erase";
  else if(action == 'brush')
    state = 'Brush';

  ctx = cnv.getContext('2d');
  self.bindEvents();
  if(cursorUrl != ''){
    self.updatePointer();
  }else{
    self.prepareMousePointer();
  }
}
