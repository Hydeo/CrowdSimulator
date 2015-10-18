var grid = new Grid_graph();

var arrayGr = [
	[2,2,2,2,2],
	[2,0,1,0,2],
	[2,0,1,1,2],
	[2,0,1,0,2],
	[2,2,2,2,2]
];

grid.parseGraph(arrayGr);
console.log(grid.nodes[2][2]);
console.log(grid.nodes[1][1].getEdges()[0].getOther(grid.nodes[1][1]).toString());