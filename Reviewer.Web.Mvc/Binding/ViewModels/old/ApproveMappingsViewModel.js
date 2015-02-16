
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
        self.structuredEntitiesAll = ko.observableArray();
        self.selectedStructuredEntity = ko.observable();
        self.disclosureTypes = ko.observableArray();
        self.disclosureTypesALL = ko.observableArray();
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
            // self.selectedDisclosureType();
        });

        //methods

        self.shouldEnableApprove = function () {
            var shouldEnableButton = (self.selectedRowsIds() !== undefined &&
                self.selectedRowsIds().length > 0);

            return shouldEnableButton;
        };

        self.shouldEnableApproveAll = function () {
            return true;
        };

        self.shouldEnableSearch = function () {
            var shouldEnableButton = (self.selectedZone() !== undefined &&
                self.selectedCategory() !== undefined);
            return shouldEnableButton;
        };

        self.shouldEnableCreate = function () {
            return (self.selectedZone() !== undefined &&
                self.selectedCategory() !== undefined &&
                self.selectedLegalEntity() !== undefined &&
                self.selectedProfitCentre() !== undefined &&
                self.selectedStructuredEntity() !== undefined &&
                self.selectedDisclosureType() !== undefined);
        };

        self.loadAvailableZones = function (model) {
            self.isCommandRunning(true);
            self.ajaxCaller.apiGet('api/resources/Scenarios',
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.zones);
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


        self.loadALLStructuredEntities = function (model) {
            self.ajaxCaller.apiGet('api/resources/structuredentities',
                null,
                function (result) {

                    ko.mapping.fromJS(result, {}, self.structuredEntitiesAll);

                }, function (error) {
                    toastr.error(error.responseText, "Operation Result");
                },
                function () {
                    self.isCommandRunning(false);
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

        self.loadAllDisclosureTypes = function (model) {
            var url = 'api/resources/disclosuretypes';

            self.ajaxCaller.apiGet(url,
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.disclosureTypesALL);
                });
        };

        self.loadScenarioReturnRecords = function (model) {
            self.ajaxCaller.apiGet('api/resources/returnrecords',
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.elements);
                    self.elementsPaged = self.elements;
                    // toastr.info("Loaded " + result.length, " Results");
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


        self.getMultiplePostDto = function () {

            var arrayOfMappingsToApprove = [];

            for (var i = 0; i < self.selectedRowsIds().length; i++) {

                var selectedRowId = self.selectedRowsIds()[i];

                $("#grid").jqGrid('saveRow', selectedRowId);
                var rowData = $("#grid").getRowData(selectedRowId);

                var mapping = {};

                var profitCentreId = rowData.ProfitCentreId;
                var structuredEntityId = rowData.StructuredEntityId;
                var disclosureTypeId = rowData.DisclosureTypeId;
                var questionnaireID = rowData.QuestionnaireID;

                var parsedProfitCentreId = parseInt(rowData.ProfitCentreId);
                if (isNaN(parsedProfitCentreId)) {
                    // when the editable field of the column is set to true, the *value* of the cell changes to html, because it's now editable.
                    // so  rowData.ProfitCentreId its the input control because the row is in edit mode
                    // just restore the row.

                    $("#grid").jqGrid('restoreRow', selectedRowId);
                }

                mapping['ProfitCentreId'] = profitCentreId;
                mapping['StructuredEntityId'] = structuredEntityId;
                mapping['DisclosureTypeId'] = disclosureTypeId;
                mapping['QuestionnaireID'] = questionnaireID;
                mapping['Approved'] = true;

                arrayOfMappingsToApprove.push(mapping);
            }

            return {
                'MappingDtos': arrayOfMappingsToApprove

            };
        };

        self.search = function () {
            self.isCommandRunning(true);
            self.reload();
            self.isCommandRunning(false);
        };

        self.create = function () {
            self.isCommandRunning(true);

            self.ajaxCaller.apiPost("api/operations/returnrecord",
                self.getDto(),
                function (result) {
                    toastr.success("Success! ", "Operation Result");
                    self.reload();
                },
                function (error) {
                    toastr.error(error.responseText, "Operation Result");
                },
                function () {
                    self.isCommandRunning(false);
                }
            );

            self.reload();
            self.isCommandRunning(false);
        };

        self.viewRecord = function (id) {
            window.location.href = Reviewer.rootPath + 'Display/SubmitQuestionnaire?id=' + id;
        };


        self.reload = function () {
            self.myGrid.jqGrid("clearGridData", true);
            self.myGrid.jqGrid('setGridParam', { postData: self.getDto() }).trigger('reloadGrid');
        };

        self.operateOnAllRecordsSelected = function (operation, callback) {
            self.isCommandRunning(true);

            //toastr.info(ko.toJSON(self.getMultiplePostDto()), "Operation Result");
            self.ajaxCaller.apiPost("api/operations/" + operation,
                 self.getMultiplePostDto(),
                function (result) {
                    if (callback != null) {
                        callback();
                    }

                    toastr.success("Records updated !", "Operation Result");
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


        self.approveAllRecords = function () {
            self.isCommandRunning(true);


            self.ajaxCaller.apiPost("api/operations/approveallrecords",
                null,
                function (result) {
                    toastr.success("All records were 'Approved' in the Database.", "Operation Result");
                    self.reload();

                },
                function (error) {
                    toastr.error(error.responseText, "Operation Result");
                },
                function () {
                    self.isCommandRunning(false);
                }
            );
        };


        self.loadAvailableZones(self, { insertmessages: false });

    }; // vm

    ns.ApproveMappingsViewModel = vm;

}(window.Reviewer));


$(function () {
    'use strict';
    $.ajaxSetup({ cache: false });

    var viewModel = new window.Reviewer.ApproveMappingsViewModel;


    var notifyListeners = function () {
        var Ids = $("#grid").jqGrid('getGridParam', 'selarrrow');
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

    var createViewQuestionnaireLinkButton = function () {
        var iCol = getColumnIndexByName(myGrid, 'act');
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

    var ondblClickRow = function (id, ri, ci) {
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

    /*This event fires when multiselect option is true and you click on the header checkbox. 
  aRowids array of the selected rows (rowid's). 
  status - boolean variable determining the status of the header check box - true if checked, false if not checked. 
  Note that the aRowids alway contain the ids when header checkbox is checked or unchecked.*/
    var onSelectAllRowsAction = function (aRowids, status) {
        notifyListeners();
    };

    var onSelectRowAction = function (id) {
        var tableGrid = $(this); //$("#grid")

        if (id && id !== lastSel) {

           // $("#jqg_grid_" + lastSel)[0].attr('checked', 'false');
            
            // cancel editing of the previous selected row if it was in editing state.
            // jqGrid hold intern savedRow array inside of jqGrid object,
            // so it is safe to call restoreRow method with any id parameter
            // if jqGrid not in editing state
            cancelEditing();

            lastSel = id;

            //.jqGrid('editRow',rowid, keys, oneditfunc, successfunc, url, extraparam, aftersavefunc,errorfunc, afterrestorefunc);

            var editparameters = {
                "keys": false,
                "oneditfunc": null,
                "successfunc": null,

                "extraparam": {},
                "aftersavefunc": null,
                "errorfunc": null,
                "afterrestorefunc": null,
                "restoreAfterError": true,
                "mtype": "POST"
            };

            tableGrid.jqGrid('editRow', id, editparameters);

            $("tr#" + lastSel + " div.ui-inline-edit, " + "tr#" + lastSel + " div.ui-inline-del", $('#grid')).hide();
            $("tr#" + lastSel + " div.ui-inline-save, " + "tr#" + lastSel + " div.ui-inline-cancel", $('#grid')).show();

            notifyListeners();
        } else {

            cancelEditing();
            lastSel = -1;
        }
    };

    var beforeSelectRowAction = function (rowid) {
        var selRowId = $(this).getGridParam('selrow'),
            tr = $(this.rows.namedItem(rowid)),
            thisId = $.jgrid.jqID(rowid);
        var rowData = $(this).getRowData(rowid);

        if (selRowId !== rowid && rowData.HasAnswers != "True") {

            $("#edit_" + thisId).removeClass('ui-state-disabled');
            $("#del_" + thisId).removeClass('ui-state-disabled');

            return true; // allow selection or unselection
        } else {

            $("#edit_" + thisId).addClass('ui-state-disabled');
            $("#del_" + thisId).addClass('ui-state-disabled');

            return false; // allow selection or unselection
        }
    };

    var loadCompleteAction = function () {
        var iCol = getColumnIndexByName(myGrid, 'act');

        var arrayOfIds = $(this).jqGrid('getDataIDs');
        var grid = this;
        var jqgrid = $(this);

        arrayOfIds.forEach(function (id) {
            var rowData = jqgrid.getRowData(id);

            if (rowData.HasAnswers == "True") {
                disablePencilIcon(iCol, id);
            }

            if (rowData.Approved == "True") {
                disablePencilIcon(iCol, id);
            }
        });
    };

    var disablePencilIcon = function (iCol, id) {
        $(grid.rows.namedItem(id)).addClass('ui-state-disabled');

        var editDivs = $(grid.rows.namedItem(id)).find("td:nth-child(" + (iCol + 1) + ")").find("div");
        $(editDivs[0]).html('<span title="Is Already Approved." class="ui-icon ui-icon-cancel"></span>');
    };

    $.extend($.jgrid.defaults, {
        ajaxRowOptions: {
            success: function (e) {
                var iCol = getColumnIndexByName(myGrid, 'act');
                disablePencilIcon(iCol, lastSel);
            }
        }
    });

    var myGrid = $("#grid").jqGrid({
        datatype: 'json',
        postData: viewModel.getDto(),
        mtype: 'POST',
        url: Reviewer.rootPath + "api/operations/searchmappings",
        colNames: ["QuestionnaireID", "PC Id", "PC Code", "SE ID", "SE Id", "DT Id", "Has Answers", "BL", "Scenario", "LE", "PCentre", "SE", "Disclosure", "Status", "UserComments", "Approved", ""],
        colModel: [
            { name: "QuestionnaireID", key: true, index: 'QuestionnaireID', hidden: true, editable: true, editrules: { edithidden: false }, hidedlg: true },
            { name: "ProfitCentreId", hidden: true, editable: true, editrules: { edithidden: false }, hidedlg: true },
            { name: "ProfitCentreCode", width: 70, "index": "ProfitCentreCode", sortable: true, align: "center" },
            { name: "StructuredEntityId", key: true, hidden: true, editable: true, editrules: { edithidden: false }, hidedlg: true },
            { name: "DisclosureTypeId", hidden: true, editable: true, editrules: { edithidden: false }, hidedlg: true },
            { name: "HasAnswers", width: 0, hidden: true },
            { name: "BusinessLine", sortable: false, width: 80, "index": "BusinessLine", align: "center" },
            { name: "ScenarioName", width: 80, "index": "ScenarioName", align: "right" },
            { name: "LegalEntity", width: 70, "index": "LegalEntity", align: "center", sortable: true },
            { name: "ProfitCentre", hidden: true, width: 80, align: "right" },
            { name: "StructuredEntityName", width: 80, editable: false, cellattr: cellattr, align: "center", "index": "StructuredEntityName", sortable: true },
            { name: "TypeOfInterestInEntity", width: 80, editable: false, cellattr: cellattr, align: "center", "index": "TypeOfInterestInEntity", sortable: true },
            { name: "Status", width: 0, hidden: true },
            { name: "UserComments", width: 0, hidden: true },
            { name: "Approved", width: 65, editable: true, cellattr: cellattr, align: "center", "index": "Approved", sortable: true, edittype: "checkbox", editoptions: { value: "True:False" } },
            { name: 'act', index: 'act', sortable: false, width: 65, editable: false, formatter: 'actions', formatoptions: { keys: true, editbutton: true, delbutton: false } }
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

        editurl: Reviewer.rootPath + 'api/operations/approvemmapings',
        height: "100%",
        jsonReader: { repeatitems: true },
        /*  ondblClickRow: ondblClickRow,*/
        /*  beforeSelectRow: beforeSelectRowAction, */
        onSelectRow: onSelectRowAction,
        onSelectAll: onSelectAllRowsAction,
        loadComplete: loadCompleteAction
    });


    $("#grid").jqGrid('navGrid', "#pager", { "edit": false, "add": false, "del": false, "search": false, "refresh": true, "view": false, "position": "left", "cloneToTop": true });

    $("#approveSelectedBtn").click(function () {
        viewModel.operateOnAllRecordsSelected('approvemultiplemmapings');

    });

    $("#approveAllBtn").click(function () {
        $("#approveAllBtn").attr('disabled', 'true');
        viewModel.approveAllRecords();

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
});


