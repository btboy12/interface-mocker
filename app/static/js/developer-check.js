$(document).ready(function(){
    $('form :input').blur(function(){
        if($(this).is('#name')){
            var nameSpan=$('#nameSpan');
            if(this.value==""){
                nameSpan.addClass("onCheckError");
                var alertMes="*请输入姓名";
                if(nameSpan.text()==""){
                    nameSpan.text(alertMes);
                }
                else{

                }
            }
            else{
                nameSpan.text("");
            }
        }
        if($(this).is('#add')){
            var addSpan=$('#addSpan');
            if(this.value==""){
                addSpan.addClass("onCheckError");
                var alertMes="*请输入地址";
                if(addSpan.text()==""){
                    addSpan.text(alertMes);
                }
                else{

                }
            }
            else{
                addSpan.text("");
            }
        }
        if($(this).is('#num')){
            var numSpan=$('#numSpan');
            if(this.value==""){
                numSpan.addClass("onCheckError");
                var alertMes="*请输入端口";
                if(numSpan.text()==""){
                    numSpan.text(alertMes);
                }
                else{

                }
            }
            else{
                numSpan.text("");
            }
        } 
    })
    /*$('#confirmBtn').click(function(){
        var nameSpan=$('#nameSpan');
        var addSpan=$('#addSpan');
        var numSpan=$('#numSpan');
        if($('#name').value==""){
            nameSpan.addClass("onCheckError");
            var alertMes="*请输入姓名";
            if(nameSpan.text()==""){
                nameSpan.text(alertMes);
            }
            else{

            }
        }
        else{
            nameSpan.text("");
        }
        if($('#add').value==""){
            addSpan.addClass("onCheckError");
            var alertMes="*请输入地址";
            if(addSpan.text()==""){
                addSpan.text(alertMes);
            }
            else{

            }
        }
        else{
            addSpan.text("");
        }
        if($('#num').value==""){
            numSpan.addClass("onCheckError");
            var alertMes="*请输入端口";
            if(numSpan.text()==""){
                numSpan.text(alertMes);
            }
            else{

            }
        }
        else{
            numSpan.text("");
        }
    })
    */
    $('#cancelBtn').click(function(){
        var nameSpan=$('#nameSpan');
        var addSpan=$('#addSpan');
        var numSpan=$('#numSpan');
        nameSpan.text("");
        addSpan.text("");
        numSpan.text("");
    })
});