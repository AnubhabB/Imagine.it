function Zoom(){
	/*if(toolSelected == 'zoom'){
		var widthOld   = $("#Canvas0").width();
		var heightOld  = $("#Canvas0").height();
		$("canvas").click(function(){
			if(shiftKey){
				var widthNew  = Math.round(widthOld - (widthOld*0.1));
				var heightNew = Math.round(heightOld/widthOld * widthNew);
				/*alert(widthNew+" "+heightNew);*/
				//$(".layerEach").each(function(){
					/*console.log(this.id)*/
				/*	var id = (this.id).replace("layer","");
					$("#Canvas"+id).css({
						"width" : widthNew,
						"height": heightNew,
						"top"   : ($(window).innerHeight() - heightNew)/2 +"px",
						"left"  : ($(window).innerWidth() - widthNew)/2  +"px"
					});
				});
			}else{
				var widthNew  = Math.round(widthOld + (widthOld*0.1));
				var heightNew = Math.round(heightOld/widthOld * widthNew);
				/*alert(widthNew+" "+heightNew);*/
				/*$(".layerEach").each(function(){
					/*console.log(this.id)*/
				/*	var id = (this.id).replace("layer","");
					$("#Canvas"+id).css({
						"width" : widthNew,
						"height": heightNew,
						"top"   : ($(window).innerHeight() - heightNew)/2 +"px",
						"left"  : ($(window).innerWidth() - widthNew)/2  +"px"
					});
				});
			}
			$(".tools#zoom").click();
		});
	}else{
		alert("There is some error");
	}*/
}

Zoom.prototype.zoomfactor = {};

Zoom.prototype.resize = function() {
	var self = this;
	//Set zoom factor onnly Based on the base canvas and nothing else
	self.zoomfactor = self.calculateZoomFactor();
};

Zoom.prototype.fitOnScreen = function() {
	var self = this;

	var adjW = 0,adjH = 0;
	var actWidth = parseInt($("#Canvas0").attr("width"));
	var actHeight= parseInt($("#Canvas0").attr("height"));
	var wH = $(window).innerHeight();
	var wW = $(window).innerWidth();
	
	if(actWidth > actHeight){
		console.log("hello Zoom");
		if(actWidth > wW-300){
			adjW = wW - 500;
			self.zoomfactor = adjW/actWidth;
			adjH = actHeight*self.zoomfactor;

			$("#Canvas0").css({
				"width":adjW+"px",
				"height":adjH+"px",
				"top":(wH-adjH)/3 +"px",
				"left":(wW-adjW)/2 +"px"
				});
		}
	}else{
		console.log("Zoom says fuck you");
	}
};