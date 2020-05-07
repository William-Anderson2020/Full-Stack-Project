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
            document.getElementById("serverList").insertAdjacentHTML("afterbegin", `<li><a id="${i.id}" href="/game/${i.id}" class="game btn-initial">${i.name}</a></l1>`);
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

document.getElementById("serverSearch").addEventListener("keyup", function(){
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('serverSearch');
    filter = input.value.toUpperCase();
    ul = document.getElementById("serverList");
    li = ul.getElementsByTagName('li');
  
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }
)