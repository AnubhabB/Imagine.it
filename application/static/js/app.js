var layers = new Array();
var currentIndex  = 0;
var toolSelected  = "";
var actionTaken   = false;
var foregroundColor = 'rgba(255,255,255,1)';
var brushWidth    = 10;
var featherWidth  = 10;
var brushType     = 'round';
var sprayDensity  = 50;
var transformType = 'resize';
var baseWidth, baseHeight;
var globalTop, globalLeft;
var actionComplete = true;
var zIndX = 200;
var createcanvas = true;
var canvaslist = 0;
var compositeOps  = [];
var globalAlphaVal= [];


$(function(){

/****************************************************************************
	//RANGE SLIDERS - TO DO INITIATE ON THE GO
*****************************************************************************/
	$("#brushSize[data-slider]").each(function () {
		      var input = $(this);
		      //console.log(input);
		    }).bind("slider:ready slider:changed", function (event, data) {
		      $(this).nextAll(".output:first").html(data.value.toFixed(3));
		      brushWidth = data.value.toFixed(0);
		      $("#sizeLabel").html(brushWidth+"px");
    });
	$("#blurRadius[data-slider]").each(function () {
		      var input = $(this);
		      //console.log(input);
		    }).bind("slider:ready slider:changed", function (event, data) {
		      $(this).nextAll(".output:first").html(data.value.toFixed(3));
		      featherWidth = data.value.toFixed(0);
		      $("#featherLabel").html(featherWidth+"px");
    });
	
	$("#brightnessPercent[data-slider]").each(function () {
		      var input = $(this);
		      //console.log(input);
		    }).bind("slider:ready slider:changed", function (event, data) {
		      $(this).nextAll(".output:first").html(data.value.toFixed(3));
		      if(data.value.toFixed(2)<50 || data.value.toFixed(2)>50){
		      	var brightPerc = (data.value.toFixed(0)-50.01)*2;
		      }else{
		      	var brightPerc = 0;
		      }
		      $("#brightnessLabel").html(brightPerc.toFixed(0)+"%");
		      BrightnessContrast('brightness','preview','',brightPerc);
		      $("#brightnessFactor").val(brightPerc.toFixed(0));
    });

	$("#contrastPercent[data-slider]").each(function () {
		      var input = $(this);
		    }).bind("slider:ready slider:changed", function (event, data) {
		      $(this).nextAll(".output:first").html(data.value.toFixed(3));
		      if(data.value.toFixed(2)<50 || data.value.toFixed(2)>50){
		      	var contrastPerc = (data.value.toFixed(0)-50.01)*2;
		      }else{
		      	var contrastPerc = 0;
		      }
		      $("#contrastLabel").html(contrastPerc.toFixed(0)+"%");
		      BrightnessContrast('saturate','preview',contrastPerc,'');
		      $("#contrastFactor").val(contrastPerc.toFixed(0));
    });
	
	$("#hueElement[data-slider]").each(function () {
		      var input = $(this);
		      //console.log(input);
		    }).bind("slider:ready slider:changed", function (event, data) {
		      $(this).nextAll(".output:first").html(data.value.toFixed(3));
		      if(data.value.toFixed(2)<50 || data.value.toFixed(2)>50){
		      	var perc = (data.value.toFixed(0)-50.01)*2;
		      }else{
		      	var perc = 0;
		      }
		      $("#hueLabel").html(perc.toFixed(0)+"%");
		      SaturateHue('hue','preview','',perc);
		      $("#hueFactor").val(perc.toFixed(0));
    });

	$("#saturateElement[data-slider]").each(function () {
		      var input = $(this);
		      //console.log(input);
		    }).bind("slider:ready slider:changed", function (event, data) {
		      $(this).nextAll(".output:first").html(data.value.toFixed(3));
		      var perc = data.value.toFixed(2);
		      $("#saturateLabel").html(perc);
		      SaturateHue('saturation','preview','',perc);
		      $("#saturateFactor").val(perc);
    });



	$("#blurElement[data-slider]").each(function () {
		      var input = $(this);
		      //console.log(input);
		    }).bind("slider:ready slider:changed", function (event, data) {
		      $(this).nextAll(".output:first").html(data.value.toFixed(3));
		      var perc = data.value.toFixed(0);
		      $("#blurLabel").html(perc);
		      BlurImage('preview',perc);
		      $("#blurFactor").val(perc);
    });



	$("#redSepiaValue[data-slider]").each(function () {
		      var input = $(this);
		      //console.log(input);
		    }).bind("slider:ready slider:changed", function (event, data) {
		      $(this).nextAll(".output:first").html(data.value.toFixed(3));
		      var perc = data.value.toFixed(0);
		      $("#redSepiaLabel").html(perc);
		      $("#redIcon").css("background","rgb("+perc+",0,0)");
    });


	$("#redSepiaValue[data-slider]").each(function () {
		      var input = $(this);
		      //console.log(input);
		    }).bind("slider:ready slider:changed", function (event, data) {
		      $(this).nextAll(".output:first").html(data.value.toFixed(3));
		      var perc = data.value.toFixed(0);
		      $("#redSepiaLabel").html(perc);
		      $("#redIcon").css("background","rgb("+perc+",0,0)");
		      $("#redSepiaFactor").val(perc);
		      $("#sepiaTonePalet").css("background","rgb("+$("#redSepiaFactor").val()+","+$("#greenSepiaFactor").val()+","+$("#blueSepiaFactor").val()+")");
    });

	$("#greenSepiaValue[data-slider]").each(function () {
		      var input = $(this);
		      //console.log(input);
		    }).bind("slider:ready slider:changed", function (event, data) {
		      $(this).nextAll(".output:first").html(data.value.toFixed(3));
		      var perc = data.value.toFixed(0);
		      $("#greenSepiaLabel").html(perc);
		      $("#greenIcon").css("background","rgb(0,"+perc+",0)");
		      $("#greenSepiaFactor").val(perc);
		      $("#sepiaTonePalet").css("background","rgb("+$("#redSepiaFactor").val()+","+$("#greenSepiaFactor").val()+","+$("#blueSepiaFactor").val()+")");
    });

	$("#blueSepiaValue[data-slider]").each(function () {
		      var input = $(this);
		      //console.log(input);
		    }).bind("slider:ready slider:changed", function (event, data) {
		      $(this).nextAll(".output:first").html(data.value.toFixed(3));
		      var perc = data.value.toFixed(0);
		      $("#blueSepiaLabel").html(perc);
		      $("#blueIcon").css("background","rgb(0,0,"+perc+")");
		      $("#blueSepiaFactor").val(perc);
		      $("#sepiaTonePalet").css("background","rgb("+$("#redSepiaFactor").val()+","+$("#greenSepiaFactor").val()+","+$("#blueSepiaFactor").val()+")");
    });

	$("#blendOpacity[data-slider]").each(function () {
		      var input = $(this);
		      //console.log(input);
		    }).bind("slider:ready slider:changed", function (event, data) {
		      $(this).nextAll(".output:first").html(data.value.toFixed(3));
		      var perc = data.value.toFixed(2);
		      $("#blendOpacityLabel").html(perc+"%");
		      $("#blendOpacityFactor").val(perc);
		      setGlobalAlpha();
    });

/****************************************************************************
	END RANGE SLIDERS - TO DO INITIATE ON THE GO
*****************************************************************************/



/****************************************************************************
	DROPDOWN MENUS - TO DO INITIATE ON HOVER
*****************************************************************************/

	//GENERIC DROPDOWN 
	$(".navText").click(function(){
		if($(".navList").css("display")=='none'){
			$(".navList").css('left',$(this).offset().left+"px").css("display","block");
			switch(this.id){
				case 'file':
					$(".navList").html("<ul><li id='newFile' onclick='newFile()'>New</li><li id='openFile' onclick='$(\"#imageFile\").click()'>Open</li><li id='save' onclick='saveFinal()'>Save</li><li id='exit'>Exit</li></ul>");
				break;
				case 'edit':
					$(".navList").html("<ul><li id=''>Adjustments</li><li id=''>Image Size</li><li id='exit'>Canvas Size</li></ul>");
				break;
				case 'image':
					//alert("Image");
					$(".navList").html("<ul><li id='imageAdjustments' onclick='imageAdjustmentOptions()'>Adjustments</li><li id='openFile'>Image Size</li><li id='exit'>Canvas Size</li></ul>");
				break;
				case 'filters':
					//alert("Image");
					$(".navList").html("<ul><li id='sharpen' onclick='Sharpen()'>Sharpen</li><li id='blur' onclick='Blur()'>Blur</li><li id='sepia' onclick='getSepia()'>Sepia</li><li id='blacknwhite' onclick='blackWhite()'>Black n White</li></ul>");
				break;
			}
		}
		else
			$(".navList").css("display","none");
	});


/****************************************************************************
	END DROPDOWN MENUS
*****************************************************************************/


/*******************************************************************
	LEFT HAND SIDE TOOL WINDOW - Referred to as Panel3
*******************************************************************/

	//CLOSE PANEL 3
	$("#shrink3").click(function(){
		if($(".panel3").css("left")=='0px'){
			$(".panel3").animate({
				left:-20,
				paddingRight:'1px'
			},200,function(){
				$("#shrink3").html(" > ");
			});
		}else{
			$(".panel3").animate({
				left:0,
				paddingRight:'5px'
			},200,function(){
				$("#shrink3").html(" < ");
			});
		}	
	});
	//END CLOSE-PANEL3

	//STARTING TO DEFINE THE LEFT HAND SIDE TOOLS PANEL
	//TO DO REQUITRE.JS
	$(".tools").click(function(){
		var idref = this.id;
		if(actionComplete == true)
			toolsActivate(idref);
		else
			alert("Please complete the current action");
	});


	$('#colorPicker').ColorPicker({
		color: '#ffffff',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			$('#colorPicker span').css('backgroundColor', 'rgba('+rgb.r+','+rgb.g+','+rgb.b+',1)');
			foregroundColor = 'rgba('+rgb.r+','+rgb.g+','+rgb.b+',1)';
			//console.log(foregroundColor);
		}
	});

/*******************************************************************
	END LEFT HAND SIDE TOOL WINDOW - Referred to as Panel3
*******************************************************************/

/****************************************************
SECOND BAR ON TOP - PANEL 2 Operations
****************************************************/

	$("#confirmBrightnessContrast").click(function(){
		BrightnessContrast('','confirm',$("#contrastFactor").val(),$("#brightnessFactor").val());
	});
	$("#confirmHueSaturation").click(function(){
		SaturateHue('','confirm',$("#contrastFactor").val(),$("#saturateFactor").val());
	});
	$("#confirmBlur").click(function(){
		BlurImage('confirm',$("#blurFactor").val());
	});

	//Defining brush type
	$(".brushThumb").click(function(){
		switch(this.id){
			case 'roundsoftbrush':
				brushWidth   = 10;
				featherWidth = 10;
				brushType    = 'round';
			break;
			case 'roundhardbrush':
				brushWidth   = 10;
				featherWidth = 0;
				brushType    = 'round';
			break;
			case 'buttbrush':
				brushWidth   = 10;
				featherWidth = 0;
				brushType    = 'butt';
			break;
			case 'spraybrush':
				sprayDensity = 50;
				brushType = 'spray';
			break;
			case 'default':
				alet("operation not defined");
			break;
		}
	});

/****************************************************
PANEL 2 Operations END
****************************************************/


//HANDLE CONTEXT MENU IN ANY CASE BASED ON TOOL SELECTED
	$(window).on("contextmenu",function(e){
		var mousePosX = e.clientX;
		var mousePosY = e.clientY;
		switch(toolSelected){
			case 'eraser':
				$(".brushDetails").css('top',e.clientY+"px").css('left',e.clientX+"px").css("display","block");
			break;
			case 'draw':
				$(".brushDetails").css('top',e.clientY+"px").css('left',e.clientX+"px").css("display","block");
			break;
			default:
				console.log("Context Menu Default Case");
			break;
		}

		return false;
	});

	$(".previewLessOptions").css("left",($(window).innerWidth()-$(".previewLessOptions").width())/2+"px");
/*************************************************
	LAYER - PANEL 4
**************************************************/
	$('#LayersBody').sortable({
	    items: ':not(#layers0)'
	});

	$("#DeleteLayers").click(function(){
			$("#Canvas"+currentIndex).remove();
			$("#layer"+currentIndex).remove();
	});

	$('#LayersBody').dblclick(function(){
		$(".LayerOperations").css("display","block");
		if(globalAlphaVal[currentIndex]==undefined)
			var gval = 100;
		else
			var gval = globalAlphaVal[currentIndex]*100;
		$("#blendOpacity[data-slider]").simpleSlider("setValue",gval);

		if(compositeOps[currentIndex] == undefined)
			$("#modeSelections").val("normal");
		else
			$("#modeSelections").val(compositeOps[currentIndex]);
		LayerOperations();

	});

/***********************************************
	END PANEL 4 Onload operations
***********************************************/
	$( ".CurvesPreview" ).draggable({cancel: ".curvesPanel"});
	$(".previewOutput").draggable();
});


