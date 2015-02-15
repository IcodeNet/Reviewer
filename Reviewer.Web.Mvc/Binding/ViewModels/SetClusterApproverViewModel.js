
window.Reviewer = window.Reviewer || {};

(function (ns) {
    var vm = function () {

        var self = this;
        self.viewModelHelper = new Reviewer.ViewModelHelper();
        self.zones = ko.observableArray();
        self.users = ko.observableArray();
        self.selectedZone = ko.observable(); // Nothing selected by default
        self.userToAdd = ko.observable(0);
        self.isCommandRunning = ko.observable(false);

        self.loadAvailableZones = function (model) {
            self.viewModelHelper.apiGet('api/resources/clusters',
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.zones);
                    toastr.info("Loaded " + result.length, "Clusters");
                });
        };

        self.addUser = function () {
            self.isCommandRunning(true);

            var newClusterApprovers = [{ ClusterId: this.selectedZone() }];
            var dto = { ClusterUserApproverMappings: newClusterApprovers, UserEmail: this.userToAdd() };
            this.userToAdd("");
            $('.typeahead').val('');

            self.viewModelHelper.apiPost("api/operations/clusterapprovers",
                dto,
                function (result) {
                    self.isCommandRunning(false);
                    toastr.success("Modifications Success", "Result");
                    self.reload();
                },
                  function (error) {
                      var msg = $.parseJSON(error.responseText).Message;
                      if (msg == 'undefined') {
                          msg = error.responseText;
                      }

                      toastr.error(msg, "Result");
                  },
                  function () {
                      self.isCommandRunning(false);
                  });
        };


        self.deleteUser = function (item) {
            self.isCommandRunning(true);

            self.viewModelHelper.apiDelete("api/operations/DeleteClusterApprover",
                { id: item.Id },
                function (result) {
                    self.isCommandRunning(false);
                    toastr.success("Deletion Success", "Result");
                    self.reload();
                },
                  function (error) {
                      alert(error.responseText);
                  },
                  function () {
                      self.isCommandRunning(false);
                  });
        };

        self.loadClusterApprovers = function (model) {
            self.viewModelHelper.apiGet('api/resources/clusterapprovers',
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.users);
                    toastr.info("Loaded " + result.length, "Cluster Approvers.");
                });
        };

        self.warmUpMembershipService = function (model) {
            self.viewModelHelper.apiGet('user/AutocompleteUserBRID?query=vyron',
                null,
                function (result) {
                    // do nothing this is so that autocomplete service is responsive
                },
                  function (error) {
                      toastr.error(error.responseText);
                  },
                  function () {
                      //always
                  });
        };

        self.getDto = function () {
            return {};
        };

        self.search = function () {
            self.isCommandRunning(true);
            // toastr.info(ko.toJSON(self.getDto()));
            // toastr.info(ko.toJSON(self.selectedZone()));
            self.reload();
            self.isCommandRunning(false);
        };


        self.reload = function () {
            $('#grid').jqGrid('setGridParam', { page: 1, datatype: 'json' }).trigger('reloadGrid');
        };

        self.actionTitle = ko.computed(function () {
            if (self.userToAdd().length > 0) {
                return 'The action will be enabled once you select a user ';
            }
            return null;
        });

    };

    ns.SetClusterApproverViewModel = vm;
}(window.Reviewer));


