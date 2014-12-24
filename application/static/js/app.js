var imageLayers = {};
var foregroundColor = 'rgba(255,255,255,1)';
var currentIndex  = 0;
var toolSelected  = "";
var layers        = [];
var canvaslist    = 0;
var shiftKey      = false;
var toolSelected  = '';
var states        = [];
var brushWidth = 10,featherWidth = 10;
var brush = 'round';


function Init(){
	var self = this;
	self.globalEvents();
	window.preview = new drawPreview();
	window.zoom = new Zoom();
	zoom.zoomfactor = 1;
}

Init.prototype.panel3Adjustments = function() {
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
};

Init.prototype.panel4Adjustments = function() {
	/*************************************************
	LAYER - PANEL 4
**************************************************/
	//Position Panel4
	$(".panel4").css("left",($(window).innerWidth() - $(".panel4").width()-10 +"px"));
	var panel4width = $(".panel4").width();
	$("#layersMinnimize").click(function(){
		$(".panel4").animate({
			left    : ($(".panel4").offset().left+$(".panel4").width()-30)+"px",
			width   :"30px",
			height  :"30px",
			opacity :0
		},200);
		$(".panel4min").css({
			"width":0,
			"height":0,
			"display":"block",
			"left":$(window).innerWidth() - 30 - 10 +"px"
		}).animate({
			opacity: 1,
			width  : "30px",
			height : "30px"
		},200,function(){
			$(".panel4").css("display","none");
		});
	});
	$(".panel4min").click(function(){
		$(".panel4").css({
			"display":"block",
			"left"   :$(window).innerWidth()+"px"
		}).animate({
			width   : panel4width+"px",
			height  :"auto",
			left    : (($(window).innerWidth() - panel4width -10 +"px")),
			opacity:1
		},200);
		$(".panel4min").animate({
			opacity:0,
			width:0,
			height:0
		},200,function(){
			$(".panel4min").css("display","none");
		});
	});

	$("#DeleteLayers").click(function(){
		fileOps.prototype.DeleteLayers();
	});
};

Init.prototype.globalEvents = function(){
	var self = this;

	//$(window).on("mousemove",function(){
	//	preview.draw("preview");
	//});

	/*var mtp = function(){
			setTimeout(function(){
				preview.draw("preview");
				mtp();
			},100);
	}*/

	//mtp();

	$("nav.panel1").on("click",".navText",function(el){
		var id = this.id;
		toolController(id,"navText");
	});

	$("nav.panel3").on("click",".tools",function(el){
		var id = this.id;
		toolController(id,"tools");
	});

	$(".navList").on("click","ul li",function(el){
		var id = this.id;
		toolController(id,"action");
	});

	$("#imageFile").on("change",function(){
		fileOps.prototype.openFile();
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
		}
	});
	self.panel4Adjustments();
	self.panel3Adjustments();

}

Init.prototype.toolsActivate = function(tool) {
	toolController.prototype.toolSelection(tool);
};

Init.prototype.saveState = function() {
	// body...
};

Init.prototype.history = function(todo,action) {
	preview.draw("preview");
	if(todo == "push"){
		var data = {'action': action,'statedata':imageLayers};
		states.push(data);
	}

	init.updateHistory();
};

Init.prototype.updateHistory = function() {
	$("#history").html("");

	$.each(states,function(k,v){
		$("#history").append("<li class='row-fluid historyEach' id='"+v.action+"_"+k+"'><span class='imgCont left'></span><span class='left'>"+v.action+"</span></li>");
	});

	$("#history").scrollTop($("#history").prop('scrollHeight'));
};


$(function(){
	window.init = new Init();
});