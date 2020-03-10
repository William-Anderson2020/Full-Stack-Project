//import { DOMELEMENTS } from "./domElements";
//import { clickListener } from "./clickListener";

let tileArray = []; //Grabs all tiles on the board, passes into an array with proporties we'll use later.
let unitArray = [];
let unitTileArray = [];
let viableTiles = false;

function mapGen(xlim, ylim){ //Generate grid
    for(let xtile = xlim; xtile > 0; xtile--){
        document.getElementById("container").insertAdjacentHTML("afterbegin", `<div id="row${xtile}" class="row"></div>`);
        for(let ytile = ylim; ytile > 0; ytile--){
            document.getElementById(`row${xtile}`).insertAdjacentHTML("beforeend", `<div class="tile" x="${xtile}" y="${ytile}"></div>`);
        }
    }
}

mapGen(10,10);

const amelia = {
    "img": "./img/ameliaIdle.png",
    "name": "Amelia",
    "stats":{
        "mvt": 2,
        "rng": 1
    },
    "pos": {
        "x": 2,
        "y": 2
    },
    "owner": "Player 1"
};

const erika = {
    "img": "./img/erikaIdle.png",
    "name": "Erika",
    "stats":{
        "mvt": 3,
        "rng": 1
    },
    "pos": {
        "x": 3,
        "y": 3
    },
    "owner": "Player 2"
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
            if(tile.occupied.isOccupied == true){
                //return;
            };
            tile.occupied = {"isOccupied": true, "unit":unit};
            tile.dom.innerHTML = `<img class="board_sprite" src=${unit.img}>`;
            unitTileArray.push(tile);
            tileArray.forEach(oldTile => {
                if(oldTile.occupied.unit == tile.occupied.unit && oldTile.occupied.unit != {} && oldTile != tile){
                    unitTileArray = unitTileArray.filter(function(toRemove){return toRemove != oldTile;});
                    oldTile.occupied.isOccupied = false;
                    oldTile.occupied.unit = {};
                    oldTile.dom.classList.remove("active");
                    if((oldTile.x < tile.x) || (oldTile.x == tile.x && oldTile.dom.classList.contains("flip"))){
                        tile.dom.classList.add("flip");
                    }
                    oldTile.dom.innerHTML = "";
                    oldTile.dom.classList.remove("flip");
                };
            });
        };
    });
    //turnInit();
};

dispUnit(amelia);
dispUnit(erika);

function getTile(el){ // Checks value of dom element and returns corrosponding tile from array
    let match;
    tileArray.forEach(tile => {
        if(tile.x == el.getAttribute("x") && tile.y == el.getAttribute("y")){
            match = tile;
        }
    });
    return match;
}

function tilesInRange(tile, dist){
    //console.log(tile, dist)
    let tilesInRange = [];
    tileArray.forEach(el => {
        if (Math.abs(el.x - tile.x) + Math.abs(el.y - tile.y) <= dist /*&& el.occupied.isOccupied == false*/){
            tilesInRange.push(el);
        }
    });
    return tilesInRange;
}

function gameInit(){
    tileArray.forEach(el =>{
        el.dom.addEventListener("click", turnInit);
    })
}

let unit;

function turnInit(el){
    let tile = getTile(el.target);
    
    if(tile.occupied.isOccupied == true){
        unit = tile.occupied.unit;
        tileArray.forEach(r => {
            r.dom.classList.remove("viable", "atkViable");
        });
    }

    function moveUnit(e){
        let unitDest = e /* getTile(e.target); */
        unit.pos.x = unitDest.x;
        unit.pos.y = unitDest.y;
        viableTiles = false;
        dispUnit(unit);

        //tilesInRange(tile, unit.stats.mvt)
        tileArray.forEach(tiles => {
            tiles.dom.classList.remove("viable", "atkViable");
            tiles.dom.removeEventListener("click", moveUnit);
        });
    };

    if((!unitTileArray.includes(tile)) || (viableTiles == true)){
        if(tile.dom.classList.contains("viable")){
            moveUnit(tile);
        };
        tileArray.forEach(r => {
            r.dom.classList.remove("viable");
            viableTiles = false;
        });
        return;
    };

    tilesInRange(tile, unit.stats.mvt).forEach(tiles => {
        if(tiles.occupied.isOccupied == false){
            tiles.dom.classList.add("viable");
        };
        viableTiles = true;
    });

    tilesInRange(tile, (unit.stats.mvt + unit.stats.rng)).forEach(atkTile => {
        if((!atkTile.dom.classList.contains("viable") || (atkTile.occupied.isOccupied == true && atkTile.occupied.unit.owner != unit.owner)) && (atkTile.occupied.unit.owner != unit.owner)){
            atkTile.dom.classList.add("atkViable");
        };
    });

}

gameInit();