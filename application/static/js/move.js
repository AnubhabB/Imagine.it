function move(elemId){
	//clearing variables
	$("#Canvas"+currentIndex).off();
	$("#Canvas"+currentIndex).undelegate();
	console.log("Autoselect Called at Canvas"+currentIndex);	
	delete window.indX, window.toolSel, window.el, window.ctx, window.isDragging;
	var indX   = currentIndex;
	var toolSel= toolSelected;
	var movDistX, movDistY;
	//var el = document.getElementById('Canvas'+indX);
	//var ctx = el.getContext('2d');
	el = document.getElementById("Canvas"+indX);
	//$(el).off();
    ctx = el.getContext('2d');
	//var isMove = false;
    correctLeft = $("#Canvas"+indX).offset().left;
    correctTop  = $("#Canvas"+indX).offset().top;
    var moveXAmount=0;
	var moveYAmount=0;
	var isDragging=false;
	var prevX = 0;
	var prevY = 0;
	console.log("Hello before mouse down Autoselect Called at Canvas"+currentIndex);
    el.onmousedown = function(e) {
      	console.log(brushWidth+" | "+featherWidth);
      	console.log("MouseDown "+moveYAmount+" | "+moveXAmount);
      	isDragging = true;
    	prevX=0;
    	prevY=0;
    };

    el.onmousemove = function(e) {
    	console.log("MouseMove "+moveYAmount+" | "+moveXAmount);
      	if( isDragging == true ){
	        if( prevX>0 || prevY>0)
	        {
	            moveXAmount += event.pageX - prevX;
	            moveYAmount += event.pageY - prevY;
	            buildcanvas();
	        }
	        prevX = event.pageX;
	        prevY = event.pageY;
	    }
    };
    el.onmouseup = function(e){
    	isDragging = false;
    	prevX=0;
    	prevY=0;
    	buildcanvas();

    }

    function buildcanvas(){
    	ctx.drawImage(layers[indX],moveYAmount,moveYAmount);
    }

    saveState();

}