import io from "socket.io-client"
const socket = io("/serverIndex");
let serverList = [];

let id = document.getElementById("userTag").getAttribute("uId");
let thisUser;
let getU = async () => {
    let data = await fetch(`/users/find/${id}`);
    thisUser = await data.json();
};
getU();

document.getElementById("newGame").addEventListener("click", function(){
    document.getElementById("newServer").addEventListener("click", function(){
        socket.emit("serverCreation", {id: socket.id.split("#")[1], name: document.getElementById("namePOST").value});
        window.location.href = `/game/${socket.id.split("#")[1]}`;
    });
    document.getElementById("IdPOST").value = socket.id.split("#")[1]
    document.getElementById("namePOST").value = `${thisUser.name}'s Game`
})


socket.on("listRelay", data => {
    data.list.forEach(i => {
        if(!serverList.includes(i.id)){
            document.getElementById("serverList").insertAdjacentHTML("afterbegin", `<a id="${i.id}" href="/game/${i.id}" class="game btn-initial">${i.name}</a>`);
            document.getElementById(i.id).addEventListener("click", () => {
                socket.emit("removeListItem", {id:i.id});
            })
            serverList.push(i)
        };
    });
});

socket.on("removeListItemRelay", (data) => {
    serverList.forEach(s => {
        if(s.id == data.id){
            serverList.splice(serverList.indexOf(s));
        }
    })
    document.getElementById(data.id).remove();
});