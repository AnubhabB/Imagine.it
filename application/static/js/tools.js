function Tools(){
	var self = this;
}

Tools.prototype.zealousCrop = function(canvasId) {
	var ctx = document.getElementById("Canvas"+canvasId).getContext('2d');
	var imageData = ctx.getImageData(0, 0, $("#Canvas"+canvasId).attr('width'), $("#Canvas"+canvasId).attr('height'));
	var imData    = imageData.data;
	console.log(imData);
	for(var i = 0; i < imData.length; i++){
        var red = 	imData[i]; // Extract original red color [0 to 255]. Similarly for green and blue below
        var green = imData[i + 1];
        var blue = imData[i + 2];
        var alpha = imData[i + 3]

        if(alpha == 0){
        	//console.log("Fuckit "+i);
        }
        else
        	console.log("Dont fuck "+i);
    }
    
    //context.putImageData(imageData, imageX, imageY);
};

Tools.prototype.minMax = function(points) {
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