//END READY

/***********************************************
	Each of the click elements calls a function here which in turn calls relevant functions in in modules e.g. Sketch, erase and move will reffer to sketch.js functions
	Path: /var/www/imagine/applications/static/js/
***********************************************/
function newFile(){
	$("#infoBlock").html("<div class='row-fluid'><label for='Document'>Name:</label><input type='text' value='Untitled Document' id='Document'/></div><div class='row-fluid'><label for='Width'>Width:</label><input type='text' value='' placeholder='In Pixels' class='left' id='Width' style='width:50px;'/><span class='left'>Pixel</span></div><div class='row-fluid'><label for='Height'>Height:</label><input type='text' value='' placeholder='In Pixels' class='left' id='Height' style='width:50px'/><span class='left'>Pixel</span></div><div class='row-fluid'><label for='Resolution'>Resolution:</label><input type='text' value='72' class='left' id='Resolution' style='width:50px'/><span class='left'>Pixels/ Inch</span></div><div class='row-fluid'><label for='Background'>Background:</label><select type='text' class='left' id='Background'><option value='transparent' selected>Transparent</option><option value='#000'>Black</option><option value='#fff'>White</option><option value='#999'>Grey</option></select></div>");
	$("#okButton").attr("onclick","createNew()");
	var h = $("#popupBlock").height();
	var top = ($(window).innerHeight() - h)/2;
	//console.log(top);
	$("#popupBlock").css("opacity","0").css("display","block").css("top",top+"px").animate({
		opacity:1
	},200,function(){
		$(".navList").css("display","none");
	});

}

