$(document).ready(function(){
    $("#searchWindow").blur(function(){     //失去焦点时动态修改url的参数
        var oldInter=getUrl('interfaceId');
        var newUrl= window.location.pathname + "?interfaceId=" + oldInter + "&search=" + $("#searchWindow").val();
        window.history.pushState({},0,newUrl);
    })
})

window.onload=function(){                   //识别url中是否有search参数,如果有就填入搜索框
    $("#data_list").attr("data-search-text",getUrl('search'));
}

function getUrl(name) {                      //得到url里对应参数的值
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    } 
    else {
        return null;
    }
}

