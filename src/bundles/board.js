import io from "socket.io-client"
const socket = io("/map"); //Import and connect socket.io to the "maps" namespace.

import{ maps } from "./maps"
import{ Unit } from "./unit"


let tileArray = []; //Grabs all tiles on the board, passes into an array with proporties we'll use later.
let unitArray = []; //A dynamic array holding all of the unit objects in the game.
let unitTileArray = []; //A dynamic array holding the tiles occupied by a unit.
let unitCards = []; //Array housing a list of units who's cards are displayed.
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
let gameSide;
let cLog = document.getElementById("dialogue"); //Combat log

/* const amelia = { //Test units.
    "sprite": {
        "idle": "../img/ameliaIdle.png",
        "attack": "../img/ameliaAtk.gif",
        "portrait": "../img/ameliaportrait.gif"
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
        "portrait": "../img/erikaportrait.gif"
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
    if(unit.owner == thisUser._id){
        cardDisplayFunction(unit);
    }; //Display unit cards
};

let get = { //Initialize get obj for calling items from db.
    async user(id){ //Retrieve user from db.
        if(!id){id = document.getElementById("userTag").getAttribute("uid")}; //If no id is passed, default to user which generated the page. This attribute is passed in through passport on the back end.
        let data = await fetch(`/users/find/${id}`);
        let user = await data.json();
        if(id == document.getElementById("userTag").getAttribute("uid")){ //If user is the page owner, set game variables accordingly.
            thisUser = user;
            console.log("AT GET USER, PLAYER NUMBER IS ", playerNum);
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
            document.getElementById("oppTag").innerHTML = oppUser.name;
            if(playerNum == 1){
                user.gameSide = "r"
                oppUser.gameSide = "r"
            }else{
                user.gameSide = "l"
                oppUser.gameSide = "l"
            }
        };
        user.activeUnits.forEach(async (el) => { //Retrive units from db, pass in additional parameters.
            get.unit(el.id, user.activeUnits.findIndex(u=> u.id == el.id), user);
            /* if(el.item){ //Item function. Inclusion for later addition of item system.
                unit.item = get.item(el.item);
            } */
        }); 
        setTimeout(() => {
            turnLine();
            unitArray.filter(u=>u.owner == thisUser._id).forEach(u => cardDisplayFunction(u));
            unitArray.forEach(u => {//Apply sprite flip if nessecary
                if(u.side == "l"){
                    u.tile().dom.classList.add("flip");
                }
            });
        }, 500);
        
        
    },
    async unit(id, index, user){ //Function to retrieve unit from db
        let data = await fetch(`/characters/${id}`);
        data = await data.json()
        let unitImport = new Unit(data.name, data.hp, data.stats, data._id, data.weapon); //Build unit obj
        
        unitImport.setOwner(user._id)
        if(unitArray.filter(u => u.id.uniqueID == unitImport.id.uniqueID).length){
            return;
        };
        unitImport.side = user.gameSide;

        function setPos(){ //Setting initial position
            let startTile;
            let sTArray = [];
                if(user.gameSide == "l"){startTile = "P1 Starting Tile"}else{startTile = "P2 Starting Tile"};
            sTArray = tileArray.filter(el => {
                if(el.terrain.type == startTile && el.occupied.isOccupied == false){
                    return el;
                }
            });
            return sTArray;
        }

        let uTile = setPos()[index];
        unitImport.pos.x = uTile.x;
        unitImport.pos.y = uTile.y;

        unitImport.sprite.idle = await fetch(`/characters/image/idle/${id}`).then(im => im.url); //Retrieve unit sprites
        unitImport.sprite.attack = await fetch(`/characters/image/attack/${id}`).then(im => im.url);
        unitImport.sprite.portrait = await fetch(`/characters/image/portrait/${id}`).then(im => im.url);

        unitImport.tile = function(){ //Set location and tile proporties
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
        return unitImport;
    }
};
//get.user();

