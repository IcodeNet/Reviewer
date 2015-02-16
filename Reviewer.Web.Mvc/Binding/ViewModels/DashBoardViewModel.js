
window.Reviewer = window.Reviewer || {};

//IIFE Immediatelly Invoked Function Expression to avoid poluting the global namespace.
(function (ns) {

    var vm = function () {
        var self = this;

        //properties
        self.ajaxCaller = new ns.AjaxCaller();
        self.isCommandRunning = ko.observable(false);

        self.selectedTable = ko.observable();
        self.tableCountsArray = ko.observableArray();
        self.tableNames = ko.observableArray();

        self.gridsIds = [];

        //methods
        self.loadMessagesCount = function (model) {
            self.isCommandRunning(true);

            self.ajaxCaller.apiGet('api/resources/tablestatistics',
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.tableCountsArray);
                },
                function (error) {
                    toastr.error(error.responseText, "Operation Result");
                },
                function () {
                    self.isCommandRunning(false);
                }
            );

        };

        self.loadTableNames = function (model) {
            self.isCommandRunning(true);

            self.ajaxCaller.apiGet('api/resources/tablenames',
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.tableNames);
                },
                function (error) {
                    toastr.error(error.responseText, "Operation Result");
                },
                function () {
                    self.isCommandRunning(false);
                }
            );

        };


        self.getDtoForTableDataReport = function () {
            return {
                FilterKeyValues: [
                    { key: "TableName", value: self.selectedTable() }
                ]
            };
        };


        self.viewDataForTable = function () {
            self.isCommandRunning(true);

            toastr.options = {
                "closeButton": true,
                "timeOut": "0",
                "extendedTimeOut": "0"
            };

            self.ajaxCaller.apiPost('api/operations/tablerecords',
                self.getDtoForTableDataReport(), function (result) {

                    function createColModelArray(namesArray) {
                        var colModelArr = [];

                        for (var j = 0; j < namesArray.length; j++) {
                            var colObject = {};
                            colObject['name'] = namesArray[j];
                            colObject['width'] = 180;
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

            var tableDataGrid = mGrid.jqGrid({
                altRows: true,
                datatype: 'json',
                postData: self.getDtoForTableDataReport(),
                mtype: 'POST',
                url: Reviewer.rootPath + "api/operations/tablerecords",
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
                caption: "&nbsp; <span class='glyphicon glyphicon-list-alt'></span> Table Data",
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
                    window.location = Reviewer.rootPath + 'Home/ExportDataToExcel?tableName=' + self.selectedTable() ;
                }
            });
        };



        self.loadMessagesCount(self, { insertmessages: false });
        self.loadTableNames(self, { insertmessages: false });





    }; // vm

    ns.DashBoardViewModel = vm;

}(window.Reviewer));


$(function () {

    var viewModel = new window.Reviewer.DashBoardViewModel;
    ko.applyBindings(viewModel);

});