function createNew(){
	if($("#Document").val()==''){
		var docName = 'Untitled Document';
	}
	else{
		var docName = $("#Document").val();
	}
	if($("#Width").val()==''){
		var width = 600;
	}
	else{
		var width = $("#Width").val();
	}
	if($("#Height").val()==''){
		var height = 400;
	}
	else{
		var height = $("#Width").val();
	}
	//WILL TACKLE RESOLUTION LATER
	$(".containerMain").html("<canvas id='MainCanvas' height='"+height+"' width='"+width+"' style='border:1px solid #fff;z-index:200'></canvas>").css("display","none");
	closePopup();
	var mainC = document.getElementById("MainCanvas");
	var ctx = mainC.getContext("2d");
	$("#MainCanvas").css("position","absolute").css('margin-left',($(window).innerWidth() - width)/2 +"px").css("margin-top",($(window).innerHeight() - height)/2 +"px").css("display","block");
	$(".containerMain").css("display","block");
	$("title").html("Imagine | "+docName);

}


function closePopup(){
	$(".popupBlock").animate({
		opacity:0
	},200,function(){
		$(".popupBlock").css("display","none");
	});
}

/********END NEW LAYER OPERATIONS**********/

function closeLayerStyle(){
		$(".LayerOperations").css("display","none");
}

