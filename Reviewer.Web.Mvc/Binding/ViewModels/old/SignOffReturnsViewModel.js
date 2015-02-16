/// <reference path="../../Scripts/jquery-1.9.1.js" />
/// <reference path="../../Scripts/jquery.jqGrid.js" />
/// <reference path="../../Scripts/knockout.mapping-latest.js" />

window.Reviewer = window.Reviewer || {};

(function (ns) {


    var vm = function () {
        var self = this;

        //properties
        self.ajaxCaller = new ns.AjaxCaller();

        self.isCommandRunning = ko.observable(false);
        self.elements = ko.observableArray();
        self.elementsEdited = ko.observableArray();
        self.elementsPaged = ko.observableArray();
        self.originalElments = null;
        self.zones = ko.observableArray();
        self.selectedZone = ko.observable();
        self.categories = ko.observableArray();
        self.selectedCategory = ko.observable();
        self.legalEntities = ko.observableArray();
        self.selectedLegalEntity = ko.observable();
        self.profitCentres = ko.observableArray();
        self.selectedProfitCentre = ko.observable();
        self.structuredEntities = ko.observableArray();
        self.selectedStructuredEntity = ko.observable();
        self.disclosureTypes = ko.observableArray();
        self.selectedDisclosureType = ko.observable();
        self.selectedRowsIds = ko.observableArray([]);

        //subscriptions
        self.selectedZone.subscribe(function (newvalue) {
            self.loadAvailableCategories(self, { insertmessages: false });
        });

        self.selectedCategory.subscribe(function (newvalue) {
            self.loadAvailableLegalEntities(self, { insertmessages: false });
        });

        self.selectedLegalEntity.subscribe(function (newvalue) {
            self.loadAvailableProfitCentres(self, { insertmessages: false });
        });

        self.selectedProfitCentre.subscribe(function (newvalue) {
            self.loadAvailableStructuredEntities(self, { insertmessages: false });
        });

        self.selectedStructuredEntity.subscribe(function (newvalue) {
            self.loadAvailableDisclosureTypes(self, { insertmessages: false });
            self.selectedDisclosureType(null);
        });

        //methods
        self.shouldEnableSearch = function () {
            var shouldEnableButton = (self.selectedZone() !== undefined &&
                self.selectedCategory() !== undefined);
            return shouldEnableButton;
        };



        self.loadAvailableZones = function (model) {
            self.isCommandRunning(true);
            self.ajaxCaller.apiGet('api/resources/Scenarios',
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.zones);
                    // toastr.info("Loaded " + result.length, "Scenarios");
                }, function (error) {
                    toastr.error(error.responseText, "Operation Result");
                },
                function () {
                    self.isCommandRunning(false);
                });
        };

        self.loadAvailableCategories = function (model) {

            function BusinessLine(data) {
                this.Name = ko.observable(data);
            }

            if (self.selectedZone() == undefined) { return; }
            self.isCommandRunning(true);


            self.ajaxCaller.apiGet('api/resources/businesslinesjson?forScenario=' + encodeURIComponent(self.selectedZone()),
                null,
                function (result) {
                    var mappedEntities = $.map(result, function (item) { return new BusinessLine(item); });
                    self.categories(mappedEntities);

                }, function (error) {
                    toastr.error(error.responseText, "Operation Result");
                },
                function () {
                    self.isCommandRunning(false);
                });
        };

        self.loadAvailableLegalEntities = function (model) {

            self.isCommandRunning(true);

            function LegalEntity(data) {
                this.Name = ko.observable(data);
            }

            self.ajaxCaller.apiGet('api/resources/legalentitiesjson?forBusinessLine=' + encodeURIComponent(self.selectedCategory()),
                null,
                function (result) {
                    var mappedEntities = $.map(result, function (item) { return new LegalEntity(item); });
                    self.legalEntities(mappedEntities);

                }, function (error) {
                    toastr.error(error.responseText, "Operation Result");
                },
                function () {
                    self.isCommandRunning(false);
                });
        };

        self.loadAvailableProfitCentres = function (model) {
            self.ajaxCaller.apiGet('api/resources/profitcentres?forLegalEntity=' + encodeURIComponent(self.selectedLegalEntity()),
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.profitCentres);
                });
        };

        self.loadAvailableStructuredEntities = function (model) {
            self.ajaxCaller.apiGet('api/resources/structuredentities?forProfitCentre=' + encodeURIComponent(self.selectedProfitCentre()),
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.structuredEntities);
                });
        };

        self.loadAvailableDisclosureTypes = function (model) {
            var url = 'api/resources/disclosuretypes?forProfitCentre=' + encodeURIComponent(self.selectedProfitCentre()) + '&forStructureEntity=' + encodeURIComponent(self.selectedStructuredEntity());

            self.ajaxCaller.apiGet(url,
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.disclosureTypes);
                });
        };



        self.loadScenarioReturnRecords = function (model) {
            self.ajaxCaller.apiGet('api/resources/returnrecords',
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.elements);
                    self.elementsPaged = self.elements;
                });
        };


        self.getDto = function () {
            return {
                FilterKeyValues: [
                    { key: "Scenario", value: self.selectedZone() },
                    { key: "BusinessLine", value: self.selectedCategory() },
                    { key: "LegalEntity", value: self.selectedLegalEntity() },
                    { key: "ProfitCentre", value: self.selectedProfitCentre() },
                    { key: "StructuredEntity", value: self.selectedStructuredEntity() },
                    { key: "DisclosureType", value: self.selectedDisclosureType() }
                ]
            };
        };

        self.search = function () {
            self.isCommandRunning(true);
            self.reload();
            self.isCommandRunning(false);
        };

        self.viewRecord = function (id) {
            window.location.href = Reviewer.rootPath + 'Display/SignoffQuestionnaire?id=' + id;
        };


        self.reload = function () {
            self.myGrid.jqGrid('setGridParam', { postData: self.getDto() }).trigger('reloadGrid');
        };


        self.getDtoAllSelectedIds = function (statusId) {
            var arrayOdIds = $("#grid").jqGrid('getGridParam', 'selarrrow');

            return {
                "Ids": arrayOdIds,
                "StatusId": statusId
            };
        };

        self.operateOnAllRecordsSelected = function (operation, statusId) {
            self.isCommandRunning(true);

            self.ajaxCaller.apiPost("api/operations/" + operation,
                self.getDtoAllSelectedIds(statusId),
                function (result) {
                    toastr.success("All Records were updated !", "Operation Result");
                    self.reload();
                },
                function (error) {
                    toastr.error(error.responseText, "Operation Result");
                },
                function () {
                    self.isCommandRunning(false);
                }
            );

            self.isCommandRunning(false);
        };

        self.loadAvailableZones(self, { insertmessages: false });

    }; // vm

    ns.SignOffReturnsViewModel = vm;

}(window.Reviewer));


