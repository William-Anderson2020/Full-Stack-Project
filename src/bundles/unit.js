class Unit{
    constructor(name, stats, id){
        this.name = name,
        this.img - /*fetch(name)*/`./img/${name}Idle.png`,
        this.anim = /*fetch(name)*/`./img/${name}Idle.png`,
        this.stats = stats;
        this.pos = {
            x: "",
            y: "",
            tile: {}
        },
        this.owner = "",
        this.side = "",
        this.active= true,
        this.item= /*fetch(itemid?)*/ item,
        this.id = {
            unitID: id,
            uniqueID: ""
        }
    }
    active(){
        this.active=!(this.active);
    };
    setPos(tileArray, map){
        tileArray.forEach(el => {
            if(this.side = "l"){
                if(el.x <=2 && el.occupied.isOccupied == false && el.terrain.type != "Mountain"){
                    this.pos.x == el.x,
                    this.pos.y == el.y
                }
            }else{
                if(el.x >= map.size.x - 2 && el.occupied.isOccupied == false){
                    this.pos.x == el.x,
                    this.pos.y == el.y
                }
            }
        });
    }
    setOwner(owner){
        this.owner = owner;
        this.id.uniqueID = `${this.owner.id}:${id}`;
    };
    
}

const amelia = {
    "img": "./img/ameliaIdle.png",
    "anim": "./img/ameliaAtk.gif",
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
    "owner": "Player 1",
    "id": 1
};