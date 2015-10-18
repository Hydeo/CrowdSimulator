var Grid_graph = function() {
	this.nodes = new Array();
	
	Grid_graph.prototype.addNode = function(node) {
		if(!(node instanceof Grid_node))
			return;
		
		this.nodes.push(node);
	}
	
	Grid_graph.prototype.parseGraph = function(graph) {
		if(!(graph instanceof Array))
			return;
		
		var tmp;
		for(var i = 0; i < graph.length; i++) {
			var tmp_row = new Array();
			
			for(var j = 0; j < graph[i].length; j++) {				
				if(2 == graph[i][j])
					continue;
				
				tmp = new Grid_node(key = [i, j]);
				tmp.values = new Array;
				
				/* 0: normal, 1: bush, 2: mur, 3: porte, 4:fromage */
				switch(graph[i][j]) {
					case 0: tmp.values.type = 0; break;
					case 1: tmp.values.type = 1; break;
					case 2: tmp.values.type = 2; break;
					case 3: tmp.values.type = 3; break;
					case 4: tmp.values.type = 4; break;
					default: return;
				}
				
				// Création des Edges
				if(i > 0) {
					if(2 != graph[i-1][j]) {
						new Grid_edge(this.nodes[i-1][j], tmp, {cost:graph[i][j]});
					}
				}
				
				if(j > 0)  {
					if(2 != graph[i][j-1]) {
						new Grid_edge(tmp_row[j-1], tmp, {cost:graph[i][j]});
					}
				}
				
				tmp_row[j] = tmp;
			}
			
			if(tmp_row.length > 0)
				this.nodes[i] = tmp_row;
		}
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
	
	Grid_edge.prototype.getOther = function(node) {
		if(!(node instanceof Grid_node))
			return null;
		
		return this.n1 == node?this.n2:this.n1;
	}
}

var Grid_node = function(key, values) {
	this.key = key;
	this.values = values;
	
	Grid_node.prototype.addEdge = function(edge) {
		if(!(edge instanceof Grid_edge))
			return;
		
		if(this.egdes == undefined)
			this.egdes = new Array();
		
		this.egdes.push(edge);
	}
	
	Grid_node.prototype.getEdges = function() {
		return this.egdes;
	}
	
	Grid_node.prototype.toString = function() {
		return this.key[0]+" "+this.key[1];
	}
}