function turnPass(){ //Pass turn between players. Determines active user, siwtches them, then emits the event to all others in the room.
    if(playerNum != activePlayer || !oppUser ||!thisUser){
        return;
    }
    let pass;
    if(playerNum == 1){
        pass = 2;
    }else if(playerNum == 2){
        pass = 1;
    };
    let msg = turnPassMsgRandomizer(thisUser, oppUser);
    socket.emit("turnPass", {"pass": pass, "room": room});
    socket.emit("cLog", {msg:msg, room:room});
};




function cardDisplayFunction(e){
    if(!e){console.log("NO UNIT RECIEVED AT CARD DISP")}
    if(unitCards.map(u => u.id.uniqueID).includes(e.id.uniqueID) /* || document.getElementById("charDisplay").children.length == thisUser.activeUnits.length */){
        console.log(e)
        document.getElementById(`${e.id.uniqueID}-mvt`).innerHTML = `${e.active.mvt}/${e.stats.mvt}`;
        document.getElementById(`${e.id.uniqueID}-hp`).innerHTML = `${e.hp.c}/${e.hp.m}`;
        return;
    };
  unitCards.push(e);

    document.getElementById("charDisplay").insertAdjacentHTML("beforeend", 
    ` <div id="${e.id.uniqueID}" class="card-side character_fronts">
            <div class="column1">
            <img class="character-portrait" src="${e.sprite.portrait}">
                <div class="skills-btn">
                    <div class="skills">1</div>
                    <div class="skills">2</div>
                    <div class="skills">3</div>
                </div>
            </div>

            <div class="column2">
                <div class="card-row">
                    <div class="name btn"> 
                        <img src="/img/card/decor_left_large.png" class="decor-left">
                        
                            ${e.name}

                        <img src="/img/card/decor_right_large.png" class="decor-right">
                    </div>
                        <div class="weapon btn">
                                <img src="/img/card/decor_left_large.png" class="decor-left">
                                <span id="${e.id.uniqueID}-mvt" class="stat-text mvt">Mvt: ${e.active.mvt}/${e.stats.mvt}</span>
                                <img src="/img/card/decor_right_large.png" class="decor-right">
                            </div>
                </div>
                <div class="card-row">
                    <div class="btn hp">
                            
                            <div id="${e.id.uniqueID}-hpFill" class="hpFill"></div>

                            <img src="/img/card/decor_left_large.png" class="decor-left">
                            
                            <span id="${e.id.uniqueID}-hp"> ${e.hp.c}/${e.hp.m} </span>

                            <img src="/img/card/decor_right_large.png" class="decor-right">
                                    
                    </div> 
                            </div>
                            <div class="card-row">
                                <div class="stats btn">
                                    <img src="/img/card/diamond_large.png" class="stat-decor">
                                        <img src="/img/card/diamond_large.png" class="stat-decor2">

                                    <span class="stat-text atk">Atk <span class="value">${e.stats.atk} </span> </span>     

                                    <span class="stat-text def">Def<span class="value">${e.stats.def} </span></span>
                                    
                                </div>
                                <div class="stats btn">
                                    <img src="/img/card/diamond_large.png" class="stat-decor">
                                    <img src="/img/card/diamond_large.png" class="stat-decor2">

                                    <span class="stat-text dex">Dex   <span class="value">${e.stats.dex} </span></span>
                                    
                                    <span class="stat-text rng">Rng  <span class=" value">${e.stats.rng} </span> </span>
                                    
                                </div>
                            </div>
        
                        </div>
    </div>
                   `);

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

function tilesInRange(tile, dist){ //Returns all tiles dist tiles away from the given tile
    let tilesInRange = [];
    tileArray.forEach(el => {
        if (Math.abs(el.x - tile.x) + Math.abs(el.y - tile.y) <= dist){
            tilesInRange.push(el);
        }
    });
    return tilesInRange;
};

function unitArrayTravelSize(){ //Trim unit data before emmiting to other users.
    let r = [];
    unitArray.forEach(el => {
        r.push({
            "id": el.id,
            "hp": el.hp,
            "stats": el.stats,
            "pos": {
                "x": el.pos.x,
                "y": el.pos.y            
            },
            "active": el.active
        });
    });
    //console.log(r);
    return r
}

function moveCheck(unit){ //Determines which tiles a unit can move to.
    let viableTilesR = [];
    let checkedTiles = [];
        let checkTiles = tilesInRange(unit.tile(), 1);
        for(let i = 0; unit.active.mvt - 1  >= i; i++){ //Loops the function below based on the units movement stat.
            checkTiles.forEach(tile => {
                if(/*!(tile.spMvt && !tile.terrain.spMvt.includes(unit.spMvt)) &&*/ tile.terrain.type != "Mountain" && !(tile.occupied.isOccupied && tile.occupied.unit.owner != unit.owner)){ //Exclusion cases
                    tilesInRange(tile, 1).forEach(t => { //Grab adjacent tiles.
                        if(!checkedTiles.includes(t)){ //Determine if tile has been checked, if not, add to array of tiles to be checked.
                            checkTiles.push(t);
                            checkedTiles.push(t);
                        }
                    })
                    if(!viableTilesR.includes(tile)){ //Determine if tile is viable for movement. If so, push to array to be returned.
                        viableTilesR.push(tile);
                    };
                };
            });
        };
    return viableTilesR; //Return viable tiles for unit movement.
};

function uiDisplay(unit){ //Fill ui with information regarding the selected unit.
    let color;
    if(unit.owner == thisUser._id){
        color = "#16805a"
    }else{
        color = "#c95a38"
    }
    document.getElementById("uiCard").style.borderColor = color
    document.getElementById("portraitDisp").innerHTML = `<img class="character-portrait-2" src="${unit.sprite.portrait}"></img>`;
    Object.keys(unit.stats).forEach(stat => {
        document.getElementById(`${stat}Disp`).innerHTML = `${stat}: ${unit.stats[stat]}`;
    });
    document.getElementById("hpDisp").innerHTML = `hp: ${unit.hp.c}/${unit.hp.m}`;
    document.getElementById("mvtDisp").innerHTML = `mvt: ${unit.active.mvt}/${unit.stats.mvt}`;
};

function uiClear(){ //Empty the ui
    document.getElementById("uiCard").style.borderColor = "black";
    document.getElementById("portraitDisp").innerHTML = "";
    Array.from(document.getElementById("statCont").children).forEach(disp => disp.innerHTML = "");
};

function gameInit(){ //Add event listeners to each tile.
    tileArray.forEach(el =>{
        el.dom.addEventListener("click", turnInit);
    });
    unitArray.forEach(u => { //Apply one-time hp buffs
        if(u.item.stats.hp){
            u.hp.c += unit.item.stats.hp;
        };
    });
};

function battleDisp(attacker, defender){ //Display battle on board.
    console.log("OUT OF RANGE?", Math.abs(attacker.pos.x - defender.pos.x) + Math.abs(attacker.pos.y - defender.pos.y), attacker.stats.rng);
    let movementTiles = tilesInRange(defender.tile(), attacker.stats.rng); //Get tiles in range of target.
    let atkTile = movementTiles[0];
    if(Math.abs(attacker.pos.x - defender.pos.x) + Math.abs(attacker.pos.y - defender.pos.y) > attacker.stats.rng){ //If target is out of range, find viable tiles to move to.
        movementTiles.forEach(m => {
            if((m.dom.classList.contains("viable") && m.terrain.type != "Mountain") && (( Math.abs(m.x - attacker.pos.x) + Math.abs(m.y - attacker.pos.y)) < Math.abs((atkTile.x + atkTile.y)-(attacker.pos.x + attacker.pos.y)) || m.y == defender.pos.y)){
                atkTile = m;
            };
        });
        console.log(`ATK TILE: ${atkTile}`)
        attacker.pos.x = atkTile.x; //Set attacker position to determined best tile. This tile will be the closest to the attacker while in range of the enemy, prefering to be on the same y level as the enemy if possible.
        attacker.pos.y = atkTile.y;
        if(defender.pos.x > attacker.pos.x && !attacker.tile().dom.classList.contains("flip")){ //Determine if attacker needs to turn to face enemy or not.
            attacker.tile().dom.classList.add("flip");
        }
        dispUnit(attacker);
    };
    attacker.tile().dom.innerHTML = `<img class="board_sprite anim_sprite" src="${attacker.sprite.attack}">`; //Render attack animation.
    if(attacker.pos.x < defender.pos.x){
        if(!attacker.tile().dom.classList.contains("flip")){
            attacker.tile().dom.classList.add("flip");
        }
    }else{
        if(attacker.tile().dom.classList.contains("flip")){
            attacker.tile().dom.classList.remove("flip");
        }
    };
    [attacker, defender].filter(u => u.owner == thisUser._id).forEach(u => cardDisplayFunction(u));
    setTimeout(() => {dispUnit(attacker)}, 1600); /*Fix timing*/ //Removes attack animation at end of cycle !UPDATE HERE
}

function buffCalc(unit){ //Determine tile and item buffs
    let uB = Object.assign({}, unit.stats)
    let buffCounters = [];
    if(unit.item.stats){buffCounters.push(unit.item.stats)};
    if(unit.tile().terrain.stats){buffCounters.push(unit.tile().terrain.stats)};

    buffCounters.forEach(buff => { //Checks values determined to have a buff, adds or subracts them from the unit here.
        Object.keys(buff).forEach(key => {
            uB[key] += buff[key];
        });
    });
    //console.log(unit.tile().terrain);
    return uB;
}

function getWeapon(unit){ //Assigns weapon type based on weapon designated on db.
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
            weapon = "t3";
            break;
        default:
            weapon = "t2";
            break;
   };
   return weapon;
};

