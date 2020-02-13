import { DOMELEMENTS } from "./domElements";
import { clickListener } from "./clickListener";

let tileArray = []; //Grabs all tiles on the board, passes into an array with proporties we'll use later.

function mapGen(xlim, ylim){ //Generate grid
    for(let ytile = 0; ytile < ylim; ytile++){
        DOMELEMENTS.board.insertAdjacentHTML("afterbegin", `<div id="row${ytile}" class="row"></div>`);
        for(let xtile = 0; xtile < xlim; xtile++){
            document.getElementById(`row${ytile}`).insertAdjacentHTML("beforeend", `<div class="tile" x="${xtile}" y="${ytile}"></div>`)
        }
    }
}

mapGen(30,60);

let tiles = document.querySelectorAll(".tile");

tiles.forEach(el => {
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

function tilesInRange(tile, dist){
    let tilesInRange = [];
    tileArray.forEach(el => {
        if (Math.abs(el.x - tile.x) + Math.abs(el.y - tile.y) <= dist){
            tilesInRange.push(el);
        }
    });
    return tilesInRange;
}

tileArray.forEach(el => { //Shows tiles within range.
    const range = 2;
    el.dom.addEventListener("mouseover", el => {
        el = getTile(el.target);
        tilesInRange(el, range).forEach(tile => tile.dom.classList.add("viable"));
    });
    el.dom.addEventListener("mouseout", el => {
        el = getTile(el.target);
        tilesInRange(el, range).forEach(tile => tile.dom.classList.remove("viable"));
    })
});