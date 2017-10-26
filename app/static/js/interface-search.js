$(document).ready(function(){
    var oldDeve=getUrl('developerId');
    var oldSearch=getUrl('search');
    var tableUrl='/api/interface?developerId='+oldDeve;
    
    $('#data_list').bootstrapTable({          //table表
        url:tableUrl,
        dataType:'json',
        toolbar:'#toolbar',
        pagination:true,
        sidePagination:'server',
    });

    $('#searchWindow').bind('input propertychange', function() {  //动态修改url的参数
        var newUrl= window.location.pathname + "?developerId=" + getUrl('developerId') + "&search=" + $("#searchWindow").val();
        window.history.pushState({},0,newUrl);
        var newSelectUrl="/api" + window.location.pathname+"?developerId=" + getUrl('developerId') + "&search=" + getUrl('search');
        var opt = {
            url: newSelectUrl,
        };
        $('#data_list').bootstrapTable('refresh', opt);
    });

    $.ajax({                          //下拉菜单
        type:"GET",
        url:"/api/developer",
        dataType:"json",
        success:function(data){
            var selecthtml='';
            selecthtml+='<option id="showAll" developerId="">查看全部</option>';
            $.each(data,function(commentIndex,comment){
                if(getUrl('developerId')==comment['id']){       //根据url更改select所选的option
                    selecthtml+='<option selected="selected" developerId='+ comment['id'] + '>' + comment['name']+'</option>';
                }
                else{
                    selecthtml+='<option developerId='+ comment['id'] + '>' + comment['name']+'</option>';
                }
            });
            $("#developerSelect").html(selecthtml);
        },
    });

    $('#developerSelect').change(function(){
        var selectId = $('#developerSelect option:selected').attr('developerId');
        var newUrl=window.location.pathname+"?developerId=" + selectId + "&search=" + getUrl('search');
        var newSelectUrl="/api" + newUrl;
        window.history.pushState({},0,newUrl);
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