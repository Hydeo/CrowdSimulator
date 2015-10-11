var grid = new Grid_graph();

var n1 = new Grid_node(key = "1,1");
var n2 = new Grid_node(key = "1,2");
grid.addNode(n1);
grid.addNode(n2);

new Grid_edge(n1, n2, "100");

console.log(grid.nodes);