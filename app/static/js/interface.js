(function () {
    Vue.component('v-select', VueSelect.VueSelect);
    var app_data = {
        id: null,
        info: {
            name: null,
            router: null,
            developerId: null
        },
        selectedDeveloper: null,
        developers: []
    }

    var app = new Vue({
        el: "#modal",
        data: app_data,
        methods: {
            getDevelopers: getDevelopers
        }
    });

    var sample_data = {
        id: null,
        sample_list: []
    }
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
            developerId: null
        },
            $("#modal").modal("show");
    }

    window.upload = function () {
        var method, postfix;
        if (app_data.id) {
            method = "put";
            postfix = "/" + app_data.id;
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
        app_data.id = id;
        $.get("/api/interface/" + id);
    }

    window.sample = function (id) {
        $.get("/api/example?interface=" + id, function (data, status) {
            sample_data.sample_list = data;
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