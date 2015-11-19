var map = new MapReader("map");

window.onload = function () {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    canvas.width = map.getLargeur() * 26;
    canvas.height = map.getHauteur() * 26;

    setInterval(function () {
        map.dessinerMap(ctx);
    }, 40);
    
    window.onkeydown = function (event) {
        var e = event || window.event;
        var key = e.which || e.keyCode;

        switch (key) {
        case 38:
        case 122:
        case 119:
        case 90:
        case 87: // Flèche haut, z, w, Z, W
            perso.deplacer(DIRECTION.HAUT, map);
            break;
        case 40:
        case 115:
        case 83: // Flèche bas, s, S
            perso.deplacer(DIRECTION.BAS, map);
            break;
        case 37:
        case 113:
        case 97:
        case 81:
        case 65: // Flèche gauche, q, a, Q, A
            perso.deplacer(DIRECTION.GAUCHE, map);
            break;
        case 39:
        case 100:
        case 68: // Flèche droite, d, D
            perso.deplacer(DIRECTION.DROITE, map);
            break;
        default:
            return true;
        }
        return false;
    }
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