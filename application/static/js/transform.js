function transform(){
	zIndX = $("#Canvas"+currentIndex).css('z-index');
	if(transformType == 'resize'){
		actionComplete = false;
		var canvas = document.getElementById("Canvas"+currentIndex);
		var ctx    = canvas.getContext('2d');
		var w = canvas.width,
		h = canvas.height,
		pix = {x:[], y:[]},
		imageData = ctx.getImageData(0,0,canvas.width,canvas.height),
		x, y, index, isDragging = false;

		for (y = 0; y < h; y++) {
		    for (x = 0; x < w; x++) {
		        index = (y * w + x) * 4;
		        if (imageData.data[index+3] > 0) {

		            pix.x.push(x);
		            pix.y.push(y);

		        }   
		    }
		}
		pix.x.sort(function(a,b){return a-b});
		pix.y.sort(function(a,b){return a-b});
		var n = pix.x.length-1;

		w = pix.x[n] - pix.x[0];
		h = pix.y[n] - pix.y[0];
		var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

		canvas.width = w;
		canvas.height = h;
		//ctx.putImageData(cut, 0, 0);
		//var image = canvas.toDataURL();

		var canvW = $("#Canvas0").width();
		var canvH = $("#Canvas0").height();
		var correctLeft = $("#Canvas0").offset().left;
		var correctTop  = $("#Canvas0").offset().top;


		$(".containerMain").append("<canvas id='temp_canvas' style='position:fixed;z-index:1000;display:block' width="+w+" height="+h+"></canvas>");
		$("#temp_canvas").css('top',globalTop+'px').css('left',globalLeft.left+'px');
		var cnvTmp = document.getElementById("temp_canvas");
		var ctxTmp = cnvTmp.getContext("2d");
		ctxTmp.putImageData(cut, 0, 0);
		
		//$("#Canvas"+currentIndex).remove();
		//compileResize($("#temp_canvas").width(),$("#tempImage").height(),zInd);
		$("#temp_canvas").css("border","1px dashed wheat");
		$("#temp_canvas").resizable({
			start: function(event,ui){
				$("#Canvas"+currentIndex).remove();
			},
			stop: function(event, ui) {
                    var w = $("#temp_canvas").width();
                    var h = $("#temp_canvas").height();
                    compileResize(w,h);
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
//

}

function compileResize(w,h){
	//var zindx = zInd;
	//alert(parseInt(zindx));
	$("#savePerspective").remove();
	if(transformType == "perspective"){
		$("#Canvas"+currentIndex).remove();
	}
	var cnvTmp = document.getElementById("temp_canvas");
	var ctxTmp = cnvTmp.getContext('2d');
	var dataImage = cnvTmp.toDataURL();
	$(".containerMain").append("<canvas id='Canvas"+currentIndex+"' style='position:fixed;display:block;' width="+baseWidth+" height="+baseHeight+"></canvas>");
	$("#Canvas"+currentIndex).css("top",globalTop+"px").css("left",globalLeft+"px");
	$("#Canvas"+currentIndex).css("z-index",zIndX);
	var cnv = document.getElementById('Canvas'+currentIndex);
	var ctx = cnv.getContext('2d');
	var tempImage = new Image();
	ctx.clearRect(0,0,baseWidth, baseHeight);
	tempImage.onload = function(){
		if(transformType == "perspective"){
			ctx.drawImage(tempImage,0,0);
		}else{
			ctx.drawImage(tempImage,0,0,w,h);
		}
	}
	tempImage.src = dataImage;
	try{
		$("#temp_canvas").resizable('destroy');
	}catch(error){
		console.log(error);
	}finally{

	}
	toolSelected = '';
	$(".tools").removeClass("active");
	$("#temp_canvas").remove();
	actionComplete = true;
	cleanCanv();
	setTimeout(function(){
		var indX = currentIndex;
		var currentCanvas = "Canvas"+indX;
		var zInd= $("#Canvas"+indX).css('z-index');	
		var cnv = document.getElementById(currentCanvas);
		var tempSrc= cnv.toDataURL();
		var height = baseHeight;
		var width  = baseWidth;
		layers[indX] = new Image();
		layers[indX].onload = function(){
			$("#Canvas"+indX).remove();
			$(".containerMain").append("<canvas id='Canvas"+indX+"' height='"+height+"' width='"+width+"' style='background:url(static/img/bg.jpg);z-index:'></canvas>").css("display","block");
			var mainC = document.getElementById("Canvas"+indX);
			var cntx = mainC.getContext("2d");
			$("#Canvas"+indX).css("position","absolute").css('margin-left',($(window).innerWidth() - width)/3 +"px").css("margin-top",($(window).innerHeight() - height)/3 +"px").css("display","block").css('z-index',zInd);
			if(indX>0){
				$("#Canvas"+indX).css("background","none");
			}
			cntx.drawImage(layers[indX],0,0,width,height);
		}
		layers[indX].src = tempSrc;
		$(".actionButton").remove();
	},100);
}
/*
function savePerspective(){
	var canvas = document.getElementById("temp_canvas");
	var contxt = canvas.getContext('2d');
	var imageTemp = canvas.toDataURL();

	var zInd = $("#Canvas"+currentIndex).css("z-index");
	$("#Canvas"+currentIndex).remove();
	$(".containerMain").append("<canvas id='Canvas"+currentIndex+"' style='z-index:"+zInd+";position:fixed' width="+baseWidth+" height="+baseHeight+"></canvas>");

}*/