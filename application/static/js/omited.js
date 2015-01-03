/*************OMMITTED CODE************/

/**********************
*
*
sketch.js
*
*
********************/

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

    /*}else if(action == "brush"){
    cnv = document.getElementById("temp_canvas");
    corL= $("#temp_canvas").offset().left;
    corT= $("#temp_canvas").offset().top;
    state= "Brush"
  }*/

  sketch.prototype.newLayerRedraw = function(newX0,newY0,newX1,newY1) {

    var self = this;
    
    var calcL = newX0 + globalLeft;
    var calcT = newY0 + globalTop;
    var calcW = newX1 - newX0;
    var calcH = newY1 - newY0;


    $(".containerMain").append("<canvas id='t_cnv' style='position:fixed;z-index:1000;left:"+calcL+"px;top:"+calcT+"px;width:"+calcW+"px;height:"+calcH+"px;' width="+calcW+" height="+calcH+"></canvas>");

    var cv = document.getElementById("Canvas"+currentIndex);
    var z  = $("#Canvas"+currentIndex).css("z-index");
    var ctx = document.getElementById("t_cnv").getContext("2d");

    var t_left = imageLayers[currentIndex].left + globalLeft -  parseInt($("#t_cnv").offset().left);
    var t_top  = imageLayers[currentIndex].top + globalTop -  parseInt($("#t_cnv").offset().top);

    ctx.drawImage(cv,t_left,t_top);

    t_left= parseInt($("#temp_canvas").offset().left) - parseInt($("#t_cnv").offset().left);
    t_top = parseInt($("#temp_canvas").offset().top) -  parseInt($("#t_cnv").offset().top);
    cv = document.getElementById("temp_canvas");
    ctx.drawImage(cv,t_left,t_top);

    $("#Canvas"+currentIndex).remove();
    $("#temp_canvas").remove();

    $("#t_cnv").css("z-index",z).addClass("canvasClass").attr("id","Canvas"+currentIndex);
    $("#Canvas"+currentIndex).css({
      "left"  : calcL * zoom.zoomfactor +"px",
      "top"   : calcT * zoom.zoomfactor +"px",
      "width" : calcW * zoom.zoomfactor +"px",
      "height": calcH * zoom.zoomfactor +"px"
    });
    imageLayers[currentIndex].width  = calcW;
    imageLayers[currentIndex].height = calcH;
  };

  sketch.prototype.createNewLayer = function() {

    var self = this;
    var minMax = this.minMax(points);
    //console.log(minMax);

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
