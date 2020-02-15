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

const amelia = {
    "img": "./img/ameliaIdle.png",
    "name": "Amelia",
    "stats":{
        "mvt": 2
    },
    "pos": {
        "x": 1,
        "y": 1
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
        "y": 6
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

            };
            tile.occupied = {"isOccupied": true, "unit":unit};
            tile.dom.innerHTML = `<img class="board_sprite" src=${unit.img}>`;
            tileArray.forEach(oldTile => {
                if(oldTile.occupied.unit == tile.occupied.unit && oldTile.occupied.unit != {} && oldTile != tile){
                    oldTile.occupied.isOccupied = false;
                    oldTile.occupied.unit = {};
                    if(oldTile.x < tile.x || (oldTile.x == tile.x && oldTile.dom.style.transform == "scaleX(-1)")){
                        console.log('flip');
                        tile.dom.style.transform = "scaleX(-1)";
                    }
                    oldTile.dom.innerHTML = '';
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

function test(e){
    console.log('test', e.target);
    tileArray.forEach(el => el.dom.removeEventListener("click", test));
}

function turnInit(){
    tileArray.forEach(el => {
        if(el.occupied.isOccupied == true){
            function turnRes(domTile){
                const tile = getTile(domTile.target);
                const unit = tile.occupied.unit;
                tilesInRange(tile, unit.stats.mvt).forEach(tiles => {
                    tiles.dom.classList.add("viable")
                });

                function moveunit(e){
                    let unitDest = getTile(e.target);
                    //console.log(unitDest);
                    tileArray.forEach(unitStart => {
                        if(unitStart.x == unit.pos.x && unitStart.y == unit.pos.y){
                            unitStart.dom.removeEventListener("click", turnRes);
                        }
                    });
                    unit.pos.x = unitDest.x;
                    unit.pos.y = unitDest.y;
                    dispUnit(unit);
                    /* tileArray.forEach(otherDest => {
                        if(otherDest.dom.classList.contains("viable") && unitStart != tile){
                            otherDest.dom.removeEventListener("click", moveUnit);
                        }
                    }); */
                    tileArray.forEach(deselector => {
                        //console.log(deselector);
                        deselector.dom.removeEventListener("click", moveunit);
                        deselector.dom.classList.remove("viable");
                    });
                };

                /* function move(e){
                    console.log('firing', e);
                } */

                tileArray.forEach(tiles => {
                    function deselect(){
                        tileArray.forEach(dis => {
                            dis.dom.classList.remove("viable");
                            tileArray.forEach(selector => selector.dom.removeEventListener("click", deselect));
                            tileArray.forEach(selector => selector.dom.removeEventListener("click", moveunit));
                        });
                    };
                    //tiles.dom.addEventListener("click", deselect);
                    
                });
                tileArray.forEach(unitStart => {
                    if(unitStart.dom.classList.contains("viable") && unitStart != tile){
                        unitStart.dom.addEventListener("click", moveunit);
                    };
                });
            }

            el.dom.addEventListener("click", turnRes);
        };
    });
};