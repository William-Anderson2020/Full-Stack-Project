import io from "socket.io-client"
const socket = io("/map"); //Import and connect socket.io to the "maps" namespace.

import{ maps } from "./maps"
import{ Unit } from "./unit"


let tileArray = []; //Grabs all tiles on the board, passes into an array with proporties we'll use later.
let unitArray = []; //A dynamic array holding all of the unit objects in the game.
let unitTileArray = []; //A dynamic array holding the tiles occupied by a unit.
let viableTiles = false; //A variable used to determine if any tile functions are active.
let map = maps[0]; //Declaring which map will be used.

function mapGen(xlim, ylim){ //Generates the game board. Dynamic, can generate any size rectangle.
    for(let xtile = xlim; xtile > 0; xtile--){
        document.getElementById("container").insertAdjacentHTML("afterbegin", `<div id="row${xtile}" class="row"></div>`);
        for(let ytile = ylim; ytile > 0; ytile--){
            document.getElementById(`row${xtile}`).insertAdjacentHTML("beforeend", `<div class="tile" x="${xtile}" y="${ytile}"></div>`);
        };
    };
};

mapGen(10,10); // Generating map.

let playerNum; //User variables. Build into later.
let activePlayer = 1;
let thisUser;
let oppUser;

/* const amelia = { //Test units.
    "sprite": {
        "idle": "../img/ameliaIdle.png",
        "attack": "../img/ameliaAtk.gif",
    },
    "name": "Amelia",
    "hp": {
        m: 20,
        c: 20
    },
    "weapon": "spear",
    "stats":{
        "atk": 30,
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
    "special":{
        "attacks":{
            "0": {
                "name": "Tempest Lance",
                "stats": {
                    "atk": 5
                }
            },
        },
        active: ""
    },
    "active":{
        mvt: 2,
        atk: true
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
    "hp": {
        m: 25,
        c: 25
    },
    "weapon": "sword",
    "stats":{
        "atk": 0,
        "def": 1,
        "mvt": 3,
        "rng": 1,
        "dex": 20,
        "lck": 30
    },
    "pos": {
        "x": 5,
        "y": 5,
        "tile": {}
    },
    "item":{
        "name": "Wooden Shield",
        "stats": {
            "atk": 1,
            "def": 2
        }
    },
    "active":{
        mvt: 3,
        atk: true
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
}; */

//unitArray.push(amelia, erika);

let tiles = document.querySelectorAll(".tile"); //Retrieve all tiles created in mapGen();
//console.log(map);

tiles.forEach(el => { //Apply proporties to each tile, pass to tileArray.
    let tile = {
        "dom": el,
        "x": parseInt(el.getAttribute("x")), //Location of tile.
        "y": parseInt(el.getAttribute("y")),
        "occupied": { //Updated dynamically, tells if tile is occupied by a unit.
            "isOccupied": false,
            "unit": {}
        },
        "terrain": { //Holds terrain proporties.
            "type": "",
            "stats": {
                "mvtc": 1
            }
        }
    };
    map.tiles.forEach(mT => { //Applies terrain effects to tiles if applicatble. Terrain effects designated in maps.js.
        if(mT.x == tile.x && mT.y == tile.y){
            tile.terrain = mT.terrain;
        };
    });
    tileArray.push(tile);
});

function dispUnit(unit){ //Displays unit on board after a position update.
    if(unit.hp.c <= 0){
        return
    };
    tileArray.forEach(tile => {
        if(tile.x == unit.pos.x && tile.y == unit.pos.y){
            tile.occupied = {"isOccupied": true, "unit":unit}; //Update tile obj.
            tile.dom.innerHTML = `<img class="board_sprite" src=${unit.sprite.idle}>`; //Generate user sprite on screen.
            unitTileArray.push(tile);
            tileArray.forEach(oldTile => {
                if(oldTile.occupied.unit == tile.occupied.unit && oldTile.occupied.unit != {} && oldTile != tile){
                    unitTileArray = unitTileArray.filter(function(toRemove){return toRemove != oldTile;}); //Remove proporties from old tile.
                    oldTile.occupied.isOccupied = false;
                    oldTile.occupied.unit = {};
                    oldTile.dom.classList.remove("active");
                    if((oldTile.x < tile.x) || (oldTile.x == tile.x && oldTile.dom.classList.contains("flip"))){//Decide if sprite should be displayed facing left or right.
                        tile.dom.classList.add("flip");
                    }
                    oldTile.dom.innerHTML = "";
                    oldTile.dom.classList.remove("flip");
                };
            });
        };
    });
};

