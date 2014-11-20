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
  /*

  sketch.prototype.distanceBetween = function(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  }
  sketch.prototype.angleBetween = function(point1, point2) {
    return Math.atan2( point2.x - point1.x, point2.y - point1.y );
  }

  var el = document.getElementById('Canvas'+currentIndex);
  var ctx = el.getContext('2d');
  ctx.lineJoin = ctx.lineCap = 'round';
  var cObj = $("#Canvas"+currentIndex); 
  var corT = cObj.offset().top;
  var corL = cObj.offset().left;
  var isDrawing, lastPoint;
  var brW = 10, sW = 20;
  var colorStop = (foregroundColor.replace("rgba(","")).replace(")","");
  colorStop     = colorStop.split(",");

  cObj.on("mousedown",function(e) {
    isDrawing = true;
    lastPoint = { x: e.pageX - corL, y: e.pageY - corT };
  });

  cObj.on("mousemove",function(e) {
    if (!isDrawing) return;
    
    var currentPoint = { x: e.pageX - corL, y: e.pageY - corT };
    var dist = sketch.prototype.distanceBetween(lastPoint, currentPoint);
    var angle = sketch.prototype.angleBetween(lastPoint, currentPoint);
    
    for (var i = 0; i < dist; i++) {
      
      x = lastPoint.x + (Math.sin(angle) * i);
      y = lastPoint.y + (Math.cos(angle) * i);
      
      var radgrad = ctx.createRadialGradient(x,y,brW,x,y,sW);
      radgrad.addColorStop(0, foregroundColor);
      radgrad.addColorStop(0.5, 'rgba('+colorStop[0]+','+colorStop[1]+','+colorStop[2]+',0.5)');
      radgrad.addColorStop(1, 'rgba('+colorStop[0]+','+colorStop[1]+','+colorStop[2]+',0)');
      
      ctx.fillStyle = radgrad;
      ctx.fillRect(x-sW, y-sW, sW*2, sW*2);
    }
    
    lastPoint = currentPoint;
  });

  cObj.on("mouseup",function(){
    isDrawing = false;
  });*/
  var points = [], isDrawing = false, ctx, cnv, corL, corT, cvRef, oldln= 0, newln = 0;
  cnv = document.getElementById('Canvas'+currentIndex);
  cvRef = $("#Canvas"+currentIndex)
  ctx = cnv.getContext('2d');
  corL= cvRef.offset().left;
  corT= cvRef.offset().top;
  
  cvRef.on("mousedown",function(e){
    isDrawing = true;
    points.push({ x: e.pageX - corL, y: e.pageY - corT });
    //sketch.prototype.render(points,action, cnv, ctx);
  });

  cvRef.on("mousemove",function(e){
    if(!isDrawing) return;

    points.push({ x :  e.pageX - corL, y: e.pageY - corT });
    sketch.prototype.render(points,action, cnv, ctx);
  });

  cvRef.on("mouseup",function(e){
    isDrawing = false;
    points.length = 0;
    
  });



  sketch.prototype.render = function(points,action,cnv,ctx) {
    
    var len = points.length;
    ctx.lineWidth = 20;
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.shadowBlur = 10;
    ctx.shadowColor = foregroundColor;
    ctx.strokeStyle = foregroundColor;
    if(action == "eraser")
      ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.moveTo(points[len-2].x, points[len-2].y);
    //for (var i = len-1; i < points.length; i++) {
    ctx.lineTo(points[len-1].x, points[len-1].y);
    //}
    ctx.stroke();
  };
}
