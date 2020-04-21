export function clickListener(el, run){
    document.querySelectorAll(el).forEach(el => {
       el.addEventListener("click", run); 
    });
}