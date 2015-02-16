
window.Reviewer = window.Reviewer || {};

//IIFE Immediatelly Invoked Function Expression to avoid poluting the global namespace.
(function (ns) {
    var vm = function () {

        var self = this;

        self.ajaxCaller = new Reviewer.AjaxCaller();
        self.viewMode = ko.observable('request'); //'request', 'response'
        self.accessRequestModel = new Reviewer.AccessRequestModel();
        self.zones = ko.observableArray();
        self.accessRequestReferenceNumber = ko.observable();
        self.selectedZone = ko.observable();  

        self.isCommandRunning = ko.observable(false);

        self.availableScenarios = function (model) {
            self.ajaxCaller.apiGet('api/resources/getallScenarios',
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.zones);
                    self.viewMode('request');
                    // toastr.info("Loaded " + result.length, "Scenarios");
                });
        };

        self.selectedZone.subscribe(function (newValue) {
            self.accessRequestModel.ScenarioId = newValue;

            if (newValue == undefined) {
                self.isValid(false);
              //  self.ajaxCaller.modelIsValid(false);
                return;
            }

            var errors = ko.validation.group(self, { deep: true });
            if (errors().length == 0) {
               // self.ajaxCaller.modelIsValid(true);
            }
        });


        self.sendRequest = ko.command(
             function (model) {
                 var errors = ko.validation.group(model, { deep: true });
                 self.ajaxCaller.modelIsValid(model.isValid());

                 if (errors().length == 0) {
                     self.isCommandRunning(true);
                     var dto = { ScenarioId: self.selectedZone() };
                     self.ajaxCaller.apiPost("api/operations/accessrequest",
                         dto,
                         function (result) {
                             self.accessRequestReferenceNumber(result.ScenarioId);
                             self.viewMode('response');
                             toastr.success("Success! ", "Operation Result");
                         },
                         function (error) {
                             toastr.error(error.responseText, "Operation Result");
                         },
                         function () {
                             self.isCommandRunning(false);
                         }
                     );
                 } else {
                    // self.ajaxCaller.modelErrors(errors());
                 }
             }
        );
    };

    ns.AccessRequestViewModel = vm;
}(window.Reviewer));
