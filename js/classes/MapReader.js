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
    //this.checkMap();
    this.tileset = new Tileset("Pokemon-2.png");
    this.Pokemon = new Array();

   
}

MapReader.prototype.dessinerMap = function(context,listPoke) {
        
    for (var i = 0, l = this.mapArray.length; i < l; i++) {
        var ligne = this.mapArray[i];
        var y = i * 26;
        for (var j = 0, k = ligne.length; j < k; j++) {
            this.tileset.drawTile(ligne[j], context, j * 26, y);
        }
    }
    
    //Dessine les personnages
    for(var i=0;i<listPoke.length;i++){
        listPoke[i].drawPokemon(context);
    }
}

// Pour récupérer la taille (en tiles) de la carte
MapReader.prototype.getHauteur = function() {
    return this.mapArray.length;
}
MapReader.prototype.getLargeur = function() {
    return this.mapArray[0].length;
}
MapReader.prototype.getMap = function() {
    return this.mapArray;
}

MapReader.prototype.addPokemon= function(perso){
    this.Pokemon.push(perso);
}

MapReader.prototype.checkMap = function(){
    //Test a effectuer 
    // - première ligne que des *
    // - N ligne : premier et dernier char *
    // - dernière ligne que des *
  
    // On test que toute la premier ligne est égale à *
    for(var j=0;j< this.mapArray[0].length;j++){
        if( this.mapArray[0][j] != "*")
            if(!alert(" /!\\ La map n'est pas valide, il manque des murs à la première ligne !/!\\ ")){window.location.reload();}      
        if( this.mapArray[this.mapArray.length-1][j] != "*")
            if(!alert("/!\\ La map n'est pas valide, il manque des murs à la dernière ligne ! /!\\")){window.location.reload();}
    }
    
    for(var l=0;l<  this.mapArray.length;l++){
       
        if( this.mapArray[l][0] !="*" || this.mapArray[l][ this.mapArray[0].length-1] !="*" )
            if(!alert(" /!\\ La map n'est pas valide, il manque des murs de cloison ligne "+l+". \nVérfifiez que les contours de votre carte soient biens murés!  /!\\")){window.location.reload();}
            //throw new Error("La map n'est pas valide, il manque des murs de cloison ligne "+l); 
        
        for(var k =0;k<this.mapArray[l].length;k++){
            if( this.mapArray[l][k] !="*" && this.mapArray[l][k] !="G" && this.mapArray[l][k] !="A" && this.mapArray[l][k] !="D" && this.mapArray[l][k] !=" ")
                if(!alert(" /!\\ La map n'est pas valide, caractère invalide ligne "+l+ " colonne " + k +" : '"+this.mapArray[l][k]+"' /!\\")){window.location.reload();}
                //throw new Error("La map n'est pas valide, caractère invalide ligne "+l+ " colonne " + k); 
        }
    
    }
}

MapReader.prototype.modifyMap = function(y,x,tilesType){
    this.mapArray[y][x] = tilesType;
}