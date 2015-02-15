/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../Models.ts" />
/// <reference path="../Shared/SearchFiltersViewModel.ts" />
/// <reference path="../SearchViewModel.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ViewModels;
(function (ViewModels) {
    var BulkUpdateViewModel = (function (_super) {
        __extends(BulkUpdateViewModel, _super);
        function BulkUpdateViewModel(searchResourcesUri, saveUri, searchFormElement, searchFilterModel) {
            var _this = this;
            _super.call(this, searchResourcesUri);

            this.SearchFiltersViewModel = new ViewModels.SearchFiltersViewModel(searchFilterModel.DomicileCountry, searchFilterModel.DomicileSite);

            this.SaveUri = saveUri;
            this.SearchFormElement = searchFormElement;
            this.Editing = new ko.observableArray();

            this.InOutStatus = ko.observable();
            this.WorkLocationCountry = ko.observable();
            this.WorkLocationSite = ko.observable();
            this.ActualStartDate = ko.observable();
            this.ActualExitDate = ko.observable();
            this.ContractedHoursPerWeek = ko.observable();
            this.UsualFTE = ko.observable();
            this.Grade = ko.observable();
            this.CostCentre = ko.observable();
            this.MaxContractedHoursPerWeek = ko.observable();
            this.Supplier = ko.observable();
            this.Seconded = ko.observable();
            this.RecoveryMethod = ko.observable();
            this.PercentageChargeability = ko.observable();
            this.UnitCostValue = ko.observable();
            this.ContractEndDate = ko.observable();
            this.PurchaseOrderNumber = ko.observable();
            this.ResourceType = ko.observable();
            this.RecruitmentStatus = ko.observable();
            this.VacancyType = ko.observable();
            this.PlannedStartDate = ko.observable();
            this.PlannedExitDate = ko.observable();
            this.SAPPositionNumber = ko.observable();
            this.OrganisationalUnit = ko.observable();
            this.LineManagerFirstName = ko.observable();
            this.LineManagerLastName = ko.observable();
            this.RoleTitle = ko.observable();
            this.FunctionalTitle = ko.observable();
            this.TechnologyRoleFamily = ko.observable();
            this.ApplicationFocus = ko.observable();
            this.ReasonForStarter = ko.observable();
            this.TransferReason = ko.observable();
            this.ReasonForLeaver = ko.observable();
            this.ServiceType = ko.observable();
            this.Status = ko.observable();
            this.ReasonForGrowth = ko.observable();
            this.CompanyStartDate = ko.observable();

            this.InOutStatus.subscribe(function (x) {
                _this.UpdateChildren('InOutStatus', x);
            });
            this.WorkLocationCountry.subscribe(function (x) {
                _this.UpdateChildren('WorkLocationCountry', x);
            });
            this.WorkLocationSite.subscribe(function (x) {
                _this.UpdateChildren('WorkLocationSite', x);
            });
            this.ActualStartDate.subscribe(function (x) {
                _this.UpdateChildren('ActualStartDate', x);
            });
            this.ActualExitDate.subscribe(function (x) {
                _this.UpdateChildren('ActualExitDate', x);
            });
            this.ContractedHoursPerWeek.subscribe(function (x) {
                _this.UpdateChildren('ContractedHoursPerWeek', x);
            });
            this.UsualFTE.subscribe(function (x) {
                _this.UpdateChildren('UsualFTE', x);
            });
            this.Grade.subscribe(function (x) {
                _this.UpdateChildren('Grade', x);
            });
            this.CostCentre.subscribe(function (x) {
                _this.UpdateChildren('CostCentre', x);
            });
            this.MaxContractedHoursPerWeek.subscribe(function (x) {
                _this.UpdateChildren('MaxContractedHoursPerWeek', x);
            });
            this.Supplier.subscribe(function (x) {
                _this.UpdateChildren('Supplier', x);
            });
            this.Seconded.subscribe(function (x) {
                _this.UpdateChildren('Seconded', x);
            });
            this.RecoveryMethod.subscribe(function (x) {
                _this.UpdateChildren('RecoveryMethod', x);
            });
            this.PercentageChargeability.subscribe(function (x) {
                _this.UpdateChildren('PercentageChargeability', x);
            });
            this.UnitCostValue.subscribe(function (x) {
                _this.UpdateChildren('UnitCostValue', x);
            });
            this.ContractEndDate.subscribe(function (x) {
                _this.UpdateChildren('ContractEndDate', x);
            });
            this.PurchaseOrderNumber.subscribe(function (x) {
                _this.UpdateChildren('PurchaseOrderNumber', x);
            });
            this.ResourceType.subscribe(function (x) {
                _this.UpdateChildren('ResourceType', x);
            });
            this.RecruitmentStatus.subscribe(function (x) {
                _this.UpdateChildren('RecruitmentStatus', x);
            });
            this.VacancyType.subscribe(function (x) {
                _this.UpdateChildren('VacancyType', x);
            });
            this.PlannedStartDate.subscribe(function (x) {
                _this.UpdateChildren('PlannedStartDate', x);
            });
            this.PlannedExitDate.subscribe(function (x) {
                _this.UpdateChildren('PlannedExitDate', x);
            });
            this.SAPPositionNumber.subscribe(function (x) {
                _this.UpdateChildren('SAPPositionNumber', x);
            });
            this.OrganisationalUnit.subscribe(function (x) {
                _this.UpdateChildren('OrganisationalUnit', x);
            });
            this.LineManagerFirstName.subscribe(function (x) {
                _this.UpdateChildren('LineManagerFirstName', x);
            });
            this.LineManagerLastName.subscribe(function (x) {
                _this.UpdateChildren('LineManagerLastName', x);
            });
            this.RoleTitle.subscribe(function (x) {
                _this.UpdateChildren('RoleTitle', x);
            });
            this.FunctionalTitle.subscribe(function (x) {
                _this.UpdateChildren('FunctionalTitle', x);
            });
            this.TechnologyRoleFamily.subscribe(function (x) {
                _this.UpdateChildren('TechnologyRoleFamily', x);
            });
            this.ApplicationFocus.subscribe(function (x) {
                _this.UpdateChildren('ApplicationFocus', x);
            });
            this.ReasonForStarter.subscribe(function (x) {
                _this.UpdateChildren('ReasonForStarter', x);
            });
            this.TransferReason.subscribe(function (x) {
                _this.UpdateChildren('TransferReason', x);
            });
            this.ReasonForLeaver.subscribe(function (x) {
                _this.UpdateChildren('ReasonForLeaver', x);
            });
            this.ServiceType.subscribe(function (x) {
                _this.UpdateChildren('ServiceType', x);
            });
            this.Status.subscribe(function (x) {
                _this.UpdateChildren('Status', x);
            });
            this.ReasonForGrowth.subscribe(function (x) {
                _this.UpdateChildren('ReasonForGrowth', x);
            });
            this.CompanyStartDate.subscribe(function (x) {
                _this.UpdateChildren('CompanyStartDate', x);
            });

            this.HasSearched = ko.observable(false);
        }
        BulkUpdateViewModel.prototype.UpdateChildren = function (propertyName, value) {
            this.Results().forEach(function (x) {
                x[propertyName](value);
            });
        };

        BulkUpdateViewModel.prototype.Search = function (searchRequest) {
            this.HasSearched(true);

            $(".collapsibleContainerTitle", $("#searchFiltersCollapsibleContainer")).trigger("click");

            if (searchRequest == null)
                searchRequest = {};

            $.each($(this.SearchFormElement).serializeArray(), function (_, kv) {
                if (searchRequest[kv.name] == null) {
                    searchRequest[kv.name] = kv.value;
                }
            });

            _super.prototype.Search.call(this, searchRequest);
        };

        BulkUpdateViewModel.prototype.Revert = function () {
            this.Search({});
        };
        BulkUpdateViewModel.prototype.cb_Revert = function () {
            this.Revert();
        };

        BulkUpdateViewModel.prototype.OnResponse = function (response) {
            // Translate the response items to individual view models.
            var mappedResults = new Array();
            for (var i = 0; i < response.Results.length; i++) {
                var mappedResult = new BulkUpdateRecordViewModel(response.Results[i]);
                mappedResults.push(mappedResult);
            }
            response.Results = mappedResults;

            _super.prototype.OnResponse.call(this, response);
        };

        BulkUpdateViewModel.prototype.Save = function () {
            var _this = this;
            var updatingItems = new Array();

            $.each(this.Results(), function (i, x) {
                if (x.IsDirty) {
                    updatingItems.push(x.GetSaveRecord());
                    x.Saving(true);
                }
            });

            var data = {
                Records: updatingItems
            };

            var enumerableResults = Enumerable.From(this.Results());

            this.IsLoading(true);
            $.ajax({
                type: 'POST',
                url: this.SaveUri,
                data: 'value=' + encodeURIComponent(JSON.stringify(data)),
                traditional: true,
                dataType: 'JSON',
                success: function (result) {
                    var results = result.Results;

                    $.each(results, function (i, r) {
                        var vm = enumerableResults.FirstOrDefault(null, function (x) {
                            if (r.ResourceId != null) {
                                return x.ResourceId == r.ResourceId;
                            } else if (r.VacancyId != null) {
                                return x.VacancyId == r.VacancyId;
                            } else {
                                return x.ResourceId == r.ResourceId || x.VacancyId == r.VacancyId;
                            }
                        });

                        if (r.Success) {
                            // Clear the vm from edit fields.
                            vm.Editing([]);
                            vm.IsDirty = false;
                            vm.IsError(false);
                        } else {
                            vm.Errors = r.Errors;
                            vm.IsError(true);
                        }
                    });

                    _this.IsLoading(false);
                }
            });
        };
        BulkUpdateViewModel.prototype.cb_Save = function () {
            this.Save();
        };

        BulkUpdateViewModel.prototype.IsEditing = function (fieldName) {
            return this.Editing.indexOf(fieldName) != -1;
        };
        BulkUpdateViewModel.prototype.cb_IsEditing = function (fieldName) {
            return this.IsEditing(fieldName);
        };

        BulkUpdateViewModel.prototype.Edit = function (fieldName) {
            if (this.Editing.indexOf(fieldName) == -1) {
                this.Editing.push(fieldName);

                this.Results().forEach(function (x) {
                    x.cb_Edit(fieldName);
                });
            }
        };
        BulkUpdateViewModel.prototype.cb_Edit = function (fieldName) {
            this.Edit(fieldName);
        };
        return BulkUpdateViewModel;
    })(ViewModels.SearchViewModel);
    ViewModels.BulkUpdateViewModel = BulkUpdateViewModel;

    var BulkUpdateRecordViewModel = (function (_super) {
        __extends(BulkUpdateRecordViewModel, _super);
        function BulkUpdateRecordViewModel(item) {
            _super.call(this);

            this.IsDirty = false;
            this.Item = item;

            this.RoleId = item.RoleId;
            this.VacancyId = item.VacancyId;
            this.ResourceId = item.ResourceId;

            this.RoleStatus = item.RoleStatus;
            this.BRID = ko.observable(item.BRID);
            this.ResourceType = ko.observable(item.ResourceType);
            this.VacancyType = ko.observable(item.VacancyType);
            this.IsSAP = item.IsSAP;
            this.FirstName = ko.observable(item.FirstName);
            this.LastName = ko.observable(item.LastName);
            this.DomicileCountry = ko.observable(item.DomicileCountry);
            this.DomicileSite = ko.observable(item.DomicileSite);
            this.OnshoreOffshore = ko.observable(item.OnshoreOffshore);
            this.SupplierCategory = ko.observable(item.SupplierCategory);
            this.Supplier = ko.observable(item.Supplier);
            this.OrganisationalUnit = ko.observable(item.OrganisationalUnit);
            this.OrganisationalUnitId = ko.observable(item.OrganisationalUnitId);
            this.RoleTitle = ko.observable(item.RoleTitle);
            this.FunctionalTitle = ko.observable(item.FunctionalTitle);
            this.TechnologyRoleFamily = ko.observable(item.TechnologyRoleFamily);
            this.LineManagerFirstName = ko.observable(item.LineManagerFirstName);
            this.LineManagerLastName = ko.observable(item.LineManagerLastName);
            this.InOutStatus = ko.observable(item.InOutStatus);
            this.RecruitmentStatus = ko.observable(item.RecruitmentStatus);
            this.SanctionedReferenceNumber = ko.observable(item.SanctionedReferenceNumber);
            this.SanctionedDate = ko.observable(item.SanctionedDate);
            this.WorkLocationCountry = ko.observable(item.WorkLocationCountry);
            this.WorkLocationSite = ko.observable(item.WorkLocationSite);
            this.StaffId = ko.observable(item.StaffId);
            this.NavigatorId = ko.observable(item.NavigatorId);
            this.Grade = ko.observable(item.Grade);
            this.SAPPositionNumber = ko.observable(item.SAPPositionNumber);
            this.ServiceType = ko.observable(item.ServiceType);
            this.RecoveryMethod = ko.observable(item.RecoveryMethod);
            this.UnitCostValue = ko.observable(item.UnitCostValue);
            this.PercentageChargeability = ko.observable(item.PercentageChargeability);
            this.CostCentre = ko.observable(item.CostCentre);
            this.ContractedHoursPerWeek = ko.observable(item.ContractedHoursPerWeek);
            this.MaxContractedHoursPerWeek = ko.observable(item.MaxContractedHoursPerWeek);
            this.UsualFTE = ko.observable(item.UsualFTE);
            this.ReasonForStarter = ko.observable(item.ReasonForStarter);
            this.ReasonForLeaver = ko.observable(item.ReasonForLeaver);
            this.WFPStatus = ko.observable(item.WFPStatus);
            this.Seconded = ko.observable(item.Seconded);
            this.PurchaseOrderNumber = ko.observable(item.PurchaseOrderNumber);
            this.ApplicationFocus = ko.observable(item.ApplicationFocus);
            this.TransferReason = ko.observable(item.TransferReason);
            this.Status = ko.observable(item.Status);
            this.ReasonForGrowth = ko.observable(item.ReasonForGrowth);

            this.PlannedStartDate = ko.observable();
            this.PlannedExitDate = ko.observable();
            this.ActualStartDate = ko.observable();
            this.ActualExitDate = ko.observable();
            this.ContractEndDate = ko.observable();
            this.CompanyStartDate = ko.observable();

            if (item.PlannedStartDate)
                this.PlannedStartDate = ko.observable(this.DateFromISO(item.PlannedStartDate));
            if (item.PlannedExitDate)
                this.PlannedExitDate = ko.observable(this.DateFromISO(item.PlannedExitDate));
            if (item.ActualStartDate)
                this.ActualStartDate = ko.observable(this.DateFromISO(item.ActualStartDate));
            if (item.ActualExitDate)
                this.ActualExitDate = ko.observable(this.DateFromISO(item.ActualExitDate));
            if (item.ContractEndDate)
                this.ContractEndDate = ko.observable(this.DateFromISO(item.ContractEndDate));
            if (item.CompanyStartDate)
                this.CompanyStartDate = ko.observable(this.DateFromISO(item.CompanyStartDate));

            this.Editing = new ko.observableArray();
            this.Saving = new ko.observable(false);
            this.IsError = new ko.observable(false);
        }
        /// For IE8 (as usual).
        BulkUpdateRecordViewModel.prototype.DateFromISO = function (s) {
            return (Date).fromISO(s);
        };

        BulkUpdateRecordViewModel.prototype.GetSaveRecord = function () {
            return {
                VacancyId: this.VacancyId,
                ResourceId: this.ResourceId,
                BRID: this.BRID(),
                ResourceType: this.ResourceType(),
                VacancyType: this.VacancyType(),
                IsSAP: this.IsSAP,
                FirstName: this.FirstName(),
                LastName: this.LastName(),
                DomicileCountry: this.DomicileCountry(),
                DomicileSite: this.DomicileSite(),
                OnshoreOffshore: this.OnshoreOffshore(),
                SupplierCategory: this.SupplierCategory(),
                Supplier: this.Supplier(),
                OrganisationalUnit: this.OrganisationalUnit(),
                OrganisationalUnitId: this.OrganisationalUnitId(),
                RoleTitle: this.RoleTitle(),
                FunctionalTitle: this.FunctionalTitle(),
                TechnologyRoleFamily: this.TechnologyRoleFamily(),
                LineManagerFirstName: this.LineManagerFirstName(),
                LineManagerLastName: this.LineManagerLastName(),
                InOutStatus: this.InOutStatus(),
                RecruitmentStatus: this.RecruitmentStatus(),
                SanctionedReferenceNumber: this.SanctionedReferenceNumber(),
                SanctionedDate: this.SanctionedDate(),
                WorkLocationCountry: this.WorkLocationCountry(),
                WorkLocationSite: this.WorkLocationSite(),
                StaffId: this.StaffId(),
                NavigatorId: this.NavigatorId(),
                Grade: this.Grade(),
                SAPPositionNumber: this.SAPPositionNumber(),
                ServiceType: this.ServiceType(),
                RecoveryMethod: this.RecoveryMethod(),
                UnitCostValue: this.UnitCostValue(),
                PercentageChargeability: this.PercentageChargeability(),
                CostCentre: this.CostCentre(),
                ContractedHoursPerWeek: this.ContractedHoursPerWeek(),
                MaxContractedHoursPerWeek: this.MaxContractedHoursPerWeek(),
                PlannedStartDate: this.PlannedStartDate(),
                PlannedExitDate: this.PlannedExitDate(),
                ActualStartDate: this.ActualStartDate(),
                ActualExitDate: this.ActualExitDate(),
                UsualFTE: this.UsualFTE(),
                ReasonForStarter: this.ReasonForStarter(),
                ReasonForLeaver: this.ReasonForLeaver(),
                WFPStatus: this.WFPStatus(),
                Seconded: this.Seconded(),
                ContractEndDate: this.ContractEndDate(),
                PurchaseOrderNumber: this.PurchaseOrderNumber(),
                ApplicationFocus: this.ApplicationFocus(),
                TransferReason: this.TransferReason(),
                Status: this.Status(),
                ReasonForGrowth: this.ReasonForGrowth(),
                CompanyStartDate: this.CompanyStartDate()
            };
        };

        BulkUpdateRecordViewModel.prototype.IsEditing = function (fieldName) {
            return this.Editing.indexOf(fieldName) != -1;
        };
        BulkUpdateRecordViewModel.prototype.cb_IsEditing = function (fieldName) {
            return this.IsEditing(fieldName);
        };

        BulkUpdateRecordViewModel.prototype.Edit = function (fieldName) {
            if (this.Editing.indexOf(fieldName) == -1) {
                this.IsDirty = true;
                this.Editing.push(fieldName);
            }
        };
        BulkUpdateRecordViewModel.prototype.cb_Edit = function (fieldName) {
            this.Edit(fieldName);
        };

        BulkUpdateRecordViewModel.prototype.ShowErrors = function () {
            $.each(this.Errors, function (i, x) {
                alert(x.ErrorMessage);
            });
        };
        BulkUpdateRecordViewModel.prototype.cb_ShowErrors = function () {
            this.ShowErrors();
        };
        return BulkUpdateRecordViewModel;
    })(HasCallbacks);
    ViewModels.BulkUpdateRecordViewModel = BulkUpdateRecordViewModel;
})(ViewModels || (ViewModels = {}));
