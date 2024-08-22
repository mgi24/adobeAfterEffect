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
var buttonthree = panel.add("button", undefined,"APPLY TO LAYER");
var buttonfour = panel.add("button", undefined,"TEST");
var panel2 = mywindow.add("panel", undefined,"How many slider to apply");
var slidertoapply = panel2.add("edittext", undefined, "how much");
mywindow.center();
mywindow.show();

//VAR CONTROLLER
var layertotal = 1;
var videowidth = 3840;


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
buttonfour.onClick = function(){
    actionbutton4();
}
function actionbutton4(){
    var comp=app.project.activeItem;
    var select=comp.selectedLayers;
    var layer=select[0];
    var timekey =  layer.marker.keyTime(400);
    alert(timekey);
}
//ButtonOne
function actionbutton1(){
    //VAR CONTROLLER (EDIT IF NEEDED)
    var fps = 60;
    var oneframe = 1/fps;
    var beatsensitivity = parseInt(beatval.text);
    
    var bartime = 1; //second
    var keyframelayer = "effect('Sound Keys')('Output 1')";
    var keyframeeffect = "Sound Keys";
    var keyframevar = "Output 1";
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
                layer.Effects.property("POS "+writetoslide+"").property('Slider').setValueAtTime(timekey,videowidth+barlength);
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
                layer.Effects.property("POS "+writetoslide+"").property('Slider').setValueAtTime(timekey,videowidth+barlength);
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
    layer.Effects.addProperty("Slider Control");//control slider
    layer.Effects.addProperty("Slider Control");//memory slider
    layer.Effects.property("Slider Control").property('Slider').expression="thisLayer.marker.numKeys";//check how many markers
    //VAR CONTROLLER
    var keytotal = layer.Effects.property("Slider Control").property('Slider').value;//get marker count
    var scan = 1; //counter
    var ishold = false; 
    var bartime = 4;//second, change if you want slower or faster
    var fps = 60;
    var oneframe = 1/fps;
    var writetoslide=1; //write counter
    var totallayer=1; //slider needed for smooth operation
    layer.Effects.addProperty("Slider Control").name="POS "+writetoslide+""; //position keyframe
    layer.Effects.addProperty("Slider Control").name="LENGTH "+writetoslide+""; //length keyframe
    //scan
    while(scan<keytotal+1){
        var timekey =  layer.marker.keyTime(scan); //where is the time of the marker

        if (scan%2==1){ //if odd, insert beat time
            beattime = timekey;
        }
        else{ //if even, means the bar is stopped, now write the keyframe
            writetoslide = 1;
            var barlength = videowidth/bartime*(timekey-beattime);//explaied by var name
            layer.Effects.property("Slider Control 2").property('Slider').setValueAtTime(beattime,barlength);//just to visualize how the bar might look like
            layer.Effects.property("Slider Control 2").property('Slider').setValueAtTime(timekey,barlength);
            layer.Effects.property("Slider Control 2").property('Slider').setValueAtTime(timekey+oneframe,0);
            layer.Effects.property("Slider Control").property('Slider').expression="effect('POS "+writetoslide+"')('Slider').valueAtTime("+(beattime-bartime)+");";//checking if slider free or not
            var slidevalue = layer.Effects.property('Slider Control').property('Slider').value;
            if (slidevalue==0){//if slider is free, inject the value
                
                layer.Effects.property("LENGTH "+writetoslide+"").property('Slider').setValueAtTime(beattime-bartime,barlength);
                layer.Effects.property("LENGTH "+writetoslide+"").property('Slider').setValueAtTime(timekey,barlength);
                layer.Effects.property("LENGTH "+writetoslide+"").property('Slider').setValueAtTime(timekey+oneframe,0);
                layer.Effects.property("POS "+writetoslide+"").property('Slider').setValueAtTime(beattime-bartime,0);
                layer.Effects.property("POS "+writetoslide+"").property('Slider').setValueAtTime(timekey,videowidth+barlength);
                layer.Effects.property("POS "+writetoslide+"").property('Slider').setValueAtTime(timekey+oneframe,0);
            }
            else{//if slider is not free make new slider
                while(slidevalue>0){
                    writetoslide++;
                    if(writetoslide>totallayer){
                        totallayer = writetoslide;
                        layertotal = writetoslide;
                        layer.Effects.addProperty("Slider Control").name="POS "+writetoslide+"";
                        layer.Effects.addProperty("Slider Control").name="LENGTH "+writetoslide+"";
                    }
                    layer.Effects.property("Slider Control").property('Slider').expression="effect('POS "+writetoslide+"')('Slider').valueAtTime("+(beattime-bartime)+");";//check again if slider free or not
                    slidevalue = layer.Effects.property('Slider Control').property('Slider').value;
                }
                //inject the value again
                layer.Effects.property("LENGTH "+writetoslide+"").property('Slider').setValueAtTime(beattime-bartime,barlength);
                layer.Effects.property("LENGTH "+writetoslide+"").property('Slider').setValueAtTime(timekey,barlength);
                layer.Effects.property("LENGTH "+writetoslide+"").property('Slider').setValueAtTime(timekey+oneframe,0);
                layer.Effects.property("POS "+writetoslide+"").property('Slider').setValueAtTime(beattime-bartime,0);
                layer.Effects.property("POS "+writetoslide+"").property('Slider').setValueAtTime(timekey,videowidth+barlength);
                layer.Effects.property("POS "+writetoslide+"").property('Slider').setValueAtTime(timekey+oneframe,0);

            }
        }
        scan++;
    }
    alert("Scan done");
    
}
function actionbutton3(){
    layertotal = parseInt(slidertoapply.text);
    var comp=app.project.activeItem;
    var select=comp.selectedLayers;
    var targetlayer=select[0];
    var keyframelayer=select[1];
    var ancory = targetlayer.property("Anchor Point").value[1];
    targetlayer.property("Anchor Point").setValue([0, ancory]); // make sure frame 1, layer fully hidden in the right
    var xpos = targetlayer.property("Position").value[0]*2;
    var ypos = targetlayer.property("Position").value[1];
    targetlayer.property("Position").expression = "["+xpos+"-thisComp.layer('"+ keyframelayer.name +"').effect('POS 1')('Slider'),"+ypos+"];";
    targetlayer.property("Scale").expression = "[thisComp.layer('"+ keyframelayer.name +"').effect('LENGTH 1')('Slider'),100];";
    var index = 2;
    while (index<layertotal+1) {
        
        targetlayer.duplicate();
        targetlayer.property("Anchor Point").setValue([0, ancory]); // make sure frame 1, layer fully hidden in the right
        targetlayer.property("Position").expression = "["+xpos+"-thisComp.layer('"+ keyframelayer.name +"').effect('POS "+index+"')('Slider'),"+ypos+"];";
        targetlayer.property("Scale").expression = "[thisComp.layer('"+ keyframelayer.name +"').effect('LENGTH "+index+"')('Slider'),100];";
        index++;
    }
    
    alert("done!");
}