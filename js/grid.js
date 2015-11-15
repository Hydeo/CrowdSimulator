var Grid_graph = function(pkmn1, pkmn2, pkmn3) {
	this.nodes = new Array();
	this.pokemons = new Array();
	this.starts = new Array();
	this.pkmnNb = 0;
	
	this.starts[0] = {"node":null, "pool":pkmn1};
	this.starts[1] = {"node":null, "pool":pkmn2};
	this.starts[2] = {"node":null, "pool":pkmn3};
	
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
			var starts = 0;
			
			for(var j = 0; j < graph[i].length; j++) {				
				if('*' == graph[i][j])
					continue;
				
				tmp = new Grid_node(key = [i, j]);		
				tmp.values = new Array;
				tmp.type = graph[i][j];
				
				if('D' == graph[i][j] && starts < 3) {
					this.starts[starts++]["node"] = tmp;
				}
				
				// Création des Edges
				if(i > 0) {
					if('*' != graph[i-1][j]) {
						new Grid_edge(this.nodes[i-1][j], tmp, {cost:(graph[i][j]=='G' || graph[i-1][j]=='G')?2:1});
					}
				}
				
				if(j > 0)  {
					if('*' != graph[i][j-1]) {
						new Grid_edge(tmp_row[j-1], tmp, {cost:(graph[i][j]=='G' || graph[i][j-1]=='G')?2:1});
					}
				}
				
				tmp_row[j] = tmp;
			}
			
			if(tmp_row.length > 0)
				this.nodes[i] = tmp_row;
		}
	}
	
	Grid_graph.prototype.getDistance = function(node1, node2) {
		return Math.sqrt((node2.key[0] - node1.key[0])*(node2.key[0] - node1.key[0]) - (node2.key[1] - node1.key[1])*(node2.key[1] - node1.key[1])).toFixed(2);
	}
	
	Grid_graph.prototype.getNearestArrival = function(coords) {
		if(!(coords instanceof Array))
			return;
		
		var tmp = null;
		for(var i = 0; i<this.nodes.length; i++) {
			if(this.nodes[i] == null || this.nodes[i] == undefined )
				continue;
			
			for(var j = 0; j<this.nodes[i].length; j++) {
				if(this.nodes[i][j] != undefined && this.nodes[i][j].type == 'A') {
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
	
		if(node1.values[id]["eur"] < node2.values[id]["eur"])
			return 1;
		
		if(node1.values[id]["eur"]  == node2.values[id]["eur"] )
		return 0;	
		
		return -1; 
	}
	
	var returnPath = function(node, id) {
		var actual = node, tmp;
		var path = new Queue();

		while(actual.values["path_"+id]["eur"] > 0) {
			path.add(actual);

			var i = 0;
			while(actual.getEdges()[i].getOther(actual).values["path_"+id] == undefined) { i++; }
			tmp = actual.getEdges()[i].getOther(actual);
			
			for(;i<actual.getEdges().length;i++) {		
				if(actual.getEdges()[i].getOther(actual).values["path_"+id] != undefined && actual.getEdges()[i].getOther(actual).values["path_"+id]["cost"] < tmp.values["path_"+id]["cost"]) {
					tmp = actual.getEdges()[i].getOther(actual);
				}
			}
			
			actual = tmp;
		}

		path.queue = path.queue.reverse();
		return path;
	} 
	
	Grid_graph.prototype.seekPathToArrival = function(pokemon) {
		if(!(pokemon instanceof Pokemon))
			return;
		
		var actual = this.nodes[pokemon.coords[0]][pokemon.coords[1]];
		var end = this.getNearestArrival(pokemon.coords);
		
		var opened = new PriorityQueue(compare2Nodes, "path_"+pokemon.id);
		var closed = new Queue();
		var tmp = null, next = null;
		
		opened.add(actual);
		actual.values["path_"+pokemon.id] = {cost:0, eur:0};
		
		while(opened.size > 0) {
			tmp = opened.dequeue();

			if(tmp.key == end.key) {
				console.log("find!");
				tmp.values["path_"+pokemon.id]["eur"] = 1;

				pokemon.path = returnPath(tmp, pokemon.id);
				return;
			}
			
			else {
				for(var i = 0; i<tmp.getEdges().length; i++) {					
					next = tmp.getEdges()[i].getOther(tmp);
					
					if( next.type == "D" || closed.contains(next) || (opened.contains(next) && next.values["path_"+pokemon.id]["cost"] > tmp.values["path_"+pokemon.id]["cost"]) ) 
						continue;

					next.values["path_"+pokemon.id] = {cost:tmp.values["path_"+pokemon.id]["cost"] + tmp.getEdges()[i].attributes["cost"]};
					next.values["path_"+pokemon.id]["eur"] = next.values["path_"+pokemon.id]["cost"] + this.getDistance(tmp, end);
									
					opened.add(next);
					opened.sortByFilter("path_"+pokemon.id, "eur");
				}
			}
			closed.add(tmp);
		}
	}
	
	Grid_graph.prototype.seekAllPaths = function() {
		if(this.pokemons.length < 1)
			return;
		
		for(var i = 0; i<this.pokemons.length; i++) {
			this.seekPathToArrival(this.pokemons[i]);
		}
	}
	
	Grid_graph.prototype.placeNewPokemons = function() {
		if(this.starts == null || this.starts.length < 1) {
			return;
		}
		
		var newPkmn;
		
		for(var i = 0; i<3; i++) {
			if(this.starts[i] != undefined && this.starts[i]["node"] != null) {
				for(var l = -1; l<2; l+=2) {
					if(this.starts[i]["pool"] > 0 && this.starts[i]["node"] != null 
						&& this.nodes[this.starts[i]["node"].key[0]][this.starts[i]["node"].key[1] + l] != undefined
						&& !this.nodes[this.starts[i]["node"].key[0]][this.starts[i]["node"].key[1] + l].occuped) {
							
						newPkmn = new Pokemon(this.pkmnNb++, [this.starts[i]["node"].key[0], this.starts[i]["node"].key[1] + l]);
						this.pokemons.push(newPkmn);
						this.starts[i]["pool"]--;
					}
					
					if(this.starts[i]["pool"] > 0 && this.starts[i]["node"] != null 
						&& this.nodes[this.starts[i]["node"].key[0] + l] != undefined && this.nodes[this.starts[i]["node"].key[0] + l][this.starts[i]["node"].key[1]] != undefined
						&& !this.nodes[this.starts[i]["node"].key[0] + l][this.starts[i]["node"].key[1]].occuped) {
							
						newPkmn = new Pokemon(this.pkmnNb++, [this.starts[i]["node"].key[0] + l, this.starts[i]["node"].key[1]]);
						this.pokemons.push(newPkmn);
						this.starts[i]["pool"]--;
					}
				}
			}
		}
	}
	
	Grid_graph.prototype.movePokemons = function() {
		var next;
		for(var i = 0; i<this.pokemons.length; i++) {
			this.pokemons[i].actions++;
			if(this.pokemons[i].actions > 0) {
				var next = this.pokemons[i].path.dequeue();
				this.pokemons[i].actions -= this.nodes[this.pokemons[i].coords[0]][this.pokemons[i].coords[1]].getEdgeWithNode(next).attributes["cost"];
				this.pokemons[i].coords = next.key;
				console.log(this.pokemons[i].coords);
			}
			
			if(this.pokemons[i].path.size < 1) 
				this.pokemons.splice(i, 1);
		}
	}
}	