
window.Reviewer = window.Reviewer || {};

(function (ns) {
    var vm = function () {
        /// <signature>
        ///   <summary>A knockout self reveiling viewmodel used in the reports page.</summary>
        /// </signature>

        var self = this;
        self.viewModelHelper = new Reviewer.ViewModelHelper();

        self.interestTypes = ko.observable([{ 'Name': 'Interest Full', 'Id': '2' }, { 'Id': '3', 'Name': 'Limited' }, { 'Id': '4', 'Name': 'Sponsor' }, { Id: 1, 'Name': 'Trusts & Funds' }]);
        self.uploadTypes = ko.observableArray();
        self.fileNames = ko.observableArray();
        self.periods = ko.observableArray();

        self.selectedPeriod = ko.observable();
        self.selectedUploadType = ko.observable(); 
        self.selectedFileName = ko.observable();
        self.selectedInterestType = ko.observable();

        self.isCommandRunning = ko.observable(false);

        self.loadAvailableUploadTypes = function (model) {
            self.viewModelHelper.apiGet('api/resources/uploadtypes',
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.uploadTypes);
                });
        };

        self.loadAvailableFileNames = function (model) {
            self.viewModelHelper.apiGet('api/resources/exceptionfilenames',
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.fileNames);
                });
        };

        self.getExceptionsDto = function () {
            return {
                FilterKeyValues: [
                    { key: "UploadType", value: self.selectedUploadType() },
                    { key: "FileName", value: self.selectedFileName() }
                ]
            };
        };

        self.getDtoForManagementReport = function () {
            return {
                FilterKeyValues: [
                    { key: "DisclosureTypeID", value: self.selectedInterestType() },
                    { key: "PeriodRequired", value: moment(self.selectedPeriod()).toISOString() }
                ]
            };
        };

        self.search = function () {
            self.isCommandRunning(true);
            self.reload();
            self.isCommandRunning(false);
        };

        self.searchMgmt = function () {
            self.isCommandRunning(true);

            toastr.options = {
                "closeButton": true,
                "timeOut": "0",
                "extendedTimeOut": "0"
            };

            self.viewModelHelper.apiPost('api/operations/searchmanagementrecords',
                self.getDtoForManagementReport(), function (result) {
                
                    function createColModelArray(namesArray) {
                        var colModelArr = [];

                        for (var j = 0; j < namesArray.length; j++) {
                            var colObject = {};
                            colObject['name'] = namesArray[j];
                            colObject['width'] = 120;
                            colObject['align'] = 'center';
                            
                            colModelArr.push(colObject);
                        }

                        return colModelArr;
                    };

                    function createRecord(cell) {
                        var record = {};
                        for (var j = 0; j < cell.length; j++) {
                            record[colNamesArray[j]] = cell[j];
                        }

                        return record;
                    };

                    var colNamesArray = result.columns;
                    var colModelArray = createColModelArray(colNamesArray);

                    $("#gridM").jqGrid('GridUnload');
                    
                    self.loadGrid('#gridM', result, [], colModelArray);
                   /* $("#gridM").jqGrid("clearGridData", true);

                    for (var i = 0; i < result.rows.length; i++) {
                        $("#gridM").jqGrid('addRowData', i , createRecord(result.rows[i].cell));
                    }*/
                   
                },
                function (error) {
                    toastr.error(error.responseText, "Operation Result");
                },
                function () {
                    self.isCommandRunning(false);
                });
        };


        self.reload = function () {
            self.exceptionsJqGrid.jqGrid("clearGridData", true);
            self.exceptionsJqGrid.jqGrid('setGridParam', { postData: self.getExceptionsDto() }).trigger('reloadGrid');
        };

        self.loadGrid = function (gridId, gridData, colNamesArray, colModelArray) {

            'use strict';
            var mGrid = $(gridId);
            
            var managementGrid = mGrid.jqGrid({
                altRows: true,
                datatype: 'json',
                postData: self.getDtoForManagementReport(),
                mtype: 'POST',
                url: Reviewer.rootPath + "api/operations/searchmanagementrecords",
             /*   datatype: 'local',
                data: gridData.rows,*/
                editurl: 'clientArray',
                colNames: colNamesArray,
                colModel: colModelArray,
                rowNum: 5,
                rowList: [5, 10, 20, 30, 100],
                sortname: "Id",
                sortorder: "asc",
                pager: "#pagerM",
                viewrecords: true,
                save: true,
                gridview: true,
                autoencode: true,
                caption: "&nbsp; <span class='glyphicon glyphicon-list-alt'></span> Management Report data.",
                autowidth: true,
                width: "100%",
                shrinkToFit: false,
                height: "100%",
                jsonReader: { repeatitems: true },
            });
            
            mGrid.jqGrid('navGrid', "#pagerM", { "edit": false, "add": false, "del": false, "search": false, "refresh": true, "view": false, "position": "left", "cloneToTop": true });

            mGrid.jqGrid('navButtonAdd', '#pagerM', {
                caption: '<span class="ui-pg-button-text">Export</span>',
                buttonicon: "ui-icon-extlink",
                title: "Export To Excel",
                onClickButton: function () {
                    window.location = Reviewer.rootPath + 'Home/ExportManagementReportDataToExcel?disclosureTypeID=' + self.selectedInterestType() + '&periodRequired=' + moment(self.selectedPeriod()).toISOString();
                }
            });
        };
    };

    ns.ReportsViewModel = vm;
}(window.Reviewer));
 

