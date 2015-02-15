
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
        self.previousStructuredEntityId = ko.observable();

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
            self.viewModelHelper.apiGet('api/resources/clusters',
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.zones);
                    // toastr.info("Loaded " + result.length, "Clusters");
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


            self.viewModelHelper.apiGet('api/resources/businesslinesjson?forCluster=' + encodeURIComponent(self.selectedZone()),
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

            self.viewModelHelper.apiGet('api/resources/legalentitiesjson?forBusinessLine=' + encodeURIComponent(self.selectedCategory()),
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
            self.viewModelHelper.apiGet('api/resources/profitcentres?forLegalEntity=' + encodeURIComponent(self.selectedLegalEntity()),
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.profitCentres);
                    // toastr.info("Loaded " + result.length, "Profit Centres");
                });
        };

        self.loadAvailableStructuredEntities = function (model) {
            self.viewModelHelper.apiGet('api/resources/structuredentities?forProfitCentre=' + encodeURIComponent(self.selectedProfitCentre()),
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.structuredEntities);
                    // toastr.info("Loaded " + result.length, "Structured Entities");
                });
        };


        self.loadALLStructuredEntities = function (model) {
            self.isCommandRunning(true);
            self.viewModelHelper.apiGet('api/resources/structuredentities',
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

            self.viewModelHelper.apiGet(url,
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.disclosureTypes);
                });
        };


        self.loadAllDisclosureTypes = function (model) {
            var url = 'api/resources/disclosuretypes';

            self.viewModelHelper.apiGet(url,
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.disclosureTypesALL);
                });
        };


        self.loadClusterReturnRecords = function (model) {
            self.viewModelHelper.apiGet('api/resources/returnrecords',
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
                    { key: "Cluster", value: self.selectedZone() },
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
            //toastr.info(ko.toJSON(self.getDto()));
            // toastr.info(ko.toJSON(self.selectedZone()));
            self.reload();
            self.isCommandRunning(false);
        };

        self.create = function () {
            self.isCommandRunning(true);
            //toastr.info(ko.toJSON(self.getDto()));

            self.viewModelHelper.apiPost("api/operations/returnrecord",
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

            $("#grid").jqGrid('GridUnload');
          
            self.loadGrid();
            $("#grid").jqGrid("clearGridData", true);

            $("#grid").jqGrid('setGridParam', { postData: self.getDto() }).trigger('reloadGrid');
        };


        self.loadAvailableZones(self, { insertmessages: false });

    }; // vm

    ns.AmendMappingsViewModel = vm;

}(window.Reviewer));


