
window.Reviewer = window.Reviewer || {};

(function (ns) {


    var vm = function () {
        var self = this;

        //properties
        self.viewModelHelper = new ns.ViewModelHelper();
        self.model = ns.PrepareReturnsModel;
        self.isCommandRunning = ko.observable(false);
        self.questions = ko.observableArray();
        self.header = ko.observable();
        self.questionaireViewModel = { HEADER: self.header, PAYLOAD: self.questions };
        self.gridsIds = [];

        //methods
        self.loadQuestions = function (model) {
            self.isCommandRunning(true);
            self.viewModelHelper.apiGet('api/resources/questionrecords?questionnaireId=' + self.getParameterByName('id'),
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.questionaireViewModel);

                    self.questions(ko.toJS(self.questionaireViewModel.PAYLOAD));
                    self.header(ko.toJS(self.questionaireViewModel.HEADER));

                    var wizard = self.createWizard('#wizard', '#wizardTabs');
                    if (wizard == undefined) {
                        toastr.error("The wizard could not be created");
                        self.isCommandRunning(false);
                        throw "Cancelled loading due to errors.";
                    }

                    var jsRoles = ko.toJS(self.header().Roles);
                    var isUserAdmin = Enumerable.From(jsRoles).Where(function (r) { return r == 'Reviewer_SystemAdministrator' }).Any();
                    var isUserSubmitter = Enumerable.From(jsRoles).Where(function (r) { return r == 'Reviewer_Submitter' }).Any();
                    var isUserReviewer = Enumerable.From(jsRoles).Where(function (r) { return r == 'Reviewer_Reviewer' }).Any();
                    var isUserSignoff = Enumerable.From(jsRoles).Where(function (r) { return r == 'Reviewer_SignOff' }).Any();

                    $('#wizard').smartWizard('showMessage', self.header().QuestionnaireStatus);

                    if (!isUserAdmin) {
                        if ((self.header().QuestionnaireStatus == 'Awaiting Approval'
                            || self.header().QuestionnaireStatus == 'Reviewed'
                            || self.header().QuestionnaireStatus == 'Completed/Signed Off'
                            ) && isUserSubmitter) {
                            disableButtons();
                        }
                    }

                    if (self.header().QuestionnaireStatus == 'Rejected in Review'
                        || self.header().QuestionnaireStatus == 'Rejected in Signoff'
                        ) {
                        $('#wizard').smartWizard('setError', { stepnum: 1, iserror: true });
                    }

                },
                function (error) {
                    toastr.error(error.responseText, "Operation Result");
                },
                function () {
                    self.isCommandRunning(false);

                    var nice = $(".stepContainer").niceScroll({
                        autohidemode: 'false',     // Do not hide scrollbar when mouse out
                        cursorborderradius: '4px', // Scroll cursor radius
                        background: '#E5E9E7',     // The scrollbar rail color
                        cursorwidth: '6px',       // Scroll cursor width
                        cursorcolor: '#003366',     // Scroll cursor color
                        zindex: 999999

                    });

                    $(".stepContainer").attr('overflow-y', 'hidden');
                    // $('.stepContainer').getNiceScroll().resize();
                }
            );


            function disableButtons() {
                $('.buttonFinish').first().addClass('buttonDisabled');
                $('.buttonSubmit').first().addClass('buttonDisabled');

                for (var i = 0; i < self.gridsIds.length ; i++) {
                    $(self.gridsIds[i]).jqGrid('hideCol', ["act"]);
                }
            };

        };


        self.getDto = function () {
            return {
                Id: self.getParameterByName('id')
            };
        };


        self.submit = function () {
            self.isCommandRunning(true);


            $('.buttonSubmit').first().addClass('buttonDisabled');
            $('.buttonFinish').first().addClass('buttonDisabled');

            self.viewModelHelper.apiPost("api/operations/submitreturnrecord",
                self.getDto(),
                function (result) {
                    toastr.success("Submitted and Saved Successfully! ", "Operation Result");
                    $('#wizard').smartWizard('showMessage', 'Awaiting Approval');
                    $('#wizard').smartWizard('hideError', { stepnum: 1, iserror: false });
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


        self.getParameterByName = function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };

        self.reload = function () {
            self.myGrid.jqGrid('setGridParam', {}).trigger('reloadGrid');
        };


        self.createWizard = function (wizardId, wizardTabsId) {
            try {

                var wizardDivElem = $(wizardId);
                var ulTabs = wizardDivElem.find(wizardTabsId);

                var sectionIds = Enumerable.From(ko.toJS(self.questions)).Distinct(function (q) { return q.QuestionSectionID; }).Select("$.QuestionSectionID").ToArray();

                var jsQuestions = ko.toJS(self.questions);

                if (jsQuestions.length == 0) {
                    toastr.error("No Questions returned. Check that the DisclosureType is the right one in DB and that QuestionAnswers have been uploaded.");
                }

                $.each(sectionIds, function (j, sectionId) {
                    var i = j + 1;

                    var filteredQuestions = Enumerable.From(jsQuestions).Where(function (q) { return q.QuestionSectionID == sectionId; }).ToArray();

                    if (filteredQuestions.length == 0) {
                        toastr.error("The QuestionSectionOrdinal of the Questions do not start from 1. Instead they start at " + jsQuestions[0].QuestionSectionOrdinal + " Sections must start from 1 upwards.");
                    }

                    var gridSectionSpecificQuestions = { "QUESTIONS": filteredQuestions };

                    ulTabs.append('<li><a href="#step-' + i + '"><label class="stepNumber">' + i + '</label><span class="stepDesc">Section ' + i + '<br /><small>Section ' + i + ' Questions</small></span></a></li>');
                    wizardDivElem.prepend('<div id="step-' + i + '"><h2 class="StepTitle">' + filteredQuestions[0].QuestionSectionTitle + ' </h2><table id="grid' + i + '"><tr><td></td></tr></table></div>');

                    self.gridsIds.push('#grid' + i);
                    self.loadGrid('#grid' + i, gridSectionSpecificQuestions.QUESTIONS); // after the structure is build
                    $('#grid' + i).jqGrid('bindKeys');
                });

                var wizard;

                if (sectionIds.length > 0) {
                    wizard = wizardDivElem.smartWizard({
                        cycleSteps: false,
                        enableFinishButton: true,
                        enableAllSteps: true,
                        onLeaveStep: leaveAStepCallback,
                        onFinish: onFinishCallback,
                        labelFinish: 'Save',
                        onSubmit: onSubmitCallback,
                        includeFinishButton: true,
                        includeSubmitButton: true,
                        includeRejectButton: false,
                        includeApproveButton: false

                    });
                }

                function leaveAStepCallback(obj, context) {
                    // alert("Leaving step " + context.fromStep + " to go to step " + context.toStep);
                    return validateSteps(context.fromStep); // return false to stay on step and true to continue navigation 
                }


                function onSubmitCallback(objs, context) {
                    onFinishCallback(); // save first
                }



                function onFinishCallback(objs, context) {
                    self.isCommandRunning(true);

                    clearExceptions();

                    if (validateAllSteps()) {
                        $('#wizard').smartWizard('showMessage', 'Data Saved.');


                        //var sectionIds = Enumerable.From(ko.toJS(self.questions)).Distinct(function (q) { return q.QuestionSectionID; }).Select("$.QuestionSectionID").ToArray();
                        var successSections = [];

                        for (var j = 0; j < sectionIds.length; j++) {

                            var i = j + 1;

                            var sectionGrid = $('#grid' + i);

                            var rowIds = sectionGrid.jqGrid('getDataIDs');
                            for (var n = 0; n < rowIds.length; n++) {
                                sectionGrid.saveRow(rowIds[n], true, 'clientArray');
                            }

                            var gridata = sectionGrid.jqGrid('getRowData');

                            var dto = { Questions: gridata };

                            self.isCommandRunning(true);

                            self.viewModelHelper.apiPost("api/operations/questions",
                                dto,
                                function (result) {
                                    successSections.push(sectionIds[j]);

                                    /* 
                                        The calls to AJAX are asynchronous and as a result the enclosing for(...) will return immediatelly.
                                        This means that the following check needs to be in the return success callback of the AJAX call if we 
                                        ever want it to fire. (BTH)
                                    */
                                    if (successSections.length == sectionIds.length) {
                                        // If all sections had no errors we could save successfully then Submit the Record.
                                        self.submit();
                                        //toastr.success("Submitted Successfuly! ", "Operation Result");
                                    }
                                },
                                function (error) {
                                    //console.log(error);
                                    handleExceptions(error);
                                },
                                function () {
                                    self.isCommandRunning(false);
                                }
                            );
                        }
                    }
                }

                function handleExceptions(error) {

                    var arrayAnswerErrors = eval(error.responseText);
                    var stepWithErrors = [];

                    for (var k = 0; k < self.gridsIds.length; k++) {
                        var currentGrid = $(self.gridsIds[k]);
                        var rowIds = currentGrid.jqGrid('getDataIDs');

                        for (var i = 0; i <= rowIds.length; i++) {
                            var rowData = currentGrid.jqGrid('getRowData', rowIds[i]);
                            for (var m = 0; m < arrayAnswerErrors.length; m++) {
                                if (rowData['QuestionNo'] == arrayAnswerErrors[m].QuestionNo) {
                                    currentGrid.jqGrid('setCell', rowIds[i], 'QuestionNo', '', 'btn-danger', { title: arrayAnswerErrors[m].ValidationErrors });
                                    if ($.inArray(k + 1, stepWithErrors) == -1) {
                                        stepWithErrors.push(k + 1);
                                    }
                                }//if 
                            }
                        } //for

                        for (var j = 0; j < stepWithErrors.length; j++) {
                            $('#wizard').smartWizard('setError', { stepnum: stepWithErrors[j], iserror: true });
                        }

                    }//for

                    /*
                    toastr.options = {
                        "closeButton": true,
                        "timeOut": "0",
                        "extendedTimeOut": "0"
                    };

                    toastr.error(error.responseText, "Operation Result");*/
                }


                function clearExceptions() {

                    for (var k = 0; k < self.gridsIds.length; k++) {

                        $('#wizard').smartWizard('setError', { stepnum: k + 1, iserror: false });

                        var currentGrid = $(self.gridsIds[k]);
                        var iCol = getColumnIndexByName(currentGrid, "QuestionNo");

                        var rowIds = currentGrid.jqGrid('getDataIDs');

                        for (var i = 0; i <= rowIds.length; i++) {
                            var tr = currentGrid[0].rows.namedItem(rowIds[i]);
                            if (tr != null) {
                                var td = tr.cells[iCol];
                                $(td).removeClass("btn-danger");
                            }
                        }
                    }
                }

                var getColumnIndexByName = function (grid, columnName) {
                    var cm = grid.jqGrid('getGridParam', 'colModel');
                    for (var i = 0, l = cm.length; i < l; i++) {
                        if (cm[i].name === columnName) {
                            return i; // return the index
                        }
                    }
                    return -1;
                }


                function validateSteps(stepnumber) {
                    var isStepValid = true;

                    if (stepnumber == 1) {
                        // Your step validation logic
                        // set isStepValid = false if has errors
                    }

                    return isStepValid;
                }

                function validateAllSteps() {

                    var isStepValid = true;

                    // all step validation logic     
                    return isStepValid;
                }

                return wizard;

            } catch (e) {
                ulTabs.empty();
                toastr.error(e, "Javascript Error while constructing the wizard.");
                self.isCommandRunning(false);
            }
        };

        self.loadGrid = function (gridId, arrayOfQuestions) {

            'use strict';

            var getEditType = function (data) {

                return 'checkbox';
            };
            var getFormatter = function (data) { return 'checkbox'; };

            var editOptions = function (data) {
                return {
                    value: "True:False"
                };
            };

            function pickadate(rowId) {

                var iCol = getColumnIndexByName(self.myGrid, 'Answer');

                $("#" + rowId + "_Answer").datepicker({ dateFormat: "yy-mm-dd" });
            }


            function radioelem(value, options) {
                var receivedradio = '<input type="radio" name="receivednaradio" value="true" />Yes';
                var breakline = '&nbsp;&nbsp;';
                var naradio = '<input type="radio" name="receivednaradio" value="false"';
                var endnaradio = '/>No<br>';
                if (value == 'true') {
                    var radiohtml = receivedradio + ' checked="checked"' + breakline + naradio + endnaradio;
                    return "<span>" + radiohtml + "</span>";
                } else if (value == 'No') {
                    var radiohtml = receivedradio + breakline + naradio + ' checked="checked"' + endnaradio;
                    return "<span>" + radiohtml + "</span>";
                } else {
                    return "<span>" + receivedradio + breakline + naradio + endnaradio + "</span>";
                }
            };

            function radiovalue(elem, operation, value) {

                if (operation === 'get') {
                    if (elem.find("input[name=receivednaradio]:checked").val() == undefined) {
                        return false;
                    }
                    return elem.find("input[name=receivednaradio]:checked").val();
                } else if (operation === 'set') {
                    if ($(elem).is(':checked') === false) {
                        return $(elem).filter('[value=' + value + ']').attr('checked', true);
                    }
                }
            };

            var getColumnIndexByName = function (grid, columnName) {
                var cm = grid.jqGrid('getGridParam', 'colModel'), i, l = cm.length;
                for (i = 0; i < l; i++) {
                    if (cm[i].name === columnName) {
                        return i; // return the index
                    }
                }
                return -1;
            };

            var lastSel = null;

            var cellattr = function (rowId, val, rawObject) {
                if (val == 'Rejected') {
                    return " class='ui-state-error-text ui-state-error ui-icon-circle-close'";
                }
                return "";
            };


            var myGrid = $(gridId).jqGrid({
                altRows: true,
                datatype: 'local',
                data: arrayOfQuestions,
                editurl: 'clientArray',
                colNames: ["Id", "QuestionNo", "ControlTypeID", "QuestionLookupValues", "QuestionnaireId", "QuestionText", "Answer", "DisclosureTypeID", ''],
                colModel: [
                    { name: "Id", width: 35, align: "center", key: true, hidden: false },
                    { name: "QuestionNo", align: "center", width: 70, "index": "QuestionNo" },
                    { name: "ControlTypeID", hidden: true },
                    { name: "QuestionLookupValues", hidden: true },
                    { name: "QuestionnaireId", hidden: true },
                    { name: "QuestionText", classes: 'wrap', align: "center", width: 350, "index": "QuestionText" },
                    { name: "Answer", width: 200, "index": "Answer", align: "center", editable: true },
                    { name: "DisclosureTypeID", hidden: true },
                    { name: 'act', index: 'act', sortable: false, width: 85, editable: false, formatter: 'actions', formatoptions: { keys: true, editbutton: true, delbutton: false } }

                ],

                rowNum: 100,
                rowList: [10, 20, 30, 100],
                sortname: "Id",
                sortorder: "asc",
                viewrecords: true,
                save: true,
                gridview: true,
                autoencode: true,
                caption: "",
                autowidth: false,
                shrinkToFit: false,
                height: "100%",
                jsonReader: { repeatitems: true },
                onSelectRow: function (id) {
                    if (id && id !== lastSel) {

                        var tableGrid = $(this); //$("#grid")
                        var rowData = tableGrid.getRowData(id);
                        var cm = tableGrid.jqGrid('getColProp', 'Answer');

                        // cancel editing of the previous selected row if it was in editing state.
                        // jqGrid hold intern savedRow array inside of jqGrid object,
                        // so it is safe to call restoreRow method with any id parameter
                        // if jqGrid not in editing state

                        if (typeof lastSel !== null) {
                            tableGrid.saveRow(lastSel, true, 'clientArray');
                            tableGrid.restoreRow(lastSel);
                            cancelEditing(gridId);
                        }

                        lastSel = id;


                        var row = id;

                        var rowData = tableGrid.getLocalRow(row);

                        tableGrid.jqGrid('restoreRow', row);
                        var cm = tableGrid.jqGrid('getColProp', 'Answer');

                        if (rowData.ControlTypeID == '1') {

                            cm.edittype = 'checkbox';
                            cm.editoptions = { value: "true" };
                            cm.formatter = 'checkbox';
                            tableGrid.jqGrid('editRow', row);
                        }

                        if (rowData.ControlTypeID == '2') {
                            cm.formatter = 'date';
                            cm.formatoptions = { newformat: 'd/m/Y' };
                            cm.datefmt = 'd/m/Y';
                            tableGrid.jqGrid('editRow', row, true, pickadate);
                        }

                        if (rowData.ControlTypeID == '3') {
                            var lookups = ko.toJS(rowData.QuestionLookupValues);

                            if (lookups == null) {
                                window.toastr.info('ControlType is a "Select Box" in Edit mode, but no QuestionLookupValues were returned from the service data call for this Questionnaire. \n It will default to a TextBox with unpredictable results. Please notify Admin to data in the DB');
                            }

                            var keyValues = '';
                            $.each(lookups, function (index, element) {
                                keyValues += element.LookupValueCode + ':' + element.LookupValueCode + ';';
                            });



                            cm.edittype = 'select';
                            cm.editoptions = { value: keyValues.slice(0, -1) };
                            cm.formatter = 'select';
                            tableGrid.jqGrid('editRow', row);
                        }

                        if (rowData.ControlTypeID == '4') {

                            cm.edittype = 'text';
                            cm.editoptions = { value: rowData.Answer };
                            cm.formatter = 'text';
                            tableGrid.jqGrid('editRow', row);
                        }

                        if (rowData.ControlTypeID == '5') {

                            cm.edittype = 'textarea';
                            cm.editoptions = { value: rowData.Answer };
                            cm.formatter = 'textarea';
                            tableGrid.jqGrid('editRow', row);
                        }

                        if (rowData.ControlTypeID == '6') {
                            cm.edittype = 'custom';
                            cm.editoptions = { custom_element: radioelem, custom_value: radiovalue };
                            cm.formatter = 'dynamicText';
                            tableGrid.jqGrid('editRow', row);
                        }

                        $("tr#" + lastSel + " div.ui-inline-edit, " + "tr#" + lastSel + " div.ui-inline-del", gridId).hide();
                        $("tr#" + lastSel + " div.ui-inline-save, " + "tr#" + lastSel + " div.ui-inline-cancel", gridId).show();
                    }
                },

                aftersavefunc: function (rowID, response) {
                    cancelEditing($(this));
                },
                loadComplete: function () {
                    /*
                    edittype
                    Edittype option defines the type of of the editable field. 
                    Possible values: 'text', 'textarea', 'select', 'checkbox', 'password', 'button', 'image', 'file' and 'custom'. 
                    The default value is 'text'.*/
                }
            });


            self.myGrid = myGrid;

            var saveparameters = {
                "successfunc": null,
                "url": null,
                "extraparam": {},
                "aftersavefunc": null,
                "errorfunc": null,
                "afterrestorefunc": null,
                "restoreAfterError": true,
                "mtype": "POST"
            };

            myGrid.jqGrid('saveRow', 'rowid', saveparameters);


            function cancelEditing(gridId) {
                if (typeof lastSel !== "undefined") {

                    $(gridId).jqGrid('restoreRow', lastSel);

                    $("tr#" + lastSel + " div.ui-inline-edit, " + "tr#" + lastSel + " div.ui-inline-del", gridId).show();
                    $("tr#" + lastSel + " div.ui-inline-save, " + "tr#" + lastSel + " div.ui-inline-cancel", gridId).hide();
                }
            }




        };

        self.loadQuestions(self, { insertmessages: false });
    }; // vm

    ns.QuestionsViewModel = vm;

}(window.Reviewer));


$(function () {

    var viewModel = new window.Reviewer.QuestionsViewModel;
    ko.applyBindings(viewModel);

    $(document).bind('DOMNodeInserted', function (e) {
        var element = e.target;
        if ($(element).is('select')) {
            //  $(element).addClass("styled-select");
        }
    });

});