/// <reference path="../../Scripts/jquery.jqGrid.js" />

window.Reviewer = window.Reviewer || {};

(function (ns) {


    var vm = function () {
        var self = this;

        //properties
        self.viewModelHelper = new ns.ViewModelHelper();

        self.isCommandRunning = ko.observable(false);
        self.elements = ko.observableArray();
        self.elementsEdited = ko.observableArray();
        self.elementsPaged = ko.observableArray();
        self.originalElments = null;


        self.zones = ko.observableArray();
        self.selectedZone = ko.observable();


        self.categories = ko.observableArray();
        self.selectedCategory = ko.observable();
       
        //subscriptions
        self.selectedZone.subscribe(function (newvalue) {
            self.loadAvailableCategories(self, { insertmessages: false });
        });

        self.selectedCategory.subscribe(function (newvalue) {

        });

      

        //methods
        self.shouldEnableSearch = function () {
            var shouldEnableButton = (self.selectedZone() !== undefined &&
                self.selectedCategory() !== undefined);
            return shouldEnableButton;
        };

        self.shouldEnableCreate = function () {
            return (self.selectedZone() !== undefined &&
                self.selectedCategory() !== undefined );
        };

        self.loadAvailableZones= function (model) {
            self.isCommandRunning(true);
            self.viewModelHelper.apiGet('api/resources/zones',
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.zones);
                    toastr.info("Loaded " + result.length, "Zones");
                }, function (error) {
                    toastr.error(error.responseText, "Operation Result");
                },
                function () {
                    self.isCommandRunning(false);
                });
        };

        self.loadAvailableCategories = function (model) {

            function Category(data) {
                this.Name = ko.observable(data);
            }

            if (self.selectedZone() == undefined) { return; }
            self.isCommandRunning(true);


            self.viewModelHelper.apiGet('api/resources/categoriesjson?forZone=' + encodeURIComponent(self.selectedZone()),
                null,
                function (result) {
                    var mappedEntities = $.map(result, function (item) { return new Category(item); });
                    self.categories(mappedEntities);

                }, function (error) {
                    toastr.error(error.responseText, "Operation Result");
                },
                function () {
                    self.isCommandRunning(false);
                });
        };


        self.getDto = function () {
            return {
                FilterKeyValues: [
                    { key: "Zone", value: self.selectedZone() },
                    { key: "Category", value: self.selectedCategory() }
                ]
            };
        };

        self.search = function () {
            self.isCommandRunning(true);
            //toastr.info(ko.toJSON(self.getDto()));
            // toastr.info(ko.toJSON(self.selectedZone()));
            self.reload();
            self.isCommandRunning(false);
        };

      
        self.reload = function () {
            self.myGrid.jqGrid('setGridParam', { postData: self.getDto() }).trigger('reloadGrid');
        };


        self.loadAvailableZones(self, { insertmessages: false });

    }; // vm

    ns.ScenariaViewModel = vm;

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

    var cellattr = function (rowId, val, rawObject) {

        if (val == 'Rejected in Review' || val == 'Rejected in Signoff') {
            return " class='rejected'";
        }
        if (val == 'Reviewed' || (val == 'Completed/Signed Off')) {
            return " class='approved'";
        }
        return "";
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
        mtype: 'POST',
        url: Reviewer.rootPath + "api/operations/searchScenaria",
        colNames: ["Id", "Approved", "Zone", "Category", "Status",  ""],
        colModel: [
            { name: "Id", width: 35, align: "center", key: true, index: 'Id', sortable: true, hidden: true },
            { name: "Approved", width: 0, hidden: true },
            { name: "Zone", width: 75, "index": "Zone", sortable: true, align: "center" },
            { name: "Category", width: 75, "index": "Category", sortable: true, align: "center" },
            { name: "Status", width: 70, "index": "Status", sortable: true, align: "center" },
            { name: 'act', index: 'act', sortable: false, width: 85, editable: false, formatter: 'actions', formatoptions: { keys: true, editbutton: false, delbutton: false } }
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
        caption: "&nbsp; Return records",
        autowidth: true,
        shrinktofit: false,
        editurl: Reviewer.rootPath + 'api/operations/searchScenaria',
        height: "100%",
        jsonReader: { repeatitems: true },
        /* ondblClickRow: ondblClickRowAction,*/
        onSelectRow: onSelectRowAction,
        aftersavefunc: function (rowID, response) {
            cancelEditing($('#grid'));
        },
        loadComplete: loadCompleteAction
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