$(function () {

    var viewModel = new Reviewer.SetClusterApproverViewModel();
    viewModel.loadAvailableZones(viewModel, { insertmessages: false });

    $(".tag-delete").live("click", function () {
        var itemToRemove = { Id: $(this).attr('data-id') };
        viewModel.users.remove(itemToRemove);
        viewModel.deleteUser(itemToRemove);
    });

    ko.applyBindings(viewModel);

    $('.typeahead').typeahead({
        remote: {
            url: Reviewer.rootPath + 'user/AutocompleteUserBRID?query=%query',
            wildcard: '%query'
        },
        limit: 10,
    });

    $(".typeahead").on("typeahead:selected", function (e, datum) {
        viewModel.userToAdd(datum.value);
    });


    var lastSel;

    var cellattr = function (rowId, val, rawObject) {
        if (val == 'Rejected') {
            return " class='ui-state-error-text ui-state-error ui-icon-circle-close'";
        }
        return "";
    };

    var myGrid = $("#grid").jqGrid({
        datatype: 'json',
        mtype: 'GET',
        url: Reviewer.rootPath + "api/resources/clusterapproversjson",
        colNames: ["Id", "ClusterName", "UserEmail", "UserName", ""],
        colModel: [
            { name: "Id", width: 35, align: "center", key: true },
            { name: "ClusterName", width: 85, align: "center", "index": "ClusterName" },
            { name: "UserEmail", width: 90, "index": "UserEmail", align: "center" },
            { name: "UserName", width: 80, "index": "UserName", align: "center" },
            {
                name: 'act',
                index: 'act',
                sortable: false,
                width: 45,
                editable: false,
                formatter: function (cellvalue, options, rowObjectArray) {
                    return "<span title='Click to Remove the Record' onmouseover=$(this).addClass('ui-icon-hover'); data-id='" + rowObjectArray[0] + "' class='tag-delete ui-icon ui-icon-trash'></span>";
                },
                align: "right"
            }
        ],
        loadonce: false,
        pager: "#pager",
        rowNum: 5,
        rowList: [5, 10, 20, 30, 100],
        sortname: "Id",
        sortorder: "asc",
        viewrecords: true,
        save: true,
        gridview: true,
        autoencode: true,
        caption: "&nbsp;<span class='icon-group icon-large'>&nbsp;</span>Cluster Approvers",
        autowidth: true,
        shrinktofit: false,
        height: "100%",
        jsonReader: { repeatitems: true },
        ondblClickRow: function (id, ri, ci) {
            // edit the row and save it on press "enter" key

            $("#grid").jqGrid('editRow', id,
                {
                    keys: true,
                    successfunc: function () {
                        cancelEditing();
                    },
                    afterrestorefunc: function () {

                        $("tr#" + lastSel + " div.ui-inline-edit, " + "tr#" + lastSel + " div.ui-inline-del", "#grid").show();
                        $("tr#" + lastSel + " div.ui-inline-save, " + "tr#" + lastSel + " div.ui-inline-cancel", "#grid").hide();
                    }
                });

            $("#" + id + "_Status").focus();

            $("tr#" + lastSel + " div.ui-inline-edit, " + "tr#" + lastSel + " div.ui-inline-del", "#grid").hide();
            $("tr#" + lastSel + " div.ui-inline-save, " + "tr#" + lastSel + " div.ui-inline-cancel", "#grid").show();

        },
        onSelectRow: function (id) {
            if (id && id !== lastSel) {
                // cancel editing of the previous selected row if it was in editing state.
                // jqGrid hold intern savedRow array inside of jqGrid object,
                // so it is safe to call restoreRow method with any id parameter
                // if jqGrid not in editing state
                if (typeof lastSel !== "undefined") {
                    $('#grid').restoreRow(lastSel);
                    cancelEditing();
                }
                lastSel = id;
            }
        },
        aftersavefunc: function (rowID, response) {
            cancelEditing($('#grid'));
        }
    });


    $("#grid").jqGrid('navGrid', "#pager", { "edit": false, "add": false, "del": false, "search": false, "refresh": true, "view": false, "position": "left", "cloneToTop": true });

    $("#grid").jqGrid('navButtonAdd', '#pager', {
        caption: '<span class="ui-pg-button-text">Export</span>',
        buttonicon: "ui-icon-extlink",
        title: "Export To Excel",
        onClickButton: function () {
            window.location = Reviewer.rootPath + 'Home/ExportAllToExcel';
        }
    });

    viewModel.myGrid = myGrid;

    function cancelEditing() {
        if (typeof lastSel !== "undefined") {

            $('#grid').jqGrid('restoreRow', lastSel);

            $("tr#" + lastSel + " div.ui-inline-edit, " + "tr#" + lastSel + " div.ui-inline-del", "#grid").show();
            $("tr#" + lastSel + " div.ui-inline-save, " + "tr#" + lastSel + " div.ui-inline-cancel", "#grid").hide();
        }
    };


    function startEditing() {
        if (typeof lastSel !== "undefined") {
            $("tr#" + lastSel + " div.ui-inline-edit, " + "tr#" + lastSel + " div.ui-inline-del", "#grid").hide();
            $("tr#" + lastSel + " div.ui-inline-save, " + "tr#" + lastSel + " div.ui-inline-cancel", "#grid").show();
        }
    };

    viewModel.warmUpMembershipService();
});