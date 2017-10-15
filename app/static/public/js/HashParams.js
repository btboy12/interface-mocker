function getHashParams() {
    var params = {};
    var pairs = document.location.hash.split("&");
    for (var i in pairs) {
        var paramStr = pairs[i];
        if (paramStr.indexOf("=") > 0) {
            var kv = paramStr.split("=");
            params[kv[0]] = kv[1];
        }
    }
}

function parseHashParams(params) {
    var list = [];
    for (var i in params) {
        list.push(i + "=" + params[i]);
    }
    return list.join("&");
}