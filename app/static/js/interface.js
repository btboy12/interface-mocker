var current;

$("table").on("click-row.bs.table", function ($event, value, $element) {
    $("#modal").modal("show");
    $.get("/api/interface/"+value.id);
});

$("#modal").on("show.bs.modal", function (e) {
    $("#req_info").editableTableWidget();
    // 接口所属
    $('#interfaceClassId').select2({
        width: "100%",
        minimumResultsForSearch: Infinity,
        ajax: {
            url: "/api/intfc_class",
            dataType: 'json',
            processResults: function (data, params) {
                var result = [];
                for (var i in data) {
                    result.push({
                        id: data[i].id,
                        text: data[i].name
                    });
                }

                return {
                    results: result
                }
            }
        }
    });
    // code
    $("#status").select2({
        width: "100%",
        minimumResultsForSearch: Infinity,
        multiple: true,
        ajax: {
            url: "/api/status",
            dataType: 'json',
            processResults: function (data, params) {
                var result = [];
                for (var i in data) {
                    result.push({
                        id: data[i].id,
                        text: data[i].code
                    });
                }
                return {
                    results: result
                }
            }
        }
    });
    // 所属开发者
    $("#developerId").select2({
        width: "100%",
        minimumResultsForSearch: Infinity,
        ajax: {
            url: "/api/developer",
            dataType: 'json',
            processResults: function (data, params) {
                var result = [];
                for (var i in data) {
                    result.push({
                        id: data[i].id,
                        text: data[i].name
                    });
                }

                return {
                    results: result
                }
            }
        }
    });

    current = {
        reqInfo: [],
        resInfo: []
    }
});

function initModal(data) {

}

$('#req_info').on('change', function (event, newValue) {
    var target_id = $(event.target).index();
    var parent_id = $(event.target).parent().index();
    var notEmpty = newValue && newValue.trim();
    notEmpty && (current.reqInfo[parent_id][target_id] = newValue);
    console.info(target_id, parent_id, newValue);
    for (var str of current.reqInfo[parent_id]) {
        if (str && str.trim()) {
            notEmpty = true;
            break;
        }
    }
    notEmpty || delReqInfo(parent_id);
    return true;
});

$('#req_info_content').on('nextStep', function (event) {
    var target = $(event.target);
    var parent = target.parent();
    if (target.index() === parent.children().length - 1) {
        addReqInfo(event);
        parent.next().children()[0].focus();
    } else {
        target.next().focus();
    }
});

function addReqInfo(event) {
    event.preventDefault();

    $("#req_info_del").append("<tr><td><a class='glyphicon glyphicon-trash' onclick='delReqInfo(" + current.reqInfo.length + ")'></a>&nbsp;</td></tr>");
    $("#req_info_content").append("<tr><td>&nbsp;</td><td></td><td></td></tr>");
    $("#req_info_content").editableTableWidget();
    $("#req_info button").hide();

    current.reqInfo.push([]);
}

function delReqInfo(id) {
    current.reqInfo.slice(id, 1);
    $("#req_info_content").children()[id].remove();
    $("#req_info_del").children()[id].remove();
    $("#req_info button").show();
}

function addResInfo(event) {
    event && event.preventDefault();
    current.reqInfo.push([]);

    $("#res_info_del").append("<tr><td><a class='glyphicon glyphicon-trash'></a>&nbsp;</td></tr>");
    $("#res_info_content").append("<tr><td>&nbsp;</td><td></td><td></td></tr>");
    $("#res_info_content").editableTableWidget();
    $("#res_info button").hide();
}

function iSubmit(event, element) {
    if (event.ctrlKey && (event.keyCode == 10)) {
        // $(element).prev().show();
        // $(element).hide();
        console.info(current);
    }
}

function add() {

    $("#modal").modal("show");
}

function upload() {
    var method;
    if ($("#id").val()) {
        method = "put";
    } else {
        method = "post";
    }

    $.ajax({
        url: "/api/interface" + (method == "put" ? ("/" + $("#id").val()) : ""),
        type: method,
        dataType: "json",
        data: {
            name: $("#name").val(),
            description: $("#description").val(),
            interfaceClassId: $("#interfaceClassId").val(),
            status: $("#status").val(),
            router: $("#addr").val(),
            developerId: $("#developerId").val(),
            reqInfo: JSON.stringify(current.reqInfo),
            resInfo: JSON.stringify(current.resInfo)
        },
        success: function (data, status) {
            $("#data_list").bootstrapTable('refresh', { silent: true });
            $("#modal").modal('hide');
        },
        error: function (xhr, status, error) {
            console.warn(error);
        }
    });
}