var Pokemon = function(id, coords) {
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
			console.log("GAUCHE");
			return 3;
		}
		
		if(this.coords[1]-this.path.peek().key[1] == -1 && this.coords[0]-this.path.peek().key[0] == 0) {
			console.log("DROITE");
			return 1;
		}

		if(this.coords[1]-this.path.peek().key[1] == 0 && this.coords[0]-this.path.peek().key[0] == 1) {
			console.log("HAUT");
			return 0;
		}

		if(this.coords[1]-this.path.peek().key[1] == 0 && this.coords[0]-this.path.peek().key[0] == -1) {
			console.log("BAS");
			return 2;
		}
	}
}