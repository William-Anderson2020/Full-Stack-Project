import DOMELEMENTS from DOMELEMENTS.js;

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