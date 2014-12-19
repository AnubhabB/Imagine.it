function AutoSelect(){
	$("canvas").off("mousedown").off("mouseup").off("mousemove").off("mouseup");
	var isDragging = false, id;
	var startX = 0,startY = 0, endX = 0, endY = 0, clX = 0, clY = 0, endX = 0, endY = 0;
	
	$("canvas").on("mousedown",function(ev){
		if(toolSelected == "autoSelect"){
			id = this.id;
			var self = this;
			currentIndex = parseInt(id.replace("Canvas",""));
			$(".layerEach").removeClass("selected");
			$(".layerEach#layer"+currentIndex).addClass("selected");
			startX = ev.pageX;
			startY = ev.pageY;
			clX    = $(self).offset().left;
			clY    = $(self).offset().top;
			isDragging = true;	
		}
	});
	$("canvas").on("mousemove",function(ev){
		if(toolSelected == "autoSelect"){
			if(isDragging == true){
				endX = ev.pageX;
				endY = ev.pageY;
				var balX = endX - startX;
				var balY = endY - startY;
				$("#"+id).css({
					"left" : clX+balX +"px",
					"top" : clY+balY +"px"
				});
			}
		}
	});

	$("canvas").on("mouseup",function(ev){
		if(toolSelected == "autoSelect"){
			isDragging = false;
			imageLayers[currentIndex].top = $("#"+id).offset().top;
			imageLayers[currentIndex].left = $("#"+id).offset().left;
          	init.history("push","Nudge");
		}
	});
}