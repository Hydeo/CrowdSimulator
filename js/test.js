var grid = new Grid_graph(1, 0, 0);

var arrayGr = [
//	  0	  1	  2	  3   4   5 
	['*','*','*','*','*','*'], //0
	['*',' ','*',' ','A','*'], //1
	['*',' ','G','G',' ','*'], //2
	['*',' ','G','G',' ','*'], //3
	['*',' ','G','G',' ','*'], //4
	['*',' ','G','G',' ','*'], //5
	['*',' ','G','G',' ','*'], //6
	['*',' ','G','G',' ','*'], //7
	['*',' ','G','G',' ','*'], //8
	['*',' ','G','G',' ','*'], //9
	['*','D','G','G','D','*'], //10
	['*','*','*','*','*','*']  //11
];

grid.parseGraph(arrayGr);

