function BlurImage(type, blurFactor){
	if($("#previewCanvas").length !== 0){
		if(type == 'preview'){
			var width  = $("#previewCanvas").width();
			var height = $("#previewCanvas").height();
			var radius = blurFactor;
			stackBlurCanvasRGBA('previewCanvas', 0, 0, width, height, radius);
		}else if(type == 'confirm'){
			delete window.x;
			delete window.ctxt;
			delete window.canvas;
			$(".previewPanel").css("display","none");
			layers[currentIndex] = new Image();
			var canvas = document.getElementById("Canvas"+currentIndex);
			var ctxt   = canvas.getContext('2d');
			var imgB64D= canvas.toDataURL();
			ctxt.clearRect(0,0,baseWidth,baseHeight);
			var data = {
				'action'    : 'gaussian_blur',
				'blurFactor': blurFactor,
				'imgData'   : imgB64D
			};
			$.ajax({
				type: 'POST',
				contentType: 'application/json;charset=UTF-8',
				url : '/processEnhance',
				data: JSON.stringify(data,null,'\t'),
				async: false,
				success:function(response){
					layers[currentIndex].onload = function(){
							ctxt.clearRect(0,0,0,0,baseWidth,baseHeight);
							ctxt.drawImage(layers[currentIndex],0,0,baseWidth,baseHeight);
						}
					layers[currentIndex].src = "static/img/uploads/"+response.name;
					cleanCanv();
				}
			});
			cleanCanv();
		}else{
			//alert("invalid case");
		}
	}
}