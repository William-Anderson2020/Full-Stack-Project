class Unit{
    constructor(stats, start, owner, weapon=null){
        this.stats = stats;
        this.pos = {
            x: start.x,
            y: start.y
        };
        this.owner = owner;
        this.active= true;
        this.weapon=null;
    }
    active(){
        this.active=!(this.active);
    }
    weapon(weapon){
        this.weapon=weapon;
    }
}