var Queue = function() {
	this.queue = new Array();
	this.size = 0;
	
	Queue.prototype.add = function(newO) {
		if(null == this.queue)
			this.queue = new Array();
		
		this.queue.push(newO);
		this.size++;
	}
	
	Queue.prototype.peek = function() {
		if(null == this.queue)
			return null;	

		return this.queue[0];
	}
	
	Queue.prototype.dequeue = function() {
		if(null == this.queue)
			return null;
		
		var tmp = this.queue[0];
		this.queue.splice(0,1);
		this.size--;
		return tmp;
	}
	
	Queue.prototype.contains = function(obj) {
		for(var i = 0; i<this.size; i++) {
			if(this.queue[i] ==  obj) {
				return true;
			}
		}
		
		return false;
	}
}

var PriorityQueue = function(comp, end) {
	this.queue = new Array();
	this.size = 0;
	this.comp = comp;
	this.end = end;

	PriorityQueue.prototype.add = function(newO) {
		if(null == this.queue)
			this.queue = new Array();
		
		var i = 0;
		while( i < this.size && this.comp(newO, this.queue[i], this.end) < 0 ) {
			i++;
		}

		this.queue.splice(i, 0, newO);
		this.size++;
	}
	
	PriorityQueue.prototype.peek = function() {
		if(null == this.queue)
			return null;	

		return this.queue[0];
	}
	
	PriorityQueue.prototype.dequeue = function() {
		if(null == this.queue)
			return null;
		
		var tmp = this.queue[0];
		this.queue.splice(0,1);
		this.size--;
		return tmp;
	}
	
	PriorityQueue.prototype.contains = function(obj) {
		for(var i = 0; i<this.size; i++) {
			if(this.queue[i] ==  obj) {
				return true;
			}
		}
		
		return false;
	}
	
	PriorityQueue.prototype.sortByFilter = function(filter, filter2) {
		var i, j, index, tmp;
		var change = false;
		for(i = 0; i<this.queue.length - 1; i++) {
			index = i;
			for(j = i+1; j<this.queue.length; j++) {
				if( filter2 != undefined && this.queue[j].values[filter][filter2] < this.queue[index].values[filter][filter2] ) {
					index = j;
				}	
				
				else if( this.queue[j][filter] < this.queue[index][filter]) {
					index = j;
				}	
			}
			
			tmp = this.queue[i];
			this.queue[i] = this.queue[index];
			this.queue[index] = tmp;
		}
	}
}

