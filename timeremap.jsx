// AE INJECTOR BY MMV
var mywindow = new Window("palette","TIME REMAPPER", undefined);
//MAKE THE WINDOW
mywindow.orientation = "column";
var panel1 = mywindow.add("panel", undefined,"Change Value Based on Beat Level");
panel1.orientation="row";

var beatval = panel1.add("edittext", undefined, "beat");
var kickval = panel1.add("edittext", undefined, "kick");
var panel = mywindow.add("panel", undefined, "Scan the beat, click layer beat dulu");
panel.orientation = "row";


var text2 = mywindow.add("statictext", undefined,"idk what it is used for");
var group2 = mywindow.add("group", undefined, "");

group2.orientation="row";
var buttonone = panel.add("button", undefined,"SCAN BEAT");
var buttontwo = panel.add("button", undefined,"SCAN KICK");
var buttonthree = panel.add("button", undefined,"TEST");

var buttonfour = group2.add("button", undefined,"");
var buttonfive = group2.add("button", undefined,"");
mywindow.center();
mywindow.show();

//USE OBJECT BASED PROGRAMMING
buttonone.onClick = function(){
    
    actionbutton1();

}
buttontwo.onClick = function(){
    
    actionbutton2();

}
buttonthree.onClick = function(){
    
    actionbutton3();

}

