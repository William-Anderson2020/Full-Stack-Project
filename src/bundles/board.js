//import { DOMELEMENTS } from "./domElements";
//import { clickListener } from "./clickListener";

import{ maps } from "./maps"
import io from "socket.io-client"
const socket = io("/map");

import{ Unit } from "./unit"

let tileArray = []; //Grabs all tiles on the board, passes into an array with proporties we'll use later.
let unitArray = [];
let unitTileArray = [];
let viableTiles = false;
let map = maps[0];

function mapGen(xlim, ylim){ //Generate grid
    for(let xtile = xlim; xtile > 0; xtile--){
        document.getElementById("container").insertAdjacentHTML("afterbegin", `<div id="row${xtile}" class="row"></div>`);
        for(let ytile = ylim; ytile > 0; ytile--){
            document.getElementById(`row${xtile}`).insertAdjacentHTML("beforeend", `<div class="tile" x="${xtile}" y="${ytile}"></div>`);
        };
    };
};

mapGen(10,10);

let playerNum;
let activePlayer = 1;

const amelia = {
    "sprite": {
        "idle": "../img/ameliaIdle.png",
        "attack": "../img/ameliaAtk.gif",
    },
    "name": "Amelia",
    "hp": 20,
    "weapon": "spear",
    "stats":{
        "atk": 3,
        "def": 2,
        "mvt": 2,
        "rng": 1,
        "lck": 2,
        "dex": 3
    },
    "pos": {
        "x": 3,
        "y": 5,
        "tile": {}
    },
    "item":{
        "name": "Goddess Ring",
        "stats": {
            "def": 1,
            "hp": 3
        }
    },
    "owner": 1,
    "id": {
        "unitID": 1
    },
    "tile": function(){
        let uPos;
        tileArray.forEach(t => {
            if(t.x == this.pos.x && t.y == this.pos.y){
                uPos = t;
            }
        });
        return uPos;
    }
};

const erika = {
    "sprite": {
        "idle": "../img/erikaIdle.png",
        "attack": "../img/erikaAtk.gif",
    },
    "name": "Erika",
    "hp": 25,
    "weapon": "sword",
    "stats":{
        "atk": 2,
        "def": 1,
        "mvt": 3,
        "rng": 1,
        "dex": 20,
        "lck": 30
    },
    "pos": {
        "x": 7,
        "y": 7,
        "tile": {}
    },
    "item":{
        "name": "Wooden Shield",
        "stats": {
            "atk": 1,
            "def": 2
        }
    },
    "owner": 2,
    "id": {
        "unitID": 2
    },
    "tile": function(){
        let uPos;
        tileArray.forEach(t => {
            if(t.x == this.pos.x && t.y == this.pos.y){
                uPos = t;
            }
        });
        return uPos;
    }
};

unitArray.push(amelia, erika);

let tiles = document.querySelectorAll(".tile");
//console.log(map);

tiles.forEach(el => {
    let tile = {
        "dom": el,
        "x": parseInt(el.getAttribute("x")),
        "y": parseInt(el.getAttribute("y")),
        "occupied": {
            "isOccupied": false,
            "unit": {}
        },
        "terrain": {
            "type": "",
            "stats": {
                "mvtc": 1
            }
        }
    };
    map.tiles.forEach(mT => {
        if(mT.x == tile.x && mT.y == tile.y){
            tile.terrain = mT.terrain;
        };
    });
    tileArray.push(tile);
});

