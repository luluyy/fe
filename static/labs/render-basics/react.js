// let count = 0;

//hooks,useState,useReducer 代数效应
const queue =[]
let index=0
const useState = (initialState) => {
    queue.push(initialState)
    const update= (newState)=>{
        //为什么在React中，hooks不能写在条件语句中？
        //因为hooks的执行顺序是固定的，如果写在条件语句中，会导致hooks的执行顺序不固定，从而导致bug
        //所以，hooks必须写在组件的顶层，不能写在条件语句中
        queue.push(newState)
        index++
    }
    return [queue[index],update]
}
const [count,setCount] = useState(0)

//事件
window.addEventListener('click', () => {
    // count++;
    // render();
    setCount(count+1)
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
    //react为什么不用requestIdleCallback/schedule.postTask？
    //因为requestIdleCallback/schedule.postTask,没有优先级，不能根据优先级来执行任务，所以不能保证任务的执行顺序
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