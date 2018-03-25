// 处理事件的方式，通过connect 中间件方式
// 当一个事件发生的时候，一次通过一系列的处理器，一个处理器处理完，再处理另外一个。顺序执行

// 1. 预先设置好处理队列
// 2. 将事件交给处理队列处理
function ProcessQueue() {
    this.list = [];
    this.currentIndex = 0;
}

ProcessQueue.prototype.next = function() {
    if(this.currentIndex < this.list.length) {
        return this.list[this.currentIndex ++];
    }
}

ProcessQueue.prototype.middleware = function(handler) {
    this.list.push(handler);
}

ProcessQueue.prototype.process = function() {
    var handler = this.next();
    var thisRef = this;
    if(handler) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.push(function() {
            thisRef.process.apply(thisRef, args);
        });

        handler.apply(null, 
            args
        );
    }
}

var eventProcessQueue = new ProcessQueue();
eventProcessQueue.middleware(function(event, callback, next) {
    console.log('process event before', event);
    next();
    console.log('process event after', event);
});

eventProcessQueue.middleware(function(event, callback, next) {
    callback(event);
});

eventProcessQueue.process({ name: 'TestEvent'}, function(result) {
    console.log(result);
});