function LayerOperations(){
	var canvPrev = document.getElementById("layerOpsPreview");
	var ctxPrev  = canvPrev.getContext('2d');
	for(z=canvaslist+1;z>=1;z--){
		if($("#layer"+(z-1)).length != 0){
			var id    = $(".layersBody li:nth-child("+z+")").attr("id");
			id        = id.replace("layer","");
			var hFact = ($("#Canvas0").height()/$("#Canvas0").width() * $("#layerOpsPreview").width());
			if($("#Canvas"+id).css("display")=='block'){
				canvas = document.getElementById("Canvas"+id);
				/*ctxTmp = canvas.getContext('2d');*/
				var composite = compositeOps[id];
				var alpha     = globalAlphaVal[id];
				//alert(compositeOps[id]);
				if(composite == undefined)
					composite = 'normal';
				if(globalAlphaVal == undefined)
					alpha =1
				ctxPrev.globalCompositeOperation = composite;
				ctxPrev.globalAlpha = alpha;
				ctxPrev.drawImage(canvas,0,0,$("#layerOpsPreview").width(),hFact);
				composite = 'normal';
				alpha =1;
				ctxPrev.globalCompositeOperation = 'source-atop';
				ctxPrev.globalAlpha = 1;
				ctxPrev.clearRect(canvas,0,0,$("#layerOpsPreview").width(),hFact);
			}		
		}
	}
	var currentUrl = canvPrev.toDataURL();
	/*var data = currentUrl;*/
}

function setGlobalAlpha(){
	var id = currentIndex;
	globalAlphaVal[id] = $("#blendOpacityFactor").val()/100;
	LayerOperations();
}

function SetCompositeMode(){
	compositeOps[currentIndex] = $("#modeSelections").val();
	LayerOperations();
}
//Set the final preview to a preview image
function setBlendMode(){
	$(".LayerOperations").css("display","none");
	drawPreview();
}

/******************
//OPEN FILE - To Do Drag and Drop
******************/
function openFile(){
	$(".navList").css("display","none");
	var imagefile = $("#imageFile")[0].files[0];
	formdata = false;
	if(window.FormData){
		formdata = new FormData();
	}/*
	if(canvaslist == 0)
		canvaslist++*/
	formdata.append("file[]",imagefile);
	$.ajax({
		type: 'POST',
		url : '/sync',
		data: formdata,
		processData: false,
		contentType: false,
		success:function(response){
				createcanvas = true;
				layers[canvaslist] = new Image();
				layers[canvaslist].onload = function(){
					if(createcanvas)
						drawCanvas(layers[canvaslist],this.width,this.height);
					createcanvas = false;
					baseHeight = $("#Canvas0").height();
					baseWidth  = $("#Canvas0").width();
					globalLeft = $("#Canvas0").offset().left;
					globalTop = $("#Canvas0").offset().top;
					createcanvas = false;
				}
				layers[canvaslist].name= response.name;
				layers[canvaslist].src = "static/img/uploads/"+response.name;
		}
	});
	
	
}
/**************************END OPEN FILE**************************/
/*****************************************************************/

