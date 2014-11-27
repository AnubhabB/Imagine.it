function Adjustments(){

	Adjustments.prototype.loadpreviewBrightnessContrast = function() {
		$(".actionArea").css("display","none");
		$("#brightnessPercent[data-slider]").simpleSlider("setValue",50);
		$("#contrastPercent[data-slider]").simpleSlider("setValue",50);
		$("#Secondary").remove();
		$("#Primary").css("display","none");
		$(".previewPanel").css("display","block").css("left",(($(window).innerWidth()-$(".previewPanel").width())/2)+"px");
		$("#previewHeading").html("Adjust Brightness and Contrast - Layer"+currentIndex);
		$("#actionAreaContrastBrightness").css("display","block");

		var currentCanvas = document.getElementById("Canvas"+currentIndex);
		var w = $(".previewArea").width();
		var calch;
		var orgR = $("#Canvas"+currentIndex).height()/$("#Canvas"+currentIndex).width();
		var h = $(".previewArea").width()*orgR;
		if($("#Canvas"+currentIndex).length !== 0){
			$(".previewArea").html("<canvas id='previewCanvas'></canvas>");
			var cnv  = document.getElementById('previewCanvas');
			var cntxt= cnv.getContext('2d');
			cntxt.drawImage(currentCanvas,0,0,w,h);
		}
		else{
			$(".previewArea").html("<h1 style='font-size:30px;font-weight:bold;color:#555'>No Images Selected</h1>");
		}
	};
	
}