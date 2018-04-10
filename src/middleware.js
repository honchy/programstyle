// 中间件模式
// 当一个事件发生的时候，一次通过一系列的处理器，一个处理器处理完，再处理另外一个。顺序执行

// 1. 预先设置好处理队列
// 2. 将事件交给处理队列处理
function Middleware() {
    this.list = [];
    this.currentIndex = 0;
}

Middleware.prototype.next = function() {
    if (this.currentIndex < this.list.length) {
        let fn = this.list[this.currentIndex++];
        fn.apply(this);
    }
};

Middleware.prototype.use = function(handler) {
    this.list.push(handler);
    return this;
};

Middleware.prototype.do = function(...args) {
    this.next();
};

var mw = new Middleware();
mw.use(function() {
    console.log("middleware 1 before");
    this.next();
    console.log("middleware 1 after");
});

mw.use(function() {
    // setTimeout(() => {
        console.log("middleware 2 before");
        this.next();
        console.log("middleware 2 after");
    // }, 100);
});

mw.use(function() {
    console.log("middleware 3");
});

mw.do({ name: "TestEvent" });