/********
*
*
This function actually draw the canvas
Author: Anubhab & Manindrateja
*
*
*******/
function drawCanvas(sourceImage,width,height){
		var left,top;
		left = top = 0;
		if(canvaslist > 0){
			//delete window.width, window.height;
			var widthN = $("#Canvas0").width();
			var heightN= $("#Canvas0").height();
		}else{
			var widthN = width;
			var heightN= height;
/*			$(".containerMain").append("<canvas id='Canvas0' height='"+heightN+"' width='"+widthN+"' style='background:url(static/img/bg.jpg);z-index:"+(200+canvaslist)+"'></canvas>").css("display","block");*/
			/*$("#Canvas0").css("position","absolute").css('margin-left',($(window).innerWidth() - widthN)/3 +"px").css("margin-top",($(window).innerHeight() - heightN)/3 +"px").css("display","block");*/
		}

		$(".containerMain").append("<canvas id='Canvas"+canvaslist+"' height='"+heightN+"' width='"+widthN+"' style='background:url(static/img/bg.jpg);z-index:"+(200+canvaslist)+"'></canvas>").css("display","block");
		var mainC = document.getElementById("Canvas"+canvaslist);
		var ctx = mainC.getContext("2d");
		$("#Canvas"+canvaslist).css("position","absolute").css('margin-left',($(window).innerWidth() - widthN)/3 +"px").css("margin-top",($(window).innerHeight() - heightN)/3 +"px").css("display","block");
		if(canvaslist==0){
			$("#Canvas"+canvaslist).css("overflow","hidden");
		}
		if(canvaslist>0){
			$("#Canvas"+canvaslist).css("background","none");
		}
		var left,top;
		ctx.drawImage(layers[canvaslist],0,0);
		layers[canvaslist].l   = left;
		layers[canvaslist].t    = top;
		layers[canvaslist].w  = widthN;
		layers[canvaslist].h = heightN;
		//console.log(layers[canvaslist].l+" "+layers[canvaslist].t+" "+layers[canvaslist].w+" "+layers[canvaslist].h+" this");
		canvaslist++;
		composeLayers();
		drawPreview();

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
function composeLayers(){
	var x = canvaslist;
	//console.log(canvaslist);
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
		$(".layerEach").removeClass("selected");
		$("#"+this.id).addClass("selected");
		var oldIndex = currentIndex;
		currentIndex = parseInt((this.id).replace("layer",""));
		if(document.getElementById("Canvas"+oldIndex)!=null){
			document.getElementById("Canvas"+oldIndex).onmousedown = null;		//console.log(currentIndex);
			document.getElementById("Canvas"+oldIndex).onmouseup = null;		//console.log(currentIndex);
			document.getElementById("Canvas"+oldIndex).onmousemove = null;		//console.log(currentIndex);
		}
		//ACTIVATE ACTION
		var tempAction = toolSelected;
		toolsActivate(tempAction);
	});
	//LAYER REORDER
	$('#LayersBody').sortable({
	    items: ':not(#layer0)'
	}).bind('sortupdate',function(e, ui){
		redoCanvasOrder();
	});

	$(".layersBody .visible").click(function(){
		var indexId = parseInt((this.id).replace('showHide',""));
		if($("#Canvas"+indexId).css("display")=='block'){
			$("#Canvas"+indexId).css("display","none");
			$("#showHide"+indexId).css("background","url(static/img/hide.png)").css("background-size","24px 24px").css("background-repeat","no-repeat");
		}else{
			$("#Canvas"+indexId).css("display","block");
			$("#showHide"+indexId).css("background","url(static/img/eye.png)").css("background-size","24px 24px").css("background-repeat","no-repeat");
		}
	})
}

/***********END COMPOSE LAYERS***********/
/****************************************/



/*********************************************************/
//     PANEL 2 OPERATIONS
/*********************************************************/

function closeBrush(){
	$(".brushDetails").css("display","none").css("left","2px").css("top","66px");
}

function brushThumbClicked(){
	if($(".brushDetails").css('display') == 'none'){
		$(".brushDetails").css('display','block');
		$("#brushHeading").html('Brush Details');
	}else{
		$(".brushDetails").css('display','none');
	}
}
function eraserThumbClicked(){
	if($(".brushDetails").css('display') == 'none'){
		$(".brushDetails").css('display','block');
		$("#brushHeading").html('Eraser Details');
	}else{
		$(".brushDetails").css('display','none');
	}
}


/*********ACTIONS POPULATING IN PANEL2*****/
function panel2Modification(idref){
	if(idref!=='colorPicker'){
		$("#thumbActions").html("");
	}
	//console.log(idref);
	switch(idref){
		case 'brush':
			$("#thumbActions").html("<div class='left thumbAct' id='brushThumb' onclick='brushThumbClicked()'><img src='static/img/brush.png'/></div>");
		break;
		case 'eraser':
			$("#thumbActions").html("<div class='left thumbAct' id='eraserThumb' onclick='eraserThumbClicked()'><img src='static/img/eraser.png'/></div>");
		break;
		case 'crop':
		break;
		case 'lasso':
		break;
		case 'marqueue_square':
		break;
		case 'colorPicker':
		break;
		case 'autoSelect':
		break;
		case 'eyedropper':
		break;
		case 'transform':
		break;
		default:
			console.log("Nothing to do");
		break;
	}
}
/*********************************************************
    END PANEL 2 OPERATIONS
*********************************************************/