let get = { //Initialize get obj for calling items from db.
    async user(id){ //Retrieve user from db.
        if(!id){id = document.getElementById("userTag").getAttribute("uid")}; //If no id is passed, default to user which generated the page. This attribute is passed in through passport on the back end.
        let data = await fetch(`/users/find/${id}`);
        let user = await data.json();
        if(id == document.getElementById("userTag").getAttribute("uid")){ //If user is the page owner, set game variables accordingly.
            thisUser = user;
            thisUser.playerNum = playerNum;
            document.getElementById("userTag").innerHTML = thisUser.name;
            if(playerNum == 1){
                thisUser.gameSide = "l"
                user.gameSide = "l"
                gameSide = "l";
            }else{
                thisUser.gameSide = "r"
                user.gameSide = "r"
                gameSide = "r";
            };
        }else{
            oppUser = user;
            if(playerNum == 1){
                user.gameSide = "r"
                oppUser.gameSide = "r"
            }else{
                user.gameSide = "l"
                oppUser.gameSide = "l"
            }
        };
        user.activeUnits.forEach(async (el) => { //Retrive units from db, pass in additional parameters.
            let unit = await get.unit(el.id, user.activeUnits.findIndex(u=> u.id == el.id), user.gameSide);
            unit.side = user.gameSide;
            unit.setOwner(user._id);
            /* if(el.item){ //Item function. Inclusion for later addition of item system.
                unit.item = get.item(el.item);
            } */
        }); 
        unitArray.forEach(u => {//Apply sprite flip if nessecary
            if(u.side == "l"){
                u.tile().dom.classList.add("flip");
            }
        });
        
    },
    async unit(id, index, aSide){
        let data = await fetch(`/characters/${id}`);
        data = await data.json()
        let unitImport = new Unit(data.name, data.hp, data.stats, data._id);

        function setPos(){
            let startTile;
            let sTArray = [];
                if(aSide == "l"){startTile = "P1 Starting Tile"}else{startTile = "P2 Starting Tile"};
            sTArray = tileArray.filter(el => {
                if(el.terrain.type == startTile && el.occupied.isOccupied == false){
                    console.log(el);
                    return el;
                }
            });
            return sTArray;
        }

        let uTile = setPos()[index];
        unitImport.pos.x = uTile.x;
        unitImport.pos.y = uTile.y;

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

        unitImport.tile().occupied.isOccupied = true;
        unitImport.tile().occupied.unit = unitImport;

        unitImport.active = {
            mvt: unitImport.stats.mvt,
            atk: true
        },

        unitArray.push(unitImport);
        dispUnit(unitImport);
        console.log(unitImport);
        return unitImport;
    }
};
//get.user();

function turnPass(){
    if(playerNum != activePlayer){
        return;
    }
    let pass;
    if(playerNum == 1){
        pass = 2;
    }else if(playerNum == 2){
        pass = 1;
    };
    console.log(`Passing to ${pass}.`)
    socket.emit("turnPass", {"pass": pass, "room": room});
};


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

    /* tilesInRange(unit.tile(), 1).forEach(el => {
        if(el.terrain.type == "Mountain" || (el.occupied.isOccupied == true && el.occupied.unit.owner != unit.owner)){
            return;
        }; */
        let checkTiles = tilesInRange(unit.tile(), 1);
        for(let i = 0; unit.active.mvt - 1  >= i; i++){
            //console.log(i, unit.active.mvt);
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
    /* }); */

    /* tilesInRange(unit.tile(), 1){

    } */

    return viableTilesR;
};

