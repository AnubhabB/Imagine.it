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
      sketch.prototype.render(points,action, cnv, ctx);
    });

    cvRef.on("mouseup",function(e){
      isDrawing = false;
      points.length = 0;
      init.prototype.history("push",state);
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
  
  sketch.prototype.render = function(points,action,cnv,ctx) {
    
    var len = points.length;
    ctx.lineWidth = brushWidth;
    ctx.lineJoin = ctx.lineCap = brush;
    ctx.shadowBlur = featherWidth;
    ctx.shadowColor = foregroundColor;
    ctx.strokeStyle = foregroundColor;
    if(action == "eraser")
      ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.moveTo(points[len-2].x, points[len-2].y);
    
    ctx.lineTo(points[len-1].x, points[len-1].y);
    
    ctx.stroke();
  };

  sketch.prototype.secondPanel = function(action) {
    $("#thumbActions").html("<div class='left thumbAct'></div>");

    /*if(action == "eraser"){*/
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

  sketch.prototype.secondPanel(action);

  cnv = document.getElementById('Canvas'+currentIndex);
  cvRef = $("#temp_canvas");

  if(action == "eraser"){
    ctx = cnv.getContext('2d');
    corL= cvRef.offset().left;
    corT= cvRef.offset().top;
    sketch.prototype.bindEvents();
    if(cursorUrl != ''){
      sketch.prototype.updatePointer();
    }else{
      sketch.prototype.prepareMousePointer();
    }
    state = "Erase";
  }
}
