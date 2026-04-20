let count = 0;

window.addEventListener('click', () => {
    count++;
    // render();
},false);


const render = () => {
 
    document.body.innerHTML = count; 
    console.log('render~render');
}

render();

//diff
let prevCount = count;
const reconcile = () => {
    if(prevCount === count) return;
    prevCount = count;
    render();
}

//调度器
const workLoop = () => {
    reconcile();
    requestIdleCallback(()=>workLoop())
    // window.requestIdleCallback(workLoop);
    // window.requestAnimationFrame(workLoop);
 };
workLoop();
// function render() {
//     console.log('render~render');

//   const btn = document.getElementById("btn");
//   if (!btn) return;

//   btn.textContent = String(count);
//   btn.addEventListener("click", () => {
//     count++;
//     console.log('click~click');
//     btn.textContent = String(count);
//   });
//  }

// render();