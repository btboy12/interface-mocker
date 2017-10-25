// 将地址栏的hash转换为字典。例：
// id=1&name=test
// =>
// {id:1,name:'test'}
// 如果没有传入参数，则直接取地址栏的hash

function getHashParams(hash) {
    var params = {};
    var hash = hash || document.location.hash;  
    var pairs = hash.split("&");
    for (var i in pairs) {
        var paramStr = pairs[i];
        if (paramStr.indexOf("=") > 0) {
            var kv = paramStr.split("=");
            params[kv[0]] = decodeURIComponent(kv[1]);
        }
    }
}
// 将字典转化为hash。例：
// {id:1,name:'test'}
// =>
// id=1&name=test

function parseHashParams(params) {
    var list = [];
    for (var i in params) {
        list.push(encodeURIComponent(i) + "=" + encodeURIComponent(params[i]));
    }
    return list.join("&");
}