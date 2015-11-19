var DIRECTION = {
    "BAS": 2,
    "GAUCHE": 3,
    "DROITE": 1,
    "HAUT": 0
}
var DUREE_ANIM = 3; // nombre de fois que la frame a été dessinée, après X fois, on passe a la frame suivante de l'animation
var DUREE_DEPLACEMENT = 8;
var POKEMON = [72];

var Pokemon = function(id, coords, direction) {

	this.x = coords[1]; //en cases et non pas en pixel
    this.y = coords[0];
    this.url = "pokemon";
    this.direction = direction;
    this.etatAnimation = 1;
    this.pokemonWidth = Math.floor(Math.random() * 4) + 0;
    this.pokemonHeigth = Math.floor(Math.random() * 2) + 0;
    
    //on charge l'image
    this.image = new Image();
    this.image.referenceDuPerso = this;
    this.image.onload = function () {
        if (!this.complete)
            throw "Erreur lors du chargement du sprite " + this.url;
        this.referenceDuPerso.largeur = this.width / 12;
        this.referenceDuPerso.hauteur = this.height / 8;
    }
    this.image.src = "sprites/" + this.url + ".png";

    //------------------

	this.id = id; 
	this.coords = coords;
	this.path = null;
	this.actions = -1;
	
	Pokemon.prototype.setCoords = function(x, y, coords) {
		if(coords != null && coords instanceof Array) {
			this.coords = coords; 
			return;
		}
		
		this.coords[0] = x;
		this.coords[1] = y;
	}
	
	Pokemon.prototype.mouvement = function () {	 
		if(this.coords[1]-this.path.peek().key[1] == 1 && this.coords[0]-this.path.peek().key[0] == 0) {
			this.deplacer(DIRECTION.GAUCHE, map);
			return;
		}
		
		if(this.coords[1]-this.path.peek().key[1] == -1 && this.coords[0]-this.path.peek().key[0] == 0) {
			this.deplacer(DIRECTION.DROITE, map);
			return;
		}

		if(this.coords[1]-this.path.peek().key[1] == 0 && this.coords[0]-this.path.peek().key[0] == 1) {
			this.deplacer(DIRECTION.HAUT, map);
			return;
		}

		if(this.coords[1]-this.path.peek().key[1] == 0 && this.coords[0]-this.path.peek().key[0] == -1) {
			this.deplacer(DIRECTION.BAS, map);
			return ;
		}
	}


Pokemon.prototype.drawPokemon = function (context) {

    var frame = 0; // Numéro de l'image à prendre pour l'animation
    var decalageX = 0,
        decalageY = 0; // Décalage à appliquer à la position du personnage
    if (this.etatAnimation >= DUREE_DEPLACEMENT) {
        // Si le déplacement a atteint ou dépassé le temps nécessaire pour s'effectuer, on le termine
        this.etatAnimation = -1;

    } else if (this.etatAnimation >= 0) {

        // On calcule l'image (frame) de l'animation à afficher
        frame = Math.floor(this.etatAnimation / DUREE_ANIM);
        if (frame > 2) {
            frame %= 3;
        }

        // Pixels restant à parcourir entre les deux cases
        var pixelsAParcourir = 26 - (26 * (this.etatAnimation / DUREE_DEPLACEMENT));

        // À partir de ce nombre, on définit le décalage en x et y.
        if (this.direction == DIRECTION.HAUT) {
            decalageY = pixelsAParcourir;
        } else if (this.direction == DIRECTION.BAS) {
            decalageY = -pixelsAParcourir;
        } else if (this.direction == DIRECTION.GAUCHE) {
            decalageX = pixelsAParcourir;
        } else if (this.direction == DIRECTION.DROITE) {
            decalageX = -pixelsAParcourir;
        }
        this.etatAnimation++;
    }
    //On dessine le sprite 
  
    context.drawImage(
        this.image, (this.largeur * frame)+(72 * this.pokemonWidth), // changer la deuxieme valeur pour changer de pokemon (+24 pour changer de colonne)
        (this.direction * this.hauteur)+128*this.pokemonHeigth, // Point d'origine de la zone a prendre dans notre image de sprite (permet de changer de direction)
        this.largeur, this.hauteur, // taille de la zone (taille du perso)
        (this.x * 26) - (this.largeur / 2) + 13 + decalageX, (this.y * 26) - this.hauteur + 24 + decalageY, // point de destination (toujours en fonction de la taille du perso) 
        this.largeur,
        this.hauteur // taille de la zone de destination (perso)
    )
}

Pokemon.prototype.getCoordonneesAdjacentes = function (direction) {
    var coord = {
        'x': this.x,
        'y': this.y
    };
    switch (direction) {
    case DIRECTION.BAS:
        coord.y++;
        break;
    case DIRECTION.GAUCHE:
        coord.x--;
        break;
    case DIRECTION.DROITE:
        coord.x++;
        break;
    case DIRECTION.HAUT:
        coord.y--;
        break;
    }
    return coord;
}

Pokemon.prototype.deplacer = function (direction, map) {
    // On ne peut pas se déplacer si un mouvement est déjà en cours 
  /*  if (this.etatAnimation >= 0) {
        return false;
    }*/

    // On change la direction du personnage
    this.direction = direction;

    // On vérifie que la case demandée est bien située dans la carte
    var prochaineCase = this.getCoordonneesAdjacentes(direction);
    if (prochaineCase.x < 0 || prochaineCase.y < 0 || prochaineCase.x >= map.getLargeur() || prochaineCase.y >= map.getHauteur()) {
        return false;
    }

    this.etatAnimation = 1;
    this.x = prochaineCase.x;
    this.y = prochaineCase.y;

    return true;
}


}