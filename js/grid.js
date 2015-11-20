/**
	Classe de Graphe
	
	pkmn1 : nombre toral de pokémon à la porte 1
	pkmn2 : nombre toral de pokémon à la porte 2
*/

var Grid_graph = function(pkmn1, pkmn2, pkmn3) {
	this.nodes = new Array();
	this.pokemons = new Array();
	this.starts = new Array();
	this.arrivals = new Array();
	this.pkmnNb = 0;
	this.turn = 0;
	this.moves = 0;
	this.arrived = 0;
	
	this.starts[0] = {"node":null, "pool":pkmn1};
	this.starts[1] = {"node":null, "pool":pkmn2};
	this.starts[2] = {"node":null, "pool":pkmn3};
	
	
	
	Grid_graph.prototype.addNode = function(node) {
		if(!(node instanceof Grid_node))
			return;
		
		this.nodes.push(node);
	}
	
	/**
		Fonction de parsing du tableau et génération des nodes et liens (Carte logique)
		
		graph: tableau 2D des cases
	*/
	Grid_graph.prototype.parseGraph = function(graph) {
		if(!(graph instanceof Array))
			return;
		
		var tmp;
		var starts = 0;
		for(var i = 0; i < graph.length; i++) {
			var tmp_row = new Array();
			
			
			for(var j = 0; j < graph[i].length; j++) {				
				if('*' == graph[i][j])
					continue;
				
				tmp = new Grid_node(key = [i, j]);		
				tmp.values = new Array;
				tmp.type = graph[i][j];
				
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
				
				if('D' == graph[i][j] && starts < 3) {
					this.starts[starts++]["node"] = tmp;
				}
				
				if('A' == graph[i][j]) {
					this.arrivals.push(tmp);
				}

				tmp_row[j] = tmp;
			}
			
			if(tmp_row.length > 0)
				this.nodes[i] = tmp_row;
		}
	}
	
	/**
		Fonction de calcul de la distance entre 2 points
	*/
	Grid_graph.prototype.getDistance = function(node1, node2) {
		return Math.sqrt(Math.abs((node2.key[0] - node1.key[0])*(node2.key[0] - node1.key[0]) + (node2.key[1] - node1.key[1])*(node2.key[1] - node1.key[1]))).toFixed(1);
	}
	
	/**
		Fonction de recherche de l'arrivée la plus proche
	*/
	Grid_graph.prototype.getNearestArrival = function(coords) {
		if(!(coords instanceof Array)) 
			return;

		var tmp = this.arrivals[0];
		for(var i = 1; i<this.arrivals.length; i++) {
			if(this.getDistance(this.nodes[coords[0]][coords[1]], this.arrivals[i]) < this.getDistance(this.nodes[coords[0]][coords[1]], tmp) ) {
				tmp  = this.arrivals[i];
			}
			
			return tmp;
		}
	}
	
	var compare2Nodes = function(node1, node2, id) {
	
		if(node1.values[id]["eur"] < node2.values[id]["eur"])
			return 1;
		
		if(node1.values[id]["eur"]  == node2.values[id]["eur"] )
		return 0;	
		
		return -1; 
	}
	
	var compare2Pkmn = function(pkmn1, pkmn2) {
	
		if(pkmn1.waiting > pkmn2.waiting)
			return -1;
		
		if(pkmn1.waiting  == pkmn2.waiting )
		return 0;	
		
		return 1; 
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
			return 1;
		
		var actual = this.nodes[pokemon.coords[0]][pokemon.coords[1]];
		var end = this.getNearestArrival(pokemon.coords);
		
		var opened = new PriorityQueue(compare2Nodes, "path_"+pokemon.id);
		var closed = new Queue();
		var tmp = null, next = null;
		
		opened.add(actual);
		actual.values["path_"+pokemon.id] = {cost:0, eur:0};
		
		while(opened.size > 0) {			
			tmp = opened.dequeue();

			if(tmp.key == end.key ) {
				pokemon.path = returnPath(tmp, pokemon.id);
				return 1;
			}
			
			else {
				for(var i = 0; i<tmp.getEdges().length; i++) {					
					next = tmp.getEdges()[i].getOther(tmp);

					if( next.type == "D" || closed.contains(next) || (opened.contains(next) && next.values["path_"+pokemon.id]["cost"] > tmp.values["path_"+pokemon.id]["cost"])) 
						continue;

					next.values["path_"+pokemon.id] = {cost:(tmp.values["path_"+pokemon.id]["cost"] + tmp.getEdges()[i].attributes["cost"])*(next.occuped?2:1)};
					next.values["path_"+pokemon.id]["eur"] = (next.values["path_"+pokemon.id]["cost"] + this.getDistance(tmp, end))*1.5;
									
					opened.add(next);
				}
			}
			closed.add(tmp);
		}
		
		return 0;
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
				if(this.nodes[this.starts[i]["node"].key[0]][this.starts[i]["node"].key[1] - 1] != undefined && this.starts[i]["pool"] > 0 &&
					!this.nodes[this.starts[i]["node"].key[0]][this.starts[i]["node"].key[1] - 1].occuped) 
				{
					newPkmn = new Pokemon(this.pkmnNb++, [this.starts[i]["node"].key[0], this.starts[i]["node"].key[1] - 1],3);
					this.pokemons.push(newPkmn);
					this.starts[i]["pool"]--;
					this.nodes[this.starts[i]["node"].key[0]][this.starts[i]["node"].key[1] - 1].occuped = true;
				}
				/*if(this.nodes[this.starts[i]["node"].key[0] - 1] != undefined && this.nodes[this.starts[i]["node"].key[0] - 1][this.starts[i]["node"].key[1] - 1] != undefined && this.starts[i]["pool"] > 0 &&
					!this.nodes[this.starts[i]["node"].key[0] - 1][this.starts[i]["node"].key[1] - 1].occuped) 
				{
					newPkmn = new Pokemon(this.pkmnNb++, [this.starts[i]["node"].key[0] - 1, this.starts[i]["node"].key[1] - 1],0);
					this.pokemons.push(newPkmn);
					this.starts[i]["pool"]--;
					this.nodes[this.starts[i]["node"].key[0] - 1][this.starts[i]["node"].key[1] - 1].occuped = true;
				}*/
				if(this.nodes[this.starts[i]["node"].key[0] - 1] != undefined && this.nodes[this.starts[i]["node"].key[0] - 1][this.starts[i]["node"].key[1]] != undefined && this.starts[i]["pool"] > 0 &&
					!this.nodes[this.starts[i]["node"].key[0] - 1][this.starts[i]["node"].key[1]].occuped) 
				{
					newPkmn = new Pokemon(this.pkmnNb++, [this.starts[i]["node"].key[0] - 1, this.starts[i]["node"].key[1]],0);
					this.pokemons.push(newPkmn);
					this.starts[i]["pool"]--;
					this.nodes[this.starts[i]["node"].key[0] - 1][this.starts[i]["node"].key[1]].occuped = true;
				}
				/*if(this.nodes[this.starts[i]["node"].key[0] - 1] != undefined && this.nodes[this.starts[i]["node"].key[0] - 1][this.starts[i]["node"].key[1] + 1] != undefined && this.starts[i]["pool"] > 0 &&
					!this.nodes[this.starts[i]["node"].key[0] - 1][this.starts[i]["node"].key[1] + 1].occuped) {
					newPkmn = new Pokemon(this.pkmnNb++, [this.starts[i]["node"].key[0] - 1, this.starts[i]["node"].key[1] + 1],1);
					this.pokemons.push(newPkmn);
					this.starts[i]["pool"]--;
					this.nodes[this.starts[i]["node"].key[0] - 1][this.starts[i]["node"].key[1] + 1].occuped = true;
				}*/
			
				if(this.nodes[this.starts[i]["node"].key[0]][this.starts[i]["node"].key[1] + 1] != undefined && this.starts[i]["pool"] > 0 &&
					!this.nodes[this.starts[i]["node"].key[0]][this.starts[i]["node"].key[1] + 1].occuped) 
				{
					newPkmn = new Pokemon(this.pkmnNb++, [this.starts[i]["node"].key[0], this.starts[i]["node"].key[1] + 1],1);
					this.pokemons.push(newPkmn);
					this.starts[i]["pool"]--;
					this.nodes[this.starts[i]["node"].key[0]][this.starts[i]["node"].key[1] + 1].occuped = true;
				}
				/*if(this.nodes[this.starts[i]["node"].key[0] + 1] != undefined && this.nodes[this.starts[i]["node"].key[0] + 1][this.starts[i]["node"].key[1] + 1] != undefined && this.starts[i]["pool"] > 0 &&
					!this.nodes[this.starts[i]["node"].key[0] + 1][this.starts[i]["node"].key[1] + 1].occuped)
				{
					newPkmn = new Pokemon(this.pkmnNb++, [this.starts[i]["node"].key[0] + 1, this.starts[i]["node"].key[1] + 1],2);
					this.pokemons.push(newPkmn);
					this.starts[i]["pool"]--;
					this.nodes[this.starts[i]["node"].key[0] + 1][this.starts[i]["node"].key[1] - 1].occuped = true;
				}*/
				if(this.nodes[this.starts[i]["node"].key[0] + 1] != undefined && this.nodes[this.starts[i]["node"].key[0] + 1][this.starts[i]["node"].key[1]] != undefined && this.starts[i]["pool"] > 0 &&
					!this.nodes[this.starts[i]["node"].key[0] + 1][this.starts[i]["node"].key[1]].occuped) 
				{
					newPkmn = new Pokemon(this.pkmnNb++, [this.starts[i]["node"].key[0] + 1, this.starts[i]["node"].key[1]],2);
					this.pokemons.push(newPkmn);
					this.starts[i]["pool"]--;
					this.nodes[this.starts[i]["node"].key[0] + 1][this.starts[i]["node"].key[1]].occuped = true;
				}
				/*if(this.nodes[this.starts[i]["node"].key[0] + 1] != undefined && this.nodes[this.starts[i]["node"].key[0] + 1][this.starts[i]["node"].key[1] - 1] != undefined && this.starts[i]["pool"] > 0 &&
					!this.nodes[this.starts[i]["node"].key[0] + 1][this.starts[i]["node"].key[1] - 1].occuped) 
				{
					newPkmn = new Pokemon(this.pkmnNb++, [this.starts[i]["node"].key[0] + 1, this.starts[i]["node"].key[1] - 1],2);
					this.pokemons.push(newPkmn);
					this.starts[i]["pool"]--;
					this.nodes[this.starts[i]["node"].key[0] + 1][this.starts[i]["node"].key[1] - 1].occuped = true;
				}*/
			}
		}
	}
	
	Grid_graph.prototype.makeTurn = function() {
		var next;
		var waitList = new PriorityQueue(compare2Pkmn);
		this.placeNewPokemons();
		
		for(var i = 0; i<this.pokemons.length; i++) {
			if(this.pokemons[i].path == null || this.pokemons[i].path == undefined) {
				this.seekPathToArrival(this.pokemons[i]);
			}
			
			if(this.pokemons[i].path != undefined) {
				if(++this.pokemons[i].actions > 0 && this.turn > 0) {
					if(!this.pokemons[i].path.peek().occuped) {
						this.pokemons[i].waiting = 0;
						this.pokemons[i].mouvement();
						var next = this.pokemons[i].path.dequeue();
						this.pokemons[i].actions -= this.nodes[this.pokemons[i].coords[0]][this.pokemons[i].coords[1]].getEdgeWithNode(next).attributes["cost"];
						
						this.nodes[this.pokemons[i].coords[0]][this.pokemons[i].coords[1]].occuped = false;
						this.pokemons[i].coords = next.key;
						
						if(this.nodes[this.pokemons[i].coords[0]][this.pokemons[i].coords[1]].type != "A")
							this.nodes[this.pokemons[i].coords[0]][this.pokemons[i].coords[1]].occuped = true;
						this.moves++;
					}
					
					else {
						this.pokemons[i].waiting++;
						
						if(this.pokemons[i].waiting > 10 ) {
							this.pokemons[i].waiting = 0;
							this.seekPathToArrival(this.pokemons[i]);
						}
						
						this.pokemons[i].actions--;				
					}
				}
			
				if(this.pokemons[i].path.size < 1){
					this.pokemons.splice(i, 1);
					this.arrived++;
				}
			}
		}
		
		this.turn++;
	}
}	