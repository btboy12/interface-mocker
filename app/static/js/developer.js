(function () {
    var app_data = {
        id: null,
        name: null,
        addr: null,
        port: null
    };

    var app = new Vue({
        el: '#modal',
        data: app_data
    });

    $("#data_list").on("click-row.bs.table", function (row, field, $element) {
        mod(field.id);
    });

    window.getButton = function (value, row, index) {
        return "<button class='btn btn-warning' onclick='del(event," + row.id + ")'>删除</button>\
                <button class='btn btn-primary' onclick='mod("+ row.id + ")'>修改</button>";
    }

    window.add = function () {
        app_data = {
            id: null,
            name: null,
            addr: null,
            port: null
        };
        $("#modal").modal('show');
    }

    window.mod = function (id) {
        $.get("/api/developer/" + id, function (data, status) {
            for (var i in app_data) {
                app_data[i] = data[i];
            }
        });
        $("#modal").modal('show');
    }

    window.del = function (event, id) {
        event.stopPropagation()
        $.ajax({
            url: "/api/developer/" + id,
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
        if ($("#id").val()) {
            method = "put";
            param = "/" + $("#id").val();
        } else {
            method = "post";
            param = "";
        }
        $.ajax({
            url: "/api/developer" + param,
            type: method,
            data: app_data,
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




