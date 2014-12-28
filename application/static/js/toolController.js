function toolController(navElem,navType){
	switch(navType){
		case "navText":
			toolController.prototype.composeSecondMenu(navElem);
		break;
		case "tools":
			toolController.prototype.toolSelection(navElem);
		break;
		case "action":
			toolController.prototype.editorAction(navElem);
		break;
	}
}

toolController.prototype.toolSelection = function(navElem){
	
	$("#thumbActions").off("click");
    $("#thumbActions").off("click",".thumbAct");
    $(".brushType").off("click",".brushThumb");
    $(".thumbAct").remove();
	$("#temp_canvas").remove();
	$("#transformPanel").remove();
	zoom.cleanThis();

	$("#Canvas"+currentIndex).css("display","block");
	
	if($(".selected").length != 0){
		$(".tools").removeClass("active");
		toolSelected = navElem;
		$("canvas").css("cursor","auto");
		switch(navElem){
			case "autoSelect":
				$("#Canvas"+currentIndex).css("cursor","move");
				AutoSelect();
			break;
			case "marqueue_square":
				marqueue_square();
			break;
			case "lasso":
				lasso();
			break;
			case "crop":
				crop();
			break;
			case "eyedropper":
				eyedropper();
			break;
			case "zoom":
				zoom.renderZoom();
			break;
			case "preview":
				if($(".previewOutput").is(":visible")){
					$(".previewOutput").hide();
					$(".tools").removeClass("active");
				}else{
					var preview = new drawPreview();
					preview.draw("preview");
					$(".previewOutput").show();
				}
			break;
			case "eraser":
				var Sketch = new sketch(toolSelected);
			break;
			case "brush":
				var Sketch = new sketch(toolSelected);
			break;
			case "transform":
				var t = new transform();
				t.composeTransform();
			break;
			default:
				console.log("to integrate "+toolSelected);
				$(".tools").removeClass("active");
			break;
		}
		$("#"+navElem).addClass("active");
	}else{
		alert("Select a layer");
	}
}


toolController.prototype.editorAction = function(navElem) {
	switch(navElem){
		case "newFile":
			console.log("To Do");
		break;
		case "openFile":
			new fileOps("open");
		break;
		case "imageAdjustments":
			toolController.prototype.composeThirdMenu(navElem);
		break;
		case "brightnessContrast":
			var adj = new Adjustments();
			adj.loadpreviewBrightnessContrast();
		break;
		default:
			console.log("To do "+navElem);
		break;
	}
}

toolController.prototype.composeSecondMenu = function(navElem){
	if($(".navList").css("display")=='none'){
		$(".navList").css({
			'left' : $("#"+navElem).offset().left+"px",
			"display":"block"
		});
		switch(navElem){
			case 'file':
				$(".navList").html("<ul><li id='newFile'>New (To Do)</li><li id='openFile'>Open (O)</li><li id='save'>Save (Space)</li><li id='exit'>Exit</li></ul>");
			break;
			case 'edit':
				$(".navList").html("<ul><li id=''>Adjustments</li><li id=''>Image Size</li><li id='exit'>Canvas Size</li></ul>");
			break;
			case 'image':
				$(".navList").html("<ul><li id='imageAdjustments' >Adjustments</li><li id='openFile'>Image Size</li><li id='exit'>Canvas Size</li></ul>");
			break;
			case 'filters':
				$(".navList").html("<ul><li id='sharpen' onclick='Sharpen()'>Sharpen</li><li id='blur' onclick='Blur()'>Blur</li><li id='sepia' onclick='getSepia()'>Sepia</li><li id='blacknwhite' onclick='blackWhite()' data-type='action'>Black n White</li></ul>");
			break;
			case 'about':
				$(".navList").html("<ul><li>v 0.1(Alpha)</li><li>To Do</li><li>Credits</li><li>Help</li><li>Known Issues</li><li>Lisence</li></ul>");
			break;
			case 'layer':
				$(".navList").html("<ul><li onclick='addNewLayer(\"transparent\")'>New Layer</li><li onclick='addNewLayer(\"fill\")'>New Fill Layer</li><li>Delete Layers</li><li>Merge Layers</li><li>Duplicate Layers</li><li onclick='drawPreview(\"mergevisible\")'>Merge Visible</li><li>New Adjustment Layer</li></ul>");
			break;
		}
	}
	else{
		$(".navList").css("display","none");
	}
}

toolController.prototype.composeThirdMenu = function(navElem) {
	$(".thirdPanel").off("click");
	$("body").append("<div class='navList' id='Tertiary'></div>");
	$("#Tertiary").css({
		"left":($("#Primary").offset().left+$("#Primary").width()+12)+"px",
		"top":$("#imageAdjustments").offset().top+"px",
		"display":"block"
	});
	switch(navElem){
		case "imageAdjustments":
			$("#Tertiary").html("<ul><li class='thirdPanel' id='brightnessContrast'>Brightness/ Contrast</li><li class='thirdPanel' id='hueSaturtion' onclick='loadpreviewHueSaturation()'>Hue/ Saturation</li><li id='brightnessContrast' onclick='loadpreviewCurves()'>Curves</li><li id='brightnessContrast' onclick='loadpreviewBrightnessContrast()'>Levels</li><li id='brightnessContrast' onclick='loadpreviewBrightnessContrast()'>Color Balance</li></ul>");
		break;
	}
	$(".thirdPanel").on("click",function(event){
		var elem = this.id;
		$("#Tertiary").remove();
		toolController.prototype.editorAction(elem);
	});
}