function damageCalc(attacker, defender){ //Damage calculation
    let args = [...arguments];
    args.forEach(arg => {arg.cStats = buffCalc(arg)}); //Use cStats for battle.
  
    let adv = 1;
    let crit = 1;
    let mit = 0;

    if(attacker.weapon == "magic"){ //Mitigation factor.
        mit = defender.cStats.res;
    } else{
        mit = defender.cStats.def;
    }

    //Weapon triangle.
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

    //Crit Calc.
    if(Math.trunc(Math.random()*100) < (attacker.cStats.lck + attacker.cStats.dex - defender.cStats.lck)/2 ){ /*crit calc*/
        crit = 2;
    }

    let dmg = Math.floor((attacker.cStats.atk + Math.trunc(attacker.cStats.atk * adv) - mit) * crit);
    if(dmg < 0){dmg = 0};
    defender.hp.c -= dmg;
    let msg = combatMsgRandomizer(attacker, defender, dmg);
    if(defender.hp.c < 0){
        defender.hp.c = 0;
    };
    if(crit > 1){
        msg = critMsgRandomizer(attacker, defender, dmg);
    };
    socket.emit("cLog", {msg:msg, room:room});
};

function battleRes(attacker, defender){
    battleDisp(attacker, defender);
    damageCalc(attacker, defender);
    if(defender.hp.c == 0){ //Signal unit death event.
        socket.emit("unitDefeated", {x: defender.pos.x, y: defender.pos.y, room: room});
        let msg = deathMsgRandomizer(attacker, defender);
        socket.emit("cLog", {msg:msg, room:room});
    };
    unitArray.forEach(u => { //Update unit cards
        if(u.owner == thisUser._id){
            cardDisplayFunction(u);
        }
    });
    socket.emit("boardUpdate", {data: unitArrayTravelSize(), type:"atk", attacker: attacker.id.uniqueID, defender: defender.id.uniqueID, room:room}); //Send battle data to other users/
    
};

