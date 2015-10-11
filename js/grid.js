var Grid_graph = function() {
	this.nodes = new Array();
	
	Grid_graph.prototype.addNode = function(node) {
		if(!(node instanceof Grid_node))
			return;
		
		this.nodes.push(node);
	}
}

var Grid_edge = function(n1, n2, attributes) {
	if(!(n1 instanceof Grid_node) || !(n1 instanceof Grid_node))
		return null;
	
	this.n1 = n1;
	this.n2 = n2;
	
	this.n1.addEdge(this);
	this.n2.addEdge(this);
	
	this.attributes = attributes
}

var Grid_node = function(key, type) {
	this.key = key;
	this.type = type;
	
	Grid_node.prototype.addEdge = function(edge) {
		if(!(edge instanceof Grid_edge))
			return;
		
		if(this.egdes == undefined)
			this.egdes = new Array();
		
		this.egdes.push(edge);
	}
	
	Grid_node.prototype.getEgdes = function() {
		return this.egdes;
	}
}