// 异步处理模型
var $ = require('jquery');
var fs = require('fs');
// 1. 最基本的异步处理模型就是callback方式

 $.ajax({
    url: 'url',
    data: {},
    success: function() {},
    fail: function() {}
});

// 2. 这是一个通常的行为模式，还有类似node的处理方式

fs.readFile('./connect.js', function(error, data) {
    console.log(data.toString('utf8'));
});

// 3. Promise模式

var filePath = './connect.js';

Promise.resolve(filePath).then(function(fp) {
    return new Promise(function(resolve, reject) {
        fs.readFile(fp, function(error, data) {
            if(error) {
                reject(error)
            } else {
                resolve(data);
            }
        });
    });
});