let unit; //Dynamic variable. Saves currently selected unit outside of turn function unil overwritten.

function turnInit(el){
    let tile = getTile(el.target); //Return tile obj which corresponds to the selected tile.

    if(!thisUser || !oppUser){ //Prohibits moevement if one user isn't connected.
        return console.log("Not enough players to begin");
    }

    if(activePlayer != playerNum){ //Case if it is not the user's turn. Only allows ui functions to take place.
        if(tile.occupied.isOccupied == true){
            uiDisplay(tile.occupied.unit);
        }else{
            uiClear();
        };
        return;
    };
    
    if(tile.occupied.isOccupied == true){ //Case if tile is occupied.
        if(tile.dom.classList.contains("atkViable") && tile.occupied.unit.owner != unit.owner){ //If tile is viable for attack, commence attack function.
            console.log(tile);
            console.log(`BATTLE ${unit.name} VS ${tile.occupied.unit.name}`)
            battleRes(unit, tile.occupied.unit);
            uiDisplay(tile.occupied.unit);
            unit.active.atk = false;
            //console.log("t1" + unitArray.filter(u => u.owner == playerNum).filter(u => u.active.atk == true).length);
            if(!unitArray.filter(u => u.owner == thisUser._id).filter(u => u.active.atk == true).length){ //Checks if any units can still attack. If not, passes turn. (Unit attack is always the final action of the turn) !UPDATE HERE for CANTO ability on riders.
                turnPass();
            };
        }else{ //If tile is a friendly unit, display select them as current unit.
            unit = tile.occupied.unit;
            uiDisplay(tile.occupied.unit);
        }
        tileArray.forEach(r => { //Remove all viable markers at the end of action.
            r.dom.classList.remove("viable", "atkViable");
        });
    }else{ //If tile is empty, clear the ui. !UPDATE HERE for displaying tile stats
        uiClear();
    }

    function moveUnit(e){ //Function for moving a unit and updating the respective object proporties
        let unitDest = e
        unit.active.mvt -= (Math.abs(unitDest.x - unit.pos.x) + Math.abs(unitDest.y - unit.pos.y)); //Subtract cost of movement from unit's allowance per turn.
        unit.pos.x = unitDest.x;
        unit.pos.y = unitDest.y; //Update position
        viableTiles = false; //Global veriable to tell function no tiles are highlighted.
        dispUnit(unit);
        socket.emit('boardUpdate', {data: unitArrayTravelSize(), type: "move", room:room}); //Send new board data to other user.
        tileArray.forEach(tiles => { //Removes highlights and listeners from tiles.
            tiles.dom.classList.remove("viable", "atkViable");
            tiles.dom.removeEventListener("click", moveUnit);
        });
        if(!tilesInRange(unit.tile(), unit.stats.rng).filter(tile => tile.occupied.isOccupied == true).filter(tile => tile.occupied.unit.owner != thisUser._id).length && unit.active.mvt == 0){ //If unit is out of mvt points and no enemies are in range, set unit to inactive.
            unit.active.atk = false;
            if(!unitArray.filter(u => u.owner == thisUser._id).filter(u => u.active.atk == true)){ //If no units are active, pass the turn.
                console.log("NO MVT LEFT, PASS TURN");
                turnPass();
            };
        };
    };

    

    if(unit.owner == thisUser._id && unit.active.atk == true){ //Check if unit belongs to user and if it is still active.

        if((!unitTileArray.includes(tile)) || (viableTiles == true)){ //Check if tile is open and if unit is ready for movement.
            if(tile.dom.classList.contains("viable")){ //If selected tile is viable, move unit to it.
                moveUnit(tile);
            };
            tileArray.forEach(r => { //Remove overlays.
                r.dom.classList.remove("viable", "atkViable");
                viableTiles = false;
            });
            uiClear();
            return;
        };

        moveCheck(unit).forEach(tiles => { //Find tiles in range of unit, add viable overlay if they are empty.
            if(tiles.occupied.isOccupied == false){
                tiles.dom.classList.add("viable");
            };
            viableTiles = true;
        });

        moveCheck(unit).forEach(aT => { //Return tiles in range, extend array to include tiles withing unit attack distance. Add attack tile overlay to each.
            tilesInRange(aT, unit.stats.rng).forEach(atkTile => {
                if((!atkTile.dom.classList.contains("viable") || (atkTile.occupied.isOccupied == true && atkTile.occupied.unit.owner != unit.owner)) && (atkTile.occupied.unit.owner != unit.owner)){
                    atkTile.dom.classList.add("atkViable");
                };
            });
        });

        if(unit.active.mvt == 0){ //If unit cannot move, check tiles within attack range. Add attack overlay to each. !UPDATE HERE Potentially redundant function.
        tilesInRange(unit.tile(), unit.stats.rng).forEach(atkTile => {
            if((!atkTile.dom.classList.contains("viable") || (atkTile.occupied.isOccupied == true && atkTile.occupied.unit.owner != unit.owner)) && (atkTile.occupied.unit.owner != unit.owner)){
                atkTile.dom.classList.add("atkViable");
            };
        });   
        };
    };
};

