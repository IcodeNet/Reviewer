/// <reference path="../../Scripts/jquery-1.9.1.js" />
/// <reference path="../../Scripts/jquery.jqGrid.js" />
/// <reference path="../../Scripts/knockout.mapping-latest.js" />

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

                    self.createWizard('#wizard', '#wizardTabs');

                    var jsRoles = ko.toJS(self.header().Roles);
                    var isUserSubmitter = Enumerable.From(jsRoles).Where(function (r) { return r == 'Reviewer_Submitter' }).Any();
                    var isUserReviewer = Enumerable.From(jsRoles).Where(function (r) { return r == 'Reviewer_Reviewer' }).Any();
                    var isUserSignoff = Enumerable.From(jsRoles).Where(function (r) { return r == 'Reviewer_SignOff' }).Any();

                    $('#wizard').smartWizard('showMessage', self.header().QuestionnaireStatus);
                    
                    if ((self.header().QuestionnaireStatus == 'Completed/Signed Off' || self.header().QuestionnaireStatus == 'In Progress') && isUserSignoff) {
                        self.disableButtons();
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

        };

        self.disableButtons = function () {
            $('.buttonReject').first().addClass('buttonDisabled');
            $('.buttonApprove').first().addClass('buttonDisabled');
            
            for (var i = 0; i < self.gridsIds.length ; i++) {
                $(self.gridsIds[i]).jqGrid('hideCol', ["act"]);
            }
        };


        self.getDto = function () {
            return {
                Id: self.getParameterByName('id'),
                Comments: $('#comments').val()
            };
        };

        self.approve = function () {
            self.isCommandRunning(true);

            self.disableButtons();

            self.viewModelHelper.apiPost("api/operations/approveinsignoff",
                self.getDto(),
                function (result) {
                    toastr.success("Completed/Signed Off! ", "Operation Result");
                    $('#wizard').smartWizard('showMessage', 'Completed/Signed Off');
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


        self.reject = function () {
            self.isCommandRunning(true);

            $('#modalRejectComment').modal({
                keyboard: false
            });

            $('#btnReject').on('click', function (e) {

                e.preventDefault();
                self.postChanges();

                $("#modalRejectComment").modal('hide');

            });

            self.isCommandRunning(false);
        };


        self.postChanges = function () {
            self.isCommandRunning(true);

            self.viewModelHelper.apiPost("api/operations/rejectinsignoff",
                self.getDto(),
                function (result) {
                    toastr.success("Rejected! ", "Operation Result");
                    $('#wizard').smartWizard('showMessage', 'Rejected in Signoff');
                    self.disableButtons();
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

                var sectionIds = Enumerable.From(ko.toJS(self.questions)).Distinct(function (q) { return q.QuestionSectionOrdinal; }).Select("$.QuestionSectionOrdinal").ToArray();

                var jsQuestions = ko.toJS(self.questions);

                if (jsQuestions.length == 0) {
                    toastr.error("No Questions returned. Check that the DisclosureType is the right one in DB.");
                }
                
                $.each(sectionIds, function (j, sectionId) {
                    var i = j + 1;
                    
                    var filteredQuestions = Enumerable.From(jsQuestions).Where(function (q) { return q.QuestionSectionOrdinal == i; }).ToArray();

                    if (filteredQuestions.length == 0) {
                        toastr.error("The QuestionSectionOrdinal of the Questions do not start from 1. Instead they start at " + jsQuestions[0].QuestionSectionOrdinal + " Sections must start from 1 upwards.");

                    }
                    
                    var gridSectionSpecificQuestions = { "QUESTIONS": filteredQuestions };

                    ulTabs.append('<li><a href="#step-' + i + '"><label class="stepNumber">' + i + '</label><span class="stepDesc">Section ' + i + '<br /><small>Section ' + i + ' Questions</small></span></a></li>');
                    wizardDivElem.prepend('<div id="step-' + i + '"><h2 class="StepTitle">' + filteredQuestions[0].QuestionSectionTitle + ' </h2><table id="grid' + i + '"><tr><td></td></tr></table></div>');

                    self.gridsIds.push('#grid' + i);
                    self.loadGrid('#grid' + i, gridSectionSpecificQuestions.QUESTIONS); // after the structure is build
                    $('#grid' + i).jqGrid('bindKeys');;
                });

                if (sectionIds.length > 0) {
                    wizardDivElem.smartWizard({
                        onLeaveStep: leaveAStepCallback,
                        onFinish: onFinishCallback,
                        labelFinish: 'Save',
                        includeSubmitButton: false,
                        includeFinishButton: false,
                        includeRejectButton: true,
                        includeApproveButton: true,
                        onReject: onRejectCallback,
                        onApprove: onApproveCallback,
                        labelApprove: 'Sign Off'
                    });
                }

                function leaveAStepCallback(obj, context) {
                    // alert("Leaving step " + context.fromStep + " to go to step " + context.toStep);
                    return validateSteps(context.fromStep); // return false to stay on step and true to continue navigation 
                }


                function onRejectCallback(objs, context) {
                    self.reject();
                }


                function onApproveCallback(objs, context) {
                    self.approve();
                }




                function onFinishCallback(objs, context) {
                    if (validateAllSteps()) {
                        $('#wizard').smartWizard('showMessage', 'Finish Clicked');


                        var sectionIds = Enumerable.From(ko.toJS(self.questions)).Distinct(function (q) { return q.QuestionSectionID; }).Select("$.QuestionSectionID").ToArray();

                        $.each(sectionIds, function (j, sectionId) {
                            var i = j + 1;

                            var sectionGrid = $('#grid' + i);

                            var rowIds = sectionGrid.jqGrid('getDataIDs');
                            $.each(rowIds, function (index, rowId) {
                                sectionGrid.saveRow(rowId, true, 'clientArray');
                            });

                            var gridata = sectionGrid.jqGrid('getRowData');

                            var dto = { Questions: gridata };

                            self.isCommandRunning(true);

                            self.viewModelHelper.apiPost("api/operations/questions",
                            dto,
                            function (result) {
                                toastr.success("Success! ", "Operation Result");
                            },
                            function (error) {
                                toastr.error(error.responseText, "Operation Result");
                            },
                            function () {
                                self.isCommandRunning(false);
                            }
                        );
                        });

                    }
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
                colNames: ["Id", "QuestionNo", "ControlTypeID", "QuestionLookupValues", "QuestionnaireId", "QuestionText", "Answer", ''],
                colModel: [
                    { name: "Id", width: 35, align: "center", key: true, hidden: true },
                    { name: "QuestionNo", align: "center", width: 100, "index": "QuestionNo" },
                    { name: "ControlTypeID", hidden: true },
                    { name: "QuestionLookupValues", hidden: true },
                    { name: "QuestionnaireId", hidden: true },
                    { name: "QuestionText", classes: 'wrap', align: "center", width: 350, "index": "QuestionText" },
                    { name: "Answer", width: 340, "index": "Answer", align: "center", editable: false },
                    { name: 'act', index: 'act', sortable: false, width: 15, editable: false, formatter: 'actions', formatoptions: { keys: true, editbutton: false, delbutton: false } }

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
                width: "100%",
                shrinkToFit: false,
                height: "100%",
                jsonReader: { repeatitems: true },
                onSelectRow: function (id) {
                  
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

});