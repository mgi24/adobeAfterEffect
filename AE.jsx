var mywindow = new Window("palette","AUTO BAR", undefined);

mywindow.orientation = "column";
var text = mywindow.add("statictext", undefined,"Automaticly add bar from marker");
var group = mywindow.add("group", undefined, "");
var group2 = mywindow.add("group", undefined, "");
group.orientation="row";
group2.orientation="row";
var buttonone = group.add("button", undefined,"CREATE MIDI");
var buttontwo = group.add("button", undefined,"CREATE MARKER");
var buttonthree = group.add("button", undefined,"DEBUG USE ONLY");
var buttonfour = group2.add("button", undefined,"MIDI FROM PP");
var buttonfive = group2.add("button", undefined,"USE EXAC TIME");
mywindow.center();
mywindow.show();

buttonone.onClick = function(){
    var comp=app.project.activeItem;
    actionbutton1()

}
buttontwo.onClick = function(){
    var comp=app.project.activeItem;
    actionbutton2()

}
buttonthree.onClick = function(){
    var comp=app.project.activeItem;
    actionbutton3()

}
buttonfour.onClick = function(){
    var comp=app.project.activeItem;
    actionbutton4()

}
buttonfive.onClick = function(){
    var comp=app.project.activeItem;
    actionbutton5()

}
function actionbutton1(){
   // alert ("Test");
   //INSERT VALUE HERE!!!

   var xstart= 1920;
   var xend=0;
   var screenduration = 1.5;
   var frameps = 60;
   var scanstart=1;
   var midilayercount=3;
   var x=0;
   var yaxis=540;


   //END OF INSERT VALUE
    var select=comp.selectedLayers;
    var layer=select[0];
    var layerindex=layer.index;
    var layername = layer.name;
    var solidlayer = comp.layers.addSolid([1, 1, 1], "midicontrol", 100, 100, 1.0);
    solidlayer.Effects.addProperty("Slider Control");
    var slider = solidlayer.Effects.property("Slider Control").property("Slider");
    var solidname=solidlayer.name;
    slider.expression = "thisComp.layer('"+layername+"').marker.numKeys;";
    var result = slider.value;
    


    //END OF INSERT VALUE
    var layerindex=solidlayer.index+midilayercount;
    var sliderlength = solidlayer.Effects.property("Slider Control").property("Slider");
    while (x<midilayercount){
        solidlayer.Effects.addProperty("Slider Control");
        x++;
        var miditiles = comp.layers.addSolid([1, 1, 1], "midi tiles"+x+"", 100, 100, 1.0);
        var miditilespos = miditiles.property("ADBE Transform Group").property("ADBE Position");
        var miditilesop = miditiles.property("ADBE Transform Group").property("ADBE Opacity");
        var miditilescale = miditiles.property("ADBE Transform Group").property("ADBE Scale");
        var control=x+2;
        var scalecontrol=x+midilayercount+2;
        
        miditilespos.expression = "x=thisComp.layer('"+solidname+"').effect('Slider Control "+control+"')('Slider');[x,"+yaxis+"];";
        miditilescale.expression = "x=thisComp.layer('"+solidname+"').effect('Slider Control "+scalecontrol+"')('Slider');[x, 100];"
        miditilesop.expression = "if (transform.position[0]=="+xend+"){value=0}";
    }
    while (x<(midilayercount*2)+1){
        solidlayer.Effects.addProperty("Slider Control");
        x++;
    }
    var sliderselect=3;
    var prevtime=0;
    
    //var makertime=0;
    // alert ("controller created")
    // solidlayer.Effects.property("Slider Control").property("Slider").expression = "thisComp.layer('"+layername+"').marker.key("+scanstart+").time;";
    // var apalah = solidlayer.Effects.property("Slider Control").property("Slider");
    // alert(apalah.value);

    // solidlayer.Effects.property("Slider Control 2").property("Slider").expression = "thisComp.layer('"+layername+"').marker.key("+scanstart+").duration;";
    // var barlength=(solidlayer.Effects.property("Slider Control 2").property("Slider").value)/screenduration*(xstart-xend)/100;
    // alert (barlength);


    while (scanstart<result){
        
        
        
        solidlayer.Effects.property("Slider Control").property("Slider").expression = "thisComp.layer('"+layername+"').marker.key("+scanstart+").time;";
        var markertime = solidlayer.Effects.property("Slider Control").property("Slider");
        
        //alert(markertime.value);
        
        if ((markertime.value-prevtime)>screenduration){
            var time=(markertime.value)-screenduration;
            var sliderlength=sliderselect+midilayercount;
            solidlayer.Effects.property("Slider Control 2").property("Slider").expression = "thisComp.layer('"+layername+"').marker.key("+scanstart+").duration;";
            var barlength=(solidlayer.Effects.property("Slider Control 2").property("Slider").value)/screenduration*(xstart-xend);
            var barlengthprev=solidlayer.Effects.property("Slider Control "+sliderlength+"").property("Slider").value;
            solidlayer.Effects.property("Slider Control "+sliderlength+"").property("Slider").setValueAtTime(((time*frameps-1)/frameps), barlengthprev);
            solidlayer.Effects.property("Slider Control "+sliderlength+"").property("Slider").setValueAtTime(time, barlength);
            solidlayer.Effects.property("Slider Control "+sliderlength+"").property("Slider").setValueAtTime(markertime.value, barlength);
            solidlayer.Effects.property("Slider Control "+sliderselect+"").property("Slider").setValueAtTime(((time*frameps-1)/frameps), xend);
            solidlayer.Effects.property("Slider Control "+sliderselect+"").property("Slider").setValueAtTime(time, xstart);
            solidlayer.Effects.property("Slider Control "+sliderselect+"").property("Slider").setValueAtTime(markertime.value, xend);
            
            prevtime=markertime.value;
        }
        else {
            sliderselect++;
            
            if (sliderselect>(midilayercount+2)){
                sliderselect=3;
            }
            var sliderlength=sliderselect+midilayercount;
            var time=markertime.value-screenduration;
            solidlayer.Effects.property("Slider Control 2").property("Slider").expression = "thisComp.layer('"+layername+"').marker.key("+scanstart+").duration;";
            var barlength=(solidlayer.Effects.property("Slider Control 2").property("Slider").value)/screenduration*(xstart-xend);
            var barlengthprev=solidlayer.Effects.property("Slider Control "+sliderlength+"").property("Slider").value;
            solidlayer.Effects.property("Slider Control "+sliderlength+"").property("Slider").setValueAtTime(((time*frameps-1)/frameps), barlengthprev);
            solidlayer.Effects.property("Slider Control "+sliderlength+"").property("Slider").setValueAtTime(time, barlength);
            solidlayer.Effects.property("Slider Control "+sliderlength+"").property("Slider").setValueAtTime(markertime.value, barlength);
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
    
    //var eta30 = eta60/2;
    
    
    //        !!!NPUT HERE!!!
    var tresh  = 17;
    var frameps = 60;
    var startscan=(comp.workAreaStart)*frameps;
    var endscan=(comp.workAreaStart+comp.workAreaDuration)*frameps;
    //alert(startscan);
    //alert(endscan);
    var durationscan=endscan-startscan;
    var eta60 = (durationscan/3600);
    alert("There are " +durationscan + "keyframe, ETA: "+eta60+" minutes on 60FPS");




    while (startscan<endscan){
        slider.expression = "thisComp.layer('"+layername+"').effect('Both Channels')('Slider').key("+startscan+");";
        slidertime.expression = "thisComp.layer('"+layername+"').effect('Both Channels')('Slider').key("+startscan+").time;";
        
        if (slider.value>tresh){
            var startmaker=slidertime.value;
            while(slider.value>tresh){
                slider.expression = "thisComp.layer('"+layername+"').effect('Both Channels')('Slider').key("+startscan+");";
                slidertime.expression = "thisComp.layer('"+layername+"').effect('Both Channels')('Slider').key("+startscan+").time;";
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
function actionbutton3(){
    //EDIT VALUR HERE
    var valpersec = 0.05;
    var sliderdivider = 15;
    var frameps = 60;


    //END OF EDIT VALUE HERE
    var comp=app.project.activeItem;
    
    var select=comp.selectedLayers;
    var layer=select[0];
    //var tempNull = comp.layers.addNull(comp.duration);
    
    layer.Effects.addProperty("Slider Control");
    layer.Effects.addProperty("Slider Control");
    var sliderex=layer.Effects.property("Slider Control").property("Slider");
    var slider = layer.Effects.property("Slider Control 2").property("Slider");
    
    var startscan=comp.workAreaStart*frameps;
    
    var endscan=(comp.workAreaStart+comp.workAreaDuration)*frameps;
    var slidervalue=0;
    
    
    //alert(startscan);
    while (startscan<endscan){
        layer.Effects.property("Slider Control").property("Slider").expression="effect('Sound Keys')('Output 1').key("+(startscan+1)+");";
        var probe=layer.Effects.property("Slider Control").property("Slider").value;
        slidervalue=probe/sliderdivider+slidervalue+valpersec;
        //probe+slidervalue+1
        layer.Effects.property("Slider Control 2").property("Slider").setValueAtTime(startscan/frameps, slidervalue);
        startscan++;
        
        
        
        
    }
    alert(startscan);
    
}












function actionbutton4(){
    // alert ("Test");
    //INSERT VALUE HERE!!!
 
    var xstart= 1920;
    var xend=0;      //ENDING POS
    var screenduration = 1.5;
    var frameps = 60;
    var scanstart=1;
    var midilayercount=5; //KEKETATAN LAYER
    var x=0;
    var yaxis=540; //EDIT BUAT PINDAH POS<<
    var midilayernum = 5; //EDIT KLO BANYAK LAYER<<
    

    //END OF INSERT VALUE
     var select=comp.selectedLayers;
     var layer=select[0];
     var layerindex=layer.index;
     var layername = layer.name;
     var solidlayer = comp.layers.addSolid([1, 1, 1], "midicontrol"+midilayernum+"", 100, 100, 1.0);
     solidlayer.Effects.addProperty("Slider Control");
     var slider = solidlayer.Effects.property("Slider Control").property("Slider");
     var solidname=solidlayer.name;
     slider.expression = "thisComp.layer('"+layername+"').marker.numKeys;";
     var result = slider.value;
     
     var layerindex=solidlayer.index+midilayercount;
     //var sliderlength = solidlayer.Effects.property("Slider Control").property("Slider");
     while (x<midilayercount){
         solidlayer.Effects.addProperty("Slider Control");
         x++;
         var miditiles = comp.layers.addSolid([1, 1, 1], "midi tiles"+x+"", 100, 100, 1.0);
         var miditilespos = miditiles.property("ADBE Transform Group").property("ADBE Position");
         var miditilesop = miditiles.property("ADBE Transform Group").property("ADBE Opacity");
         var miditilescale = miditiles.property("ADBE Transform Group").property("ADBE Scale");
         var control=x+2;
         var scalecontrol=x+midilayercount+2;
         
         miditilespos.expression = "x=thisComp.layer('"+solidname+"').effect('Slider Control "+control+"')('Slider');[x,"+yaxis+"];";
         miditilescale.expression = "x=thisComp.layer('"+solidname+"').effect('Slider Control "+scalecontrol+"')('Slider');[x, 100];"
         miditilesop.expression = "if (transform.position[0]=="+xend+"){value=0}";
     }
     while (x<(midilayercount*2)+1){
         solidlayer.Effects.addProperty("Slider Control");
         x++;
     }
     var sliderselect=3;
     var prevtime=0;
     
     //var makertime=0;
     // alert ("controller created")
     // solidlayer.Effects.property("Slider Control").property("Slider").expression = "thisComp.layer('"+layername+"').marker.key("+scanstart+").time;";
     // var apalah = solidlayer.Effects.property("Slider Control").property("Slider");
     // alert(apalah.value);
 
     // solidlayer.Effects.property("Slider Control 2").property("Slider").expression = "thisComp.layer('"+layername+"').marker.key("+scanstart+").duration;";
     // var barlength=(solidlayer.Effects.property("Slider Control 2").property("Slider").value)/screenduration*(xstart-xend)/100;
     // alert (barlength);
 
     var markdur=0;
     var markertime=0;
     app.beginUndoGroup("Undome");
     

     while (scanstart<result){

        if (scanstart%2==1){
            solidlayer.Effects.property("Slider Control").property("Slider").expression = "thisComp.layer('"+layername+"').marker.key("+scanstart+").time;";
            markertime = solidlayer.Effects.property("Slider Control").property("Slider").value;
            markdur=solidlayer.Effects.property("Slider Control").property("Slider").value;
        }
        else{
            solidlayer.Effects.property("Slider Control").property("Slider").expression = "thisComp.layer('"+layername+"').marker.key("+scanstart+").time;";
            markdur=solidlayer.Effects.property("Slider Control").property("Slider").value-markdur;


            if ((markertime-prevtime)>screenduration){
                var time=(markertime)-screenduration;
                var sliderlength=sliderselect+midilayercount;
                solidlayer.Effects.property("Slider Control 2").property("Slider").expression = "["+markdur+"];";
                var barlength=(solidlayer.Effects.property("Slider Control 2").property("Slider").value)/screenduration*(1920/2);
                var barlengthprev=solidlayer.Effects.property("Slider Control "+sliderlength+"").property("Slider").value;
                solidlayer.Effects.property("Slider Control "+sliderlength+"").property("Slider").setValueAtTime(((time*frameps-1)/frameps), barlengthprev);
                solidlayer.Effects.property("Slider Control "+sliderlength+"").property("Slider").setValueAtTime(time, barlength);
                solidlayer.Effects.property("Slider Control "+sliderlength+"").property("Slider").setValueAtTime(markertime, barlength);
                solidlayer.Effects.property("Slider Control "+sliderselect+"").property("Slider").setValueAtTime(((time*frameps-1)/frameps), xend);
                solidlayer.Effects.property("Slider Control "+sliderselect+"").property("Slider").setValueAtTime(time, xstart);
                solidlayer.Effects.property("Slider Control "+sliderselect+"").property("Slider").setValueAtTime(markertime, xend);
                
                prevtime=markertime.value;
            }
            else {
                sliderselect++;
                
                if (sliderselect>(midilayercount+2)){
                    sliderselect=3;
                }
                var sliderlength=sliderselect+midilayercount;
                var time=markertime-screenduration;
                solidlayer.Effects.property("Slider Control 2").property("Slider").expression = "["+markdur+"];";
                var barlength=(solidlayer.Effects.property("Slider Control 2").property("Slider").value)/screenduration*(1920)/2;
                var barlengthprev=solidlayer.Effects.property("Slider Control "+sliderlength+"").property("Slider").value;
                solidlayer.Effects.property("Slider Control "+sliderlength+"").property("Slider").setValueAtTime(((time*frameps-1)/frameps), barlengthprev);
                solidlayer.Effects.property("Slider Control "+sliderlength+"").property("Slider").setValueAtTime(time, barlength);
                solidlayer.Effects.property("Slider Control "+sliderlength+"").property("Slider").setValueAtTime(markertime, barlength);
                solidlayer.Effects.property("Slider Control "+sliderselect+"").property("Slider").setValueAtTime(((time*frameps-1)/frameps), xend);
                solidlayer.Effects.property("Slider Control "+sliderselect+"").property("Slider").setValueAtTime(time, xstart);
                solidlayer.Effects.property("Slider Control "+sliderselect+"").property("Slider").setValueAtTime(markertime, xend);
                prevtime=markertime.value;
                
    
            
            }
            

        }
         
         
         
         

         
         //alert(markertime.value);
         
         
         scanstart++;
     }
     app.endUndoGroup();
 
 
     
 
 
 }












 function actionbutton5(){

    
    var midilayernum=9;
    var select=comp.selectedLayers;
    var layer=select[0];
    var layername=layer.name;
    var solidlayer = comp.layers.addSolid([1, 1, 1], "midicontrol"+midilayernum+"", 100, 100, 1.0);
    solidlayer.Effects.addProperty("Slider Control");
    solidlayer.Effects.addProperty("Slider Control");
    var slider = solidlayer.Effects.property("Slider Control").property("Slider");
    
    slider.expression = "thisComp.layer('"+layername+"').marker.numKeys;";
    var result = slider.value;

    var markertime=0;
    var frameps=60;
    var scanstart=1;
    //alert ("test");
    while (scanstart<result){

        if (scanstart%2==1){
            solidlayer.Effects.property("Slider Control").property("Slider").expression = "thisComp.layer('"+layername+"').marker.key("+scanstart+").time;";
            markertime = solidlayer.Effects.property("Slider Control").property("Slider").value; //save value ganjil
            
            
        }
        else{
            solidlayer.Effects.property("Slider Control").property("Slider").expression = "thisComp.layer('"+layername+"').marker.key("+scanstart+").time;";
            var timegenap= solidlayer.Effects.property("Slider Control").property("Slider").value;
            var zeroganjil=(((markertime*frameps)-1)/frameps);
            var zerogenap=(((timegenap*frameps)+1)/frameps);
            solidlayer.Effects.property("Slider Control 2").property("Slider").setValueAtTime(zeroganjil, 0);
            solidlayer.Effects.property("Slider Control 2").property("Slider").setValueAtTime(markertime, 100);
            solidlayer.Effects.property("Slider Control 2").property("Slider").setValueAtTime(timegenap, 100);
            solidlayer.Effects.property("Slider Control 2").property("Slider").setValueAtTime(zerogenap, 0);

        }
        scanstart++;
        
    }

   
     
 }