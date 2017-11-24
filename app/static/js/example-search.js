$(document).ready(function(){
    var oldInter=getUrl('interfaceId');
    var oldSearch=getUrl('search');
    var tableUrl='/api/example?interfaceId='+oldInter;

    $('#data_list').bootstrapTable({          //table表
        url:tableUrl,
        dataType: "json",
        toolbar:'#toolbar', 
        pagination:true,
        sidePagination:'server',
        height:800,
    });

    $('#searchWindow').bind('input propertychange', function() {  //动态修改url的参数
        var newUrl= window.location.pathname + "?interfaceId=" + getUrl('interfaceId') + "&search=" + $("#searchWindow").val();
        window.history.pushState({},0,newUrl);
        var newSelectUrl="/api" + window.location.pathname+"?interfaceId=" + getUrl('interfaceId') + "&search=" + getUrl('search');
        var opt = {
            url: newSelectUrl,
        };
        $('#data_list').bootstrapTable('refresh', opt);
    });

    $.ajax({                          //下拉菜单
        type:"GET",
        url:"/api/interface",
        dataType:"json",
        success:function(data){
            var selecthtml='';
            selecthtml+='<option id="showAll" interfaceId="">查看全部</option>';
            $.each(data,function(commentIndex,comment){
                if(getUrl('interfaceId')==comment['id']){       //根据url更改select所选的option
                    selecthtml+='<option selected="selected" interfaceId='+ comment['id'] + '>' + comment['name']+'</option>';
                }
                else{
                    selecthtml+='<option interfaceId='+ comment['id'] + '>' + comment['name']+'</option>';
                }
            });
            $("#interfaceSelect").html(selecthtml);
        },
    });

    $('#interfaceSelect').change(function(){
        var selectId = $('#interfaceSelect option:selected').attr('interfaceId');
        
        var newUrl=window.location.pathname+"?interfaceId=" + selectId + "&search=" + getUrl('search');
        window.history.pushState({},0,newUrl);
        var newSelectUrl="/api" + window.location.pathname+"?interfaceId=" + getUrl('interfaceId') + "&search=" + getUrl('search');
        var opt = {
            url: newSelectUrl,
        };
        $('#data_list').bootstrapTable('refresh', opt);
    });
})

window.onload=function(){          

}

function getUrl(name) {                      //得到url里对应参数的值
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    } 
    else {
        return "";
    }
}

