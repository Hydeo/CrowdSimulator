var Grid_edge = function(n1, n2, attributes) {
	if(!(n1 instanceof Grid_node) || !(n1 instanceof Grid_node))
		return null;
	
	this.n1 = n1;
	this.n2 = n2;
	
	this.n1.addEdge(this);
	this.n2.addEdge(this);
	
	this.attributes = attributes;
	
	Grid_edge.prototype.getOther = function(node) {
		if(!(node instanceof Grid_node))
			return null;
		
		return this.n1 == node?this.n2:this.n1;
	}
}

var Grid_node = function(key, values, type) {
	this.key = key;
	this.values = values;
	this.occuped = false;
	this.type = type;
	this.egdes = new Array();
	
	Grid_node.prototype.addEdge = function(edge) {
		if(!(edge instanceof Grid_edge))
			return;
		
		if(this.egdes == undefined)
			this.egdes = new Array();
		
		this.egdes.push(edge);
	}
	
	Grid_node.prototype.getEdgeWithNode = function(node) {
		for(var i = 0; i<this.getEdges().length; i++) {
			if(this.getEdges()[i].n1 === node || this.getEdges()[i].n2 === node)
				return this.getEdges()[i];
		}
		
		return null;
	}
	
	Grid_node.prototype.getEdges = function() {
		return this.egdes;
	}
	
	Grid_node.prototype.toString = function() {
		return this.key[0]+" "+this.key[1];
	}
}