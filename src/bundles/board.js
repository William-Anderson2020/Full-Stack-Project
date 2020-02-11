import { DOMELEMENTS } from "./domElements";

let tileArray;
DOMELEMENTS.boardCont.children.forEach(el => {
    let proporties = {
        x = el.x,
        y = el.y,
        occupied,
        terrain
    };
    tileArray.push(proporties);
});