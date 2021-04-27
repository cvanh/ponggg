window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented)  return;    
    
    var handled = false;
    if (event.key !== undefined) {
        dispatchEvent( new CustomEvent('KEY_DOWN', {detail: event.key}) );
        handled = true;        
    } else if (event.keyCode !== undefined) {
        dispatchEvent( new CustomEvent('KEY_DOWN', {detail: event.keyCode}) );
        handled = true;
    }
    
    if (handled)  event.preventDefault(); 
}, true);

window.addEventListener("keyup", function (event) {
    if (event.defaultPrevented)  return;    
    
    var handled = false;
    if (event.key !== undefined) {
        dispatchEvent( new CustomEvent('KEY_UP', {detail: event.key}) );
        handled = true;        
    } else if (event.keyCode !== undefined) {
        dispatchEvent( new CustomEvent('KEY_UP', {detail: event.keyCode}) );
        handled = true;
    }
    
    if (handled)  event.preventDefault(); 
}, true);

window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60)
};

window.getRandomNumBetween = function(min, max) {
    return Math.floor(Math.random()*(max-min + 1))+min;
}