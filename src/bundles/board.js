import { DOMELEMENTS } from "./domElements";
import { clickListener } from "./clickListener";

console.log('link')

let tileArray = [];
DOMELEMENTS.tiles.forEach(el => {
    let tile = {
        dom: el,
        x: el.getAttribute("x"),
        y: el.getAttribute("y"),
        occupied: null,
        terrain: null
    };
    console.log(tile.x, tile.y);
    tileArray.push(tile);
});

tileArray.forEach(el => {
    el.dom.addEventListener("mouseover", el => {
        tileArray.forEach(tile => {
            if (Math.abs(tile.x - el.x) + Math.abs(tile.y - el.y) <= 2){
                tile.dom.classList.add("viable");
            }
        });
    })
});

tileArray.forEach(el => {
    el.dom.addEventListener("mouseout", el => {
        tileArray.forEach(tile => {
            if (Math.abs(tile.x - el.x) + Math.abs(tile.y - el.y) <= 2){
                tile.dom.classList.remove("viable");
            }
        });
    })
});