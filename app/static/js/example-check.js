$(document).ready(function(){
    $('form :input').blur(function(){
        if($(this).is('#examName')){
            var examNameSpan=$('#examNameSpan');
            if(this.value==""){
                examNameSpan.addClass("onCheckError");
                var alertMes="*请输入样例名";
                if(examNameSpan.text()==""){
                    examNameSpan.text(alertMes);
                }
                else{

                }
            }
            else{
                examNameSpan.text("");
            }
        }
        if($(this).is('#codeNum')){
            var codeNumSpan=$('#codeNumSpan');
            if(this.value==""){
                codeNumSpan.addClass("onCheckError");
                var alertMes="*请输入状态码";
                if(codeNumSpan.text()==""){
                    codeNumSpan.text(alertMes);
                }
                else{

                }
            }
            else{
                codeNumSpan.text("");
            }
        }
    })
    /*$('#confirmBtn').click(function(){
        var examNameSpan=$('#examNameSpan');
        var codeNumSpan=$('#codeNumSpan');
        if($('#examName').value==""){
            examNameSpan.addClass("onCheckError");
            var alertMes="*请输入样例名";
            if(examNameSpan.text()==""){
                examNameSpan.text(alertMes);
            }
            else{

            }
        }
        else{
            examNameSpan.text("");
        }
        if($('#codeNum').value==""){
            codeNumSpan.addClass("onCheckError");
            var alertMes="*请输入状态码";
            if(codeNumSpan.text()==""){
                codeNumSpan.text(alertMes);
            }
            else{

            }
        }
        else{
            codeNumSpan.text("");
        }
    })*/
    $('#cancelBtn').click(function(){
        var examNameSpan=$('#examNameSpan');
        var codeNumSpan=$('#codeNumSpan');
        examNameSpan.text("");
        codeNumSpan.text("");
    })
});