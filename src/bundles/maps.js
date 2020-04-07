let maps = []

class Tile{
    constructor(x, y, terrain){
        this.x = x,
        this.y = y,
        this.terrain = terrain
    };
};

class Map{
    constructor(name, size, tiles){
        this.name = name,
        this.tiles = tiles,
        this.size = {
            x:size.split("x")[0],
            y:size.split("x")[1]
        }
    };
};

class Terrain{
    constructor(type, stats){
        this.type = type,
        this.stats = stats
    }
};

const mountain = new Terrain("Mountain", {spMvt: ["flier"]});
const forest = new Terrain("Forest", {def: 2});

maps.push(new Map ("Demo", "10x10", 
    setTerrain([
        [2, [1]],
        [3, [1, 5, 6]],
        [4, [5, 6, 7]],
        [5, [2, 3]],
        [6, [1, 2, 3, 7]],
        [7, [7, 8]],
        [8, [6]]
    ], forest).concat( 
    setTerrain([
        [2, [5, 6]],
        [3, [2, 4, 7]],
        [4, [1, 2, 8]],
        [5, [1, 7, 8]],
        [6, [8]],
        [7, [2, 3, 4, 8]],
        [8, [2, 3, 7, 8]],
        [9, [7, 8]]
    ], mountain))
));

function setTerrain(tiles, terrain){ /*Format [[x1, [y1, y2]], [x2, [y1,y2]]]*/ 
    let r = [];
    tiles.forEach(el => {
        el[1].forEach(y => {
            r.push(new Tile(el[0], y, terrain))
        });
    });
    return r;
}

export { maps };