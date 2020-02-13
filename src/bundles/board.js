import { DOMELEMENTS } from "./domElements";
import { clickListener } from "./clickListener";

let tileArray = []; //Grabs all tiles on the board, passes into an array with proporties we'll use later.
DOMELEMENTS.tiles.forEach(el => {
    let tile = {
        dom: el,
        x: parseInt(el.getAttribute("x")),
        y: parseInt(el.getAttribute("y")),
        occupied: null,
        terrain: null
    };
    //console.log(tile.x, tile.y);
    tileArray.push(tile);
});

function getTile(el){ // Checks value of dom element and returns corrosponding tile from array
    let match;
    tileArray.forEach(tile => {
        if(tile.x == el.getAttribute('x') && tile.y == el.getAttribute('y')){
            match = tile;
        }
    });
    return match;
}

tileArray.forEach(el => { //Shows tiles within range.
    el.dom.addEventListener("mouseover", el => {
        el = getTile(el.target);
        tileArray.forEach(tile => {
            if (Math.abs(tile.x - el.x) + Math.abs(tile.y - el.y) <= 2){
                tile.dom.classList.add("viable");
            }
        });
    })
});

tileArray.forEach(el => { //Removes highlight when mouse moved off of tile.
    el.dom.addEventListener("mouseout", el => {
        el = getTile(el.target);
        tileArray.forEach(tile => {
            if (Math.abs(tile.x - el.x) + Math.abs(tile.y - el.y) <= 2){
                tile.dom.classList.remove("viable");
            }
        });
    })
});