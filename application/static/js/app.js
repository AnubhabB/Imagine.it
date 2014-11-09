var imageLayers = {};
var foregroundColor = 'rgba(255,255,255,1)';
var currentIndex  = 0;
var toolSelected  = "";
var layers        = [];
var canvaslist    = 0;
var shiftKey      = false;
var toolSelected = '';



$(function(){
	init();
});

function init(){
	globalEvents();
}

function globalEvents(){
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

/*
	$("body").on("mousedown",".draggable",function(){
		console.log(imageLayers);
		console.log("Before drag",imageLayers[currentIndex]);
		
	});*/
}

init.prototype.toolsActivate = function(tool) {
	toolController.prototype.toolSelection(tool);
};