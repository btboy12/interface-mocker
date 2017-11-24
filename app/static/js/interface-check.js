$(document).ready(function(){
    $('form :input').blur(function(){
        if($(this).is('#interName')){
            var interNameSpan=$('#interNameSpan');
            if(this.value==""){
                interNameSpan.addClass("onCheckError");
                var alertMes="*请输入接口名";
                if(interNameSpan.text()==""){
                    interNameSpan.text(alertMes);
                }
                else{

                }
            }
            else{
                interNameSpan.text("");
            }
        }
        if($(this).is('#interAdd')){
            var interAddSpan=$('#interAddSpan');
            if(this.value==""){
                interAddSpan.addClass("onCheckError");
                var alertMes="*请输入接口地址";
                if(interAddSpan.text()==""){
                    interAddSpan.text(alertMes);
                }
                else{

                }
            }
            else{
                interAddSpan.text("");
            }
        }
    /*$('#postWay').on("onchange",function(){
            var postWaySpan=$('#postWaySpan');
            
                postWaySpan.addClass("onCheckError");
                var alertMes="*请选择请求方式";
                if(postWaySpan.text()==""){
                    postWaySpan.text(alertMes);
                }
                else{

                }
    */       
    })
   /* $('#confirmBtn').click(function(){
        var interNameSpan=$('#interNameSpan');
        var interAddSpan=$('#interAddSpan');
        if($('#interName').value==""){
            interNameSpan.addClass("onCheckError");
            var alertMes="*请输入接口名";
            if(interNameSpan.text()==""){
                interNameSpan.text(alertMes);
            }
            else{

            }
        }
        else{
            interNameSpan.text("");
        }
        if($('#interAdd').value==""){
            interAddSpan.addClass("onCheckError");
            var alertMes="*请输入接口地址";
            if(interAddSpan.text()==""){
                interAddSpan.text(alertMes);
            }
            else{

            }
        }
        else{
            interAddSpan.text("");
        }
    })
    */
    $('#cancelBtn').click(function(){
        var interNameSpan=$('#interNameSpan');
        var interAddSpan=$('#interAddSpan');
        interNameSpan.text("");
        interAddSpan.text("");
    })
});