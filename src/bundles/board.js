import { DOMELEMENTS } from "./domElements";
import { clickListener } from "./clickListener";

let tileArray = []; //Grabs all tiles on the board, passes into an array with proporties we'll use later.

function mapGen(xlim, ylim){ //Generate grid
    for(let xtile = xlim; xtile > 0; xtile--){
        DOMELEMENTS.board.insertAdjacentHTML("afterbegin", `<div id="row${xtile}" class="row"></div>`);
        for(let ytile = ylim; ytile > 0; ytile--){
            document.getElementById(`row${xtile}`).insertAdjacentHTML("beforeend", `<div class="tile" x="${xtile}" y="${ytile}"></div>`)
        }
    }
}

mapGen(10,10);

const amelia = {
    "img": "./img/ameliaIdle.png",
    "name": "Amelia",
    "stats":{
        "mvt": 2
    },
    "pos": {
        "x": 2,
        "y": 2
    }
};

const erika = {
    "img": "./img/erikaIdle.png",
    "name": "Erika",
    "stats":{
        "mvt": 3
    },
    "pos": {
        "x": 3,
        "y": 3
    }
}

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
            if(tile.occupied.isOccupied == true){
                //return;
            };
            tile.occupied = {"isOccupied": true, "unit":unit};
            tile.dom.innerHTML = `<img class="board_sprite" src=${unit.img}>`;
            tileArray.forEach(oldTile => {
                if(oldTile.occupied.unit == tile.occupied.unit && oldTile.occupied.unit != {} && oldTile != tile){
                    oldTile.occupied.isOccupied = false;
                    oldTile.occupied.unit = {};
                    oldTile.dom.classList.remove("active");
                    if((oldTile.x < tile.x) || (oldTile.x == tile.x && oldTile.dom.classList.contains('flip'))){
                        tile.dom.classList.add("flip");
                    }
                    oldTile.dom.innerHTML = "";
                    oldTile.dom.classList.remove("flip");
                };
            });
        };
    });
    turnInit();
};

dispUnit(amelia);
dispUnit(erika);

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
        if (Math.abs(el.x - tile.x) + Math.abs(el.y - tile.y) <= dist && el.occupied.isOccupied == false){
            tilesInRange.push(el);
        }
    });
    return tilesInRange;
}

function turnInit(){
    tileArray.forEach(el => {
        if(el.occupied.isOccupied == true && el.occupied.unit != {}){
            function turnRes(domTile){
                let active;
                tileArray.forEach(tile => {
                    if(tile.dom.classList.contains("active")){
                        active = tile;
                    };
                });
                if(active){
                    active.dom.classList.remove("active");
                    //removeAllListeners();
                    //turnRes(domTile);
                    //console.log(domTile, active);
                    return;
                }else{
                    const tile = getTile(domTile.target);
                    const unit = tile.occupied.unit;
                    tile.dom.classList.add("active");

                    /* tileArray.forEach(t => {
                        if(t.occupied.isOccupied == true && t != tile){
                            removeAllListeners();
                        }
                    }); */

                    tilesInRange(tile, unit.stats.mvt).forEach(tiles => {
                        tiles.dom.classList.add("viable");
                    });

                    function moveunit(e){
                        let unitDest = getTile(e.target);
                        tileArray.forEach(unitStart => {
                            if(unitStart.x == unit.pos.x && unitStart.y == unit.pos.y){
                                unitStart.dom.removeEventListener("click", turnRes);
                            }
                        });
                        unit.pos.x = unitDest.x;
                        unit.pos.y = unitDest.y;
                        removeAllListeners();
                        dispUnit(unit);
                    };

                    function removelisteners(tile){
                        if(tile.target){
                            tile = getTile(tile.target);
                        }
                        tile = tile.dom;
                        tile.classList.remove("viable");
                        tile.classList.remove("active");
                        //tile = tile.cloneNode(true);
                        /* let clone = tile.cloneNode(true);
                        tile.parentNode.replaceChild(clone, tile); */

                        //tile.removeEventListener("click", removelisteners);
                        tile.removeEventListener("click", moveunit);
                        //tile.removeEventListener("click", turnRes);
                    
                    }

                    function removeAllListeners(){
                        tileArray.forEach(removelisteners);
                        turnInit();
                    }

                    tileArray.forEach(unitStart => {
                        if(unitStart.dom.classList.contains("viable") && unitStart != tile){
                            unitStart.dom.addEventListener("click", moveunit);
                        };
                    });

                    tileArray.forEach(tiles => {
                        if(!tiles.dom.classList.contains("viable")){
                            tiles.dom.addEventListener("click", removeAllListeners);
                        };
                    });

                };
            };
            el.dom.addEventListener("click", turnRes);
        };
    });
};