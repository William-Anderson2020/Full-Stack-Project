import io from "socket.io-client"
const socket = io("/serverIndex");
let serverList = [];

document.getElementById("newServer").addEventListener("click", function(){
    socket.emit("serverCreation", {id: socket.id.split("#")[1]});
});

socket.on("listRelay", data => {
    data.list.forEach(id => {
        if(!serverList.includes(id)){
            document.getElementById("serverList").insertAdjacentHTML("afterbegin", `<a class="server" href="/game/${id}">game #${id}</a>`);
        };
    });
})