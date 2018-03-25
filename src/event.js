// 简单的事件模型
// 所谓事件就是一个地方发生了变化，其他地方也许要跟随这个变化做出响应的反应

function EventCenter() {
    this.handlers = [];
}

EventCenter.prototype.fireEvent = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    this.handlers.forEach(function(handler) {
        handler.apply(null, args);
    });
}

EventCenter.prototype.addEventListener = function(handler) {
    this.handlers.push(handler);
}

EventCenter.prototype.removeEventListener = function(handler) {
    this.handlers = this.handlers.filter(function(hn) {
        return hn !== handler;
    });
}

// 通常在使用的时候，还会通过名字区分不同的事件。此时可以稍作变化

function EventCenter() {
    this.handlers = {};
}

EventCenter.prototype.fireEvent = function(name) {
    var args = Array.prototype.slice.call(arguments, 1);
    var handlers= this.handlers[name];
    handlers && handlers.forEach(function(handler) {
        handler.apply(null, args);
    });
}

EventCenter.prototype.addEventListener = function(name, handler) {
    if(this.handlers[name]) {
        this.handlers[name].push(handler);
    } else {
        this.handlers[name] = [handler];
    }
}

EventCenter.prototype.removeEventListener = function(name, handler) {
    if(!handler) {
        if(this.handlers.hasOwnProperty(name)) {
            delete this.handlers[name];
        }
    } else {
        var handlers = this.handlers[name];
        if(handlers) {
            this.handlers[name] = this.handlers[name].filter(function(fn) {
                return fn !== handler;
            })
        }
    }
}

// 但是还可以更复杂点，假如一个事件发生以后，假如绑定了多个handler，那么后面的handler不再被触发
// 可以调整下上面的fireEvent算法。

EventCenter.prototype.fireEvent = function(name) {
    var args = Array.prototype.slice.call(arguments, 1);
    var handlers= this.handlers[name];

    // 如果return false了，那么认为着终止处理
    handlers && handlers.some(function(handler) {
        return handler.apply(null, args) === false;
    });
}