gameInit();

let room; //Global variable to hold game room value.

socket.on("cT", () => { //Runs on connection. Sets room variable, returns event which adds socket to the game's unique room.
    room = window.location.pathname.slice(6);
    let pos = room.indexOf('/');
    if (pos !== -1) {
        room = room.slice(0, pos);
    }
    socket.emit("joinRoom", {room: room});
})

socket.on("rT", (el) => { //Recieves unit data. Compares each unit to unit on board and updates accordingly.
    unitArray.forEach(u => {
        el.data.forEach(d => {
            if(d.id.uniqueID == u.id.uniqueID){ //Matches units acording to id. Updates values for matching units.
                Object.keys(d).forEach(key => {
                    u[key] = d[key];
                });
                dispUnit(u);
            };
        });
        u.active.mvt = u.stats.mvt; //Resets values used to determine if a unit is active or not.
        u.active.atk = true;
    });
    if(el.type == "atk"){ //If update contains an attack, run the attack display function. Damage was already calculated by the other user and updated above.
        let attacker, defender;
        console.log("ATTACKING")
        unitArray.forEach(atk => {if(atk.id.uniqueID == el.attacker){attacker = atk}});
        unitArray.forEach(def => {if(def.id.uniqueID == el.defender){defender = def}});
        battleDisp(attacker, defender);
    };
});

