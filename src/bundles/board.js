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

mapGen(10,10);

const testUnit = {
    "img": "./img/testUnit.png",
    "name": "Amelia",
    "stats":{
        "mvt": 2
    },
    "pos": {
        "x": 1,
        "y": 1
    }
};

let tiles = document.querySelectorAll(".tile");

tiles.forEach(el => {
    let tile = {
        dom: el,
        x: parseInt(el.getAttribute("x")),
        y: parseInt(el.getAttribute("y")),
        occupied: {
            "isOccupied": false,
            "unit": {}
        },
        terrain: {}
    };
    //console.log(tile.x, tile.y);
    tileArray.push(tile);
});

function dispUnit(unit){
    tileArray.forEach(tile => {
        if(tile.x == unit.pos.x && tile.y == unit.pos.y){
            tile.occupied = {"isOccupied": true, "unit":unit};
            tile.dom.innerHTML = `<img class="board_sprite" src=${unit.img}>`;
            tileArray.forEach(oldTile => {
                if(oldTile.occupied.unit == tile.occupied.unit && oldTile.occupied.unit != {} && oldTile != tile){
                    oldTile.occupied.isOccupied = false;
                    oldTile.occupied.unit = {};
                    oldTile.dom.innerHTML = '';
                };
            });
        };
    });
    turnInit();
};

dispUnit(testUnit);

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
    //console.log(tile, dist)
    let tilesInRange = [];
    tileArray.forEach(el => {
        if (Math.abs(el.x - tile.x) + Math.abs(el.y - tile.y) <= dist){
            tilesInRange.push(el);
        }
    });
    return tilesInRange;
}

/* tileArray.forEach(el => { //Shows tiles within range.
    const range = 2;
    el.dom.addEventListener("mouseover", el => {
        el = getTile(el.target);
        tilesInRange(el, range).forEach(tile => tile.dom.classList.add("viable"));
    });
    el.dom.addEventListener("mouseout", el => {
        el = getTile(el.target);
        tilesInRange(el, range).forEach(tile => tile.dom.classList.remove("viable"));
    })
}); */

function turnInit(){
    tileArray.forEach(el => {
        if(el.occupied.isOccupied == true){
            el.dom.addEventListener("click", domTile => {
                const tile = getTile(domTile.target);
                const unit = tile.occupied.unit;
                tilesInRange(tile, unit.stats.mvt).forEach(tiles => {
                    tiles.dom.classList.add("viable")
                });
                tileArray.forEach(tiles => {
                    if(tiles != tile){
                        function deselect(){
                            tileArray.forEach(dis => {
                            dis.dom.classList.remove("viable");
                            tileArray.forEach(selector => selector.dom.removeEventListener("click", deselect));
                            });
                        };
                        tiles.dom.addEventListener("click", deselect);
                    };
                });
                tileArray.forEach(unitStart => {
                    if(unitStart.dom.classList.contains("viable") && unitStart != tile){
                        function moveUnit(unitDest){
                            unitDest = getTile(unitDest.target);
                            unit.pos.x = unitDest.x;
                            unit.pos.y = unitDest.y;
                            dispUnit(unit);
                            tileArray.forEach(otherDest => {
                                if(otherDest.dom.classList.contains("viable") && unitStart != tile){
                                    otherDest.dom.removeEventListener(moveUnit);
                                }
                            });
                        };
                        unitStart.dom.addEventListener("click", unitDest => {moveUnit(unitDest)});
                    };
                });
            });
        };
    });
};

/* tileArray.forEach(el => {
    if(el.occupied.isOccupied == true){
        el.dom.addEventListener("click", domTile => {
            const tile = getTile(domTile.target);
            const unit = tile.occupied.unit;
            tilesInRange(tile, unit.stats.mvt).forEach(tiles => {
                tiles.dom.classList.add("viable")
            });
            tileArray.forEach(tiles => {
                if(tiles != tile){
                    function deselect(){
                        tileArray.forEach(dis => {
                        dis.dom.classList.remove("viable");
                        tileArray.forEach(selector => selector.dom.removeEventListener("click", deselect));
                        });
                    };
                    tiles.dom.addEventListener("click", deselect);
                };
            });
            tileArray.forEach(unitStart => {
                if(unitStart.dom.classList.contains("viable") && unitStart != tile){
                    function moveUnit(unitDest){
                        unitDest = getTile(unitDest.target);
                        unit.pos.x = unitDest.x;
                        unit.pos.y = unitDest.y;
                        dispUnit(unit);
                        tileArray.forEach(otherDest => {
                            if(otherDest.dom.classList.contains("viable") && unitStart != tile){
                                otherDest.dom.removeEventListener(moveUnit);
                            }
                        });
                    };
                    unitStart.dom.addEventListener("click", unitDest => {moveUnit(unitDest)});
                };
            });
        });
    };
}); */