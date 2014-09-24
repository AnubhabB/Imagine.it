function SaturateHue(action,type,hueConstant,saturationConstant){
	cleanCanv();
	if($("#previewCanvas").length !== 0){
		if(type == 'preview'){
			if(action == 'saturation'){
				//alert(saturationConstant);
				//console.log("Saturation constant "+saturationConstant);
				var saturateFactor = saturationConstant;
				var canvas = document.getElementById('previewCanvas');
			    context = canvas.getContext('2d');
			    
			    var image = new Image();
			    image.onload = function()
			    {
			        var imageX = canvas.width/2 - image.width/2;
			        var imageY = canvas.height/2 - image.height/2;
			        
			        context.drawImage(image, imageX, imageY);
			        
			        var imageData = context.getImageData(imageX, imageY, image.width, image.height);
			        var dA = imageData.data; // raw pixel data in array
			        
			        var sv = parseInt(saturateFactor); // saturation value 
			        
			        var luR = 0.3086; // luminance constant
			        var luG = 0.6094;
			        var luB = 0.0820;
			        
			        var az = (1 - sv)*luR + sv;
			        var bz = (1 - sv)*luG;
			        var cz = (1 - sv)*luB;
			        var dz = (1 - sv)*luR;
			        var ez = (1 - sv)*luG + sv;
			        var fz = (1 - sv)*luB;
			        var gz = (1 - sv)*luR;
			        var hz = (1 - sv)*luG;
			        var iz = (1 - sv)*luB + sv;
			        
			        for(var i = 0; i < dA.length; i += 4)
			        {
			            
			            var red = dA[i]; // Extract original red color [0 to 255]. Similarly for green and blue below
			            var green = dA[i + 1];
			            var blue = dA[i + 2];
			            
			            var saturatedRed = (az*red + bz*green + cz*blue);
			            var saturatedGreen = (dz*red + ez*green + fz*blue);
			            var saturateddBlue = (gz*red + hz*green + iz*blue);
			            
			            dA[i] = saturatedRed;
			            dA[i + 1] = saturatedGreen;
			            dA[i + 2] = saturateddBlue;
			        }
			        
			        context.putImageData(imageData, imageX, imageY);
			    }
			    image.src = canvas.toDataURL();
			}else if(action == 'hue'){
				//alert("to do hue");
			}else{
				//alert("invalid case");
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
			var data = {
				'action'          : 'hue_saturation',
				'saturationFactor': saturationConstant,
				'hueFactor'       : 0,
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
		}else{
			//alert("invalid case");
		}
	}
}