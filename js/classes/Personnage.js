var DIRECTION = {
    "BAS": 2,
    "GAUCHE": 3,
    "DROITE": 1,
    "HAUT": 0
}

function Personnage(url, x, y, direction) {
    this.x = x; //en cases et non pas en pixel
    this.y = y;
    this.direction = direction;

    //on charge l'image
    this.image = new Image();
    this.image.referenceDuPerso = this;
    this.image.onload = function () {
        if (!this.complete)
            throw "Erreur lors du chargement du sprite " + url;
        this.referenceDuPerso.largeur = this.width / 12;
        this.referenceDuPerso.hauteur = this.height / 8;
    }
    this.image.src = "sprites/" + url + ".png";
}

Personnage.prototype.drawPersonnage = function (context) {
    //On dessine le sprite 
    context.drawImage(
        this.image, 48, // changer la deuxieme valeur pour changer de pokemon (+24 pour changer de colonne)
        this.direction * this.hauteur,// Point d'origine de la zone a prendre dans notre image de sprite
        this.largeur,this.hauteur,// taille de la zone (taille du perso)
        (this.x * 26) - (this.largeur / 2) + 13, (this.y * 26) - this.hauteur + 24, // point de destination (toujours en fonction de la taille du perso) 
        this.largeur,
        this.hauteur// taille de la zone de destination (perso)
    )
}

Personnage.prototype.getCoordonneesAdjacentes = function(direction)  {
	var coord = {'x' : this.x, 'y' : this.y};
	switch(direction) {
		case DIRECTION.BAS : 
			coord.y++;
			break;
		case DIRECTION.GAUCHE : 
			coord.x--;
			break;
		case DIRECTION.DROITE : 
			coord.x++;
			break;
		case DIRECTION.HAUT : 
			coord.y--;
			break;
	}
	return coord;
}
	
Personnage.prototype.deplacer = function(direction, map) {
	// On change la direction du personnage
	this.direction = direction;
		
	// On vérifie que la case demandée est bien située dans la carte
	var prochaineCase = this.getCoordonneesAdjacentes(direction);
	if(prochaineCase.x < 0 || prochaineCase.y < 0 || prochaineCase.x >= map.getLargeur() || prochaineCase.y >= map.getHauteur()) {
		// On retourne un booléen indiquant que le déplacement ne s'est pas fait, 
		// Ça ne coute pas cher et ca peut toujours servir
		return false;
	}
		
	// On effectue le déplacement
	this.x = prochaineCase.x;
	this.y = prochaineCase.y;
		
	return true;
}


