

function transform(){

	var transformType;
	var self = this;
	transform.prototype.composeTransform = function() {
		$("#transformPanel").html("<div class='toolsSecondary' id='resize'><img src='static/img/transform.png' title='Resize'/></div><div class='toolsSecondary' id='perspective'><img src='static/img/transform.png' title='Perspective'/></div>");
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

	transform.prototype.drawGridlines = function(cnv) {
		var cntxt = document.getElementById("t_canvas").getContext('2d');
		cntxt.lineWidth = 2;
		cntxt.strokeStyle = "#222";
		cntxt.moveTo(cnv.width()/3,0);
		cntxt.lineTo(cnv.width()/3,cnv.height());
		cntxt.moveTo(2*cnv.width()/3,0);
		cntxt.lineTo(2*cnv.width()/3,cnv.height());
		cntxt.moveTo(0,cnv.height()/3);
		cntxt.lineTo(cnv.width(),cnv.height()/3);
		cntxt.moveTo(0,2*cnv.height()/3);
		cntxt.lineTo(cnv.width(),2*cnv.height()/3);
		cntxt.stroke();
	};

	transform.prototype.renderTransform = function() {
		zIndX = $("#Canvas"+currentIndex).css('z-index');
		if(transformType == 'resize'){
			var cnv = $("#Canvas"+currentIndex);

			var w = cnv.css("width");
	        var h = cnv.css("height");

			$(".containerMain").append("<canvas id='t_canvas' width="+cnv.attr("width")+" height="+cnv.attr("height")+" style='z-index:700;width:"+w+"px;height:"+h+"px;position:fixed;left:"+cnv.offset().left+"px;top:"+cnv.offset().top+"px;border:2px solid #222'></canvas>");

	        cnv = $("#t_canvas");
			self.drawGridlines(cnv);
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

					/*// canvas
					var canvasOriginal = document.getElementById("Canvas"+currentIndex);
					var ctxOriginal = canvasOriginal.getContext('2d');
					var tempImage = canvasOriginal.toDataURL();

					$(".containerMain").append("<canvas id='temp_canvas' style='position:fixed;z-index:1000;display:block' width="+$("#Canvas"+currentIndex).width()+" height="+$("#Canvas"+currentIndex).height()+"></canvas>");
					$("#temp_canvas").css({
						'top':$("#Canvas"+currentIndex).offset().top+'px',
						'left':$("#Canvas"+currentIndex).offset().left+'px'
					});

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
					var points = [[3, 3], [($("#Canvas"+currentIndex).width()), 3], [($("#Canvas"+currentIndex).width()), ($("#Canvas"+currentIndex).height())], [3, ($("#Canvas"+currentIndex).height())]];
					// img
					var img = new Image();
					
					img.onload = function() {
						op = new html5jp.perspective(ctx1, img);
						op.draw(points);
						self.prepare_lines(ctx2, points);
						self.draw_canvas(ctx, ctx1, ctx2);
						//draw_canvas(ctxOriginal, ctx1, ctx2);
					};
					img.src = document.getElementById("Canvas"+currentIndex).toDataURL();
					// canvas
					var drag = null;
					canvas.addEventListener("mousedown", function(event) {
						event.preventDefault();
						var p = self.get_mouse_position(event);
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
						var p = self.get_mouse_position(event);
						points[drag][0] = p.x;
						points[drag][1] = p.y;
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						
						ctx1.clearRect(0, 0, canvas.width, canvas.height);
						op.draw(points);
						self.prepare_lines(ctx2, points);
						self.draw_canvas(ctx, ctx1, ctx2);
						
					}, false);
					canvas.addEventListener("mouseup", function(event) {
						event.preventDefault();
						if(drag == null) { return; }
						var p = self.get_mouse_position(event);
						points[drag][0] = p.x;
						points[drag][1] = p.y;
						self.prepare_lines(ctx2, points);
						self.draw_canvas(ctx, ctx1, ctx2);
						
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
					}, false);*/
			self.perspective();
		}
	};

	transform.prototype.perspective = function() {

			// canvas要素
			var canvas = document.getElementById("Canvas"+currentIndex);
			var ctx = canvas.getContext('2d');
			// 変形画像貼り付け用canvas要素
			var canvas1 = document.createElement('canvas');
			canvas1.width = canvas.width;
			canvas1.height = canvas.height;
			var ctx1 = canvas1.getContext('2d');
			// 補助線貼り付け用canvas要素
			var canvas2 = document.createElement('canvas');
			canvas2.width = canvas.width;
			canvas2.height = canvas.height;
			var ctx2 = canvas2.getContext('2d');
			//
			var op = null;
			var points = [[50, 50], [550, 100], [300, 400], [100, 400]];
			// img要素
			var img = new Image();
			img.src = document.getElementById("Canvas"+currentIndex).toDataURL();
			img.onload = function() {
				op = new html5jp.perspective(ctx1, img);
				op.draw(points);
				prepare_lines(ctx2, points);
				draw_canvas(ctx, ctx1, ctx2);
			};
			// canvas要素にマウス関連イベントのリスナーをセット
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
				var p = get_mouse_position(event);
				points[drag][0] = p.x;
				points[drag][1] = p.y;
				prepare_lines(ctx2, points, true);
				draw_canvas(ctx, ctx1, ctx2);
			}, false);
			canvas.addEventListener("mouseup", function(event) {
				event.preventDefault();
				if(drag == null) { return; }
				var p = get_mouse_position(event);
				points[drag][0] = p.x;
				points[drag][1] = p.y;
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx1.clearRect(0, 0, canvas.width, canvas.height);
		
				op.draw(points);
		
				prepare_lines(ctx2, points);
				draw_canvas(ctx, ctx1, ctx2);
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

		function prepare_lines(ctx, p, with_line) {
			ctx.save();
			//ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.clearRect(0, 0, 600, 450);
			//
			if( with_line == true ) {
				ctx.beginPath();
				ctx.moveTo(p[0][0], p[0][1]);
				for( var i=1; i<4; i++ ) {
					ctx.lineTo(p[i][0], p[i][1]);
				}
				ctx.closePath();
				ctx.strokeStyle = "red";
				ctx.stroke();
			}
			//
			ctx.fillStyle = "red";
			for( var i=0; i<4; i++ ) {
				ctx.beginPath();
				ctx.arc(p[i][0], p[i][1], 4, 0, Math.PI*2, true);
				ctx.fill();
			}
			//
			ctx.restore();
		}

		function draw_canvas(ctx, ctx1, ctx2) {
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.drawImage(ctx1.canvas, 0, 0);
			ctx.drawImage(ctx2.canvas, 0, 0);
		}

		function get_mouse_position(event) {
			var rect = event.target.getBoundingClientRect() ;
			return {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top
			};
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
