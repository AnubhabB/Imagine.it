function BrightnessContrast(action,type,factor,factorB){
	setTimeout(function(){
		if($("#previewCanvas").length !== 0){
				if(type == 'preview'){
					if(action == 'contrast'){
						var contrast = factor;
						var w        = $("#previewCanvas").width();
						var h        = $("#previewCanvas").height();
						var canvas   = document.getElementById('previewCanvas');
						var ctxt     = canvas.getContext('2d');
						var imgData  = ctxt.getImageData(0,0,w,h);
						var data     = imgData.data;
					    var fact     = (259 * (contrast + 255)) / (255 * (259 - contrast));
					    for(var i=0;i<data.length;i+=4)
					    {
					        data[i] = fact * (data[i] - 128) + 128;
					        data[i+1] = fact * (data[i+1] - 128) + 128;
					        data[i+2] = fact * (data[i+2] - 128) + 128;
					    }
					    ctxt.putImageData(imgData,0,0);
					}
					if(action == 'brightness'){
						var contrast = factorB;
						var w        = $("#previewCanvas").width();
						var h        = $("#previewCanvas").height();
						var canvas   = document.getElementById('previewCanvas');
						var ctxt     = canvas.getContext('2d');
						var imgData  = ctxt.getImageData(0,0,w,h);
						var data     = imgData.data;
						//console.log(contrast);
						if(contrast>0){
					    	for(var i=0;i<data.length;i+=3){
						        data[i] = data[i]*contrast/2;
								data[i+1] = data[i+1]*contrast/2;
								data[i+2] = data[i+2]*contrast/2;
						    }
					    }else{
					    	for(var i=0;i<data.length;i+=3){
						        data[i] = data[i]/contrast/2;
								data[i+1] = data[i+1]/contrast/2;
								data[i+2] = data[i+2]/contrast/2;
						    }
					    }
					    ctxt.putImageData(imgData,0,0);
					}
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
					//alert(factorB);
					var data = {
						'action'          : 'brightness_contrast',
						'brightnessFactor': factorB,
						'contrastFactor'  : factor,
						'imgData'         : imgB64D
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
				}
			}
	},500);
	
}