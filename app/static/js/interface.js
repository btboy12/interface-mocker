(function () {
    Vue.component('v-select', VueSelect.VueSelect);
    var app_data = {
        info: {
            id: null,
            name: null,
            addr: null,
            developerId: null
        },
        developers: []
    }

    var app = new Vue({
        el: "",
        data: app_data,
        method: {
            getDevelopers: function (search, loading) {
                $.get("/api/developer", function (data, status) {
                    var temp = [];
                    for (var i in data) {
                        temp.push({
                            label: data[i].name,
                            value: data[i].id
                        });
                        app_data.developers = temp;
                    }
                });
            }
        }
    });
})();

var current;
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
// 返回状态码
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

$("#req_info").editableTableWidget();


$("table").on("click-row.bs.table", function (row, field, $element) {
    $("#modal").modal("show");
    $.get("/api/interface/" + value.id);
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
    event && event.preventDefault();
    $("#req_info_del").append("<tr><td><a class='glyphicon glyphicon-trash' onclick='delReqInfo(this)'></a>&nbsp;</td></tr>");
    $("#req_info_content").append("<tr><td>&nbsp;</td><td></td><td></td></tr>");
    $("#req_info_content").editableTableWidget();
}

function delReqInfo(id) {
    current.reqInfo.slice(id, 1);
    $("#req_info_content").children()[id].remove();
    $("#req_info_del").children()[id].remove();
    $("#req_info button").show();
}

function addResInfo(event) {
    event && event.preventDefault();
    $("#res_info_del").append("<tr><td><a class='glyphicon glyphicon-trash'></a>&nbsp;</td></tr>");
    $("#res_info_content").append("<tr><td>&nbsp;</td><td></td><td></td></tr>");
    $("#res_info_content").editableTableWidget();
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
    var method, postfix;
    if ($("#id").val()) {
        method = "put";
        postfix = "/" + $("#id").val();
    } else {
        method = "post";
        postfix = "";
    }

    $.ajax({
        url: "/api/interface" + postfix,
        type: method,
        dataType: "json",
        data: {
            name: $("#name").val(),
            // description: $("#description").val(),
            // interfaceClassId: $("#interfaceClassId").val(),
            // statuses: $("#status").val().join(","),
            router: $("#addr").val(),
            developerId: $("#developerId").val(),
            // reqInfo: JSON.stringify(getTableData("#req_info_content")),
            // resInfo: JSON.stringify(getTableData("#res_info_content"))
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

function getTableData(selector) {
    var result = [];
    $(selector).find("tr").each(function (i, e) {
        var temp = [];
        $(e).find("td").each(function (_i, _e) {
            temp.push($(_e).text());
        })
        result.push(temp);
    });
    return result;
}