//ONE OF OBJECT
function actionbutton1(){
    //>>>>>>>>EDIT THIS FOR BEAT<<<<<<<<
    var fps = 30;
    var beatsensitivity = parseInt(beatval.text);
    var cliplength = 10.9;
    var delay = 1.7;
    var amplitudetoscan = "effect('Sound Keys')('Output 1')";
    var specificscan = 'Sound Keys';
    var specificscan1 = 'Output 1';

    //SELECT ACTIVE PROJECT
    var comp=app.project.activeItem;
    //SELECT LAYER
    var select=comp.selectedLayers;
    var layer=select[0];
    //CALL LAYER
    var layername = layer.name;
    var layerindex=layer.index;
    //HOW MANY KEYFRAME THERE? (USUALLY 1 KEYFRAME / FRAME)
    layer.Effects.addProperty("Slider Control");
    layer.Effects.property("Slider Control").property("Slider").expression=""+amplitudetoscan+".numKeys;"
    var numkey=layer.Effects.property("Slider Control").property("Slider").value;
    layer.Effects.property('Slider Control').remove();
    //PREP THE SCAN
    var scan=1;
    var beatcount=0; //How many beats per segment
    var largestbeat = 0; //decide how many slider needed
    var hold=false;
    var endtime = 0;
    var oneframe = 1/fps;
    //SCAN RESULT
    layer.Effects.addProperty("Slider Control"); //READER
    layer.Effects.addProperty("Slider Control"); //CONTROL IS USED?
    layer.Effects.addProperty("Slider Control"); //BEAT CHECKER
    layer.Effects.property("Slider Control 2").property('Slider').setValueAtTime(0,0); //startvalue
    layer.Effects.property("Slider Control 3").property('Slider').setValueAtTime(0,0); //startvalue
    
    
    //SCAN LAYER

    while (scan<numkey){
        var amplitude = layer.Effects.property(specificscan).property(specificscan1).keyValue(scan);
        
       //SEGMENT BASED ON TIME OF CLIPLENGTH
            
            
                
                var timekey = layer.Effects.property(specificscan).property(specificscan1).keyTime(scan);
                layer.Effects.property("Slider Control").property('Slider').expression="effect('Slider Control 2')('Slider').valueAtTime("+timekey+");"
                var freelayer= layer.Effects.property("Slider Control").property('Slider').value;
                
                
                if (freelayer==0){
                    //CREATE KEYFRAME SLIDER IN USE OR NOT?
                    //layer.Effects.property("Slider Control 2").property('Slider').setValueAtTime(timekey-oneframe,0);
                    layer.Effects.property("Slider Control 2").property('Slider').setValueAtTime(timekey+oneframe,100);
                    layer.Effects.property("Slider Control 2").property('Slider').setValueAtTime(timekey+cliplength,100);
                    layer.Effects.property("Slider Control 2").property('Slider').setValueAtTime(timekey+cliplength+oneframe,0);
                    endtime = timekey + cliplength;


                    
                }
                
                
            
            
        
        
        scan++;
    }
    
    //RESET VALUE, START SCAN 2
    scan=1;
    hold=false;
    var holdbeat=false;
    //SLIDER FOR SAVING HOW MANY BEAT PER SEGMENT
    layer.Effects.addProperty("Slider Control"); 
    

    //SCAN NO 2 TO COUNT BEAT / SEGMENT

    while (scan < numkey){
        var timekey = layer.Effects.property(specificscan).property(specificscan1).keyTime(scan);
        var amplitude = layer.Effects.property(specificscan).property(specificscan1).keyValue(scan);
        layer.Effects.property("Slider Control").property('Slider').expression="effect('Slider Control 2')('Slider').valueAtTime("+timekey+");"
        var value = layer.Effects.property('Slider Control').property('Slider').value;
        if (value==100){

            if (hold==false){//HOLD FOR SEGMENT
                hold = true;
                
            }
            else{
                if (amplitude>beatsensitivity){
                    if (holdbeat==false){ //HOLD FOR EVERY BEAT
                         holdbeat=true;
                         beatcount++
                         layer.Effects.property('Slider Control 4').property('Slider').setValueAtTime(timekey, beatcount);
                         layer.Effects.property("Slider Control 3").property('Slider').setValueAtTime(timekey-oneframe,0);
                         layer.Effects.property("Slider Control 3").property('Slider').setValueAtTime(timekey,50);
                    }
                 }
                 else{
                     if (holdbeat==true){
                         holdbeat=false;
                        layer.Effects.property("Slider Control 3").property('Slider').setValueAtTime(timekey-oneframe,50);
                        layer.Effects.property("Slider Control 3").property('Slider').setValueAtTime(timekey,0);
                     }
                     
                 }
            }
            
            
            

        }
        else{
            if (hold == true){
                //COMMIT MAX NUMBER BEAT PER SEGMENT TO DECIDE SLIDER COUNT
                if (beatcount>largestbeat){
                    largestbeat=beatcount;
                    
                }
                beatcount =0;
                hold=false;
            }         
        }
        


        scan++;
    }

    //INJECT SLIDER 4 VAL TO ALL LAYER
    layer.Effects.addProperty("Slider Control"); 
    var totallayer=5;
    layer.Effects.property("Slider Control").property("Slider").expression="effect('Slider Control 4')('Slider').numKeys;"
    var totalkeyframe=layer.Effects.property("Slider Control").property("Slider").value;
    var scan=1;
    while (scan<totalkeyframe+1){
        var timekey = layer.Effects.property('Slider Control 4').property('Slider').keyTime(scan);
        layer.Effects.property("Slider Control").property('Slider').expression="effect('Slider Control "+writetoslide+"')('Slider').valueAtTime("+(timekey+delay-cliplength)+");";
        var value = layer.Effects.property('Slider Control').property('Slider').value;
        var writetoslide = 5;
        if (value==0){
            layer.Effects.property("Slider Control "+writetoslide+"").property('Slider').setValueAtTime(timekey+delay-cliplength,0);
            layer.Effects.property("Slider Control "+writetoslide+"").property('Slider').setValueAtTime(timekey+delay,cliplength);
            layer.Effects.property("Slider Control "+writetoslide+"").property('Slider').setValueAtTime(timekey+delay+oneframe,0);
        }
        else{
            while(value>0){
                writetoslide++
                layer.Effects.property("Slider Control").property('Slider').expression="effect('Slider Control "+writetoslide+"')('Slider').valueAtTime("+(timekey+delay-cliplength)+");";
                value = layer.Effects.property('Slider Control').property('Slider').value;
                if(writetoslide>totallayer){
                    totallayer=writetoslide;
                    layer.Effects.addProperty("Slider Control"); 
                }
            }
            
            layer.Effects.property("Slider Control "+writetoslide+"").property('Slider').setValueAtTime(timekey+delay-cliplength,0);
            layer.Effects.property("Slider Control "+writetoslide+"").property('Slider').setValueAtTime(timekey+delay,cliplength);
            layer.Effects.property("Slider Control "+writetoslide+"").property('Slider').setValueAtTime(timekey+delay+oneframe,0);
        }
        scan++;
    }
    alert("DONE???");
    
}
function actionbutton2(){
    //>>>>>>>>EDIT THIS FOR KICK <<<<<<<<
    var fps = 30;
    var beatsensitivity = parseInt(kickval.text);
    
    var cliplength = 10.9;
    var delay = 1.7;
    var amplitudetoscan = "effect('Sound Keys')('Output 2')";
    var specificscan = 'Sound Keys';
    var specificscan1 = 'Output 2';

    //SELECT ACTIVE PROJECT
    var comp=app.project.activeItem;
    //SELECT LAYER
    var select=comp.selectedLayers;
    var layer=select[0];
    //CALL LAYER
    var layername = layer.name;
    var layerindex=layer.index;
    //HOW MANY KEYFRAME THERE? (USUALLY 1 KEYFRAME / FRAME)
    layer.Effects.addProperty("Slider Control");
    layer.Effects.property("Slider Control").property("Slider").expression=""+amplitudetoscan+".numKeys;"
    var numkey=layer.Effects.property("Slider Control").property("Slider").value;
    layer.Effects.property('Slider Control').remove();
    //PREP THE SCAN
    var scan=1;
    var beatcount=0; //How many beats per segment
    var largestbeat = 0; //decide how many slider needed
    var hold=false;
    var endtime = 0;
    var oneframe = 1/fps;
    //SCAN RESULT
    layer.Effects.addProperty("Slider Control"); //READER
    layer.Effects.addProperty("Slider Control"); //CONTROL IS USED?
    layer.Effects.addProperty("Slider Control"); //BEAT CHECKER
    layer.Effects.property("Slider Control 2").property('Slider').setValueAtTime(0,0); //startvalue
    layer.Effects.property("Slider Control 3").property('Slider').setValueAtTime(0,0); //startvalue
    
    
    //SCAN LAYER

    while (scan<numkey){
        var amplitude = layer.Effects.property(specificscan).property(specificscan1).keyValue(scan);
        
       //SEGMENT BASED ON TIME OF CLIPLENGTH
            
            
                
                var timekey = layer.Effects.property(specificscan).property(specificscan1).keyTime(scan);
                layer.Effects.property("Slider Control").property('Slider').expression="effect('Slider Control 2')('Slider').valueAtTime("+timekey+");"
                var freelayer= layer.Effects.property("Slider Control").property('Slider').value;
                
                
                if (freelayer==0){
                    //CREATE KEYFRAME SLIDER IN USE OR NOT?
                    //layer.Effects.property("Slider Control 2").property('Slider').setValueAtTime(timekey-oneframe,0);
                    layer.Effects.property("Slider Control 2").property('Slider').setValueAtTime(timekey+oneframe,100);
                    layer.Effects.property("Slider Control 2").property('Slider').setValueAtTime(timekey+cliplength,100);
                    layer.Effects.property("Slider Control 2").property('Slider').setValueAtTime(timekey+cliplength+oneframe,0);
                    endtime = timekey + cliplength;


                    
                }
                
                
            
            
        
        
        scan++;
    }
    
    //RESET VALUE, START SCAN 2
    scan=1;
    hold=false;
    var holdbeat=false;
    //SLIDER FOR SAVING HOW MANY BEAT PER SEGMENT
    layer.Effects.addProperty("Slider Control"); 
    

    //SCAN NO 2 TO COUNT BEAT / SEGMENT

    while (scan < numkey){
        var timekey = layer.Effects.property(specificscan).property(specificscan1).keyTime(scan);
        var amplitude = layer.Effects.property(specificscan).property(specificscan1).keyValue(scan);
        layer.Effects.property("Slider Control").property('Slider').expression="effect('Slider Control 2')('Slider').valueAtTime("+timekey+");"
        var value = layer.Effects.property('Slider Control').property('Slider').value;
        if (value==100){

            if (hold==false){//HOLD FOR SEGMENT
                hold = true;
                
            }
            else{
                if (amplitude>beatsensitivity){
                    if (holdbeat==false){ //HOLD FOR EVERY BEAT
                         holdbeat=true;
                         beatcount++
                         layer.Effects.property('Slider Control 4').property('Slider').setValueAtTime(timekey, beatcount);
                         layer.Effects.property("Slider Control 3").property('Slider').setValueAtTime(timekey-oneframe,0);
                         layer.Effects.property("Slider Control 3").property('Slider').setValueAtTime(timekey,50);
                    }
                 }
                 else{
                     if (holdbeat==true){
                         holdbeat=false;
                        layer.Effects.property("Slider Control 3").property('Slider').setValueAtTime(timekey-oneframe,50);
                        layer.Effects.property("Slider Control 3").property('Slider').setValueAtTime(timekey,0);
                     }
                     
                 }
            }
            
            
            

        }
        else{
            if (hold == true){
                //COMMIT MAX NUMBER BEAT PER SEGMENT TO DECIDE SLIDER COUNT
                if (beatcount>largestbeat){
                    largestbeat=beatcount;
                    
                }
                beatcount =0;
                hold=false;
            }         
        }
        


        scan++;
    }

    //INJECT SLIDER 4 VAL TO ALL LAYER
    layer.Effects.addProperty("Slider Control"); 
    var totallayer=5;
    layer.Effects.property("Slider Control").property("Slider").expression="effect('Slider Control 4')('Slider').numKeys;"
    var totalkeyframe=layer.Effects.property("Slider Control").property("Slider").value;
    var scan=1;
    while (scan<totalkeyframe+1){
        var timekey = layer.Effects.property('Slider Control 4').property('Slider').keyTime(scan);
        layer.Effects.property("Slider Control").property('Slider').expression="effect('Slider Control "+writetoslide+"')('Slider').valueAtTime("+(timekey+delay-cliplength)+");";
        var value = layer.Effects.property('Slider Control').property('Slider').value;
        var writetoslide = 5;
        if (value==0){
            layer.Effects.property("Slider Control "+writetoslide+"").property('Slider').setValueAtTime(timekey+delay-cliplength,0);
            layer.Effects.property("Slider Control "+writetoslide+"").property('Slider').setValueAtTime(timekey+delay,cliplength);
            layer.Effects.property("Slider Control "+writetoslide+"").property('Slider').setValueAtTime(timekey+delay+oneframe,0);
        }
        else{
            while(value>0){
                writetoslide++
                layer.Effects.property("Slider Control").property('Slider').expression="effect('Slider Control "+writetoslide+"')('Slider').valueAtTime("+(timekey+delay-cliplength)+");";
                value = layer.Effects.property('Slider Control').property('Slider').value;
                if(writetoslide>totallayer){
                    totallayer=writetoslide;
                    layer.Effects.addProperty("Slider Control"); 
                }
            }
            
            layer.Effects.property("Slider Control "+writetoslide+"").property('Slider').setValueAtTime(timekey+delay-cliplength,0);
            layer.Effects.property("Slider Control "+writetoslide+"").property('Slider').setValueAtTime(timekey+delay,cliplength);
            layer.Effects.property("Slider Control "+writetoslide+"").property('Slider').setValueAtTime(timekey+delay+oneframe,0);
        }
        scan++;
    }
    alert("DONE???");
}
function actionbutton3(){
    
    alert(beatval.text);
}