
/*****************************************
DRAW PREVIEW
****************************************/
function drawPreview(action){

	//cleanCanv();
	toolSelected = "";
	var canvPreview = document.getElementById("previewOutput");
	var ctxPreview  = canvPreview.getContext('2d');
	var hFact    = $("#Canvas0").attr("height");
	var wFact    = $("#Canvas0").attr("width");
	var lFact    = $("#Canvas0").offset().left;
	var tFact    = $("#Canvas0").offset().top;
	$("#previewOutput").attr("width",wFact).attr("height",hFact)
	$(".previewOutput").css("left","60px").css("bottom","10px");
	if(action == "preview" || action == "mergevisible"){
		for(z=canvaslist+1;z>=1;z--){
			if($("#layer"+(z-1)).length != 0){
				try{
					var id    = $(".layersBody li:nth-child("+z+")").attr("id");
					console.log("Troubled Id: "+id);
					id        = id.replace("layer","");
					if($("#Canvas"+id).css("display")=='block'){
						var canvas = document.getElementById("Canvas"+id);
						var composite = imageLayers[id].blendmode;
						var alpha     = imageLayers[id].alpha;
						var correctLeft= imageLayers[id].left - lFact;
						var correctTop =  imageLayers[id].top - tFact;

						console.log(correctLeft,correctTop);
						ctxPreview.globalCompositeOperation = composite;
						ctxPreview.globalAlpha = alpha;
						ctxPreview.drawImage(canvas,correctLeft,correctTop);
						
						ctxPreview.globalCompositeOperation = 'source-over';
						ctxPreview.globalAlpha = 1;
						if(action == "mergevisible"){
							if(z!==0){
								$("#layer"+z).remove();
								$("#Canvas"+z).remove();
							}
						}
					}		
				}catch(error){
					console.log(error);
				}
			}
		}
		var currentUrl = canvPreview.toDataURL();
		if(action == "mergevisible"){
			var cnvs = document.getElementById("Canvas0");
			var ctxt = cnvs.getContext('2d');
			var img  = new Image();
			img.onload = function(){
				ctxt.drawImage(img,0,0,$("#Canvas0").attr("width"),$("#Canvas0").attr("height"));	
			}
			img.src = currentUrl;
			
		}
	}else if(action == "mergeselected"){
		if($(".selected").length > 1){
			//alert("Merge selected");

			var selectedLayers = new Array();
			$(".selected").each(function(){
				var id = (this.id).replace("layer","");
				$("#layer"+id).remove();
				selectedLayers.push(id);
			});
			$(".containerMain").append("<canvas id='temp_canvas' width="+$("#Canvas0").attr("width")+" height="+$("#Canvas0").attr("height")+" style='position:absolute;width:"+$("#Canvas0").width()+"px;height:"+$("#Canvas0").height()+"px;margin-top:"+($(window).innerHeight() - $("#Canvas0").height())/3+"px;margin-left:"+($(window).innerWidth() - $("#Canvas0").width())/3 +"px;z-index:"+$("#Canvas"+selectedLayers[0]).css("z-index")+"'></canvas>");
			var cnvTmp = document.getElementById("temp_canvas");
			var ctxTmp = cnvTmp.getContext('2d');
			for(var i = selectedLayers.length-1;i >= 0; i--){
				console.log("now at "+selectedLayers[i]);
				var id = selectedLayers[i];
				if($("#Canvas"+id).css("display")!='none'){
					console.log(id);
					var canvas = document.getElementById("Canvas"+id);
					var composite = compositeOps[id];
					var alpha     = globalAlphaVal[id];
					if(composite == undefined)
						composite = 'normal';
					if(globalAlphaVal == undefined)
						alpha =1
					ctxTmp.globalCompositeOperation = composite;
					ctxTmp.globalAlpha = alpha;
					ctxTmp.drawImage(canvas,0,0,wFact,hFact);
					composite = 'normal';
					alpha =1;
					ctxTmp.globalCompositeOperation = 'source-atop';
					ctxTmp.globalAlpha = 1;
					$("#Canvas"+id).remove();
				}
			}
			$("#temp_canvas").attr("id","Canvas"+selectedLayers[selectedLayers.length-1]);
			composeLayers();
			canvaslist = canvaslist - selectedLayers.length +1;
		}else{
			alert("Operation Not Permitted, please select more than one layer");
		}
	}
}

function closePreviewBlock(){
	$(".previewOutput").hide();
	$(".tools").removeClass("active");
}