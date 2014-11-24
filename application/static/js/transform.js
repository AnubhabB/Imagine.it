

function transform(){

	var transformType;
	var self = this;
	transform.prototype.composeTransform = function() {
		$("#transformPanel").html("<div class='tools' id='resize'><img src='static/img/transform.png' title='Resize'/></div><div class='tools' id='perspective'><img src='static/img/transform.png' title='Perspective'/></div>");
		$("#resize").click(function(){
			$("#transformPanel").css("display","none");
			transformType = "resize";
			self.renderTransform();
		});
		$("#perspective").click(function(){
			$("#transformPanel").css("display","none");
			transformType = "perspective";
			self.renderTransform();
		});
	};

	transform.prototype.renderTransform = function() {
		zIndX = $("#Canvas"+currentIndex).css('z-index');
		if(transformType == 'resize'){
			var cnv = $("#Canvas"+currentIndex);

			var w = cnv.css("width");
	        var h = cnv.css("height");

			$(".containerMain").append("<canvas id='t_canvas' width="+cnv.attr("width")+" height="+cnv.attr("height")+" style='z-index:700;width:"+w+"px;height:"+h+"px;position:fixed;left:"+cnv.offset().left+"px;top:"+cnv.offset().top+"px;border:1px solid #ccc'></canvas>");

	        cnv = $("#t_canvas");
			//cnv.css("border","1px dashed wheat");
			cnv.resizable({
	            alsoResize: "#Canvas"+currentIndex,
				start: function(event,ui){
					$("#doTransform").off("click").remove();
				},
				stop: function(event, ui) {
	                    var w = cnv.css("width");/*attr("width")*/;
	                    var h = cnv.css("height");/*cnv.attr("height")*/;
	                	$(".containerMain").append("<button id='doTransform' style='position:fixed;z-index:1000;top:"+event.pageY+"px;left:"+event.pageX+"px'>Apply</button>");
	                	$("#doTransform").on("click",function(){
	                		self.compileResize(w,h);
	                	});	
	            }
			});
		}else if(transformType == 'perspective'){

					// canvas
					var canvasOriginal = document.getElementById("Canvas"+currentIndex);
					var ctxOriginal = canvasOriginal.getContext('2d');
					var tempImage = canvasOriginal.toDataURL();

					$(".containerMain").append("<canvas id='temp_canvas' style='position:fixed;z-index:1000;display:block' width="+$("#Canvas0").width()+" height="+$("#Canvas0").height()+"></canvas>");
					$("#temp_canvas").css('top',$("#Canvas0").offset().top+'px').css('left',$("#Canvas0").offset().left+'px');
					var newImage= new Image();
					var canvas = document.getElementById("temp_canvas");
					var ctx    = canvas.getContext("2d");
					newImage.onload  = function(){
						
						ctx.drawImage(newImage,0,0);
					}
					newImage.src = tempImage;
					//var zInd  = $("#Canvas"+currentIndex).css("z-index");
					$("#Canvas"+currentIndex).css("display","none");
					//Canvas
					var canvas1 = document.createElement('canvas');
					canvas1.width = canvas.width;
					canvas1.height = canvas.height;
					var ctx1 = canvas1.getContext('2d');
					//Canvas
					var canvas2 = document.createElement('canvas');
					canvas2.width = canvas.width;
					canvas2.height = canvas.height;
					var ctx2 = canvas2.getContext('2d');
					//
					var op = null;
					var points = [[3, 3], [($("#Canvas0").width()-6), 3], [($("#Canvas0").width()-6), ($("#Canvas0").height()-6)], [3, ($("#Canvas0").height()-6)]];
					// img
					var img = new Image();
					img.src = layers[currentIndex].src;
					img.onload = function() {
						op = new html5jp.perspective(ctx1, img);
						op.draw(points);
						prepare_lines(ctx2, points);
						draw_canvas(ctx, ctx1, ctx2);
						//draw_canvas(ctxOriginal, ctx1, ctx2);
					};
					// canvas
					var drag = null;
					canvas.addEventListener("mousedown", function(event) {
						event.preventDefault();
						var p = get_mouse_position(event);
						for( var i=0; i<4; i++ ) {
							var x = points[i][0];
							var y = points[i][1];
							if( p.x < x + 10 && p.x > x - 10 && p.y < y + 10 && p.y > y - 10 ) {
								drag = i;
								break;
							}
						}
					}, false);
					canvas.addEventListener("mousemove", function(event) {
						event.preventDefault();
						if(drag == null) { return; }
						$("#savePerspective").remove();
						var p = get_mouse_position(event);
						points[drag][0] = p.x;
						points[drag][1] = p.y;
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						//ctxOriginal.clearRect(0, 0, canvas.width, canvas.height);
						ctx1.clearRect(0, 0, canvas.width, canvas.height);
						op.draw(points);
						prepare_lines(ctx2, points);
						draw_canvas(ctx, ctx1, ctx2);
						//draw_canvas(ctxOriginal, ctx1, ctx2);
					}, false);
					canvas.addEventListener("mouseup", function(event) {
						event.preventDefault();
						if(drag == null) { return; }
						var p = get_mouse_position(event);
						points[drag][0] = p.x;
						points[drag][1] = p.y;
						prepare_lines(ctx2, points);
						draw_canvas(ctx, ctx1, ctx2);
						//draw_canvas(ctxOriginal, ctx1, ctx2);
						$(".containerMain").append("<button onclick='compileResize(baseWidth,baseHeight,zIndX)' id='savePerspective' style='position:fixed;z-index:5001'>Save Perspective</button>");
						$("#savePerspective").css("top",event.clientY+"px").css("left",event.clientX+"px");
						drag = null;
					}, false);
					canvas.addEventListener("mouseout", function(event) {
						event.preventDefault();
						drag = null;
					}, false);
					canvas.addEventListener("mouseenter", function(event) {
						event.preventDefault();
						drag = null;
					}, false);

				function prepare_lines(ctx, p) {
					ctx.save();
					//ctxOriginal.save();
					ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
					//ctxOriginal.clearRect(0, 0, ctxOriginal.canvas.width, ctxOriginal.canvas.height);
					ctx.fillStyle = "wheat";
					//ctxOriginal.fillStyle = "rgba(0,0,0,0)";
					for( var i=0; i<4; i++ ) {
						ctx.beginPath();
						//ctxOriginal.beginPath();
						ctx.arc(p[i][0], p[i][1], 2, 0, Math.PI*2, true);
						//ctxOriginal.arc(p[i][0], p[i][1], 4, 0, Math.PI*2, true);
						ctx.fill();
					}
					//
					ctx.restore();
					//ctxOriginal.restore();
				}

				function draw_canvas(ctx, ctx1, ctx2) {
					ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
					ctx.drawImage(ctx1.canvas, 0, 0);
					//ctxOriginal.drawImage(ctx1.canvas, 0, 0);
					ctx.drawImage(ctx2.canvas, 0, 0);
					//ctxOriginal.drawImage(ctx2.canvas, 0, 0);
				}

				function get_mouse_position(event) {
					var rect = event.target.getBoundingClientRect() ;
					return {
						x: event.clientX - rect.left,
						y: event.clientY - rect.top
					};
				}
		}
	};
	
	
	transform.prototype.compileResize = function(w,h) {

		$("#doTransform").remove();
		$("#temp_canvas").remove();
		$("#t_canvas").remove();
		$("#savePerspective").remove();
		

		w = parseInt(w.replace("px",""));
		h = parseInt(h.replace("px",""));

		if(transformType == "perspective"){
			$("#Canvas"+currentIndex).remove();
		}


		var cnvTmp = document.getElementById("Canvas"+currentIndex);
		var ctxTmp = cnvTmp.getContext('2d');
		
		var imageData = cnvTmp.toDataURL();
		//$(".containerMain").append("<canvas>")
		var img = new Image();
		img.onload = function(){
			$("#Canvas"+currentIndex).attr("width",w).attr("height",h);
			ctxTmp.drawImage(img,0,0,w,h);
		}
		img.src = imageData;
		
		try{
			$("#temp_canvas").resizable('destroy');
			$("#t_canvas").resizable('destroy');
		}catch(error){
			console.log(error);
		}
		toolSelected = '';
		$(".tools").removeClass("active");
		
		actionComplete = true;
		fileOps.prototype.layerInfoUpdate(currentIndex,w,h,1,$("#Canvas"+currentIndex).offset().top,$("#Canvas"+currentIndex).offset().left,"source-over",'');
		init.prototype.history("push","Transform");
	};
}
