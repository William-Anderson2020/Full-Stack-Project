export class Unit{
    constructor(name, hp, stats, id){
        this.name = name,
        this.hp = {
            c: hp,
            m: hp
        }
        this.stats = stats,
        this.pos = {
            x: "",
            y: "",
            tile: ""
        },
        this.sprite = {
            "idle": "",
            "attack": "",
            "portrait":""
        },
        this.owner = "",
        this.side = "",
        this.active= {},
        this.item= "",
        this.id = {
            unitID: id,
            uniqueID: ""
        }
    }
    /* active(){
        this.active=!(this.active);
    }; */
    setOwner(owner){
        this.owner = owner;
        this.id.uniqueID = `${this.owner}:${id}`;
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