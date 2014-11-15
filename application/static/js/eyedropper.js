/************************
*
*
Author Anubhab
August 2015
Developed Heavily on existing libraries
Function: Eyedropper - get color pixel values of oixel clicked 
Catch: tried separating move but somee conflict with event handelling
*
****************/

function eyedropper(){
    delete window.temp_canvas;
    $("#temp_canvas").remove();
    $(".containerMain").off();
    $("#Canvas"+currentIndex).off();
    delete window.temp_canvas;
    $("#crop_canvas").remove();
    var correctLeft = $("#Canvas0").offset().left;
    var correctTop  = $("#Canvas0").offset().top;

    var indX = currentIndex;
    $(".containerMain").append("<canvas id='temp_canvas' width="+$("#Canvas0").width()+" height="+$("#Canvas0").height()+"></canvas>");
    $("#temp_canvas").css("position","fixed").css({
        'left':($(window).innerWidth() - $("#Canvas0").width())/3 +"px",
        'top' :($(window).innerHeight() - $("#Canvas0").height())/3 +"px",
        'display':'block',
        'z-index':1000
    });
    var cnv = document.getElementById('temp_canvas');
    var ctx = cnv.getContext('2d');
     for(z=canvaslist+1;z>=1;z--){
        if($("#layer"+(z-1)).length != 0){
            var id = $(".layersBody li:nth-child("+z+")").attr("id");
            id     = id.replace("layer","");
            var cnvt = document.getElementById("Canvas"+id);
            ctx.drawImage(cnvt,0,0);
        }
    }

    $("#temp_canvas").click(function(e) {
      var pixelData = ctx.getImageData((e.clientX-correctLeft), (e.clientY-correctTop), 1, 1).data;
      
      var colorPicked = "rgba("+pixelData[0]+","+pixelData[1]+","+pixelData[2]+",1)";
      foregroundColor = colorPicked;
      $('#colorPicker span').css("background",foregroundColor);
    });

    //$("#temp_canvas").remove();

}
