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

buttonone.onClick = function(){
    actionbutton1();

}
function actionbutton1(){
    alert("TEST");
}