$(function () {
    'use strict';

    var viewModel = new window.Reviewer.SignOffReturnsViewModel;


    var notifyListeners = function () {
        var Ids = $("#grid").jqGrid('getGridParam', 'selarrrow');
        //alert(Ids);
        viewModel.selectedRowsIds(Ids);
    };

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

        ensureThatDisabledAreNotSelected();
        notifyListeners();
    };

    var ensureThatDisabledAreNotSelected = function () {
        var arrayOfIds = $('#grid').jqGrid('getDataIDs');

        arrayOfIds.forEach(function (id, index) {

            var iColCb = getColumnIndexByName(myGrid, 'cb');
            var cbxs = $(grid.rows.namedItem(id)).find("td:nth-child(" + (iColCb + 1) + ")").find("input[type=checkbox]");

            var rowData = myGrid.getRowData(id);

            if (rowData.Status == "In Progress" || rowData.Status == "Completed/Signed Off") {
                myGrid.jqGrid('setSelection', id, false);
            }
        });
    };

    var onSelectAllRowsAction = function (id) {
        ensureThatDisabledAreNotSelected();
        notifyListeners();
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

            if (rowData.Status == "In Progress" || rowData.Status == "Awaiting Approval"
                || rowData.Status == "Rejected in Review" || rowData.Status == "Completed/Signed Off") {
                var iColCb = getColumnIndexByName(myGrid, 'cb');
                var cbxs = $(grid.rows.namedItem(id)).find("td:nth-child(" + (iColCb + 1) + ")").find("input[type=checkbox]");
                cbxs.addClass('ui-state-disabled');
                cbxs.attr("disabled", "true");
                $(grid.rows.namedItem(id)).find("td:nth-child(" + (iColCb + 1) + ")").html('');
            }

        });

        var actionCells = $(this).find(">tbody>tr.jqgrow>td:nth-child(" + (iCol + 1) + ")");

        actionCells
            .each(function () {
                $("<div>", {
                    title: "View Questionnaire",
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

    var myGrid = $("#grid").jqGrid({
        datatype: 'json',
        postData: viewModel.getDto(),
        mtype: 'POST',
        url: Reviewer.rootPath + "api/operations/searchreturnrecords",
        colNames: ["Id", "HasAnswers", "BusinessLine", "ScenarioName", "LegalEntity", "ProfitCentre", "StructuredEntityName", "TypeOfInterestInEntity", "Status", "UserComments", ""],
        colModel: [
            { name: "Id", width: 35, align: "center", key: true, index: 'Id', sortable: true , hidden: true},
            { name: "HasAnswers", width: 0, hidden: true },
            { name: "BusinessLine", width: 75, "index": "BusinessLine", sortable: true, align: "center" },
            { name: "ScenarioName", width: 75, "index": "ScenarioName", sortable: true, align: "center" },
            { name: "LegalEntity", width: 70, "index": "LegalEntity", sortable: true, align: "center" },
            { name: "ProfitCentre", width: 75, align: "center" },
            { name: "StructuredEntityName", width: 75, align: "center" },
            { name: "TypeOfInterestInEntity", width: 75, align: "center" },
            { name: "Status", width: 100, editable: true, cellattr: cellattr, align: "center", edittype: "select", formatter: 'select', editoptions: { value: "In Progress:In Progress;Awaiting Approval:Awaiting Approval;Reviewed:Reviewed;Rejected in Review:Rejected in Review;Rejected in Signoff:Rejected in Signoff;Completed/Signed Off:Completed/Signed Off" }, sortable: false },
            { name: "UserComments", width: 0, hidden: true },
            { name: 'act', index: 'act', sortable: false, width: 85, editable: false, formatter: 'actions', formatoptions: { keys: true, editbutton: false, delbutton: false } }
        ],
        multiselect: true,
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
        editurl: Reviewer.rootPath + 'api/operations/searchreturnrecords',
        height: "100%",
        jsonReader: { repeatitems: true },
        onSelectRow: onSelectRowAction,
        onSelectAll: onSelectAllRowsAction,
        aftersavefunc: function (rowID, response) {
            cancelEditing($('#grid'));
        },
        loadComplete: loadCompleteAction
    });


    $("#grid").jqGrid('navGrid', "#pager", { "edit": false, "add": false, "del": false, "search": false, "refresh": true, "view": false, "position": "left", "cloneToTop": true });

    $("#approveSelectedBtn").click(function () {
        viewModel.operateOnAllRecordsSelected('approverecords', 6);
    });

    $("#rejectSelectedBtn").click(function () {
        viewModel.operateOnAllRecordsSelected('rejectrecords', 5);
    });

    viewModel.myGrid = myGrid;

    function cancelEditing() {
        if (typeof lastSel !== "undefined") {

            $('#grid').jqGrid('restoreRow', lastSel);

            $("tr#" + lastSel + " div.ui-inline-edit, " + "tr#" + lastSel + " div.ui-inline-del", "#grid").show();
            $("tr#" + lastSel + " div.ui-inline-save, " + "tr#" + lastSel + " div.ui-inline-cancel", "#grid").hide();
        }
    }

    ;


    function startEditing() {
        if (typeof lastSel !== "undefined") {
            $("tr#" + lastSel + " div.ui-inline-edit, " + "tr#" + lastSel + " div.ui-inline-del", "#grid").hide();
            $("tr#" + lastSel + " div.ui-inline-save, " + "tr#" + lastSel + " div.ui-inline-cancel", "#grid").show();
        }
    }

    ;
});