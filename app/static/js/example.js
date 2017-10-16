(function () {
    Vue.component('v-select', VueSelect.VueSelect);

    var app_data = {
        id: null,
        info: {
            name: null,
            code: null,
            interfaceId: null,
            cookies: null,
            content: null,
        },
        selectedInterface: null,
        interfaces: []
    };

    var app = new Vue({
        el: '#modal',
        data: app_data,
        methods: {
            getInterfaces: getInterfaces
        }
    });

    getInterfaces();

    $("#data_list").on("click-row.bs.table", function (row, field, $element) {
        mod(field.id);
    });

    function getInterfaces(search, loading) {
        loading && loading(true);
        $.get("/api/interface", function (data, status) {
            app_data.interfaces = data;
            loading && loading(false);
        });
    }

    window.getButton = function (value, row, index) {
        return "<button class='btn btn-warning' onclick='del(event," + row.id + ")'>删除</button>\
                <button class='btn btn-primary' onclick='mod("+ row.id + ")'>修改</button>";
    }

    window.add = function () {
        app_data.id = null;
        app_data.info = {
            name: null,
            code: null,
            interfaceId: null,
            cookies: null,
            content: null,
        };
        $("#modal").modal('show');
    }

    window.mod = function (id) {
        $.get("/api/example/" + id, function (data, status) {
            for (var i in app_data.info) {
                app_data.info[i] = data[i];
            }
            for (var intfcl of app_data.interfaces) {
                if (intfcl.id == data.interfaceId) {
                    app_data.selectedInterface = intfcl;
                    break;
                }
            }
        });
        $("#modal").modal('show');
    }

    window.del = function (event, id) {
        event.stopPropagation()
        $.ajax({
            url: "/api/example/" + id,
            type: "delete",
            success: function (data, status) {
                $("#data_list").bootstrapTable('refresh', { silent: true });
            },
            error: function (xhr, status, error) {
                console.warn(error);
            }
        });
    }

    window.upload = function () {
        var method, param;
        if (app_data.id) {
            method = "put";
            param = "/" + app_data.id;
        } else {
            method = "post";
            param = "";
        }
        app_data.info.interfaceId = app_data.selectedInterface.id;
        $.ajax({
            url: "/api/example" + param,
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
})();




