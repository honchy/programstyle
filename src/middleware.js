function EventMiddleWare() {
    this._cache = [];
}
EventMiddleWare.prototype.use = function(fn) {
    this._cache.push(fn);
};

EventMiddleWare.prototype.execute = async function(es) {
    if (this._cache) {
        var _list = this._cache.slice(0);
        let next = async () => {
            var fn = _list.shift();
            if (fn) {
                await fn(es, next);
            }
        };
        next();
    }
};

function EventSession(name, data, callback) {
    this.name = name;
    this.data = data;
    this.callback = callback;

    EventSession.sessionId = EventSession.sessionId || 0;
    this.id = EventSession.sessionId++;
}

EventSession.prototype.perf = function() {
    EventSession.sessionCache = EventSession.sessionCache || {};
    if (!EventSession.sessionCache[this.name]) {
        EventSession.sessionCache[this.name] = Date.now();
    } else {
        console.log("session cost", Date.now - EventSession.sessionCache[this.name]);
    }
};

// test
var mw = new EventMiddleWare();
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
    await mw.execute({ name: "TestEvent" });
})();
// mw.do({ name: "TestEvent" });