socket.on("sendU", () => { //Sends user id to other sockets.
    if(!thisUser){
        return console.log("No user to send")
    }
    console.log("SEND U")
    socket.emit("userRelay", {user: thisUser._id, num: playerNum, turn: activePlayer, room: room, units: unitArrayTravelSize()});
    if(thisUser && !oppUser){
        setTimeout(function(){ //Delay used in order to afford the other user time to retrieve their user.
            console.log("P1 req opp.")
            socket.emit("p1Req");
        }, 3000);
    };
});

socket.on("recieveU", data => { //Recieves user data. Runs function to retrieve user from db.
    console.log(`GET U ${data.user}`);
    if(data.num == 1 && !oppUser){
        playerNum = 2;
    }else if(data.num == 2 && !oppUser){
        playerNum = 1;
    };
    activePlayer = data.turn;
    get.user();
    get.user(data.user);
    setTimeout(() => {
        console.log("DATA", data.units)
        if(data.units.length){
            unitArray.forEach(u => {
                data.units.forEach(d => {
                    if(d.id.uniqueID == u.id.uniqueID){ //Matches units acording to id. Updates values for matching units.
                        Object.keys(d).forEach(key => {
                            u[key] = d[key];
                        });
                        dispUnit(u);
                    };
                });
            });
        };
    }, 3000); //Delay to allow user function to execute and load units
    
});

socket.on("p1ReqF", () => { //Relays user data to player 1.
    console.log("RELAY TO P1");
    socket.emit("userRelay", {user: thisUser._id, num: playerNum, turn: activePlayer, room: room, units: unitArrayTravelSize()});
});

socket.on("userNum", data => { //Declares user number. !UPDATE HERE Send account id to db with player nums, as is both players will be assigned 2 on refresh
    playerNum = data.num;
    get.user();
});

socket.on("newTurn", data => { //Receives new turn data and sets active player var accordingly.
    console.log(`Turn passed to ${data.pass}`);
    activePlayer = data.pass;
    unitArray.forEach(el => {
        el.active.atk = true;
        el.active.mvt = el.stats.mvt;
    })
    turnLine();
})

