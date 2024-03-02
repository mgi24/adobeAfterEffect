// BAR GENERATOR BY MMV
var mywindow = new Window("palette","BAR GENERATOR", undefined);
mywindow.orientation = "column";
//WINDOW LAYOUT
var panel1 = mywindow.add("panel", undefined,"Keyframe Treshold Value");
panel1.orientation="row";
var beatval = panel1.add("edittext", undefined, "beat");
var kickval = panel1.add("edittext", undefined, "kick");
var panel = mywindow.add("panel", undefined, "Scan the beat, click keyframe layer 1st");
panel.orientation = "row";
var group = mywindow.add("group", undefined, "");
group.orientation="row";
var buttonone = panel.add("button", undefined,"VIA KEYFRAME");
var buttontwo = panel.add("button", undefined,"VIA MARKER");
var buttonthree = panel.add("button", undefined,"TEST");
mywindow.center();
mywindow.show();

//VAR CONTROLLER
var layertotal = 1;



//BUTTON CONTROLLER
buttonone.onClick = function(){
    actionbutton1();
}
buttontwo.onClick = function(){
    actionbutton2();
}
buttonthree.onClick = function(){
    actionbutton3();
}
//ButtonOne
function actionbutton1(){
    //VAR CONTROLLER (EDIT IF NEEDED)
    var fps = 60;
    var oneframe = 1/fps;
    var beatsensitivity = parseInt(beatval.text);
    var videowidth = 1920;
    var bartime = 1; //second
    var keyframelayer = "effect('Sound Keys')('Output 2')";
    var keyframeeffect = "Sound Keys";
    var keyframevar = "Output 2";
    //SELECT ACTIVE PROJECT
    var comp=app.project.activeItem;
    //SELECT LAYER
    var select=comp.selectedLayers;
    var layer=select[0];
    //CALL LAYER
    var layername = layer.name;
    var layerindex=layer.index;
    //CHECK HOW LONG THE KEYFRAME
    layer.Effects.addProperty("Slider Control");
    layer.Effects.property("Slider Control").property("Slider").expression=""+keyframelayer+".numKeys;"
    var numkey=layer.Effects.property("Slider Control").property("Slider").value;
    layer.Effects.property('Slider Control').remove();
    //PREP THE SCAN
    var scannum = 1;
    var ishold = false;
    var beattime = 0;
    var writetoslide = 1;
    var totallayer = 1;//for slider
    //SCAN RESULT VAR
    layer.Effects.addProperty("Slider Control"); //READER
    layer.Effects.addProperty("Slider Control"); //WRITER
    
    layer.Effects.addProperty("Slider Control").name="POS "+writetoslide+"";
    layer.Effects.addProperty("Slider Control").name="LENGTH "+writetoslide+"";
    //SCAN
    
    while (scannum<numkey){
        var amplitude = layer.Effects.property(keyframeeffect).property(keyframevar).keyValue(scannum);
        var timekey =  layer.Effects.property(keyframeeffect).property(keyframevar).keyTime(scannum);
        if (amplitude>beatsensitivity&&ishold==false){
            ishold=true;
            beattime = timekey;
            
        }
        if (amplitude<beatsensitivity&&ishold==true){
            writetoslide = 1;
            var barlength = videowidth/bartime*(timekey-beattime);
            layer.Effects.property("Slider Control 2").property('Slider').setValueAtTime(beattime-oneframe,0);
            layer.Effects.property("Slider Control 2").property('Slider').setValueAtTime(beattime,barlength);
            layer.Effects.property("Slider Control 2").property('Slider').setValueAtTime(timekey,barlength);
            layer.Effects.property("Slider Control 2").property('Slider').setValueAtTime(timekey+oneframe,0);
            ishold = false;

            layer.Effects.property("Slider Control").property('Slider').expression="effect('POS "+writetoslide+"')('Slider').valueAtTime("+(beattime-bartime)+");";
            var slidevalue = layer.Effects.property('Slider Control').property('Slider').value;
            if (slidevalue==0){
                layer.Effects.property("LENGTH "+writetoslide+"").property('Slider').setValueAtTime(beattime-bartime-oneframe,0);
                layer.Effects.property("LENGTH "+writetoslide+"").property('Slider').setValueAtTime(beattime-bartime,barlength);
                layer.Effects.property("LENGTH "+writetoslide+"").property('Slider').setValueAtTime(timekey,barlength);
                layer.Effects.property("LENGTH "+writetoslide+"").property('Slider').setValueAtTime(timekey+oneframe,0);
                layer.Effects.property("POS "+writetoslide+"").property('Slider').setValueAtTime(beattime-bartime,0);
                layer.Effects.property("POS "+writetoslide+"").property('Slider').setValueAtTime(timekey,1920+barlength);
                layer.Effects.property("POS "+writetoslide+"").property('Slider').setValueAtTime(timekey+oneframe,0);
            }
            else{
                while(slidevalue>0){
                    writetoslide++;
                    if(writetoslide>totallayer){
                        totallayer = writetoslide;
                        layertotal = writetoslide;
                        layer.Effects.addProperty("Slider Control").name="POS "+writetoslide+"";
                        layer.Effects.addProperty("Slider Control").name="LENGTH "+writetoslide+"";
                    }
                    layer.Effects.property("Slider Control").property('Slider').expression="effect('POS "+writetoslide+"')('Slider').valueAtTime("+(beattime-bartime)+");";
                    slidevalue = layer.Effects.property('Slider Control').property('Slider').value;
                }
                layer.Effects.property("LENGTH "+writetoslide+"").property('Slider').setValueAtTime(beattime-bartime-oneframe,0);
                layer.Effects.property("LENGTH "+writetoslide+"").property('Slider').setValueAtTime(beattime-bartime,barlength);
                layer.Effects.property("LENGTH "+writetoslide+"").property('Slider').setValueAtTime(timekey,barlength);
                layer.Effects.property("LENGTH "+writetoslide+"").property('Slider').setValueAtTime(timekey+oneframe,0);
                layer.Effects.property("POS "+writetoslide+"").property('Slider').setValueAtTime(beattime-bartime,0);
                layer.Effects.property("POS "+writetoslide+"").property('Slider').setValueAtTime(timekey,1920+barlength);
                layer.Effects.property("POS "+writetoslide+"").property('Slider').setValueAtTime(timekey+oneframe,0);
            }
            
        }
        scannum++;
    }
    scannum=1;
    alert("scan done");

}
function actionbutton2(){
    //SELECT ACTIVE PROJECT
    var comp=app.project.activeItem;
    var select=comp.selectedLayers;
    var layer=select[0];
    layer.Effects.addProperty("Slider Control");//control
    layer.Effects.addProperty("Slider Control");//memory
    layer.Effects.property("Slider Control").property('Slider').expression="thisLayer.marker.numKeys";
    //VAR CONTROLLER
    var keytotal = layer.Effects.property("Slider Control").property('Slider').value;
    var scan = 1;
    var ishold = false;
    var videowidth = 1920;
    var bartime = 1;//second
    var fps = 60;
    var oneframe = 1/fps;
    var writetoslide=1;
    var totallayer=1;
    layer.Effects.addProperty("Slider Control").name="POS "+writetoslide+"";
    layer.Effects.addProperty("Slider Control").name="LENGTH "+writetoslide+"";
    //scan
    while(scan<keytotal){
        var timekey =  layer.marker.keyTime(scan);
        //alert(timekey);
        if (scan%2==1){            
            beattime = timekey;
        }
        else{
            writetoslide = 1;
            var barlength = videowidth/bartime*(timekey-beattime);
            layer.Effects.property("Slider Control 2").property('Slider').setValueAtTime(beattime,barlength);
            layer.Effects.property("Slider Control 2").property('Slider').setValueAtTime(timekey,barlength);
            layer.Effects.property("Slider Control 2").property('Slider').setValueAtTime(timekey+oneframe,0);
            layer.Effects.property("Slider Control").property('Slider').expression="effect('POS "+writetoslide+"')('Slider').valueAtTime("+(beattime-bartime)+");";
            var slidevalue = layer.Effects.property('Slider Control').property('Slider').value;
            if (slidevalue==0){
                
                layer.Effects.property("LENGTH "+writetoslide+"").property('Slider').setValueAtTime(beattime-bartime,barlength);
                layer.Effects.property("LENGTH "+writetoslide+"").property('Slider').setValueAtTime(timekey,barlength);
                layer.Effects.property("LENGTH "+writetoslide+"").property('Slider').setValueAtTime(timekey+oneframe,0);
                layer.Effects.property("POS "+writetoslide+"").property('Slider').setValueAtTime(beattime-bartime,0);
                layer.Effects.property("POS "+writetoslide+"").property('Slider').setValueAtTime(timekey,1920+barlength);
                layer.Effects.property("POS "+writetoslide+"").property('Slider').setValueAtTime(timekey+oneframe,0);
            }
            else{
                while(slidevalue>0){
                    writetoslide++;
                    if(writetoslide>totallayer){
                        totallayer = writetoslide;
                        layertotal = writetoslide;
                        layer.Effects.addProperty("Slider Control").name="POS "+writetoslide+"";
                        layer.Effects.addProperty("Slider Control").name="LENGTH "+writetoslide+"";
                    }
                    layer.Effects.property("Slider Control").property('Slider').expression="effect('POS "+writetoslide+"')('Slider').valueAtTime("+(beattime-bartime)+");";
                    slidevalue = layer.Effects.property('Slider Control').property('Slider').value;
                }
                
                layer.Effects.property("LENGTH "+writetoslide+"").property('Slider').setValueAtTime(beattime-bartime,barlength);
                layer.Effects.property("LENGTH "+writetoslide+"").property('Slider').setValueAtTime(timekey,barlength);
                layer.Effects.property("LENGTH "+writetoslide+"").property('Slider').setValueAtTime(timekey+oneframe,0);
                layer.Effects.property("POS "+writetoslide+"").property('Slider').setValueAtTime(beattime-bartime,0);
                layer.Effects.property("POS "+writetoslide+"").property('Slider').setValueAtTime(timekey,1920+barlength);
                layer.Effects.property("POS "+writetoslide+"").property('Slider').setValueAtTime(timekey+oneframe,0);

            }
        }
        scan++;
    }
    alert("Scan done");
    
}
function actionbutton3(){
    var comp=app.project.activeItem;
    var select=comp.selectedLayers;
    var layer=select[0];
    alert(layer.marker.keyTime(1));
}