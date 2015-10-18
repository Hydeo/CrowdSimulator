var ts = new Tileset("tiles.png");
var map = new MapReader("map");
map.addPersonnage(new Personnage("pokemon", 2, 2, DIRECTION.BAS));
map.addPersonnage(new Personnage("pokemon", 2, 3, DIRECTION.HAUT));
map.addPersonnage(new Personnage("pokemon", 2, 4, DIRECTION.GAUCHE));
map.addPersonnage(new Personnage("pokemon", 2, 5, DIRECTION.DROITE));

window.onload = function () {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    canvas.width = map.getLargeur() * 26;
    canvas.height = map.getHauteur() * 26;
    
    map.dessinerMap(ctx);

    

}