socket.on("unitDefeatedRelay", data => { //Runs unit death function.
    let defender;
    unitArray.forEach(u => { //Find defender from unit array.
        if (u.pos.x == data.x && u.pos.y == data.y){
            defender = u;
        }
    });
    setTimeout(function(){defender.tile().dom.children[0].classList.add("unitDefeated");}, 1600) //Unit death. Timer waits until attack is completed.
    setTimeout(function(){defender.tile().dom.innerHTML = ""}, 2800); //Empties tile after unit death effect.
    defender.tile().occupied = {isOccupied: false, unit: {}}; //Resets tile proporties.
    if(!unitArray.filter(u => u.hp.c > 0).filter(u => u.owner == defender.owner).length){ //Checks if the defeated unit was the user's last. If so, end game.
        console.log(`Player ${defender.owner} has lost!`);
        //lossOverlay(defender.owner);
        let loser, winner;
        if(defender.owner == thisUser._id){
            loser = thisUser
            winner = oppUser
        }else{
            winner = thisUser
            loser = oppUser
        };
        let msg = `<div class="combatReport">${winner.name} has defeated ${loser.name}.</div>`;
        socket.emit("cLog", {msg:msg, room:room});
    }
});

socket.on("roomFull", function(){ //If room already has two players, redirect user to server menu.
    window.location.href = "/serverIndex";
    socket.to(socket.id).emit("roomFullErr");
});

socket.on("cLogRelay", data=> {
    cLog.insertAdjacentHTML("beforeend", data);
    document.querySelectorAll(".cLogUName").forEach(el => {
        console.log(el.getAttribute("uo"));
        if(el && el.getAttribute("uo") == thisUser._id){
            el.style.color = "#16805a";
        }else if(el && el.getAttribute("uo") == oppUser._id){
            el.style.color = "#9c513a";
        }
    });
});

document.getElementById("turnPass").addEventListener("click", turnPass); //Adds turn pass function to end turn button.
let dist;
let color;
function turnLine(){
    if(thisUser.playerNum == 1){
        switch(activePlayer){
            case 1:
                dist = "0rem"
                color = "#16805a"
                break;
            case 2:
                dist = "30rem"
                color = "#c95a38"
                break;
            default:
                console.log("TURN LINE DEFAULTING");
        }
    }else{
        switch(activePlayer){
            case 1:
                dist = "30rem"
                color = "#c95a38"
                break;
            case 2:
                dist = "0rem"
                color = "#16805a"
                break;
            default:
                console.log("TURN LINE DEFAULTING");
        }
    }
    document.getElementById("underline").style.marginLeft = dist;
    document.getElementById("underline").style.backgroundColor = color;
};

function deathMsgRandomizer(attacker, defender){
    let msg;
    switch(Math.ceil(Math.random()*11)){
        case 1:
            msg = `<span class="cLogUName" uo="${attacker.owner}">${attacker.name}</span> has bested <span class="cLogUName" uo="${defender.owner}">${defender.name}</span> in combat!`
            break;
        case 2:
            msg = `<span class="cLogUName" uo="${defender.owner}">${defender.name}</span> has fallen in combat!`
            break;
        case 3:
            msg = `<span class="cLogUName" uo="${attacker.owner}">${attacker.name}</span> has slain <span class="cLogUName" uo="${defender.owner}">${defender.name}.</span>`
            break;
        case 4:
            msg = `<span class="cLogUName" uo="${defender.owner}">${defender.name}</span> has been forced to retreat...`
            break;
        case 5:
            msg = `<span class="cLogUName" uo="${defender.owner}">${defender.name}</span> cannot keep fighting.`
            break;
        case 6:
            msg = `<span class="cLogUName" uo="${defender.owner}">${defender.name}</span> has fought their last...`
            break;
        case 7:
            msg = `<span class="cLogUName" uo="${attacker.owner}">${attacker.name}</span> has triumphed over <span class="cLogUName" uo="${defender.owner}">${defender.name}</span>.`
            break;
        case 8:
            msg = `<span class="cLogUName" uo="${attacker.owner}">${attacker.name}</span> has emerged victorious!`
            break;
        case 9:
            msg = `<span class="cLogUName" uo="${defender.owner}">${defender.name}</span> bit off more than they could chew against <span class="cLogUName" uo="${attacker.owner}">${attacker.name}</span>.`
            break;
        case 10:
            msg = `<span class="cLogUName" uo="${defender.owner}">${defender.name}</span> yeilds to <span class="cLogUName" uo="${attacker.owner}">${attacker.name}</span>.`
            break;
        case 11:
            msg = `<span class="cLogUName" uo="${defender.owner}">${defender.name}</span> breathes their last.`
            break;
        default:
            msg = `<span class="cLogUName" uo="${attacker.owner}">${attacker.name}</span> has defeated <span class="cLogUName" uo="${defender.owner}">${defender.name}</span>.`
    }
    return msg = `<div class="combatReport">${msg}</div>`;
};

