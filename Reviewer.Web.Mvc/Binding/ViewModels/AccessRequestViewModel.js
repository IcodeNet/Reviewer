
window.Reviewer = window.Reviewer || {};

//IIFE Immediatelly Invoked Function Expression to avoid poluting the global namespace.
(function (ns) {
    var vm = function () {

        var self = this;

        self.viewModelHelper = new Reviewer.ViewModelHelper();
        self.viewMode = ko.observable('request'); //'request', 'response'
        self.accessRequestModel = new Reviewer.AccessRequestModel();
        self.zones = ko.observableArray();
        self.accessRequestReferenceNumber = ko.observable();
        self.selectedZone = ko.observable();  

        self.isCommandRunning = ko.observable(false);

        self.availableClusters = function (model) {
            self.viewModelHelper.apiGet('api/resources/getallclusters',
                null,
                function (result) {
                    ko.mapping.fromJS(result, {}, self.zones);
                    self.viewMode('request');
                    // toastr.info("Loaded " + result.length, "Clusters");
                });
        };

        self.selectedZone.subscribe(function (newValue) {
            self.accessRequestModel.ClusterId = newValue;

            if (newValue == undefined) {
                self.isValid(false);
              //  self.viewModelHelper.modelIsValid(false);
                return;
            }

            var errors = ko.validation.group(self, { deep: true });
            if (errors().length == 0) {
               // self.viewModelHelper.modelIsValid(true);
            }
        });


        self.sendRequest = ko.command(
             function (model) {
                 var errors = ko.validation.group(model, { deep: true });
                 self.viewModelHelper.modelIsValid(model.isValid());

                 if (errors().length == 0) {
                     self.isCommandRunning(true);
                     var dto = { ClusterId: self.selectedZone() };
                     self.viewModelHelper.apiPost("api/operations/accessrequest",
                         dto,
                         function (result) {
                             self.accessRequestReferenceNumber(result.ClusterId);
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
                    // self.viewModelHelper.modelErrors(errors());
                 }
             }
        );
    };

    ns.AccessRequestViewModel = vm;
}(window.Reviewer));
