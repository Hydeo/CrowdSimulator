var grid = new Grid_graph();
var queue = new PriorityQueue(function(a,b) {return a>b?1:-1;});
var poketest = new Pokemon(0);
poketest.coords = [10,1];

var arrayGr = [
	['*','*','*','*','*','*'],
	['*',' ','*',' ','A','*'],
	['*',' ','G','G',' ','*'],
	['*',' ','G','G',' ','*'],
	['*',' ','G','G',' ','*'],
	['*',' ','G','G',' ','*'],
	['*',' ','G','G',' ','*'],
	['*',' ','G','G',' ','*'],
	['*',' ','G','G',' ','*'],
	['*',' ','G','G',' ','*'],
	['*','D','G',' ',' ','*'],
	['*','*','*','*','*','*']
];

grid.parseGraph(arrayGr);

grid.seekPath(poketest);