function combatMsgRandomizer(attacker, defender, dmg){
    let msg;
    let a = `<span class="cLogUName" uo="${attacker.owner}">${attacker.name}</span>`
    let b = `<span class="cLogUName" uo="${defender.owner}">${defender.name}</span>`
    let d = `<strong>${dmg}</strong>`
    switch(Math.ceil(Math.random()*6)){
        case 1:
            msg = `${a} attacked ${b} for ${d} damage.`
            break;
        case 2:
            msg = `${a} struck ${b} for ${d} damage.`
            break;
        case 3:
            msg = `${a} did ${d} damage to ${b}.`
            break;
        case 4:
            msg = `${b} took ${d} damage from ${a}.`
            break;
        case 5:
            msg = `${a}'s ${attacker.weapon} dealt ${d} damage to ${b}.`
            break;
        case 6:
            msg = `${a} did ${d} damage to ${b} in combat.`
            break;
        default:
            msg = `${a} attacked ${b} for ${d} damage.`
    }
    return msg = `<div class="combatReport">${msg}</div>`;
};

function critMsgRandomizer(attacker, defender, dmg){
    let msg;
    let a = `<span class="cLogUName" uo="${attacker.owner}">${attacker.name}</span>`
    let b = `<span class="cLogUName" uo="${defender.owner}">${defender.name}</span>`
    let d = `<strong>${dmg}</strong>`
    switch(Math.ceil(Math.random()*4)){
       case 1:
           msg = `${a} landed a decisive hit on ${b}! It did ${d} damage!`
           break;
        case 2:
            msg = `${b} suffered a crippling blow from ${a}! They sustained ${d} damage.`
            break;
        case 3:
            msg = `${a} landed a critical hit on ${b}! It dealt ${d} damage.`
            break;
        case 4:
            msg = `${a} stikes a weak point in ${d}'s armor with their ${attacker.weapon}! It did ${d} damage.`
        default:
            msg = `${a} hit ${b} for ${d} damage. It was a critical hit!`
            break; 
    };
    return msg = `<div class="combatReport">${msg}</div>`;
};

function turnPassMsgRandomizer(currentPlayer, nextPlayer){
    let c = currentPlayer.name;
    let n = nextPlayer.name;
    let msg;
    switch(Math.ceil(Math.random()*10)){
        case 1:
            msg = `${c} passed the turn to ${n}.`
            break;
        case 2:
            msg = `${c} ends their turn.`
            break;
        case 3:
            msg = `It is now ${n}'s turn.`
            break;
        case 4:
            msg = `Now it's ${n}'s time to strike!`
            break;
        case 5:
            msg = `${c} has made their move. It is now ${n}'s turn.`
            break;
        case 6:
            msg = `${c}'s strategy is in motion. Now it's ${n}'s time to adapt.`
            break;
        case 7:
            msg = `Make your move ${n}!`
            break;
        case 8:
            msg = `${c} has laid their cards out. Now it's ${n}'s turn.`
            break;
        case 9:
            msg = `${c} passes the turn to ${n}.`
            break;
        case 10:
            msg = `${c} has finished their turn. It is now ${n}'s turn.`
            break
        default:
            msg = `${c} has passed the turn to ${n}`
    }
    return msg = `<div class="combatReport">${msg}</div>`;
}

/* function lossOverlay(loserID){
    document.getElementById("gameOver").style.dsiplay= "block"
} */

//lossOverlay(1);