/**
 *  关于红绿灯大战的问题
 *  参考 https://www.w3ctech.com/topic/916 
 *  做了如下拆分： 
 *  1. 业务规则部分
 *  2. 任务调度部分
 * 
 *  业务规则简单直接点好，便于理解和沟通。业务规则需要任务调度的胶水来黏合在一起。
 */

function keepState(param) {
    console.log(param[1], param[0]);
    return new Promise(resolve => {
        setTimeout(resolve, param[1]);
    });
}
// 没中状态的灯需要保持的时间
const StateDefine = [
    ['red', 2000],
    ['yellow', 3000],
    ['green', 5000]
];

function main() {
    // 没有考虑reject的情况，直接迭代
    var p = Promise.resolve();
    StateDefine.forEach(state => {
        p = p.then(() => keepState(state));
    });
    p.then(main);
}

main();
