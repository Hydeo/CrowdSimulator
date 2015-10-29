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
				if('*' == graph[i][j])
					continue;
				
				tmp = new Grid_node(key = [i, j]);
				tmp.values = new Array;
				
				tmp.values.type = graph[i][j];
				
				// Création des Edges
				if(i > 0) {
					if('*' != graph[i-1][j]) {
						new Grid_edge(this.nodes[i-1][j], tmp, {cost:graph[i][j]=='G'?2:1});
					}
				}
				
				if(j > 0)  {
					if('*' != graph[i][j-1]) {
						new Grid_edge(tmp_row[j-1], tmp, {cost:graph[i][j]=='G'?2:1});
					}
				}
				
				tmp_row[j] = tmp;
			}
			
			if(tmp_row.length > 0)
				this.nodes[i] = tmp_row;
		}
	}
	
	Grid_graph.prototype.getDistance = function(node1, node2) {
		return Math.sqrt((node2.key[0] - node1.key[0])*(node2.key[0] - node1.key[0]) - (node2.key[1] - node1.key[1])*(node2.key[1] - node1.key[1]))
	}
	
	Grid_graph.prototype.getNearestArrival = function(coords) {
		if(!(coords instanceof Array))
			return;
		
		var tmp = null;
		for(var i = 0; i<this.nodes.length; i++) {
			if(this.nodes[i] == null || this.nodes[i] == undefined )
				continue;
			
			for(var j = 0; j<this.nodes[i].length; j++) {
				if(this.nodes[i][j] != undefined && this.nodes[i][j].values.type == 'A') {
					if(tmp == null)
						tmp = [i, j];
					
					if( (tmp[0]*tmp[0] + tmp[1]*tmp[1]) > (i*i+ j*j) )
						tmp = [i, j];
				}
			}			
		}
		
		return this.nodes[tmp[0]][tmp[1]];
	}
	
	var compare2Nodes = function(node1, node2, id) {
		if(node1.values[id] < node2.values[id])
			return 1;
		
		if(node1.values[id] == node2.values[id])
		return 0;	
		
		return -1; 
	}
	
	var returnPath = function(node, id) {
		var actual = node, tmp;
		var path = new PriorityQueue(compare2Nodes, id);
		
		while(actual.values[id]["cost"] > 0) {
			path.add(actual);
			tmp = actual.getEdges()[0].getOther(actual);
			
			for(var i = 1; i<actual.getEdges().length;i++) {
				if(actual.getEdges()[i].getOther(actual).values[id]["cost"] < tmp.values[id]["cost"]) {
					tmp = actual.getEdges()[i].getOther(actual);
				}
			}
			
			actual = tmp;
		}
		
		path.add(actual);
		console.log(path.queue.toString());
		return path;
	} 
	
	Grid_graph.prototype.seekPath = function(pokemon) {
		if(!(pokemon instanceof Pokemon))
			return;
		
		var actual = this.nodes[pokemon.coords[0]][pokemon.coords[1]];
		var end = this.getNearestArrival(pokemon.coords);
		
		var opened = new PriorityQueue(compare2Nodes, pokemon.id);
		var closed = new Queue();
		var tmp = null, next = null;
		
		opened.add(actual);
		actual.values[pokemon.id] = {cost:0};
		
		while(opened.size > 0) {
			tmp = opened.dequeue();

			if(tmp.key == end.key) {
				tmp.values[pokemon.id]["eur"] = 1;
				returnPath(tmp, pokemon.id);
				return;
			}
			
			else {
				for(var i = 0; i<tmp.getEdges().length; i++) {					
					next = tmp.getEdges()[i].getOther(tmp);
					
					if( closed.contains(next) || (opened.contains(next) && next.values[pokemon.id]["cost"] > tmp.values[pokemon.id]["cost"]) ) 
						continue;

					next.values[pokemon.id] = {cost:tmp.values[pokemon.id]["cost"] + tmp.getEdges()[i].attributes["cost"]};
					next.values[pokemon.id]["eur"] = next.values[pokemon.id]["eur"] + this.getDistance(tmp, end);
					
					opened.add(next);
					opened.sortByFilter(pokemon.id, "eur");
				}
			}
			
			closed.add(tmp);
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
			console.log(this.getEdges()[i]);
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