function uiDisplay(unit){
    //console.log("UI DISP");
    document.getElementById("nameDisp").innerHTML = `${unit.name}`;
    Object.keys(unit.stats).forEach(stat => {
        document.getElementById(`${stat}Disp`).innerHTML = `${stat}: ${unit.stats[stat]}`;
    });
    document.getElementById("hpDisp").innerHTML = `hp: ${unit.hp.c}/${unit.hp.m}`;
    document.getElementById("mvtDisp").innerHTML = `mvt: ${unit.active.mvt}/${unit.stats.mvt}`;
};

function uiClear(){
    document.getElementById("nameDisp").innerHTML = "";
    Array.from(document.getElementById("statCont").children).forEach(disp => disp.innerHTML = "");
};

function gameInit(){
    tileArray.forEach(el =>{
        el.dom.addEventListener("click", turnInit);
    });
    unitTileArray.forEach(tile => { //Apply one-time hp buffs
        let unit = tile.occupied.unit;
        if(unit.item.stats.hp){
            unit.hp.c += unit.item.stats.hp;
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
    defender.hp.c -= dmg;

    console.log(attacker.hp.c, defender.hp.c);
    if(crit > 1){
        console.log("Critical!");
    };
};

function battleRes(attacker, defender){
    battleDisp(attacker, defender);
    damageCalc(attacker, defender);
    if(defender.hp.c <= 0){
        socket.emit("unitDefeated", {x: defender.pos.x, y: defender.pos.y, room: room});
        /* setTimeout(function(){defender.tile().dom.children[0].classList.add("unitDefeated");}, 1600) //Unit Death
        setTimeout(function(){defender.tile().dom.innerHTML = ""}, 2800); */
    }
    socket.emit("boardUpdate", {data: unitArrayTravelSize(), type:"atk", attacker: attacker.id.uniqueID, defender: defender.id.uniqueID, room:room});
    
};

let unit;

function turnInit(el){
    let tile = getTile(el.target);

    if(activePlayer != playerNum){
        if(tile.occupied.isOccupied == true){
            uiDisplay(tile.occupied.unit);
        }else{
            uiClear();
        };
        return;
    };
    
    if(tile.occupied.isOccupied == true){
        if(tile.dom.classList.contains("atkViable") && tile.occupied.unit.owner != unit.owner){
            battleRes(unit, tile.occupied.unit);
            uiDisplay(tile.occupied.unit);
            unit.active.atk = false;
            //console.log("t1" + unitArray.filter(u => u.owner == playerNum).filter(u => u.active.atk == true).length);
            if(!unitArray.filter(u => u.owner == thisUser._id).filter(u => u.active.atk == true).length){
                turnPass();
            };
        }else{
            unit = tile.occupied.unit;
            uiDisplay(tile.occupied.unit);
        }
        tileArray.forEach(r => {
            r.dom.classList.remove("viable", "atkViable");
        });
    }else{
        uiClear();
    }

    function moveUnit(e){
        let unitDest = e /* getTile(e.target); */
        unit.active.mvt -= (Math.abs(unitDest.x - unit.pos.x) + Math.abs(unitDest.y - unit.pos.y));
        unit.pos.x = unitDest.x;
        unit.pos.y = unitDest.y;
        viableTiles = false;
        dispUnit(unit);
        socket.emit('boardUpdate', {data: unitArrayTravelSize(), type: "move", room:room});
        tileArray.forEach(tiles => {
            tiles.dom.classList.remove("viable", "atkViable");
            tiles.dom.removeEventListener("click", moveUnit);
        });
        //console.log(tilesInRange(unit.tile(), unit.stats.rng).filter(tile => tile.occupied.isOccupied == true).filter(tile => tile.occupied.unit.owner != playerNum).length + " units in range")
        if(!tilesInRange(unit.tile(), unit.stats.rng).filter(tile => tile.occupied.isOccupied == true).filter(tile => tile.occupied.unit.owner != thisUser._id).length){
            unit.active.atk = false;
            if(!unitArray.filter(u => u.owner == thisUser._id).filter(u => u.active.atk == true)){
                console.log("NO MVT LEFT, PASS TURN");
                turnPass();
            }

        }
    };

    

    if(unit.owner == thisUser._id && unit.active.atk == true){

        if((!unitTileArray.includes(tile)) || (viableTiles == true)){
            if(tile.dom.classList.contains("viable")){
                moveUnit(tile);
            };
            tileArray.forEach(r => {
                r.dom.classList.remove("viable", "atkViable");
                viableTiles = false;
            });
            uiClear();
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

        if(unit.active.mvt == 0){
        tilesInRange(unit.tile(), unit.stats.rng).forEach(atkTile => {
            if((!atkTile.dom.classList.contains("viable") || (atkTile.occupied.isOccupied == true && atkTile.occupied.unit.owner != unit.owner)) && (atkTile.occupied.unit.owner != unit.owner)){
                atkTile.dom.classList.add("atkViable");
            };
        });   
        }
    }
    

    
};

gameInit();

let room;

socket.on("cT", (el) => {
    //console.log(el.msg);
    room = window.location.pathname.slice(6);
    let pos = room.indexOf('/');
    if (pos !== -1) {
        room = room.slice(0, pos);
    }
    socket.emit("joinRoom", {room: room});
})

socket.on("rT", (el) => {
    //console.log("data recieved");
    //console.log(el.data);
    unitArray.forEach(u => {
        el.data.forEach(d => {
            if(d.id.uniqueID == u.id.uniqueID){ //Switch to unique id once implemented
                Object.keys(d).forEach(key => {
                    u[key] = d[key];
                });
                dispUnit(u);
            };
        });
        u.active.mvt = u.stats.mvt;
        u.active.atk = true;
    });
    if(el.type == "atk"){
        let attacker, defender;
        unitArray.forEach(atk => {if(atk.id.unitID == el.attacker){attacker = atk}});
        unitArray.forEach(def => {if(def.id.unitID == el.defender){defender = def}});
        battleDisp(attacker, defender);
    };
});

socket.on("sendU", () => {
    if(!thisUser){
        return console.log("No user to send")
    }
    console.log("SEND U")
    socket.emit("userRelay", {user: thisUser._id, room: room});
    if(thisUser && !oppUser){
        setTimeout(function(){
            console.log("P1 req opp.")
            socket.emit("p1Req");
        }, 3000)
        
    }
});

socket.on("recieveU", data => {
    console.log(`GET U ${data.user}`);
    //if(data.user == thisUser._id){return console.log("Duplicate user, returning...")};
    get.user(data.user);
});

socket.on("p1ReqF", () => {
    socket.emit("userRelay", {user: thisUser._id, room: room});
});

socket.on("userNum", data => { //Send account id to db with player nums, as is both players will be assigned 2 on refresh
    playerNum = data.num;
    get.user();
    //onsole.log(playerNum);
});

socket.on("newTurn", data => {
    console.log(`Turn passed to ${data.pass}`);
    activePlayer = data.pass;
})

socket.on("unitDefeatedRelay", data => {
    let defender;
    unitArray.forEach(u => {
        if (u.pos.x == data.x && u.pos.y == data.y){
            defender = u;
            console.log(data, defender);
        }
    });
    setTimeout(function(){defender.tile().dom.children[0].classList.add("unitDefeated");}, 1600) //Unit Death
    setTimeout(function(){defender.tile().dom.innerHTML = ""}, 2800);
    defender.tile().occupied = {isOccupied: false, unit: {}};
    if(!unitArray.filter(u => u.hp.c > 0).filter(u => u.owner == defender.owner).length){
        console.log(`Player ${defender.owner} has lost!`);
    }
});

socket.on("roomFull", function(){
    window.location.href = "/serverIndex";
    socket.to(socket.id).emit("roomFullErr");
});

document.getElementById("turnPass").addEventListener("click", turnPass);