var Pokemon = function(id, coords) {
	this.id = id; 
	this.coords = coords;
	this.path = new Queue();
	this.actions = 0;
	
	Pokemon.prototype.setCoords = function(x, y, coords) {
		if(coords != null && coords instanceof Array) {
			this.coords = coords; 
			return;
		}
		
		this.coords[0] = x;
		this.coords[1] = y;
	}
}