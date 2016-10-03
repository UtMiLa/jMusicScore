
/*$(document).bind("touchstart touchmove", function(e) {  
  //Disable scrolling by preventing default touch behaviour  
  e.preventDefault();  
  var orig = e.originalEvent;  
  var x = orig.changedTouches[0].pageX;  
  var y = orig.changedTouches[0].pageY;  
  // Move a div with id "rect"  
  $("#rect").css({top: y, left: x});  
}); */

//$('#MusicLayer').overscroll();

//$('#MusicLayer').hammer({prevent_default: true,})
/*.bind("touchmove", function(e) {  
    //Disable scrolling by preventing default touch behaviour  
    e.preventDefault();  
})*/
/*.on("drag", function(event) {
    //$('#events').prepend('<li>drag'+event.gesture.deltaX+ ','+ event.gesture.eventType+ '</li>');
    //application.deltaScroll(event.gesture.deltaX);
    //application.scroll(event.clientX);
    //console.log(event.gesture.startEvent.touches.length)
    event.preventDefault();  
    application.scroll(event.gesture.deltaX + dragStartX);		
})
.on("touch", function(event) {
    //$('#events').prepend('<li>touch</li>');
    //event.preventDefault();  
    dragStartX = application.scoreOutput.getX();
})*/
/*.on("pinch", /*".nested_el", * /function(event) {
    $('#events').prepend('<li>pinch</li>');
})
.on("hold", /*".nested_el", * /function(event) {
    $('#events').prepend('<li>hold</li>');
})
.on("doubletap", /*".nested_el", * /function(event) {
    $('#events').prepend('<li>doubletap</li>');
})
.on("tap", /*".nested_el", * /function(event) {
    $('#events').prepend('<li>tap</li>');
})*/
/*.on("swipe", function(event) {
    $('#events').prepend('<li>swipe</li>');
    event.preventDefault();  
})
;*/