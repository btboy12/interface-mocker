(function () {
    var sample_data = {
        id: null,
        sample_list: [],
        orgin_list: []
    }

    var app_sample = new Vue({
        el: "#modal_sample",
        data: sample_data,
        methods: {
            upload: function () {
                var changed_example = [];
                for (var i in this.sample_list) {
                    var sample = this.sample_list[i];
                    var orgin_sample = this.orgin_list[i];
                    if (orgin_sample) {
                        var temp = {};
                        for (var j in sample) {
                            sample[j] != orgin_sample[j] && (temp[j] = sample[j]);
                        }
                        $.isEmptyObject(temp) || changed_example.push(temp) && (temp.id = sample.id);
                    } else {
                        changed_example.push(sample);
                    }
                }
                if (!changed_example.length) {
                    $("#modal_sample").modal('hide');
                    return;
                }
                $.ajax({
                    url: "/api/example?" + "interface=" + sample_data.id,
                    type: "put",
                    contentType: "application/json",
                    data: JSON.stringify(changed_example),
                    success: function (data, status) {
                        $("#modal_sample").modal('hide');
                    },
                    error: function (xhr, status, error) {
                        console.warn(error);
                    }
                });
            }
        }
    });

    window.getButton = function (value, row, index) {
        return "<button class='btn btn-warning' onclick='del(event," + row.id + ")'>删除</button>\
                <button class='btn btn-primary' onclick='mod("+ row.id + ")'>修改</button>\
                <button class='btn btn-primary' onclick='sample("+ row.id + ")'>返回样例</button>";
    }

    window.add = function () {
        window.interface_modal.clear();
        window.interface_modal.show();

    }

    window.mod = function (id) {
        $.get("/api/interface/" + id, function (data, status) {
            window.interface_modal.set(data.id, data);
            window.interface_modal.show();
        });
    }

    window.del = function (event, id) {
        event.stopPropagation()
        $.ajax({
            url: "/api/interface/" + id,
            type: "delete",
            success: function (data, status) {
                $("#data_list").bootstrapTable('refresh', { silent: true });
            },
            error: function (xhr, status, error) {
                console.warn(error);
            }
        });
    }

    window.sample = function (id) {
        $.get("/api/example?interface=" + id, function (data, status) {
            sample_data.sample_list = data.map(function (item, index, array) {
                var result = {};
                for (var i of ["id", "name", "inUse", "code", "cookies", "content"]) {
                    result[i] = item[i];
                }
                return result;
            });
            sample_data.id = id;
            sample_data.orgin_list = data;
            Vue.nextTick(function () {
                $("#modal_sample .switch").bootstrapSwitch();
                $("#modal_sample .name").each(function (i, e) {
                    $(e).width($(e).parent().width() - $(e).prev().outerWidth() - $(e).next().outerWidth());
                });
            });
        });
        $("#modal_sample").modal('show');
    }
})();

$("#req_info").editableTableWidget();


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