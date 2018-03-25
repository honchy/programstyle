// 借鉴状态机原理，制作了一个Java日志的解析器
// 分析字符得到token，然后根据token分拆基础的unit单元。
// 然后分析unit内的结构，组建真实的数据

// 解析出来单词
// 解析出来语句
// 构建语句内部细节

// token 结构单元 分析嵌套关系
var rawinput = 'Person{name="李磊", age=33, children=["Hello World", PersonChild{name="李  磊儿子", age=13, children=[PersonChild{name="Jon Li", age=12}]}, PersonChild{name="李  磊儿子", age=13}]}\r\nPerson{name="李磊", age=33, children=[PersonChild{name="李  磊儿子", age=13}, PersonChild{name="李  磊儿子", age=13}]}';

var currentToken = '';
var isInString = false;
// 输入字符
function inputString(str) {
    for(var i = 0, len = str.length; i < len; i ++) {
        onChar(str[i]);
    }
}

// 每个字符都会引起当前的语法判定
function onChar(ch) {
    if(!isInString && /[\s\{\},\[\]\=]/.test(ch)) {
        onToken(currentToken, ch);
        currentToken = '';
    } else {
        currentToken += ch;
        if(ch === '"') {
            isInString = !isInString;
        }
    }
}
// 由词法分析到句法分析
// 拆分成为一个个的语句
var currentUnit = null;
var unitList = [];
function onToken(token, ch) {
    switch (ch) {
        case '{':
        case "[":
            onUnitStart(token, ch);
            break;
        case "}":
        case "]":
            onUnitEnd(token, ch);
            break;
        default:
            onUnitToken(token, ch);
    }
}

function onUnitStart(token, ch) {
    var unit = {
        type: ch === '{' ? 'object' : 'array',
        tokens: [token, ch]
    }
    if(currentUnit) {
        unit.parent = currentUnit;
        currentUnit.tokens.push(unit);
        currentUnit = unit;
    } else {
        currentUnit = unit;
    }
}
function onUnitToken(token, ch) {
    if(currentUnit) {
        currentUnit.tokens.push(token);
        currentUnit.tokens.push(ch);
    }
}
function onUnitEnd(token, ch) {
    if(currentUnit) {
        currentUnit.tokens.push(token);
        currentUnit.tokens.push(ch);

        if( currentUnit.parent ) {
            var u = currentUnit;
            currentUnit = currentUnit.parent;
            delete u.parent;
        } else {
            unitList.push(currentUnit);
            currentUnit = null;
        }
    }
}

// 由语句构建对象树
function buildUnitTree(unitList) {
    return unitList.map(buildUnit);
}
function buildUnit(unit) {
    switch (unit.type) {
        case 'object':
            return buildObject(unit);
        case 'array':
            return buildArray(unit);
        default:
            console.log('not accept type', unit.type, unit);
            return {error: 'unKnownType '+ unit.type, data: unit};
    }
}

function buildObject(unit) {
    var key = '',
        prevToken = '',
        value = '';

    var tokens = unit.tokens.filter(function(token) {
        return /\S/.test(token);
    });
    // key = value
    var object = {};
    var idx = 0; len = tokens.length;
    for( ;idx < len; idx ++ ) {
        if(tokens[idx] === '=') {
            var key = tokens[idx - 1];
            var value = tokens[idx + 1];
            if(value.type) {
                value = buildUnit(value);
            }
            object[key] = value;

            idx = idx + 2;
        }
    }

    return object;
}
function buildArray(unit) {
    var tokens = unit.tokens.filter(function(token) {
        return /[^\s,\[\]]/.test(token);
    });
    return tokens.map(function(token) {
        return token.type ? buildUnit(token) : token;
    })
}

inputString(rawinput);
var result = buildUnitTree(unitList);

console.log(JSON.stringify(result, null, 4));
