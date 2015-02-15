var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ViewModels;
(function (ViewModels) {
    var TransferRequestViewModel = (function (_super) {
        __extends(TransferRequestViewModel, _super);
        function TransferRequestViewModel(searchResourceUri) {
                _super.call(this, searchResourceUri);
            this.Resource = ko.observable({
            });
            this.ResourceFirstName = ko.observable('');
            this.ResourceLastName = ko.observable('');
            this.StaffID = ko.observable('');
            this.OrgUnit = ko.observable('');
            this.CostCentre = ko.observable('');
        }
        TransferRequestViewModel.prototype.Clear = function () {
            this.Resource({
            });
            this.ResourceFirstName('');
            this.ResourceLastName('');
            this.StaffID('');
            this.OrgUnit('');
            this.CostCentre('');
        };
        TransferRequestViewModel.prototype.Search = function (searchRequest) {
            this.Resource({
            });
            searchRequest.FirstName = this.ResourceFirstName();
            searchRequest.LastName = this.ResourceLastName();
            searchRequest.StaffID = this.StaffID();
            searchRequest.OrganizationalUnit = this.OrgUnit();
            searchRequest.CostCentre = this.CostCentre();
            _super.prototype.Search.call(this, searchRequest);
        };
        TransferRequestViewModel.prototype.SelectResource = function (resource) {
            this.Resource(resource);
        };
        TransferRequestViewModel.prototype.cb_SelectResource = function (resource) {
            this.SelectResource(resource);
        };
        return TransferRequestViewModel;
    })(ViewModels.SearchViewModel);
    ViewModels.TransferRequestViewModel = TransferRequestViewModel;    
})(ViewModels || (ViewModels = {}));
