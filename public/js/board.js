!function(e){var t={};function i(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=t,i.d=function(e,t,o){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(i.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)i.d(o,n,function(t){return e[t]}.bind(null,n));return o},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=0)}([function(e,t){let i=[],o=[],n=!1;!function(e,t){for(let i=e;i>0;i--){document.getElementById("container").insertAdjacentHTML("afterbegin",`<div id="row${i}" class="row"></div>`);for(let e=t;e>0;e--)document.getElementById(`row${i}`).insertAdjacentHTML("beforeend",`<div class="tile" x="${i}" y="${e}"></div>`)}}(10,10);let s;function r(e){i.forEach(t=>{t.x==e.pos.x&&t.y==e.pos.y&&(t.occupied={isOccupied:!0,unit:e},e.pos.tile=t,t.dom.innerHTML=`<img class="board_sprite" src=${e.img}>`,o.push(t),i.forEach(e=>{e.occupied.unit==t.occupied.unit&&e.occupied.unit!={}&&e!=t&&(o=o.filter((function(t){return t!=e})),e.occupied.isOccupied=!1,e.occupied.unit={},e.dom.classList.remove("active"),(e.x<t.x||e.x==t.x&&e.dom.classList.contains("flip"))&&t.dom.classList.add("flip"),e.dom.innerHTML="",e.dom.classList.remove("flip"))}))})}function c(e,t){let o=[];return i.forEach(i=>{Math.abs(i.x-e.x)+Math.abs(i.y-e.y)<=t&&o.push(i)}),o}function a(e){let t=function(e){let t;return i.forEach(i=>{i.x==e.getAttribute("x")&&i.y==e.getAttribute("y")&&(t=i)}),t}(e.target);if(1==t.occupied.isOccupied&&(t.dom.classList.contains("atkViable")&&t.occupied.unit.owner!=s.owner?function(e,t){let i=c(t.pos.tile,e.stats.rng),o=i[0];Math.abs(e.pos.x-t.pos.x)+Math.abs(e.pos.y-t.pos.y)>1&&(i.forEach(t=>{t.dom.classList.contains("viable")&&Math.abs(t.x-e.pos.x)+Math.abs(t.y-e.pos.y)<Math.abs(o.x+o.y-(e.pos.x+e.pos.y))&&(o=t)}),console.log(o),e.pos.x=o.x,e.pos.y=o.y,t.pos.x>e.pos.x&&!e.pos.tile.dom.classList.contains("flip")&&(e.pos.tile.dom.classList.add("flip"),console.log("flip")),r(e)),e.pos.tile.dom.innerHTML=`<img class="board_sprite anim_sprite" src="${e.anim}">`}(s,t.occupied.unit):s=t.occupied.unit,i.forEach(e=>{e.dom.classList.remove("viable","atkViable")})),!o.includes(t)||1==n)return t.dom.classList.contains("viable")&&function e(t){let o=t;s.pos.x=o.x,s.pos.y=o.y,n=!1,r(s),i.forEach(t=>{t.dom.classList.remove("viable","atkViable"),t.dom.removeEventListener("click",e)})}(t),void i.forEach(e=>{e.dom.classList.remove("viable","atkViable"),n=!1});c(t,s.stats.mvt).forEach(e=>{0==e.occupied.isOccupied&&e.dom.classList.add("viable"),n=!0}),c(t,s.stats.mvt+s.stats.rng).forEach(e=>{e.dom.classList.contains("viable")&&(1!=e.occupied.isOccupied||e.occupied.unit.owner==s.owner)||e.occupied.unit.owner==s.owner||e.dom.classList.add("atkViable")})}document.querySelectorAll(".tile").forEach(e=>{let t={dom:e,x:parseInt(e.getAttribute("x")),y:parseInt(e.getAttribute("y")),occupied:{isOccupied:!1,unit:{}},terrain:{}};i.push(t)}),r({img:"./img/ameliaIdle.png",anim:"./img/ameliaAtk.gif",name:"Amelia",stats:{mvt:2,rng:1},pos:{x:2,y:2,tile:{}},owner:"Player 1"}),r({img:"./img/erikaIdle.png",anim:"./img/erikaAtk.gif",name:"Erika",stats:{mvt:3,rng:1},pos:{x:3,y:3,tile:{}},owner:"Player 2"}),i.forEach(e=>{e.dom.addEventListener("click",a)})}]);