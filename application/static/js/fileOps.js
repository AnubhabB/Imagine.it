function fileOps(action){
	$(".navList").css("display","none");
	if(action == "new"){

	}else  if(action == "open"){
		$("#imageFile").click();
	}
}

fileOps.prototype.openFile = function() {
	var self = this;
	// body...
	var imagefile = $("#imageFile")[0].files[0];
	formdata = false;
	if(window.FormData){
		formdata = new FormData();
	}
	//LOADER
	formdata.append("file[]",imagefile);
	$.ajax({
		type: 'POST',
		url : '/sync',
		data: formdata,
		processData: false,
		contentType: false,
		success:function(response){
				createcanvas = true;
				session      = response.session;
				imageLayers[canvaslist] = {};
				imageLayers[canvaslist].imageObj = new Image();
				imageLayers[canvaslist].imageObj.onload = function(){
					if(createcanvas)
						self.drawCanvas(canvaslist,this.width,this.height);
					createcanvas = false;
				}
				imageLayers[canvaslist].name = response.name;

				imageLayers[canvaslist].imageObj.src = "static/uploads/"+response.name;
				imageLayers[canvaslist].identity = "Canvas"+canvaslist;

		}
	});
};

/********
*
*
This function actually draw the canvas
Author: Anubhab
*
*
*******/
fileOps.prototype.drawCanvas = function(index,width,height) {
		var self = this;
		var left,top;
		left = top = 0;
		
		var widthN = width;
		var heightN= height;
		
		var diffW = $(window).innerWidth() - widthN;
		var diffH = $(window).innerHeight() - heightN;

		if(widthN > heightN){
			console.log("Landscape");
			if( diffW <= 30 ){
				console.log("for larger than screen image");

			}else{
				left = diffW/3;
				top =  diffH/2;
			}
		}

		self.layerInfoUpdate(index,width,height,1,top,left,"source-over",'');

		$(".containerMain").append("<canvas id='Canvas"+index+"' height='"+heightN+"' width='"+widthN+"' style='background:url(static/img/bg.jpg);z-index:"+(200+canvaslist)+"'></canvas>").css("display","block");
		var mainC = document.getElementById("Canvas"+index);
		var ctx = mainC.getContext("2d");
		$("#Canvas"+canvaslist).css({
			"position":"fixed",
			"left"    :left+"px",
			"top"     : top+"px",
			"display":"block"
		});

		if(index > 0){
			$("#Canvas"+index).css("background","none");
		}
		
		ctx.drawImage(imageLayers[index].imageObj,0,0);
		init.prototype.history("push","Open");
		canvaslist++;
		self.composeLayers();
}
/**************************END DRAW CANVAS************************/
/*****************************************************************/

/********
*
*
This function composing layers
Author: Anubhab
Composing layers, get layers array, go by index name and Canvas<index> as layer id and create layers
*
*
*******/
fileOps.prototype.composeLayers = function(){
	var x = canvaslist;
	var self = this;
	
	$("#LayersBody").html("");
	for(var i=0;i<x;i++){
		if($("#Canvas"+i).length !== 0){
				var src = document.getElementById("Canvas"+i);
				src     = src.toDataURL();
				$("#LayersBody").prepend("<li class='row-fluid layerEach' id='layer"+i+"'><div class='visible left' id='showHide"+i+"'></div><div class='thumbnail left' id='thumbnail"+i+"'><img/></div><div class='title left' id='title"+i+"'>Layer"+i+"</div></li>");
				$("#thumbnail"+i+" img").attr('src',src);
				//console.log("this is i: "+i);
				if(i==0){
					$("#title0").html("Background(Locked)");
				}
		}
	}
	$("#layer"+(canvaslist-1)).addClass('selected');
	currentIndex = canvaslist-1;
	$(".layerEach").click(function(){
		self.layerClick(this.id);
	});
	//LAYER REORDER
	$('#LayersBody').sortable({
	    items: ':not(#layer0)'
	}).bind('sortupdate',function(e, ui){
		self.redoCanvasOrder();
	});

	$(".layersBody .visible").click(function(){
		var indexId = parseInt((this.id).replace('showHide',""));
		if($("#Canvas"+indexId).css("display")=='block'){
			$("#Canvas"+indexId).css("display","none");
			$("#showHide"+indexId).css({
				"background"       :"url(static/img/hide.png)",
				"background-size"  :"24px 24px",
				"background-repeat":"no-repeat"
			});
		}else{
			$("#Canvas"+indexId).css("display","block");
			$("#showHide"+indexId).css({
				"background"       :"url(static/img/eye.png)",
				"background-size"  :"24px 24px",
				"background-repeat":"no-repeat"
			});
		}
	});

	//$("#LayersBody").scrollTop($("#LayersBody").prop('scrollHeight'));
}

/***********END COMPOSE LAYERS***********/
/****************************************/

fileOps.prototype.layerClick = function(id) {
	var self = this;
	if(shiftKey == false){
			multiLayerSelect = false;
			$(".layerEach").removeClass("selected");
			$("#"+id).addClass("selected");
			var oldIndex = currentIndex;
			currentIndex = parseInt((id).replace("layer",""));
			if(document.getElementById("Canvas"+oldIndex)!=null){
				document.getElementById("Canvas"+oldIndex).onmousedown = null;
				document.getElementById("Canvas"+oldIndex).onmouseup = null;
				document.getElementById("Canvas"+oldIndex).onmousemove = null;
			}
			//ACTIVATE ACTION
			var tempAction = toolSelected;
			
			init.prototype.toolsActivate(tempAction);
		}else{
			cleanCanv();
			multiLayerSelect = true;
			$("#"+id).addClass("selected");
			toolSelected = "";
			currentIndex = null;
			$(".tools").removeClass("active");
		}
};

/*********************LAYER REORDER**************
*************************************************/

fileOps.prototype.redoCanvasOrder = function() {

 	var z;
	var factor = canvaslist;
	for(z=1;z<canvaslist+1;z++){
		if($("#layer"+z).length != 0){
			var id = $(".layersBody li:nth-child("+z+")").attr("id");
			id     = id.replace("layer","");
			zInd   = (200+(factor*10));
			var cnv= "Canvas"+id;
			$("#"+cnv).css("z-index",zInd);
			imageLayers[id].order = factor;
		}
		factor--;
	}
	init.history("push","Reorder");
 };
/*****************END LAYER REORDER**************
*************************************************/
fileOps.prototype.DeleteLayers = function(first_argument) {

	var self = this;
	$("#Canvas"+currentIndex).remove();
	$("#layer"+currentIndex).remove();
	delete(imageLayers[currentIndex]);
	
	init.prototype.history("push","Delete");
	self.composeLayers();
	//console.log(imageLayers);
};

fileOps.prototype.layerInfoUpdate = function(index,width,height,alpha,top,left,composite,src){
	if(width !== '')
		imageLayers[index]['width'] = width;
	if(height !== '')
		imageLayers[index]['height'] = height;
	if(left !== '')
		imageLayers[index]['left'] = left;
	if(top !== '')
		imageLayers[index]['top'] = top;
	if(composite !== '')
		imageLayers[index]['blendmode'] = composite;
	if(canvaslist !== '')
		imageLayers[index]['order'] = canvaslist;
	if(alpha !== '')
		imageLayers[index]['alpha'] = alpha;
	if(src !== '')
		imageLayers[index]['src'] = src;
}