function Zoom(){
	
}

Zoom.prototype.zoomfactor = {};

Zoom.prototype.creteZoomSlider = function() {
	var self = this;
	var change = false, startEvt = 0;

	//$(".panel3").append("<div class='sliderVeritcal' id='sliderVeritcal'><h5 style='margin-bottom:2px;'>300%</h5><div style='height:180px;display:block;margin:0'><div class='chanelVertical'><div id='verticalHandle' title='"+self.zoomfactor * 100+"%'></div></div></div><h5 style='margin-top:2px'>1%</h5></div>");
	$(".panel3").append("<div class='sliderVeritcal' id='sliderVeritcal'><h5 style='margin-bottom:2px;'>300%</h5><div style='height:180px;display:block;margin:0'><div class='chanelVertical' id='verticalSlider'></div></div><h5 style='margin-top:2px'>1%</h5></div>");
	var setHeight = $("#zoom").offset().top + 12 - 100;
	var setWidth  = $(".panel3").outerWidth() +3;
	$("#sliderVeritcal").css({
		top: setHeight+"px",
		left: setWidth+"px"
	});

	Zoom.prototype.setZoom = function() {
		$("#percentView").html($("#verticalSlider").slider("value")+"%");
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