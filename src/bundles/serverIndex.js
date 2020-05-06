import io from "socket.io-client"
const socket = io("/serverIndex");
let serverList = [];

document.getElementById("newGame").addEventListener("click", function(){
    document.getElementById("newServer").addEventListener("click", function(){
        socket.emit("serverCreation", {id: socket.id.split("#")[1]});
        window.location.href = `/game/${socket.id.split("#")[1]}`;
    });
    document.getElementById("IdPOST").value = socket.id.split("#")[1]
})


socket.on("listRelay", data => {
    data.list.forEach(id => {
        if(!serverList.includes(id)){
            document.getElementById("serverList").insertAdjacentHTML("afterbegin", `<a href="/game/${id}" class="game btn-initial">Join Game ${id}</a>`);
            serverList.push(id)
        };
    });
})