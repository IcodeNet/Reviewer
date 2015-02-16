/// <reference path="../../Scripts/jquery.jqGrid.js" />

window.Reviewer = window.Reviewer || {};

(function (ns) {


    var scenariaViewModel = function () {

        var vm = this;

        //*************************************
        // implemenations

        vm.getDto = function () {
            return {
                FilterKeyValues: [
                    { key: "Zone", value: vm.selectedZone() },
                    { key: "Category", value: vm.selectedCategory() }
                ]
            };
        };


        var reload = function () {
            vm.myGrid.jqGrid('setGridParam', { postData: vm.getDto() }).trigger('reloadGrid');
        };


        var search = function () {
            vm.isCommandRunning(true);
            //toastr.info(ko.toJSON(self.getDto()));
            // toastr.info(ko.toJSON(self.selectedZone()));
            vm.reload();
            vm.isCommandRunning(false);
        };


        var shouldEnableSearch = function () {
            var shouldEnableButton = (vm.selectedZone() !== undefined &&
                vm.selectedCategory() !== undefined);
            return shouldEnableButton;
        };

        var shouldEnableCreate = function () {
            return (vm.selectedZone() !== undefined &&
                vm.selectedCategory() !== undefined);
        };

        var loadAvailableCategories = function (model) {

            function Category(data) {
                this.Name = ko.observable(data);
            }

            if (vm.selectedZone() == undefined) {
                return;
            }
            vm.isCommandRunning(true);


            vm.ajaxCaller.apiGet('api/resources/categoriesjson?forZone=' + encodeURIComponent(vm.selectedZone()),
                null,
                function (result) {
                    var mappedEntities = $.map(result, function (item) { return new Category(item); });
                    vm.categories(mappedEntities);

                }, function (error) {
                    toastr.error(error.responseText, "Operation Result");
                },
                function () {
                    vm.isCommandRunning(false);
                });
        };

        var loadAvailableZones = function (model) {
            vm.isCommandRunning(true);
            vm.ajaxCaller.apiGet('api/resources/zones',
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, vm.zones);
                    toastr.info("Loaded " + result.length, "Zones");
                }, function (error) {
                    toastr.error(error.responseText, "Operation Result");
                },
                function () {
                    vm.isCommandRunning(false);
                });
        };


        // INTERFACE
        //properties
        vm.ajaxCaller = new ns.AjaxCaller();

        vm.isCommandRunning = ko.observable(false);

        vm.zones = ko.observableArray();
        vm.selectedZone = ko.observable();

        vm.categories = ko.observableArray();
        vm.selectedCategory = ko.observable();

        //methods
        vm.shouldEnableSearch = shouldEnableSearch;
        vm.shouldEnableCreate = shouldEnableCreate;

        vm.loadAvailableZones = loadAvailableZones;
        vm.loadAvailableCategories = loadAvailableCategories;
        vm.search = search;
        vm.reload = reload;



        //subscriptions
        vm.selectedZone.subscribe(function (newvalue) {
            vm.loadAvailableCategories(vm, { insertmessages: false });
        });

        vm.selectedCategory.subscribe(function (newvalue) {

        });

        // init 
        loadAvailableZones(vm, { insertmessages: false });

    }; // vm

    ns.ScenariaViewModel = scenariaViewModel;

}(window.Reviewer));


$(function () {
    'use strict';

    var viewModel = new window.Reviewer.ScenariaViewModel;
    ko.applyBindings(viewModel);


    var lastSel;

    var getColumnIndexByName = function (grid, columnName) {
        var cm = grid.jqGrid('getGridParam', 'colModel'), i, l = cm.length;
        for (i = 0; i < l; i++) {
            if (cm[i].name === columnName) {
                return i; // return the index
            }
        }
        return -1;
    };

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


    var loadCompleteAction = function () {
        var iCol = getColumnIndexByName(myGrid, 'act');

        var arrayOfIds = $(this).jqGrid('getDataIDs');
        var grid = this;
        var jqgrid = $(this);

        arrayOfIds.forEach(function (id) {
            var rowData = jqgrid.getRowData(id);

            if (rowData.UserComments != "") {
                $(grid.rows.namedItem(id)).addClass('ui-state-highlight');

                var editDivs = $(grid.rows.namedItem(id)).find("td:nth-child(" + (iCol + 1) + ")").find("div");
                $(editDivs[0]).html('<span title="' + rowData.UserComments + '" class="ui-icon ui-icon-comment"></span>');


            }
        });

        var actionCells = $(this).find(">tbody>tr.jqgrow>td:nth-child(" + (iCol + 1) + ")");

        actionCells
            .each(function () {
                $("<div>", {
                    title: "View Scenario",
                    mouseover: function () {
                        $(this).addClass('ui-state-hover');
                    },
                    mouseout: function () {
                        $(this).removeClass('ui-state-hover');
                    },
                    click: function (e) {
                        var id = $(e.target).closest("tr.jqgrow").attr("id");

                        // alert("'View' button is clicked in the rowis=" + id + "");
                        viewModel.viewRecord(id);
                    }
                }
                    ).css({ "margin-right": "5px", float: "left", cursor: "pointer" })
                    .addClass("ui-pg-div ui-inline-custom")
                    .append('<span class="ui-icon ui-icon-document"></span>')
                    .prependTo($(this).children("div"));
            });

    }; //loadCompleteAction

    var onSelectRowAction = function (id) {
        if (id && id !== lastSel) {
            // cancel editing of the previous selected row if it was in editing state.
            // jqGrid hold intern savedRow array inside of jqGrid object,
            // so it is safe to call restoreRow method with any id parameter
            // if jqGrid not in editing state
            if (typeof lastSel !== "undefined") {
                $('#grid').restoreRow(lastSel);
              //  cancelEditing();
            }
            lastSel = id;
        }
    };


    var url = 'api/operations/searchScenaria';

    var myGrid = $("#grid").jqGrid({
        datatype: 'json',
        postData: viewModel.getDto(),
        mtype: 'POST',
        url: Reviewer.rootPath + url,
        colNames: ["Id", "Approved", "Zone", "Category", "Status", ""],
        colModel: [
            { name: "Id", width: 35, align: "center", key: true, index: 'Id', sortable: true, hidden: true },
            { name: "Approved", width: 0, hidden: true },
            { name: "Zone", width: 75, "index": "Zone", sortable: true, align: "center" },
            { name: "Category", width: 75, "index": "Category", sortable: true, align: "center" },
            { name: "Status", width: 70, "index": "Status", sortable: true, align: "center" },
            { name: 'act', index: 'act', sortable: false, width: 85, editable: false, formatter: 'actions', formatoptions: { keys: true, editbutton: true, delbutton: false } }
        ],

        pager: "#pager",
        rowNum: 5,
        rowList: [5, 10, 20, 30, 100],
        sortname: "Id",
        sortorder: "asc",
        viewrecords: true,
        save: true,
        gridview: true,
        autoencode: true,
        caption: "&nbsp; Return Scenaria records",
        autowidth: true,
        shrinktofit: false,
        editurl: Reviewer.rootPath + url,
        height: "100%",
        jsonReader: { repeatitems: true },
        onSelectRow: onSelectRowAction,
        aftersavefunc: function (rowID, response) {
            cancelEditing($('#grid'));
        },
        loadComplete: loadCompleteAction
    });


    $("#grid").jqGrid('navGrid', "#pager", { "edit": false, "add": false, "del": false, "search": false, "refresh": true, "view": false, "position": "left", "cloneToTop": true });

    viewModel.myGrid = myGrid;

   
});