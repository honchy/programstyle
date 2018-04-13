// 中间件模式
// 当一个事件发生的时候，一次通过一系列的处理器，一个处理器处理完，再处理另外一个。顺序执行

// 1. 预先设置好处理队列
// 2. 将事件交给处理队列处理
function Middleware() {
    this.list = [];
}
Middleware.prototype.use = function(handler) {
    this.list.push(handler);
    return this;
};

Middleware.prototype._execute = async function(idx, next) {
    let len = this.list.length - 1;

    if (idx <= len) {
        let mw = this.list[idx];
        await mw.call(this, this.context, next);
    }
};

Middleware.prototype.do = async function(context) {
    this.context = context;
    let thisRef = this;
    let idx = 0;
    await this._execute(idx, next);

    async function next() {
        idx += 1;
        await thisRef._execute(idx, next);
    }
};

// test
var mw = new Middleware();
mw.use(async function(context, next) {
    console.log("middleware 1 before");
    await next();
    console.log("middleware 1 after");
});

mw.use(async function(context, next) {
    // next 应该有类似 resolve 类似的功能
    // 在底层支持Promise
    await new Promise(resolve => {
        setTimeout(async () => {
            console.log("middleware 2 before");
            await next();
            console.log("middleware 2 after");
            resolve();
        }, 1000);
    });
});

mw.use(async function(context, next) {
    console.log("middleware 3 before");
    await next();
    console.log("middleware 3 after");
});

(async () => {
    await mw.do({ name: "TestEvent" });
})();
// mw.do({ name: "TestEvent" });
