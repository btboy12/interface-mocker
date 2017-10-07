(function () {
    Vue.component('v-select', VueSelect.VueSelect);
    var app_data = {
        id: null,
        info: {
            name: null,
            router: null,
            method: null,
            developerId: null
        },
        selectedDeveloper: null,
        developers: []
    }

    var sample_data = {
        id: null,
        sample_list: []
    }

    var orgin_data = {};

    var app = new Vue({
        el: "#modal",
        data: app_data,
        methods: {
            getDevelopers: getDevelopers
        }
    });

    var app_sample = new Vue({
        el: "#modal_sample",
        data: sample_data
    });

    getDevelopers();

    function getDevelopers(search, loading) {
        loading && loading(true);
        $.get("/api/developer", function (data, status) {
            app_data.developers = data;
            loading && loading(false);
        });
    }

    window.getButton = function (value, row, index) {
        return "<button class='btn btn-warning' onclick='del(event," + row.id + ")'>删除</button>\
                <button class='btn btn-primary' onclick='mod("+ row.id + ")'>修改</button>\
                <button class='btn btn-primary' onclick='sample("+ row.id + ")'>返回样例</button>";
    }

    window.add = function () {
        app_data.id = null;
        app_data.info = {
            name: null,
            router: null,
            method: null,
            developerId: null
        },
            $("#modal").modal("show");
    }

    window.upload = function () {
        var method, postfix;
        if (app_data.id) {
            method = "put";
            postfix = "/" + app_data.id;
            var changed = false;
            for (var i in app_data.info) {
                changed |= (app_data.info[i] != orgin_data.intfcl[i]);
                if (changed) break;
            }
            if (!changed) {
                $("#modal").modal('hide');
                return;
            }
        } else {
            method = "post";
            postfix = "";
        }

        app_data.info.developerId = app_data.selectedDeveloper.id;

        $.ajax({
            url: "/api/interface" + postfix,
            type: method,
            data: app_data.info,
            success: function (data, status) {
                $("#data_list").bootstrapTable('refresh', { silent: true });
                $("#modal").modal('hide');
            },
            error: function (xhr, status, error) {
                console.warn(error);
            }
        });
    }

    window.mod = function (id) {
        $("#modal").modal("show");
        $.get("/api/interface/" + id, function (data, status) {
            app_data.id = id;
            for (var i in app_data.info) {
                app_data.info[i] = data[i];
            }
            app_data.selectedDeveloper = (app_data.developers.filter(function (item) {
                return item.id == data.id;
            })[0] || null);

            orgin_data.intfcl = data;
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
            orgin_data.sample = data;
        });
        $("#modal_sample").modal('show');
    }

    window.example_upload = function () {
        var changed_example = [];
        for (var i in sample_data.sample_list) {
            var sample = sample_data.sample_list[i];
            var orgin_sample = orgin_data.sample[i];
            var changed = false;
            for (var j in sample) {
                changed |= (sample[j] != orgin_sample[j]);
                if (changed) {
                    changed_example.push(sample);
                    break;
                }
            }
        }
        for (var i in changed_example) {
            $.ajax({
                url: "/api/example/" + changed_example[i].id,
                type: "put",
                data: changed_example[i],
                success: function (data, status) {
                    $("#modal_sample").modal('hide');
                },
                error: function (xhr, status, error) {
                    console.warn(error);
                }
            });
        }
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