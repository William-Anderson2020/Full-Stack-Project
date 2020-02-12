import { DOMELEMENTS } from "./domElements";

let tileArray;
DOMELEMENTS.tiles.forEach(el => {
    let tile = {
        dom: el,
        x: el.x,
        y: el.y,
        occupied,
        terrain
    };
    console.log(tile.x, tile.y);
    tileArray.push(tile);
});