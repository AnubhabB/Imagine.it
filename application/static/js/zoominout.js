function zoomInOut(){
	if(toolSelected == 'zoom'){
		var widthOld   = $("#Canvas0").width();
		var heightOld  = $("#Canvas0").height();
		$("canvas").click(function(){
			if(shiftKey){
				var widthNew  = Math.round(widthOld - (widthOld*0.1));
				var heightNew = Math.round(heightOld/widthOld * widthNew);
				/*alert(widthNew+" "+heightNew);*/
				$(".layerEach").each(function(){
					/*console.log(this.id)*/
					var id = (this.id).replace("layer","");
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
				$(".layerEach").each(function(){
					/*console.log(this.id)*/
					var id = (this.id).replace("layer","");
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
	}
}