$(function () {

    var viewModel = new Reviewer.ReportsViewModel();
    
    viewModel.loadAvailableUploadTypes(viewModel, { insertmessages: false });
    viewModel.loadAvailableFileNames(viewModel, { insertmessages: false });

    $('#dpMonths').datepicker({ autoclose: true, minViewMode: 1 }).on('changeDate', function (ev) {
        if (ev.viewMode == 'months') {
            $('#dpMonths').datepicker('hide');
        }

        viewModel.selectedPeriod(ev.date.valueOf());
    });

    ko.applyBindings(viewModel);

    var lastSel;
    var gridTable = $("#grid");
    
    var exceptionsJqGrid = gridTable.jqGrid({
        datatype: 'json',
        postData: viewModel.getExceptionsDto(),
        mtype: 'POST',
        url: Reviewer.rootPath + "api/operations/searchexceptions",
        colNames: ["Id", "Meta Id", "Line No", "Row Data", "Type", "date", "File Name", "Upload User Name"],
        colModel: [
            { name: "UploadRowExceptionID", width: 35, align: "center", key: true },
            { name: "UploadMetadataID", width: 55, align: "center", "index": "UploadMetadataID" },
            { name: "LineNumber", width: 30, "index": "LineNumber", align: "center" },
            { name: "RowData", width: 90, "index": "RowData", align: "center" },
            { name: "ExceptionType", width: 80, "index": "ExceptionType", align: "center" },
            { name: "ExceptionDate", width: 80, "index": "ExceptionDate", align: "center" },
            { name: "UploadFileName", width: 80, "index": "UploadFileName", align: "center" },
            { name: "UploadUserName", width: 80, "index": "UploadUserName", align: "center" }
        ],
        loadonce: false,
        pager: "#pager",
        rowNum: 10,
        rowList: [5, 10, 20, 30, 100],
        sortname: "Id",
        sortorder: "asc",
        viewrecords: true,
        save: true,
        gridview: true,
        autoencode: true,
        caption: "&nbsp; Found Exceptions",
        autowidth: true,
        height: "100%",
        jsonReader: { repeatitems: true }
    });

    gridTable.jqGrid('navGrid', "#pager", { "edit": false, "add": false, "del": false, "search": false, "refresh": true, "view": false, "position": "left", "cloneToTop": true });

    gridTable.jqGrid('navButtonAdd', '#pager', {
        caption: '<span class="ui-pg-button-text">Export</span>',
        buttonicon: "ui-icon-extlink",
        title: "Export To Excel",
        onClickButton: function () {
            window.location = Reviewer.rootPath + 'Home/ExportAllExceptionsToExcel';
        }
    });

    viewModel.exceptionsJqGrid = exceptionsJqGrid;

    function cancelEditing() {
        if (typeof lastSel !== "undefined") {

            gridTable.jqGrid('restoreRow', lastSel);

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