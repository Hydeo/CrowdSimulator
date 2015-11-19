var map = new MapReader("map");
var grid = new Grid_graph(0, 2, 0);
var playing = false;
grid.parseGraph(map.getMap());

window.onload = function () {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    canvas.width = map.getLargeur() * 26;
    canvas.height = map.getHauteur() * 26;
    map.dessinerMap(ctx,grid.pokemons);
    document.getElementById('Speed').value = 100 ;
    var counter = 100;
    
    
    var interval = setInterval(function bigLoop() {
        //console.log(grid.pokemons.length+" "+playing+" ")
      //  console.log(grid.starts[1]);
            if(grid.pokemons.length > 0 && playing){
                document.getElementById('play').innerHTML  = "Pause";
                clearInterval(interval);
                counter = document.getElementById('Speed').value;
                grid.makeTurn();
                map.dessinerMap(ctx,grid.pokemons);
                document.getElementById('Door1').value = grid.starts[0]["pool"];
                document.getElementById('Door2').value = grid.starts[1]["pool"];
                console.log(grid.starts[0]);
                console.log(grid.starts[1]);
                document.getElementById('Turns').innerHTML  = grid.turn;
                document.getElementById('Moves').innerHTML  = grid.moves;
                document.getElementById('NbPoke').innerHTML  = grid.pokemons.length;
                document.getElementById('NbPokeDone').innerHTML  = grid.arrived;

                interval = setInterval(bigLoop, counter);
        }
        else{
            playing=false;
            document.getElementById('play').innerHTML  = "Play";
        }
    }, counter);
    

    setInterval(function(){
         map.dessinerMap(ctx,grid.pokemons);
     },40);

    
    window.onclick = function (event) {


        if (document.getElementById('wall').checked) {
            map.modifyMap(Math.trunc((event.clientY - (canvas.getBoundingClientRect()).top) / 26), Math.trunc((event.clientX - (canvas.getBoundingClientRect()).left) / 26), "*");
        } else if (document.getElementById('grass').checked) {
            map.modifyMap(Math.trunc((event.clientY - (canvas.getBoundingClientRect()).top) / 26), Math.trunc((event.clientX - (canvas.getBoundingClientRect()).left) / 26), "G");
        } else if (document.getElementById('ground').checked) {
            map.modifyMap(Math.trunc((event.clientY - (canvas.getBoundingClientRect()).top) / 26), Math.trunc((event.clientX - (canvas.getBoundingClientRect()).left) / 26), " ");
        }

    }

}

var switchState = function(){
    if(playing)
        playing = false;
    else{
        grid.starts[0]["pool"]=document.getElementById('Door1').value;
        grid.starts[1]["pool"]=document.getElementById('Door2').value;
        playing = true;
        grid.placeNewPokemons();
    }
    console.log(playing);
}