function saveState(){
	//alert(currentIndex);;
	var indX = currentIndex;
	var currentCanvas = "Canvas"+indX;
	var zInd= $("#Canvas"+indX).css('z-index');	
	var cnv = document.getElementById(currentCanvas);
	var tempSrc= cnv.toDataURL();
	var height = baseHeight;
	var width  = baseWidth;
	layers[indX] = new Image();
	layers[indX].onload = function(){
		$("#Canvas"+indX).remove();
		$(".containerMain").append("<canvas id='Canvas"+indX+"' height='"+height+"' width='"+width+"' style='background:url(static/img/bg.jpg);z-index:'></canvas>").css("display","block");
		var mainC = document.getElementById("Canvas"+indX);
		var cntx = mainC.getContext("2d");
		$("#Canvas"+indX).css("position","absolute").css('margin-left',($(window).innerWidth() - width)/3 +"px").css("margin-top",($(window).innerHeight() - height)/3 +"px").css("display","block").css('z-index',zInd);
		if(indX>0){
			$("#Canvas"+indX).css("background","none");
		}
		cntx.drawImage(layers[indX],0,0,width,height);
	}
	layers[indX].src = tempSrc;
	$(".actionButton").remove();
}


function saveFinal(){
	$("#Canvas0").css("background","none");
	$("#currentImage").remove();
	$(".containerMain").append("<canvas id='currentImage' style='position:fixed' height="+$("#Canvas0").height()+" width="+$("#Canvas0").width()+" style='z-index:500'></canvas>");
	var cnvFinal = document.getElementById("currentImage");
	var ctxFinal = cnvFinal.getContext('2d');
	//console.log("These many canvas added "+canvaslist);
	//console.log("layers"+layers[10]);
	var canvas = null;
	
	for(z=canvaslist+1;z>=1;z--){
		if($("#layer"+(z-1)).length != 0){
			var id = $(".layersBody li:nth-child("+z+")").attr("id");
			//console.log("z: "+z+" id: "+id);
			id     = id.replace("layer","");
			if($("#Canvas"+id).css("display")=='block'){
				canvas = document.getElementById("Canvas"+id);
				ctxFinal.drawImage(canvas,0,0,$("#Canvas0").width(),$("#Canvas0").height());
			}		
		}
	}
	var currentUrl = cnvFinal.toDataURL();
	var data = currentUrl;
	//console.log(currentUrl);
	$.ajax({
		type: 'POST',
		contentType: 'application/json;charset=UTF-8',
		url : '/syncState',
		data: JSON.stringify(data,null,'\t'),
		success:function(response){
				//console.log("Fuck you");		
			}
	});
	$("#currentImage").remove();
	$(".navList").css("display","none");
	$("#Canvas0").css("background","url(static/img/bg.jpg)");
}

/*********************LAYER REORDER**************
*************************************************/

function redoCanvasOrder(){
	var z;
	var factor = canvaslist;
	for(z=1;z<canvaslist+1;z++){
		if($("#layer"+z).length != 0){
			var id = $(".layersBody li:nth-child("+z+")").attr("id");
			id     = id.replace("layer","");
			zInd   = (200+(factor*10));
			$("#Canvas"+id).css("z-index",zInd);
		}
		factor--;
	}
}
/*****************END LAYER REORDER**************
*************************************************/


function imageAdjustmentOptions(){
	//alert(.css("display"));
	$("body").append("<div class='navList' id='Secondary'></div>");
	$("#Secondary").css("left",($("#Primary").offset().left+$("#Primary").width()+12)+"px").css("top",$("#imageAdjustments").offset().top+"px").css("display","block").html("<ul><li id='brightnessContrast' onclick='loadpreviewBrightnessContrast()'>Brightness/ Contrast</li><li id='hueSaturtion' onclick='loadpreviewHueSaturation()'>Hue/ Saturation</li><li id='brightnessContrast' onclick='loadpreviewCurves()'>Curves</li><li id='brightnessContrast' onclick='loadpreviewBrightnessContrast()'>Levels</li><li id='brightnessContrast' onclick='loadpreviewBrightnessContrast()'>Color Balance</li></ul>");
}
//PREVIEW FOR BRIGHTNESS AND CONTRAST
function loadpreviewBrightnessContrast(){
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
}

//PREVIEW FOR HUE SATURATION
function loadpreviewHueSaturation(){
	$(".actionArea").css("display","none");
	$("#Secondary").remove();
	$("#Primary").css("display","none");
	$("#hueElement[data-slider]").simpleSlider("setValue",50);
	$("#saturateElement[data-slider]").simpleSlider("setValue",1);
	$(".previewPanel").css("display","block").css("left",(($(window).innerWidth()-$(".previewPanel").width())/2)+"px");
	$("#previewHeading").html("Adjust Hue Saturation - Layer"+currentIndex);
	$("#actionAreaHueSaturation").css("display","block");

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
}	

