function MapReader(map) {

    var xhr = getXMLHttpRequest();

    // Chargement du fichier
    xhr.open("GET", '././maps/' + map + '.map', false);
    xhr.send(null);
    if (xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) // Code == 0 en local
        throw new Error("Impossible de charger la carte nommée \"" + map + "\" (code HTTP : " + xhr.status + ").");
    var mapData = xhr.responseText;
    //--------------------------------

    //Va contenir le tableau a deux dimension qui représente le plateau puis qui sera traduit en json pour faciliter l'accesibilité
    //@TODO : Validateur de map
    var mapArray = [];
    var i = 0;

    for (; i < mapData.length; i++) {
        var lineArray = [];
        for (; mapData[i] != "\n"; i++) {
            if (mapData[i] == undefined)
                break;

            if (mapData[i] == " ") {

                lineArray.push(" ");
            } else {

                lineArray.push(mapData[i]);
            }
        }

        mapArray.push(lineArray);
    }
    this.mapArray = mapArray;
    this.tileset = new Tileset("tiles.png");
    
    this.personnages = new Array();
}

MapReader.prototype.dessinerMap = function(context) {
        
    for (var i = 0, l = this.mapArray.length; i < l; i++) {
        var ligne = this.mapArray[i];
        var y = i * 26;
        for (var j = 0, k = ligne.length; j < k; j++) {
            this.tileset.drawTile(ligne[j], context, j * 26, y);
        }
    }
    
    //Dessine les personnages
    for(var i=0;i<this.personnages.length;i++){
        this.personnages[i].drawPersonnage(context);
    }
}

// Pour récupérer la taille (en tiles) de la carte
MapReader.prototype.getHauteur = function() {
    return this.mapArray.length;
}
MapReader.prototype.getLargeur = function() {
    return this.mapArray[0].length-1;
}
MapReader.prototype.getMap = function() {
    return this.mapArray;
}

MapReader.prototype.addPersonnage = function(perso){
    this.personnages.push(perso);
}
