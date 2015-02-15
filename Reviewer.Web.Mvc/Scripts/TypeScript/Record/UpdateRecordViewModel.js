/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../Definitions/moment/moment.d.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../SearchViewModel.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="LineManagerViewModel.ts" />
var ViewModels;
(function (ViewModels) {
    var UpdateRecordViewModel = (function (_super) {
        __extends(UpdateRecordViewModel, _super);
        function UpdateRecordViewModel(searchUri, isResource, addCommentUri, searchResourcesUri) {
            var _this = this;
            _super.call(this, searchUri);

            this.UsualFTE = ko.observable(0);
            this.ContractedHoursPerWeek = ko.observable(0);
            this.MaxContractedHours = ko.observable(0);

            this.UsualFTE.subscribe(this.cb_CalculateContractedHoursPerWeek);
            this.ContractedHoursPerWeek.subscribe(this.cb_CalculateContractedHoursPerWeek);

            this.IsResource = isResource;
            this.AddCommentUri = addCommentUri;
            this.Countries = ko.observableArray();
            this.Sites = ko.observableArray();
            this.DomicileCountrySiteList = ko.observableArray();
            this.WorkLocationCountrySiteList = ko.observableArray();

            this.DomicileCountry = ko.observable('');
            this.DomicileSite = ko.observable('');
            this.WorkLocationCountry = ko.observable('');
            this.WorkLocationSite = ko.observable('');
            this.RecoveryMethod = ko.observable('');
            this.PercentageChargeability = ko.observable(0);
            this.IsSAPResource = ko.observable(false);

            this.SupplierCategory = ko.observable('');
            this.ServiceType = ko.observable('');
            this.ServiceTypeEnabled = ko.observable(false);
            this.ResourceType = ko.observable('');
            this.Seconded = ko.observable('');

            this.SelectedOrgUnit = ko.observable('');
            this.SelectedOrgUnitId = ko.observable();

            this.NewComment = ko.observable('');

            this.CanEditResourceFields = ko.computed(function () {
                return !_this.IsSAPResource() && _this.IsResource;
            });

            this.IsLoadingComment = ko.observable(false);
            this.CanAddComment = ko.computed(function () {
                if (_this.NewComment().length == 0)
                    return false;

                if (_this.IsLoadingComment() == true)
                    return false;

                return true;
            });

            this.DomicileCountry.subscribe(function (newValue) {
                _this.ChangeSiteList(newValue, _this.DomicileCountrySiteList);

                if (_this.WorkLocationCountry() == '' || _this.WorkLocationCountry() == null) {
                    _this.WorkLocationCountry(newValue);
                }
            });
            this.DomicileSite.subscribe(function (newValue) {
                if (_this.DomicileCountry() == _this.WorkLocationCountry() && (_this.WorkLocationSite() == '' || _this.WorkLocationSite() == null)) {
                    _this.WorkLocationSite(newValue);
                }
            });

            this.WorkLocationCountry.subscribe(function (newValue) {
                _this.ChangeSiteList(newValue, _this.WorkLocationCountrySiteList);
            });

            this.IsPermanent = ko.computed(function () {
                if (_this.ResourceType() == 'Permanent')
                    return true;
else
                    return false;
            });

            this.PercentageChargeability.subscribe(function (newValue) {
                var value = _this.PercentageChargeability();
                if (value < 50) {
                    _this.RecoveryMethod('Run');
                } else if (function (value) {
                    return 50;
                }) {
                    _this.RecoveryMethod('Charge');
                } else {
                    _this.RecoveryMethod('');
                }
            });

            this.SupplierCategory.subscribe(function (newValue) {
                _this.Seconded('Non-seconded');
                switch (newValue) {
                    case "Permanent/Regular":
                        _this.ServiceType('');
                        _this.ServiceTypeEnabled(false);
                        _this.ResourceType('Permanent');
                        break;
                    case "Inbound":
                    case "Outbound":
                    case "Third Country":
                        _this.Seconded('Seconded');
                        _this.ServiceType('');
                        _this.ServiceTypeEnabled(false);
                        _this.ResourceType('Permanent');
                        break;

                    case "Apprentice":
                        _this.ServiceType('Apprentice');
                        _this.ServiceTypeEnabled(false);
                        _this.ResourceType('Apprentice');
                        break;

                    case "Graduate":
                        _this.ServiceType('');
                        _this.ServiceTypeEnabled(false);
                        _this.ResourceType('Graduate');
                        break;

                    case "Temp/Contractor Payr":
                    case "On Call Contract":
                        _this.ServiceType('');
                        _this.ServiceTypeEnabled(false);
                        _this.ResourceType('Fixed Term Contract (Fixed Perm)');
                        break;

                    case "Intern":
                        _this.ServiceType('');
                        _this.ServiceTypeEnabled(false);
                        _this.ResourceType('Intern');
                        break;

                    case "Contingent WF":
                        _this.ServiceType('');
                        _this.ServiceTypeEnabled(false);
                        _this.ResourceType('Contingent Worker');
                        break;

                    case "Managed Services":
                        _this.ServiceType('');
                        _this.ServiceTypeEnabled(true);
                        break;

                    case "Consultant":
                        _this.ServiceType('');
                        _this.ServiceTypeEnabled(false);
                        _this.ResourceType('Consultant');
                        break;
                }

                _this.ServiceType.subscribe(function (newValue) {
                    switch (newValue) {
                        case "SI Partner":
                            _this.ResourceType('SI Partner');
                            break;
                        case "Fixed Price Engagement":
                            _this.ResourceType('Fixed Price Engagement');
                            break;
                        case "Outsourced (Managed Service)":
                            _this.ResourceType('Outsourced (Managed Service)');
                            break;
                    }
                });
            });

            this.SelectElement = $('#SelectLineManager')[0];
            this.LineManagerViewModel = ko.observable(new ViewModels.LineManagerViewModel(searchResourcesUri, this.SelectElement));
            this.LineManagerViewModel().OnSelect = this.cb_Search;
        }
        UpdateRecordViewModel.prototype.ChangeSiteList = function (countryName, siteArray) {
            // Find the Lookup for the passed country name;
            var country = Enumerable.From(this.Countries()).FirstOrDefault(null, function (x) {
                return x.LookupValue == countryName;
            });

            if (country) {
                var siteList = Enumerable.From(this.Sites()).Where(function (x) {
                    return x.DependentLookupId == country.LookupId;
                }).ToArray();
                siteArray(siteList);
            }
        };

        UpdateRecordViewModel.prototype.Populate = function (json) {
            var obj = $.parseJSON(json);
            this.Countries(obj.Countries);
            this.Sites(obj.Sites);
        };

        UpdateRecordViewModel.prototype.cb_AddComment = function () {
            this.AddComment();
        };
        UpdateRecordViewModel.prototype.AddComment = function () {
            var _this = this;
            this.IsLoadingComment(true);
            $.ajax({
                type: 'POST',
                url: this.AddCommentUri,
                data: { vacancyId: this.VacancyId, comment: this.NewComment() },
                dataType: 'JSON',
                success: function (data) {
                    $('.jsonComment').empty();
                    $.each(data.Comments, function (index, value) {
                        var xValue = value;
                        $('.jsonComment').append($('<tr><td>' + xValue.User + '</td><td>' + moment(xValue.Date).format('DD/MM/YYYY HH:mm:ss') + '</td><td>' + xValue.Comment + '</td></tr>'));
                    });

                    _this.ClearComment();
                    _this.IsLoadingComment(false);
                }
            });
        };

        UpdateRecordViewModel.prototype.OnOrgUnitSelected = function (node) {
            this.SelectedOrgUnitId(node.EntityId);
            this.SelectedOrgUnit(node.Name);
        };
        UpdateRecordViewModel.prototype.cb_OnOrgUnitSelected = function (node) {
            this.OnOrgUnitSelected(node);
        };

        UpdateRecordViewModel.prototype.ClearComment = function () {
            this.NewComment('');
        };
        UpdateRecordViewModel.prototype.cb_ClearComment = function () {
            this.ClearComment();
        };

        UpdateRecordViewModel.prototype.ShowLineManagers = function () {
            $(this.SelectElement).modal().css({ width: 'auto', 'margin-left': function () {
                    return -($(this).width() / 2);
                } });
            ;
        };
        UpdateRecordViewModel.prototype.cb_ShowLineManagers = function () {
            this.ShowLineManagers();
        };

        UpdateRecordViewModel.prototype.CalculateContractedHoursPerWeek = function () {
            if (this.UsualFTE() != 0) {
                this.MaxContractedHours(this.ContractedHoursPerWeek() / this.UsualFTE());
            } else {
                this.MaxContractedHours(0);
            }
        };
        UpdateRecordViewModel.prototype.cb_CalculateContractedHoursPerWeek = function () {
            this.CalculateContractedHoursPerWeek();
        };
        return UpdateRecordViewModel;
    })(ViewModels.SearchViewModel);
    ViewModels.UpdateRecordViewModel = UpdateRecordViewModel;
})(ViewModels || (ViewModels = {}));