function closePreview(){
	$(".previewPanel").css("display","none");
	$(".actionArea").css("display","none");
}


/***************************
*
Activate selected tool
Author Anubhab
*
*
***************/

function toolsActivate(tool){
		var idref = tool;
		if(idref=='colorPicker'){

		}else{
			if($("#Canvas"+currentIndex).length != 0){
				$(".tools").removeClass("active");
				$("#"+idref).addClass("active");
				cleanCanv();
				switch(idref){
					case 'crop':
						var myCanvas = new cropBase();
						toolSelected = 'crop';
					break;
					case 'marqueue_square':
						var myCanvas = new marqueue_square();
						toolSelected = "marqueue_square";
					break;
					case 'brush':
						//$("#Canvas0").sketch({defaultColor: "#ff0"});
						var myCanvas = new draw('Canvas'+currentIndex,'draw');
						toolSelected = "draw";
					break;
					case 'eraser':
						//$("#Canvas0").sketch({defaultColor: "#ff0"});
						var myCanvas = new draw('Canvas'+currentIndex,'erase');
						toolSelected = "eraser";
					break;
					case 'colorPicker':
						console.log("Do nothing");
					break;
					case 'autoSelect':
						toolSelected = "autoSelect";
						draw('Canvas'+currentIndex,"move");
					break;
					case 'lasso':
						toolSelected = "lasso";
						lasso('Canvas'+currentIndex);
					break;
					case 'eyedropper':
						toolSelected = "eyedropper";
						eyedropper('Canvas'+currentIndex);
					break;
					case 'transform':
						if($("#transformPanel").css("display") == 'none'){
							$("#transformPanel").css("display","block").css("top",$("#transform").offset().top - 15 +"px");
							composeTransform();
						}
						else if($("#transformPanel").css("display") == 'block'){
							$("#transformPanel").css("display","none");
							$(".tools").removeClass('active');
						}
					break;
					case 'preview':
						if($(".previewOutput").is(":visible")){
							$(".previewOutput").hide();
							$(".tools").removeClass("active");
						}else{
							drawPreview();
							$(".previewOutput").show();
						}
					break;
					default:
						console.log("Nothing to do");
					break;

				}
				panel2Modification(idref);
			}else{
				alert("Please add some layers before selecting a tool");
			}
		}
}



function cleanCanv(){
	delete window.temp_canvas;
    $("#temp_canvas").remove();
    $(".containerMain").off();
    $("#crop_canvas").remove();
    $("#Canvas"+currentIndex).off();
    //saveState();
}


function composeTransform(){
	cleanCanv();
	$("#transformPanel").html("<div class='tools' id='resize'><img src='static/img/transform.png' title='Resize'/></div><div class='tools' id='perspective'><img src='static/img/transform.png' title='Perspective'/></div>");
	$("#resize").click(function(){
		$("#transformPanel").css("display","none");
		transformType = "resize";
		transform();
	});
	$("#perspective").click(function(){
		$("#transformPanel").css("display","none");
		transformType = "perspective";
		transform();
	});
}


/*******************
*
*
Sharpening of Image
*
*
**********************/
function Sharpen(){
	$("#Secondary").remove();
	$("#Primary").css("display","none");
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
		'action'    : 'simple_sharpen',
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
}


/*******************
*
*
Blur Image Javascript
*
*
******************/
function Blur(){
	$(".actionArea").css("display","none");
	$("#blurElement[data-slider]").simpleSlider("setValue",0);
	$("#Secondary").remove();
	$("#Primary").css("display","none");
	$(".previewPanel").css("display","block").css("left",(($(window).innerWidth()-$(".previewPanel").width())/2)+"px");
	$("#previewHeading").html("Apply Blur - Layer"+currentIndex);
	$("#actionAreaBlur").css("display","block");

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
}


/**************
*
Create Pure Black and white image
*
*
***************/
function blackWhite(){
	//HAVE TO HAVE AN ALERT HERE - TO DO Standardize local allarts the PS style
	$("#Secondary").remove();
	$("#Primary").css("display","none");
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
		'action'    : 'simple_blacknwhite',
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
}


