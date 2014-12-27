function Zoom(){
	
}

Zoom.prototype.zoomfactor = {};

Zoom.prototype.drawZoom = function() {
	var self = this;
	var globLeft  = $("#Canvas0").offset().left;
	var globTop   = $("#Canvas0").offset().top;
	console.log("To do zoom all: "+self.zoomfactor);
	$(".canvasClass").each(function(){
		var cnvHeight = $(this).attr("height");
		var cnvWidth  = $(this).attr("width");

		var id = parseInt((this.id).replace("Canvas",""));

		$(this).css({
			"width" : (cnvWidth*self.zoomfactor)+"px",
			"height": (cnvHeight*self.zoomfactor)+"px",
			"left"  : globalLeft + (imageLayers[id].left*self.zoomfactor)+"px",
			"top"  : globalTop + (imageLayers[id].top*self.zoomfactor)+"px"
		});
	});
};

Zoom.prototype.creteZoomSlider = function() {
	var self = this;
	var change = false, startEvt = 0;

	$(".panel3").append("<div class='sliderVeritcal' id='sliderVeritcal'><h5 id='currentZoom' style='margin-bottom:2px;'>"+(self.zoomfactor*100)+"%</h5><div style='height:180px;display:block;margin:0'><div class='chanelVertical' id='verticalSlider'></div></div></div>");
	var setHeight = $("#zoom").offset().top + 12 - 100;
	var setWidth  = $(".panel3").outerWidth() +3;
	$("#sliderVeritcal").css({
		top: setHeight+"px",
		left: setWidth+"px"
	});

	Zoom.prototype.setZoom = function() {
		self.zoomfactor = $("#verticalSlider").slider("value")/100;
		$("#percentView").html($("#verticalSlider").slider("value")+"%");
		$("#currentZoom").html($("#verticalSlider").slider("value")+"%");

		self.drawZoom();
	};

	$("#verticalSlider").slider({
		orientation: "vertical",
		animate: true,
		value: self.zoomfactor * 100,
		max:300,
		min:1,
		change: self.setZoom,
		slide:self.setZoom,
		step:1	
	});
};

Zoom.prototype.cleanThis = function() {
	$("#verticalHandle").off("click").off("mousedown").off("mousemove").off("mouseup");
	$("#sliderVeritcal").remove();
};

Zoom.prototype.renderZoom = function() {
	var self = this;
	if($("#sliderVeritcal").length == 0)
		self.creteZoomSlider();
	else{
		console.log("clean this");
		self.cleanThis();
	}
};	