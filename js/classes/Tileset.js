function Tileset(url) {
    //On recupère l'image qui contient les tiles
    var e = document.getElementById("map_theme");
    var tileFile = e.options[e.selectedIndex].text;
    this.image = new Image();
    this.image.referenceDuTileset = this;
    this.image.onload = function () {
        if (!this.complete)
            throw new Error("Erreur lors du chargement du fichier tileset \"" + tileFile + ".");
    }
    this.image.src = "tilesets/" + tileFile +".png";
}

//Methode de dessin 
Tileset.prototype.drawTile = function (numero, context, x, y) {
    var e = document.getElementById("map_theme");
    var tileFile = e.options[e.selectedIndex].text;
    this.image.src="tilesets/" + tileFile +".png";
        //On calcule la position du tile souhaité en fonction du numéro et de la taille des tiles
        switch (numero) {
        case ' ':
            numero = 1;
            break;
        case '*':
            numero = 2;
            break;
        case 'G':
            numero = 3;
            break;
        case 'D':
            numero = 4;
            break;
        case 'A':
            numero = 6;
            break;
        }
        var yEnTile = numero % this.image.height;
        var ySource = (yEnTile - 1) * 26;

        var xSource = 0;
    context.drawImage(this.image, xSource, ySource, 26, 26, x, y, 26, 26);
}