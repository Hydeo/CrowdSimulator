var ts = new Tileset("tiles.png");
var map = new MapReader("map");

window.onload = function(){
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    
    canvas.width  = map.getLargeur() * 26;
	canvas.height = map.getHauteur() * 26;
    
    map.dessinerMap(ctx);
}