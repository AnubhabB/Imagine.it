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

function Lasso(){
		var self = this;

		$("#temp_canvas").off("mousedown").off("mouseup").off("mousemove");
		$("#temp_canvas").remove();
		var isDrawing = false;
		if(currentIndex.length > 1 || currentIndex.length == 0){
			alert("Action not permitted - "+currentIndex.length+" layer(s) selected");
		}else{
			var points = [], startX, startY, endX, endY;
			var tempW = $("#Canvas0").attr("width");
			var tempH = $("#Canvas0").attr("height");
			var tempCW= $("#Canvas0").css("width");
			var tempCH= $("#Canvas0").css("height");
			var tempL = globalLeft;
			var tempT = globalTop;

			$(".containerMain").append("<canvas id='temp_canvas' style='position:fixed;z-index:500;display:block;left:"+tempL+"px;top:"+tempT+"px;width:"+tempCW+";height:"+tempCH+";' width="+tempW+" height="+tempH+"></canvas>");
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
				self.drawSelection(tempCtx, points, 'start');
			});

			$("#temp_canvas").on("mousemove",function(ev){
				if(!isDrawing) return;

				$(".contextMenu").remove();
				points.push({ 
					x: ev.pageX - correctLeft, 
					y: ev.pageY- correctTop
				});
				self.drawSelection(tempCtx, points, 'move');
			});

			$("#temp_canvas").on("mouseup",function(ev){
				isDrawing = false;
				self.drawSelection(tempCtx, points, 'end');
				var xpos = ev.clientX - correctLeft;
				var ypos = ev.clientY;
				self.contextmenu(xpos,ypos, points);
			});

			$("#temp_canvas").on("contextmenu",function(){
				return false;
			});
		}

}

Lasso.prototype.contextmenu = function(xpos,ypos, points) {

	var self = this;

	$(".contextMenu").remove();
	$(".containerMain").append("<div class='contextMenu'><ul><li id='layerViaCopy'>Layer Via Copy</li><li id='layerViaCut'>Layer Via Cut</li><li id='fillSelection'>Fill Selection</li><li id='strokeSelection'>Stroke Selection</li><li id='clearSelection'>Clear Selection</li></ul></div>");
	$(".contextMenu").css({
		"top": ypos+"px",
		"left": xpos+"px",
		"z-index": $("#temp_canvas").css("z-index") + 100
	});

	$(".contextMenu ul li").off("click").on("click",function(){
		var id = this.id;
		id = (id.replace("layerVia","").replace("Selection","")).toLowerCase();
		self.doLasso(id, points);
	});

	init.history("push","Select-custom");
};

Lasso.prototype.drawSelection = function(tempCtx, points, act){
	
	var len = points.length;
	var ctx = tempCtx;
	
	ctx.clearRect(0,0,$("#temp_canvas").width(),$("#temp_canvas").height());
	ctx.strokeStyle = "#fff";
	ctx.lineWidth   = 1;
	ctx.setLineDash([4]);

	ctx.beginPath();
	ctx.moveTo(points[0].x/zoom.zoomfactor,points[0].y/zoom.zoomfactor);
		for(var i=1;i<len;i++){
				ctx.lineTo(points[i].x/zoom.zoomfactor, points[i].y/zoom.zoomfactor);
		}
		if(act == "end"){
			ctx.lineTo(points[0].x/zoom.zoomfactor,points[0].y/zoom.zoomfactor);
			ctx.closePath();
		}
		ctx.stroke();
}

Lasso.prototype.doLasso = function(action, points) {
	var self = this;
	$(".contextMenu").remove();
	self.lassoCopyCut(action, points);

	$("#temp_canvas").remove();
}

