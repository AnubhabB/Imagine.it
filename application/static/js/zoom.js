function Zoom(){
	
}

Zoom.prototype.zoomfactor = {};

Zoom.prototype.Draw = function() {
	var self = this;
	console.log("To do zoom all: "+self.zoomfactor);
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
		var self = this;
		self.zoomfactor = $("#verticalSlider").slider("value")/100;
		$("#percentView").html($("#verticalSlider").slider("value")+"%");
		$("#currentZoom").html($("#verticalSlider").slider("value")+"%");

		self.Draw();
	};

	$("#verticalSlider").slider({
		orientation: "vertical",
		animate: true,
		value: self.zoomfactor * 100,
		max:300,
		min:1,
		change: self.setZoom,
		slide:self.setZoom	
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