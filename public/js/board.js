!function(e){var t={};function i(o){if(t[o])return t[o].exports;var c=t[o]={i:o,l:!1,exports:{}};return e[o].call(c.exports,c,c.exports,i),c.l=!0,c.exports}i.m=e,i.c=t,i.d=function(e,t,o){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(i.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var c in e)i.d(o,c,function(t){return e[t]}.bind(null,c));return o},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=0)}([function(e,t,i){"use strict";i.r(t);const o={board:document.getElementById("container"),tiles:document.querySelectorAll(".tile")};let c=[];!function(e,t){for(let i=e;i>0;i--){o.board.insertAdjacentHTML("afterbegin",`<div id="row${i}" class="row"></div>`);for(let e=t;e>0;e--)document.getElementById(`row${i}`).insertAdjacentHTML("beforeend",`<div class="tile" x="${i}" y="${e}"></div>`)}}(10,10);function n(e){c.forEach(t=>{t.x==e.pos.x&&t.y==e.pos.y&&(t.occupied.isOccupied,t.occupied={isOccupied:!0,unit:e},t.dom.innerHTML=`<img class="board_sprite" src=${e.img}>`,c.forEach(e=>{e.occupied.unit==t.occupied.unit&&e.occupied.unit!={}&&e!=t&&(e.occupied.isOccupied=!1,e.occupied.unit={},e.dom.classList.remove("active"),(e.x<t.x||e.x==t.x&&e.dom.classList.contains("flip"))&&t.dom.classList.add("flip"),e.dom.innerHTML="",e.dom.classList.remove("flip"))}))}),function e(){c.forEach(t=>{if(1==t.occupied.isOccupied&&t.occupied.unit!={}){function i(t){let o;if(c.forEach(e=>{e.dom.classList.contains("active")&&(o=e)}),o)o.dom.classList.remove("active");else{const o=r(t.target),d=o.occupied.unit;function s(e){let t=r(e.target);c.forEach(e=>{e.x==d.pos.x&&e.y==d.pos.y&&e.dom.removeEventListener("click",i)}),d.pos.x=t.x,d.pos.y=t.y,u(),n(d)}function a(e){e.target&&(e=r(e.target)),(e=e.dom).classList.remove("viable"),e.classList.remove("active"),e.removeEventListener("click",s)}function u(){c.forEach(a),e()}o.dom.classList.add("active"),function(e,t){let i=[];return c.forEach(o=>{Math.abs(o.x-e.x)+Math.abs(o.y-e.y)<=t&&0==o.occupied.isOccupied&&i.push(o)}),i}(o,d.stats.mvt).forEach(e=>{e.dom.classList.add("viable")}),c.forEach(e=>{e.dom.classList.contains("viable")&&e!=o&&e.dom.addEventListener("click",s)}),c.forEach(e=>{e.dom.classList.contains("viable")||e.dom.addEventListener("click",u)})}}t.dom.addEventListener("click",i)}})}()}function r(e){let t;return c.forEach(i=>{i.x==e.getAttribute("x")&&i.y==e.getAttribute("y")&&(t=i)}),t}document.querySelectorAll(".tile").forEach(e=>{let t={dom:e,x:parseInt(e.getAttribute("x")),y:parseInt(e.getAttribute("y")),occupied:{isOccupied:!1,unit:{}},terrain:{}};c.push(t)}),n({img:"./img/ameliaIdle.png",name:"Amelia",stats:{mvt:2},pos:{x:2,y:2}}),n({img:"./img/erikaIdle.png",name:"Erika",stats:{mvt:3},pos:{x:3,y:3}})}]);