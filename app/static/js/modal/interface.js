(function () {
    Vue.component('v-select', VueSelect.VueSelect);

    var app = new Vue({
        el: "#interface_modal",
        data: {
            id: null,
            info: {
                name: null,
                router: null,
                method: null,
                developerId: null
            },
            orgin_info: {},
            selectedDeveloper: null,
            developers: []
        },
        methods: {
            getDevelopers: getDevelopers,
            upload: function () {
                var method, postfix;
                app.info.developerId = app.selectedDeveloper.id;
                if (app.id) {
                    method = "put";
                    postfix = "/" + app.id;
                    var temp = {};
                    for (var i in app.info) {
                        app.info[i] != app.orgin_info[i] && (temp[i] = app.info[i]);
                    }
                    if ($.isEmptyObject(temp)) {
                        $("#interface_modal").modal('hide');
                        return;
                    }
                } else {
                    method = "post";
                    postfix = "";
                }
                $.ajax({
                    url: "/api/interface" + postfix,
                    type: method,
                    data: app.info,
                    success: function (data, status) {
                        $("#data_list").bootstrapTable('refresh', { silent: true });
                        $("#interface_modal").modal('hide');
                    },
                    error: function (xhr, status, error) {
                        console.warn(error);
                    }
                });
            }
        }
    });

    getDevelopers();

    function getDevelopers(search, loading) {
        loading && loading(true);
        $.get("/api/developer", function (data, status) {
            app.developers = data;
            loading && loading(false);
        });
    }

    window.interface_modal = {
        clear: function () {
            app.id = null;
            app.info = {
                name: null,
                router: null,
                method: null,
                developerId: null
            };
            app.selectedDeveloper = null;
        },
        set: function (id, data) {
            app.id = id;
            for (var i in app.info) {
                app.info[i] = data[i];
            }
            app.selectedDeveloper = (app.developers.filter(function (item) {
                return item.id == data.id;
            })[0] || null);

            app.orgin_info = data;
        },
        show: function () {
            $("#interface_modal").modal('show');
        }
    }
})();