Lasso.prototype.lassoCopyCut = function(action, points) {
	var self = this;
	var orgX0 = imageLayers[currentIndex].left;
	var orgY0 = imageLayers[currentIndex].top;
	var orgX1 = orgX0 + parseInt($("#Canvas"+currentIndex).attr("width"));
	var orgY1 = orgY0 + parseInt($("#Canvas"+currentIndex).attr("height"));

	var minmax = tools.minMax(points);

	var minX = minmax[0]/zoom.zoomfactor;
	var minY = minmax[1]/zoom.zoomfactor;
	var maxX = minmax[2]/zoom.zoomfactor;
	var maxY = minmax[3]/zoom.zoomfactor;

	if(maxY < orgY0 || maxX < orgX0 || minX > orgX1 || minY > orgY1){
			alert("No Pixels Selected");
	}else {
			if(action == "copy" || action == "cut" || action == "clear"){
				var l = points.length;
				for(var i=1;i<=l;i++){
					points[i-1].x = points[i-1].x/zoom.zoomfactor;
					points[i-1].y = points[i-1].y/zoom.zoomfactor;
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
				var newminmax = tools.minMax(points);
				var newminX = newminmax[0];
				var newminY = newminmax[1];
				var newmaxX = newminmax[2];
				var newmaxY = newminmax[3];
				var newWidth = newmaxX - newminX;
				var newHeight= newmaxY - newminY;
				var zIndx   = $("#Canvas"+currentIndex).css("z-index"); 
				if($("#Canvas"+canvaslist).length == 0)
					$(".containerMain").append("<canvas id='Canvas"+canvaslist+"' class='canvasClass' width="+newWidth+" height="+newHeight+" style='position:fixed;top:"+(newminY*zoom.zoomfactor+globalTop)+"px;left:"+(newminX*zoom.zoomfactor+globalLeft)+"px;z-index:"+(parseInt(zIndx)+1)+";width:"+newWidth*zoom.zoomfactor+"px;height:"+newHeight*zoom.zoomfactor+"px;'></canvas>");

				var ctx = document.getElementById("Canvas"+canvaslist).getContext('2d');
				var drawX = $("#Canvas"+currentIndex).offset().left - $("#Canvas"+canvaslist).offset().left;
				var drawY = $("#Canvas"+currentIndex).offset().top - $("#Canvas"+canvaslist).offset().top;

				var cnv = document.getElementById("Canvas"+currentIndex);
				ctx.drawImage(cnv,drawX/zoom.zoomfactor,drawY/zoom.zoomfactor);

				var correctX = ($("#Canvas"+canvaslist).offset().left - globalLeft)/zoom.zoomfactor;
				var correctY = ($("#Canvas"+canvaslist).offset().top - globalTop)/zoom.zoomfactor;
				self.doCanvasAction(ctx,points,correctX,correctY,"destination-in",function(){
					
					imageLayers[canvaslist] = {};
					imageLayers[canvaslist].imageObj = new Image();
					imageLayers[canvaslist].name = imageLayers[currentIndex].name+" Copy";
					imageLayers[canvaslist].imageObj.src = cnv.toDataURL();
					imageLayers[canvaslist].identity = "Canvas"+canvaslist;
					imageLayers[canvaslist].left = ($("#Canvas"+canvaslist).offset().left - globalLeft)/zoom.zoomfactor;
					imageLayers[canvaslist].top = ($("#Canvas"+canvaslist).offset().top - globalTop)/zoom.zoomfactor;
					
					canvaslist++;

					if(action == "cut" || action == "clear"){

						var ctx = document.getElementById("Canvas"+currentIndex).getContext("2d");
						var correctX = ($("#Canvas"+currentIndex).offset().left - globalLeft)/zoom.zoomfactor;
						var correctY = ($("#Canvas"+currentIndex).offset().top - globalTop)/zoom.zoomfactor;
						self.doCanvasAction(ctx,points,correctX,correctY,"destination-out",function(){});

						if(action == "clear"){
							canvaslist--;
							$("#Canvas"+canvaslist).remove();
							delete imageLayers[canvaslist];              
						}
					}

					fileOps.prototype.composeLayers();
				});
			}else if(action == 'fill' || action == 'stroke'){

				var img = new Image();
				var newLeft = orgX0;
				if(minX < orgX0){
					newLeft = minX;
				}
				var newEndLeft = orgX1 ;
				if(maxX > orgX1){
					newEndLeft = maxX ;
				}
				var newTop = orgY0;
				if(minY < orgY0){
					newTop = minY;
				}
				var newEndTop = orgY1 ;
				if(maxY > orgY1){
					var newEndTop = maxY ;
				}

				var newminX = newLeft;
				var newminY = newTop;
				var newWidth = newEndLeft - newminX;
				var newHeight = newEndTop - newminY;
				
				var corImLeft = 0;
				if(minX < orgX0)
					corImLeft = orgX0 - minX;
				
				var corImTop  = 0;
				if(minY < orgY0)
					corImTop  = orgY0 - minY;
				
				var cnvt = document.getElementById("Canvas"+currentIndex);
 
				$(".containerMain").append("<canvas id='temp2_canvas' class='canvasClass' width="+newWidth+" height="+newHeight+" style='position:fixed;top:"+(newminY*zoom.zoomfactor+globalTop)+"px;left:"+(newminX*zoom.zoomfactor+globalLeft)+"px;z-index:1000;width:"+newWidth*zoom.zoomfactor+"px;height:"+newHeight*zoom.zoomfactor+"px;'></canvas>");

				var cntx = document.getElementById("temp2_canvas").getContext('2d');
				cntx.drawImage(cnvt,corImLeft,corImTop);

				var l = points.length;
				for(var i=1;i<=l;i++){
					points[i-1].x = points[i-1].x/zoom.zoomfactor;
					points[i-1].y = points[i-1].y/zoom.zoomfactor;
				}
				var correctX = ($("#temp2_canvas").offset().left - globalLeft)/zoom.zoomfactor;
				var correctY = ($("#temp2_canvas").offset().top - globalTop)/zoom.zoomfactor;
			
				alert("Updae imageLayers[currentIndex]");
				self.doCanvasAction(cntx,points,correctX,correctY,"source-over",function(){
					var zIndx = $("#Canvas"+currentIndex).css("z-index");
					$("#Canvas"+currentIndex).attr("id","interM");
					$("#temp2_canvas").attr("id","Canvas"+currentIndex).css("z-index",zIndx);
					$("#interM").remove();
				},action);
			}
		}
		init.history("push",action);
};

Lasso.prototype.doCanvasAction = function(ctx,points,correctLeft,correctTop,composite,callback, action) {
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