/********
*
Create Sepia using Pillow
*
*********/
function getSepia(){
	$("#Secondary").remove();
	$("#Primary").css("display","none");
	delete window.x;
	delete window.ctxt;
	delete window.canvas;
	$(".previewPanel").css("display","none");

	$(".previewLessOptions").css("display","block");
	$("#sepiaTone").css("display","block");
	$("#redSepiaValue[data-slider]").simpleSlider("setValue",255);
	$("#greenSepiaValue[data-slider]").simpleSlider("setValue",240);
	$("#blueSepiaValue[data-slider]").simpleSlider("setValue",192);

	$("#OkSepia").click(function(){
		closePreviewLess();
		var createRgb  = $("#redSepiaFactor").val()+","+$("#greenSepiaFactor").val()+","+$("#blueSepiaFactor").val();
		var canvas = document.getElementById("Canvas"+currentIndex);
		var ctxt   = canvas.getContext('2d');
		var imgB64D= canvas.toDataURL();
		ctxt.clearRect(0,0,baseWidth,baseHeight);
		var data = {
			'action'    : 'simple_sepia',
			'sepia_rgb' : createRgb,
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
	});
}

/**************************************
PREVIEWLESS OPERATIONS
*********************************/
function closePreviewLess(){
	$(".previewLessOptions").css("display","none");
}


/********************************
AN ATTEMPT AT Curves
********************************/
function loadpreviewCurves(){
	$(".CurvesPreview").css("display","block");
	$("#Secondary").remove();
	$("#Primary").css("display","none");
	cleanCanv();
	delete window.x;
	delete window.ctxt;
	delete window.canvas;
	var indX = currentIndex;
    
	if($("#Canvas"+currentIndex).length !== 0){
		$(".containerMain").append("<canvas id='temp_canvas' width="+$("#Canvas"+indX).width()+" height="+$("#Canvas"+indX).height()+"></canvas>");
    	$("#temp_canvas").css("position","absolute").css('margin-left',($(window).innerWidth() - $("#Canvas"+indX).width())/3 +"px").css("margin-top",($(window).innerHeight() - $("#Canvas"+indX).height())/3 +"px").css("display","block").css("z-index",1000);
		var tempCanv = document.getElementById("Canvas"+currentIndex);
		//var tempCtx  = tempCanv.getContext('2d');
		
		var widthO = Math.floor($(".previewCurves").width()*.95);
		//var height= Math.floor($("#temp_canvas").height());
		//alert(width+" "+height);
		var tempImage= tempCanv.toDataURL();
		var prevwCan = document.getElementById("temp_canvas");
		var prevwCtx = prevwCan.getContext('2d');
		var prevwImg = new Image();

		prevwImg.onload = function(){
			var hgth = this.height/this.width * widthO;
			/*$("#temp_canvas").attr("height",hgth);
			$("#temp_canvas").attr("width",widthO);
			*///prevwCtx.drawImage(tempCanv,0,0,width,hgth);
			prevwCtx.drawImage(tempCanv,0,0);
			try{
				Filter.Init(prevwImg,prevwCtx);
			}catch(err){
      			console.log(err.message);
      			//document.getElementById('error').style.display = 'block';
      			return;
			}
		}
		prevwImg.src = tempImage;
		CC1 = new ColorCurve('selectorR', function(){ Filter.applyFilter();});
    	CC2 = new ColorCurve('selectorG', function(){ Filter.applyFilter();});
    	CC3 = new ColorCurve('selectorB', function(){ Filter.applyFilter();});
	}
	else
		$(".previewCurves").html("<h1>No Image in selection</h1>");

}
function closeCurves(){
	$(".CurvesPreview").css("display","none");
	cleanCanv();
}
function confirmCurves(){
	$(".CurvesPreview").css("display","none");
	var zIndx = $("#Canvas"+currentIndex).css("z-index");
	$("#Canvas"+currentIndex).remove();
	$("#temp_canvas").css("z-index",zIndX);
	$("#temp_canvas").attr("id","Canvas"+currentIndex);
	cleanCanv();
}


/*****************************************
DRAW PREVIEW
****************************************/
function drawPreview(){
	var canvPreview = document.getElementById("previewOutput");
	var ctxPreview  = canvPreview.getContext('2d');
	var hFact    = $("#Canvas0").height();
	var wFact    = $("#Canvas0").width();
	$("#previewOutput").attr("width",wFact).attr("height",hFact)
	$(".previewOutput").css("left","60px").css("bottom","10px");
	for(z=canvaslist+1;z>=1;z--){
		if($("#layer"+(z-1)).length != 0){
			var id    = $(".layersBody li:nth-child("+z+")").attr("id");
			id        = id.replace("layer","");
			if($("#Canvas"+id).css("display")=='block'){
				var canvas = document.getElementById("Canvas"+id);
				/*ctxTmp = canvas.getContext('2d');*/
				var composite = compositeOps[id];
				var alpha     = globalAlphaVal[id];
				//alert(compositeOps[id]);
				if(composite == undefined)
					composite = 'normal';
				if(globalAlphaVal == undefined)
					alpha =1
				ctxPreview.globalCompositeOperation = composite;
				ctxPreview.globalAlpha = alpha;
				ctxPreview.drawImage(canvas,0,0,wFact,hFact);
				composite = 'normal';
				alpha =1;
				ctxPreview.globalCompositeOperation = 'source-atop';
				ctxPreview.globalAlpha = 1;
				//ctxPrev.clearRect(canvas,0,0,$("#layerOpsPreview").width(),hFact);
			}		
		}
	}
	var currentUrl = canvPreview.toDataURL();
}

function closePreviewBlock(){
	$(".previewOutput").hide();
	$(".tools").removeClass("active");
}