$(function () {
    'use strict';
    $.ajaxSetup({ cache: false });

    var viewModel = new window.Reviewer.AmendMappingsViewModel;

    // viewModel.loadALLStructuredEntities();
    viewModel.loadAllDisclosureTypes();

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

    var onSelectRowAction = function (id) {

        var tableGrid = $(this); //$("#grid")
        var rowData = tableGrid.getRowData(id);
        tableGrid.jqGrid('restoreRow', id);


        if (id && id !== lastSel) {

            lastSel = id;


            var structureEntityColumnModel = tableGrid.jqGrid('getColProp', 'StructuredEntityName');
            var disclosureTypesColumnModel = tableGrid.jqGrid('getColProp', 'TypeOfInterestInEntity');

            var structureEntitiesLookups = ko.toJS(viewModel.structuredEntitiesAll);
            var disclosureTypesLookups = ko.toJS(viewModel.disclosureTypesALL);

            var structureEntitiesKeyValues = '';
            var disclosureTypesKeyValues = '';

            $.each(structureEntitiesLookups, function (index, element) {
                structureEntitiesKeyValues += element.Id + ':' + element.Name + ';';
            });

            $.each(disclosureTypesLookups, function (index, element) {
                disclosureTypesKeyValues += element.Id + ':' + element.Name + ';';
            });

            structureEntityColumnModel.edittype = 'text';
            disclosureTypesColumnModel.edittype = 'select';

            //structureEntityColumnModel.editoptions = { dataUrl: Reviewer.rootPath + "api/resources/structuredentitiesjson", buildSelect: buildSelectFromJson };
            structureEntityColumnModel.editoptions = { value: [] };
            disclosureTypesColumnModel.editoptions = { value: disclosureTypesKeyValues.slice(0, -1) };

            structureEntityColumnModel.formatter = 'text';
            disclosureTypesColumnModel.formatter = 'select';

            var editparameters = {
                keys: false,
                oneditfunc: null,
                successfunc: null,
                url: Reviewer.rootPath + 'api/operations/searchnotapprovereturnrecords',
                extraparam: getextraparam(),
                aftersavefunc: null,
                errorfunc: null,
                afterrestorefunc: null,
                restoreAfterError: true,
                mtype: "POST"
            };
            
/*
            $("#grid").jqGrid('editRow', id, true, null, null, null, {
                myNextParam: function () {
                    alert("extraparam of 'editRow' is calling!!!");
                    return "Fine";
                }
            });*/
            
            $("#grid").jqGrid('editRow', id, editparameters);

            var previousStructuredEntityId = ("#" + id + "_StructuredEntityId");
            viewModel.previousStructuredEntityId($(previousStructuredEntityId).val());


            var pageSize = 20;
            var dataUrl = Reviewer.rootPath + "api/resources/senamesjson";

            $("#" + id + "_StructuredEntityName").select2({
                minimumInputLength: 3,
                placeholder: 'Search SE',
                ajax: {
                    //The url we will send our get request to
                    url: dataUrl,
                    dataType: 'json',
                    quietMillis: 100,
                    //Our search term and what page we are on
                    data: function (term, page) {
                        return {
                            pageSize: pageSize,
                            pageNum: page,
                            limit: -1,
                            term: term
                        };
                    },
                    results: function (data, page) {
                        //Used to determine whether or not there are more results available,
                        //and if requests for more data should be sent in the infinite scrolling
                        var more = (page * pageSize) < data.Total;
                        return { results: data.Results, more: more };
                    }
                },
                formatResult: function (select2Result) {
                    return "<div class='select2-user-result'>" + select2Result.text + "</div>";
                },
                formatSelection: function (select2Result) {
                    var selectedValue = $("#" + id + "_StructuredEntityName").select2("val");

                    // tableGrid.jqGrid('setCell', id, 'StructuredEntityId', selectedValue, "dirty-cell");
                    tableGrid.jqGrid('setCell', id, 'StructuredEntityName', select2Result.text, "dirty-cell");
                    $("#" + id + "_StructuredEntityId").val(select2Result.id);

                    //alert(ko.toJSON($('#grid').jqGrid('getRowData', id)));

                    structureEntityColumnModel.editoptions = { value: selectedValue };
                    return select2Result.text;
                },
                initSelection: function (element, callback) {
                    var elementText = $(element).attr('data-init-text');
                    callback({ "term": elementText });
                }
            });

            $("#" + id + "_TypeOfInterestInEntity").select2({
                "width": "125"
            });

            $("tr#" + lastSel + " div.ui-inline-edit, " + "tr#" + lastSel + " div.ui-inline-del", $('#grid')).hide();
            $("tr#" + lastSel + " div.ui-inline-save, " + "tr#" + lastSel + " div.ui-inline-cancel", $('#grid')).show();
        }

    };

    var buildSelectFromJson = function (data) {
        var html = '<select>', d = eval(data), length = d.length, i = 0, item;
        for (; i < length; i++) {
            item = d[i];
            html += '<option value=' + item + '>' + item + '</option>';
        }
        html += '</select>';
        return html;
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

    var getextraparam = function () {
        var paramArray = [];

        paramArray.push({
            "edit": function () {
                var selectedValue = $("#" + id + "_StructuredEntityName").select2("val");
                alert(selectedValue);
                return selectedValue;
            }
        });

        return { ajax: "1" };
    };

    var getEditparameters = function () {
        return {
            keys: false,
            oneditfunc: null,
            successfunc: null,
            url: Reviewer.rootPath + 'api/operations/searchnotapprovereturnrecords',
            extraparam: { "name": "value" },
            aftersavefunc: null,
            errorfunc: null,
            afterrestorefunc: null,
            restoreAfterError: true,
            mtype: "POST"
        };
    };

    var loadCompleteAction = function () {
        var iCol = getColumnIndexByName(myGrid, 'act');

        var arrayOfIds = $(this).jqGrid('getDataIDs');
        var grid = this;
        var jqgrid = $(this);

        arrayOfIds.forEach(function (id) {
            var rowData = jqgrid.getRowData(id);

            if (rowData.HasAnswers == "True" || rowData.Approved == 'True') {
                $(grid.rows.namedItem(id)).addClass('ui-state-disabled');

                var editDivs = $(grid.rows.namedItem(id)).find("td:nth-child(" + (iCol + 1) + ")").find("div");
                $(editDivs[0]).html('<span title="Has answers or is Approved so it cannot be edited." class="ui-icon ui-icon-cancel"></span>');
            }

        });
    };

    var myGrid;

    function loadGrid() {

        myGrid = $("#grid").jqGrid({
            datatype: 'json',
            postData: viewModel.getDto(),
            mtype: 'POST',
            url: Reviewer.rootPath + "api/operations/searchnotapprovereturnrecords",
            colNames: ["Id", "HasAnswers", "BL", "Cluster", "LE", "PC Code", "PC", "StructuredEntityId", "SE",  "Disclosure", "Status", "UserComments", "Approved", "PreviousStructuredEntityId", "ProfitCentreId", ""],
            colModel: [
                { name: "Id", width: 55, align: "center", key: true, hidden: true },
                { name: "HasAnswers", width: 0, hidden: true },
                { name: "BusinessLine", width: 95, align: "center", "index": "BusinessLine", sortable: true },
                { name: "ClusterName", width: 85, "index": "ClusterName", sortable: true, align: "right" },
                { name: "LegalEntity", width: 85, "index": "LegalEntity", sortable: true, align: "center" },
                { name: "ProfitCentreCode", width: 50, align: "center", "index": "ProfitCentreCode", sortable: true },
                { name: "ProfitCentre", width: 100, align: "right", "index": "ProfitCentre", sortable: true },
                { name: "StructuredEntityId", hidden: true, width: 1, editable: true, editrules: { edithidden: true }, hidedlg: true },
                { name: "StructuredEntityName", width: 135, editable: true, cellattr: cellattr, align: "center", "index": "StructuredEntityID", sortable: false },
                { name: "TypeOfInterestInEntity", width: 135, editable: true, cellattr: cellattr, align: "center", "index": "TypeOfInterestInEntity", sortable: true },
                { name: "Status", hidden: true },
                { name: "UserComments", hidden: true },
                { name: "Approved", hidden: true },
                { name: "PreviousStructuredEntityId", hidden: true,  editable: true, editrules: { edithidden: true }, hidedlg: true },
                { name: "ProfitCentreId", hidden: true, editable: true, editrules: { edithidden: true }, hidedlg: true },
                { name: 'act', index: 'act', sortable: false, width: 65, editable: false, formatter: 'actions', formatoptions: { keys: true, editbutton: true, delbutton: false } }
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
            editurl: Reviewer.rootPath + 'api/operations/searchnotapprovereturnrecords',
            editOptions: getEditparameters,
            height: "100%",
            jsonReader: { repeatitems: true },
            /*  ondblClickRow: ondblClickRow,*/
            /*  beforeSelectRow: beforeSelectRowAction, */
            onSelectRow: onSelectRowAction,
            aftersavefunc: function (rowID, response) {
                cancelEditing($('#grid'));
            },
            loadComplete: loadCompleteAction
        });

        $("#grid").jqGrid('navGrid', "#pager", { "edit": false, "add": false, "del": false, "search": false, "refresh": true, "view": false, "position": "left", "cloneToTop": true });

    };

    loadGrid();

    viewModel.loadGrid = loadGrid;
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


