import { Unit } from "./unit.js"

let thisUser;
let unitArray = [];

async function getU(){
    let user = await fetch(`/users/find/${document.getElementById("uId").getAttribute("uId")}`);
    user = await user.json();
    console.log(user);
    document.getElementById("uId").innerHTML = `${user.name}: ${user.currency} coins`
    thisUser = user;
}
getU();



async function getUnits(){
    let data = await fetch("/characters");
    let units = await data.json();
    console.log(units);
    units.forEach(async el => {
        let newU = new Unit(el.name, el.hp, el.stats, el._id, el.weapon);
        unitArray.push(newU);
        newU.sprite.portrait = await fetch(`/characters/image/portrait/${newU.id.unitID}`).then(im => im.url);
        newU.sprite.idle = await fetch(`/characters/image/idle/${newU.id.unitID}`).then(im => im.url);
        document.getElementById("storeCont").insertAdjacentHTML("beforeend", `
                <div id="${newU.name}Item" class="storeItem">
                    <img class="shopPortrait" src="${newU.sprite.portrait}"></img>
                    <div id="${newU.name}buyContainer"></div>
                </div>
            `
        ) 
    });
};

setTimeout(getUnits, 500)

setTimeout(() => {
    unitArray.forEach(el => {
        if(thisUser.units.map(u => u.id).includes(el.id.unitID)){
            return document.getElementById(`${el.name}buyContainer`).innerHTML = `
                    <form id="${el.name}BuyForm" class="purchaseForm" action="/user/buy/${thisUser._id}" Method="POST">
                        <div class="form-sections">
                            <label class="form-label" for="name">Name:</label>
                            <input type="text" value="${el.name}" id="namePOST" name="name" required readonly="readonly">
                        </div>
                        <button class="purchaseButton" action="submit" disabled="true">Already Owned</button>
                    </form>
                    `
        }
        if(thisUser.currency < 200){
            return document.getElementById(`${el.name}buyContainer`).innerHTML = `
                        <form id="${el.name}BuyForm" class="purchaseForm" action="/user/buy/${thisUser._id}" Method="POST">
                            <div class="form-sections">
                                <label class="form-label" for="name">Name:</label>
                                <input type="text" value="${el.name}" id="namePOST" name="name" required readonly="readonly">
                            </div>
                            <button class="purchaseButton" action="submit" disabled="true">Not Enough Coins. You need ${200 - thisUser.currency} more.</button>
                        </form>
                        `
        }
        document.getElementById(`${el.name}buyContainer`).innerHTML = `
        <form id="${el.name}BuyForm" class="purchaseForm" action="/user/buy/${thisUser._id}" Method="POST">
            <div class="form-sections">
                <label class="form-label" for="name">Name:</label>
                <input type="text" value="${el.name}" id="namePOST" name="name" required readonly="readonly">
            </div>
            <button class="purchaseButton" action="submit">Purchase for 200</button>
        </form>
        `
    })
}, 1500);