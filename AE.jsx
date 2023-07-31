var mywindow = new Window("palette","AUTO BAR", undefined);

mywindow.orientation = "column";
var text = mywindow.add("statictext", undefined,"Automaticly add bar from marker");
var group = mywindow.add("group", undefined, "");
group.orientation="row";
var buttonone = group.add("button", undefined,"CREATE MIDI");
var buttontwo = group.add("button", undefined,"CREATE MARKER");
var buttonthree = group.add("button", undefined,"DEBUG USE ONLY");
mywindow.center();
mywindow.show();
var comp=app.project.activeItem;
buttonone.onClick = function(){
    actionbutton1()

}
buttontwo.onClick = function(){
    actionbutton2()

}
function actionbutton1(){
   // alert ("Test");
    var select=comp.selectedLayers;
    var layer=select[0];
    var layerindex=layer.index;
    var layername = layer.name;
    var solidlayer = comp.layers.addSolid([1, 1, 1], "midicontrol", 100, 100, 1.0);
    solidlayer.Effects.addProperty("Slider Control");
    
    var slider = solidlayer.Effects.property("Slider Control").property("Slider");
    
    slider.expression = "thisComp.layer('"+layername+"').marker.numKeys;";
    var result = slider.value;
    //alert ("There are " +result + " comp markers");

    var xstart= 1920;
    var xend=0;
    var screenduration = 1.5;
    var frameps = 60;
    var scanstart=1;
    var midilayercount=5;
    var x=0;
    //var y=0;
    var layerindex=solidlayer.index+midilayercount;
    while (x<midilayercount){
        solidlayer.Effects.addProperty("Slider Control");
        x++;
        var miditiles = comp.layers.addSolid([1, 1, 1], "midi tiles"+x+"", 100, 100, 1.0);
        var miditilespos = miditiles.property("ADBE Transform Group").property("ADBE Position");
        var miditilesop = miditiles.property("ADBE Transform Group").property("ADBE Opacity");
        var control=x+1;
        
        miditilespos.expression = "x=thisComp.layer("+layerindex+").effect('Slider Control "+control+"')('Slider');[x,540];";
        miditilesop.expression = "if (transform.position[0]=="+xend+"){value=0}";
    }
    var sliderselect=2;
    var prevtime=0;
    //var makertime=0;
    //alert ("controller created")
    // solidlayer.Effects.property("Slider Control").property("Slider").expression = "thisComp.layer('"+layername+"').marker.key("+scanstart+").time;";
    // var apalah = solidlayer.Effects.property("Slider Control").property("Slider");
    // alert(apalah.value);
    while (scanstart<result){
        
        
        
        solidlayer.Effects.property("Slider Control").property("Slider").expression = "thisComp.layer('"+layername+"').marker.key("+scanstart+").time;";
        var markertime = solidlayer.Effects.property("Slider Control").property("Slider");
        //alert(markertime.value);
        
        if ((markertime.value-prevtime)>screenduration){
            var time=(markertime.value)-screenduration;
            //alert(time);
            
            solidlayer.Effects.property("Slider Control "+sliderselect+"").property("Slider").setValueAtTime(((time*frameps-1)/frameps), xend);
            solidlayer.Effects.property("Slider Control "+sliderselect+"").property("Slider").setValueAtTime(time, xstart);
            solidlayer.Effects.property("Slider Control "+sliderselect+"").property("Slider").setValueAtTime(markertime.value, xend);
            prevtime=markertime.value;
        }
        else {
            sliderselect++;
            if (sliderselect>(midilayercount+1)){
                sliderselect=2;
            }
            var time=markertime.value-screenduration;
            solidlayer.Effects.property("Slider Control "+sliderselect+"").property("Slider").setValueAtTime(((time*frameps-1)/frameps), xend);
            solidlayer.Effects.property("Slider Control "+sliderselect+"").property("Slider").setValueAtTime(time, xstart);
            solidlayer.Effects.property("Slider Control "+sliderselect+"").property("Slider").setValueAtTime(markertime.value, xend);
            prevtime=markertime.value;
            

        
        }
        scanstart++;
    }


    


}



function actionbutton2(){
    var select=comp.selectedLayers;
    var layer=select[0];
    var layerindex=layer.index;
    var layername = layer.name;
    var compMarker = new MarkerValue("");
    var slidevalue = layer.Effects.property("Both Channels").property("Slider").value;
    var tempNull = comp.layers.addNull(comp.duration);
    tempNull.Effects.addProperty("Slider Control");
    tempNull.Effects.addProperty("Slider Control");
    var slider = tempNull.Effects.property("Slider Control").property("Slider");
    var slidertime = tempNull.Effects.property("Slider Control 2").property("Slider");
    slider.expression = "thisComp.layer('"+layername+"').effect('Both Channels')('Slider').numKeys;";
    var result = slider.value;
    var eta60 = (result/3600);
    //var eta30 = eta60/2;
    alert("There are " +result + " comp keyframe, ETA: "+eta60+" minutes on 60FPS");
    
    //        !!!NPUT HERE!!!
    var tresh  = 20;
    var startscan=10800;
    var endscan=result;





    while (startscan<endscan){
        slider.expression = "thisComp.layer('"+layername+"').effect('Both Channels')('Slider').key("+x+");";
        slidertime.expression = "thisComp.layer('"+layername+"').effect('Both Channels')('Slider').key("+x+").time;";
        
        if (slider.value>tresh){
            var startmaker=slidertime.value;
            while(slider.value>tresh){
                slider.expression = "thisComp.layer('"+layername+"').effect('Both Channels')('Slider').key("+x+");";
                slidertime.expression = "thisComp.layer('"+layername+"').effect('Both Channels')('Slider').key("+x+").time;";
                startscan++;

            }
            
            var endmaker=slidertime.value;
            compMarker.duration=endmaker-startmaker;
            comp.layer(layer.index).marker.setValueAtTime(startmaker, compMarker);
        }
        startscan++;
    }
    alert("done");
    tempNull.remove();
    // for (x = 1920; x <= 1980; x++) {
        
    //          slider.expression = "thisComp.layer("+layerindex+").effect('Both Channels')('Slider').key("+x+");";
             
    //          if (slider.value>20){
    //             slider.expression = "thisComp.layer("+layerindex+").effect('Both Channels')('Slider').key("+x+").time;";
    //             var startmarker=slider.value;
    //             while (slider.value>20){
    //                 slider.expression = "thisComp.layer("+layerindex+").effect('Both Channels')('Slider').key("+x+").time;";
    //                 x++;
    //             }
    //             slider.expression = "thisComp.layer("+layerindex+").effect('Both Channels')('Slider').key("+x+").time;";
    //             var endmarker=slider.value-startmarker;
    //             alert(endmarker);
                
                 
                 
    //             //  compMarker.duration=endmarker-startmarker;
    //             //  comp.layer(layerindex).marker.setValueAtTime(slider.value, compMarker);
                

    //          }
             


    //          //alert("Marker " + x + " time = " + tempPos.value[0]);

    //  }

    // 

}