function dispUnit(unit){
    tileArray.forEach(tile => {
        if(tile.x == unit.pos.x && tile.y == unit.pos.y){
            tile.occupied = {"isOccupied": true, "unit":unit};
            //unit.tile() = tile;
            tile.dom.innerHTML = `<img class="board_sprite" src=${unit.sprite.idle}>`;
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

let get = {
    async unit(id){
        let data = await fetch(`/characters/${id}`); //Replace with working url
        data = await data.json()
        let unitImport = new Unit(data.name, data.hp, data.stats, data._id);

        unitImport.side = "l"
        unitImport.setPos(tileArray, map);
        

        unitImport.sprite.idle = await fetch(`/characters/image/idle/${id}`).then(im => im.url);
        unitImport.sprite.attack = await fetch(`/characters/image/attack/${id}`).then(im => im.url);

        unitImport.tile = function(){
            let uPos;
            tileArray.forEach(t => {
                if(t.x == this.pos.x && t.y == this.pos.y){
                    uPos = t;
                }
            });
            return uPos;
        };

        unitArray.push(unitImport);
        dispUnit(unitImport);
    }
};

get.unit("5e8cb65fa341f32310aab149");
//console.log(unitArray);

function getTile(el){ // Checks value of dom element and returns corrosponding tile from array
    let match;
    tileArray.forEach(tile => {
        if(tile.x == el.getAttribute("x") && tile.y == el.getAttribute("y")){
            match = tile;
        }
    });
    return match;
}

/* function getUnitPos(unit){
    let uPos;
    tileArray.forEach(t => {
        if(t.x == unit.pos.x && t.y == unit.pos.y){
            uPos = t;
        }
    });
    return uPos;
} */

function tilesInRange(tile, dist){
    //console.log(tile, dist)
    let tilesInRange = [];
    tileArray.forEach(el => {
        if (Math.abs(el.x - tile.x) + Math.abs(el.y - tile.y) <= dist /*&& el.occupied.isOccupied == false*/){
            tilesInRange.push(el);
        }
    });
    return tilesInRange;
};

function unitArrayTravelSize(){
    let r = [];
    unitArray.forEach(el => {
        r.push({
            "id": el.id,
            "hp": el.hp,
            "stats": el.stats,
            "pos": {
                "x": el.pos.x,
                "y": el.pos.y            
            }
        });
    });
    //console.log(r);
    return r
}

function moveCheck(unit){
    let viableTilesR = [];
    let checkedTiles = [];

    tilesInRange(unit.tile(), 1).forEach(el => {
        if(el.terrain.type == "Mountain" || (el.occupied.isOccupied == true && el.occupied.unit.owner != unit.owner)){
            return;
        };
        let checkTiles = tilesInRange(el, 1);
        for(let i = 0; unit.stats.mvt - 1 > i; i++){
            checkTiles.forEach(tile => {
                if(/*!(tile.spMvt && !tile.terrain.spMvt.includes(unit.spMvt)) &&*/ tile.terrain.type != "Mountain" && !(tile.occupied.isOccupied && tile.occupied.unit.owner != unit.owner)){
                    tilesInRange(tile, 1).forEach(t => {
                        if(!checkedTiles.includes(t)){
                            checkTiles.push(t);
                            checkedTiles.push(t);
                        }
                    })
                    if(!viableTilesR.includes(tile)){
                        viableTilesR.push(tile);
                    };
                };
            });
        };
    });

    /* tilesInRange(unit.tile(), 1){

    } */

    return viableTilesR;
};

function gameInit(){
    tileArray.forEach(el =>{
        el.dom.addEventListener("click", turnInit);
    });
    unitTileArray.forEach(tile => { //Apply one-time hp buffs
        let unit = tile.occupied.unit;
        if(unit.item.stats.hp){
            unit.hp += unit.item.stats.hp;
        };
    });
};

function battleDisp(attacker, defender){
    let movementTiles = tilesInRange(defender.tile(), attacker.stats.rng);
        let atkTile = movementTiles[0];
        if(Math.abs(attacker.pos.x - defender.pos.x) + Math.abs(attacker.pos.y - defender.pos.y) > 1){
            movementTiles.forEach(m => {
                if(m.dom.classList.contains("viable") && (( Math.abs(m.x - attacker.pos.x) + Math.abs(m.y - attacker.pos.y)) < Math.abs((atkTile.x + atkTile.y)-(attacker.pos.x + attacker.pos.y)) || m.y == defender.pos.y)){
                    atkTile = m;
                };
            });
            attacker.pos.x = atkTile.x;
            attacker.pos.y = atkTile.y;
            if(defender.pos.x > attacker.pos.x && !attacker.tile().dom.classList.contains("flip")){
                attacker.tile().dom.classList.add("flip");
            }
            dispUnit(attacker);
        };
        attacker.tile().dom.innerHTML = `<img class="board_sprite anim_sprite" src="${attacker.sprite.attack}">`;
        if(attacker.pos.x < defender.pos.x){
            if(!attacker.tile().dom.classList.contains("flip")){
                attacker.tile().dom.classList.add("flip");
            }
        }else{
            if(attacker.tile().dom.classList.contains("flip")){
                attacker.tile().dom.classList.remove("flip");
            }
        };
        setTimeout(r => {dispUnit(attacker)}, 1600); /*Fix timing*/
}

function buffCalc(unit){
    let uB = Object.assign({}, unit.stats)
    let buffCounters = [];
    if(unit.item.stats){buffCounters.push(unit.item.stats)};
    if(unit.tile().terrain.stats){buffCounters.push(unit.tile().terrain.stats)};

    buffCounters.forEach(buff => {
        Object.keys(buff).forEach(key => {
            uB[key] += buff[key];
        });
    });
    //console.log(unit.tile().terrain);
    return uB;
}

function getWeapon(unit){
   let weapon;
   switch(unit.weapon){
       case "sword":
           weapon = "t1";
           break;
        case "magic":
            weapon = "t1";
            break;
        case "spear":
            weapon = "t2";
            break;
        case "axe":
            weapon = "t3";
            break;
        case "bow":
            wepaon = "t3";
            break;
        default:
            weapon = "t2";
            break;
   };
   return weapon;
};

function damageCalc(attacker, defender){
    let args = [...arguments];
    args.forEach(arg => {arg.cStats = buffCalc(arg)}); /*Use cStats for battle*/
  
    let adv = 1;
    let crit = 1;
    let mit = 0;

    if(attacker.weapon == "magic"){ /*mitigation factor*/
        mit = defender.cStats.res;
    } else{
        mit = defender.cStats.def;
    }

    /*weapon triangle*/
    let weaponA = getWeapon(attacker);
    let weaponD = getWeapon(defender);
    switch(weaponA){
        case "t1":
            switch(weaponD){
                case "t1":
                    break
                case "t2":
                    adv -= .2;
                    break;
                case "t3":
                    adv += .2;
                    break;
                default:
                    break;
            }
            break;
        case "t2":
            switch(weaponD){
                case "t1":
                    adv += .2;
                    break;
                case "t2":
                    break;
                case "t3":
                    adv -= .2;
                    break;
                default:
                    break;
            }
            break;
        case "t3":
            switch(weaponD){
                case "t1":
                    adv -= .2;
                    break;
                case "t2":
                    adv += .2;
                    break;
                case "t3":
                    break;
                default:
                    break;
            }
            break;
        default:
            console.log("weapon trianlge defaulting.");
    }

    /*Crit Calc*/
    if(Math.trunc(Math.random()*100) < (attacker.cStats.lck + attacker.cStats.dex - defender.cStats.lck)/2 ){ /*crit calc*/
        crit = 1.5;
    }

    let dmg = (attacker.cStats.atk + Math.trunc(attacker.cStats.atk * adv) - mit) * crit;
    if(dmg < 0){dmg = 0};
    console.log(dmg);
    defender.hp -= dmg;

    console.log(attacker.hp, defender.hp);
    if(crit > 1){
        console.log("Critical!");
    };
};

function battleRes(attacker, defender){
    battleDisp(attacker, defender);
    damageCalc(attacker, defender);
    socket.emit("boardUpdate", {data: unitArrayTravelSize(), type:"atk", attacker: attacker.id.unitID, defender: defender.id.unitID, room:room});
};

let unit;

function turnInit(el){
    let tile = getTile(el.target);

    if(activePlayer != playerNum){
        return;
    };
    
    if(tile.occupied.isOccupied == true){
        if(tile.dom.classList.contains("atkViable") && tile.occupied.unit.owner != unit.owner){
            //console.log('battle function here');
            battleRes(unit, tile.occupied.unit);
        }else{
            unit = tile.occupied.unit;
        }
        tileArray.forEach(r => {
            r.dom.classList.remove("viable", "atkViable");
        });
    };

    function moveUnit(e){
        let unitDest = e /* getTile(e.target); */
        unit.pos.x = unitDest.x;
        unit.pos.y = unitDest.y;
        viableTiles = false;
        dispUnit(unit);
        socket.emit('boardUpdate', {data: unitArrayTravelSize(), type: "move", room:room});
        tileArray.forEach(tiles => {
            tiles.dom.classList.remove("viable", "atkViable");
            tiles.dom.removeEventListener("click", moveUnit);
        });
    };

    

    if(unit.owner == playerNum){

        if((!unitTileArray.includes(tile)) || (viableTiles == true)){
            if(tile.dom.classList.contains("viable")){
                moveUnit(tile);
            };
            tileArray.forEach(r => {
                r.dom.classList.remove("viable", "atkViable");
                viableTiles = false;
            });
            return;
        };

        moveCheck(unit).forEach(tiles => {
            if(tiles.occupied.isOccupied == false){
                tiles.dom.classList.add("viable");
            };
            viableTiles = true;
        });

        moveCheck(unit).forEach(aT => {
            tilesInRange(aT, unit.stats.rng).forEach(atkTile => {
                if((!atkTile.dom.classList.contains("viable") || (atkTile.occupied.isOccupied == true && atkTile.occupied.unit.owner != unit.owner)) && (atkTile.occupied.unit.owner != unit.owner)){
                    atkTile.dom.classList.add("atkViable");
                };
            });
        });
    }
    

    
};

gameInit();

/* socket.on("relay", el => {
    console.log(el.msg);
}) */

let room;

socket.on("cT", (el) => {
    console.log(el.msg);
    room = window.location.pathname.slice(6);   // remove leading /chat/
    let pos = room.indexOf('/');
    if (pos !== -1) {
        room = room.slice(0, pos);
    }
    socket.emit("joinRoom", {room: room});
})

socket.on("rT", (el) => {
    console.log("data recieved");
    console.log(el.data);
    unitArray.forEach(u => {
        el.data.forEach(d => {
            if(d.id.unitID == u.id.unitID){ //Switch to unique id once implemented
                Object.keys(d).forEach(key => {
                    u[key] = d[key];
                });
                dispUnit(u);
            };
        });
    });
    if(el.type == "atk"){
        let attacker, defender;
        unitArray.forEach(atk => {if(atk.id.unitID == el.attacker){attacker = atk}});
        unitArray.forEach(def => {if(def.id.unitID == el.defender){defender = def}});
        battleDisp(attacker, defender);
    };
});

socket.on("userNum", data => { //Send account id to db with player nums, as is both players will be assigned 2 on refresh
    playerNum = data.num;
    console.log(playerNum);
});

socket.on("newTurn", data => {
    console.log(`Turn passed to ${data.pass}`);
    activePlayer = data.pass;
})

document.getElementById("turnPass").addEventListener("click", () => {
    if(playerNum != activePlayer){
        return;
    }
    let pass;
    console.log("PASS");
    if(playerNum == 1){
        pass = 2;
    }else if(playerNum == 2){
        pass = 1;
    };
    socket.emit("turnPass", {"pass": pass, "room": room});
});