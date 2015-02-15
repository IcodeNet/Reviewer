/// <reference path="../../Scripts/jquery.jqGrid.js" />

window.Reviewer = window.Reviewer || {};


(function (ns) {


    var vm = function () {
        var self = this;

        //properties
        self.isCommandRunning = ko.observable(false);
        self.elements = ko.observableArray();
        self.elementsEdited = ko.observableArray();
        self.viewModelHelper = new window.Reviewer.ViewModelHelper();
        self.approveRequestModel = window.Reviewer.ApproveRequestModel;
      
        self.getDto = function () {
            return {
                FilterKeyValues: [{ key: "All", value: true }]
            };
        };

        self.reload = function () {
            self.myGrid.jqGrid('setGridParam', { postData: self.getDto() }).trigger('reloadGrid');
        };

    };


    ns.ApproveClusterAccessRequestViewModel = vm;

}(window.Reviewer));


$(function () {
    'use strict';

    var viewModel = new window.Reviewer.ApproveClusterAccessRequestViewModel;
    ko.applyBindings(viewModel);

    var lastSel;

    var cellattr = function (rowId, val, rawObject) {
        if (val == 'Rejected') {
            return " style='background-color:red;color:white;font-weight:bolder;font-variant:small-caps'";
        }
        return "";
    };
    var ondblClickRowAction = function (id, ri, ci) {
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

    };
    var onSelectRowAction = function (id) {
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
    };
    
    var myGrid = $("#grid").jqGrid({
        datatype: 'json',
        postData: viewModel.getDto(),
        mtype: 'GET',
        url: Reviewer.rootPath + "api/resources/accessrequestsjson",
        colNames: ["Id", "ClusterId",  "Cluster", "EmailAddress", "UserName", "Status", ""],
        colModel: [
            { name: "Id", width: 35, align: "center", sortable : true , "index": "Id",  key: true },
            { name: "ClusterId", hidden: true, editable: true, editrules: { edithidden: false }, hidedlg: true },
            { name: "Cluster", width: 120, "index": "ClusterName", align: "center" },
            { name: "EmailAddress", width: 200, "index": "UserEmail", align: "right" },
            { name: "UserName", width: 180, "index": "UserName", align: "right" },
            { name: "Status", width: 120, "index": "Status", editable: true, cellattr: cellattr, align: "center", edittype: "select", formatter: 'select', editoptions: {dataInit: function (elem) { $(elem).addClass('ui-state-highlight').width('100%').height('90%');}, value: "Approved:Approved;Rejected:Rejected;Pending:Pending;Revoked:Revoked" }, sortable: true },
            { name: 'act', index: 'act', sortable: false, width: 45, editable: false, formatter: 'actions', formatoptions: { keys: true, editbutton: true, delbutton: false } }
        ],

        pager: "#pager",
        rowNum: 5,
        rowList: [5, 10, 20, 30, 100],
        sortname: "Id",
        sortorder: "desc",
        viewrecords: true,
        save: true,
        gridview: true,
        autoencode: true,
        caption: "&nbsp; Access requests for Clusters",
        autowidth: true,
        shrinktofit: false,
        editurl: Reviewer.rootPath + 'api/operations/approveaccessrequests',
        height: "100%",
        jsonReader: { repeatitems: true },
        ondblClickRow: ondblClickRowAction,
        onSelectRow: onSelectRowAction,
        aftersavefunc: function (rowID, response) {
            cancelEditing($('#grid'));
        }
    });


    $("#grid").jqGrid('navGrid', "#pager", { "edit": false, "add": false, "del": false, "search": false, "refresh": true, "view": false, "position": "left", "cloneToTop": true });

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
});