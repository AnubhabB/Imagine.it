function Zoom(){
	
}

Zoom.prototype.zoomfactor = {};

Zoom.prototype.creteZoomSlider = function() {
	var self = this;
	var change = false, startEvt = 0;

	$(".panel3").append("<div class='sliderVeritcal' id='sliderVeritcal'><h5 style='margin-bottom:2px;'>300%</h5><div style='height:180px;display:block;margin:0'><div class='chanelVertical'><div id='verticalHandle' title='"+self.zoomfactor * 100+"%'></div></div></div><h5 style='margin-top:2px'>1%</h5></div>");
	var setHeight = $("#zoom").offset().top + 12 - 100;
	var setWidth  = $(".panel3").outerWidth() +3;
	$("#sliderVeritcal").css({
		top: setHeight+"px",
		left: setWidth+"px"
	});

	//convert percentage zoom to scale
	var scale = 60;
	$("#verticalHandle").css({
		"margin-top": 180 - scale*self.zoomfactor +"px"
	});

	$("#verticalHandle").on("mousedown",function(evt){
		change = true;
		startEvt = evt.clientY;
		//console.log(startEvt,$("#verticalHandle").css("margin-top"));
	});
	$("#verticalHandle").on("mouseup",function(evt){
		change = false;
	});
	$("#sliderVeritcal").on("mouseup",function(evt){
		change = false;
	});
	$("#verticalHandle").on("mousemove",function(evt){
		console.log(change);
		if(!change) return;

		if(evt.clientY != startEvt){
			var del  = evt.clientY-startEvt;
			//console.log(startEvt,evt.clientY,del);
			var mTop = parseInt(($("#verticalHandle").css("margin-top")).replace("px",""))+del;
			//console.log(del,mTop);
			//var x += del;
			//console.log(x);
			$("#verticalHandle").animate({
				marginTop: mTop,
			},100)
			//css("margin-top",mTop+"px");
		}

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
		self.cleanThis();
	}
};	