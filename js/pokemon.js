var Pokemon = function(id) {
	this.id = id; 
	this.coords = null;
	this.path = new Queue();
	
	Pokemon.prototype.setCoords = function(x, y, coords) {
		if(coords != null && coords instanceof Array) {
			this.coords = coords; 
			return;
		}
		
		this.coords[0] = x;
		this.coords[1] = y;
	}
}