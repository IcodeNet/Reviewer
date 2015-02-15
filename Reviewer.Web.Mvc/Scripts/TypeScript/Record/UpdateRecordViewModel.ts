/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../Definitions/moment/moment.d.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../SearchViewModel.ts" />

/// <reference path="LineManagerViewModel.ts" />

module ViewModels {
    export class UpdateRecordViewModel extends SearchViewModel {
        private Countries: KnockoutObservableArray;
        private Sites: KnockoutObservableArray;
        SearchUri: string;
        private DomicileCountry: KnockoutObservableString;
        private WorkLocationCountry: KnockoutObservableString;
        private DomicileSite: KnockoutObservableString;
        private WorkLocationSite: KnockoutObservableString;

        private DomicileCountrySiteList: KnockoutObservableArray;
        private WorkLocationCountrySiteList: KnockoutObservableArray;

        public SupplierCategory: KnockoutObservableString;
        public ServiceType: KnockoutObservableString;
        public ServiceTypeEnabled: KnockoutObservableBool;
        public ResourceType: KnockoutObservableString;

        public Seconded: KnockoutObservableString;
        public IsPermanent: KnockoutObservableFunctions;
        public IsSAPResource: KnockoutObservableBool;

        public RecoveryMethod: KnockoutObservableString;
        public PercentageChargeability: KnockoutObservableNumber;

        public NewComment: KnockoutObservableString;
        public VacancyId: number;

        public IsResource: boolean;
        public IsSanctioned: boolean;

        public SelectedOrgUnit: KnockoutObservableString;
        public SelectedOrgUnitId: KnockoutObservableNumber;
        public CanAddOrgUnit: KnockoutComputedFunctions;

        private AddCommentUri: string;

        private CanAddComment: KnockoutComputedFunctions;
        private IsLoadingComment: KnockoutObservableBool;

        private CanEditResourceFields: KnockoutComputedFunctions;

        public UsualFTE: KnockoutObservableNumber; 
        public ContractedHoursPerWeek: KnockoutObservableNumber;
        public MaxContractedHours: KnockoutObservableNumber; 

        LineManagerViewModel: KnockoutObservableAny;
        SelectElement: any;

        constructor(searchUri: string, isResource: boolean, addCommentUri: string, searchResourcesUri: string) {
            super(searchUri);

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

            this.CanEditResourceFields = ko.computed(() => {
                return !this.IsSAPResource() && this.IsResource;
            });

            this.IsLoadingComment = ko.observable(false);
            this.CanAddComment = ko.computed(() => {
                if (this.NewComment().length == 0)
                    return false;

                if (this.IsLoadingComment() == true)
                    return false;

                return true;
            });
            
            this.DomicileCountry.subscribe((newValue) => {
                this.ChangeSiteList(newValue, this.DomicileCountrySiteList);

                if (this.WorkLocationCountry() == '' || this.WorkLocationCountry() == null) {
                    this.WorkLocationCountry(newValue);
                }
            });
            this.DomicileSite.subscribe((newValue) => {
                if (this.DomicileCountry() == this.WorkLocationCountry()
                    &&
                    (this.WorkLocationSite() == '' || this.WorkLocationSite() == null)) {
                    this.WorkLocationSite(newValue);
                }
            });

            this.WorkLocationCountry.subscribe((newValue) => {
                this.ChangeSiteList(newValue, this.WorkLocationCountrySiteList);
            });

            this.IsPermanent = ko.computed(() => {
                if (this.ResourceType() == 'Permanent')
                    return true;
                else
                    return false;
            });

            this.PercentageChargeability.subscribe((newValue) => {
                var value = this.PercentageChargeability();
                if (value < 50) {
                    this.RecoveryMethod('Run');
                }
                else if (value => 50) {
                    this.RecoveryMethod('Charge');
                }
                else {
                    this.RecoveryMethod('');
                }
            });

            this.SupplierCategory.subscribe((newValue) => {
                this.Seconded('Non-seconded');
                switch (newValue) {
                    case "Permanent/Regular":
                        this.ServiceType('');
                        this.ServiceTypeEnabled(false);
                        this.ResourceType('Permanent');
                        break;
                    case "Inbound":
                    case "Outbound":
                    case "Third Country":
                        this.Seconded('Seconded');
                        this.ServiceType('');
                        this.ServiceTypeEnabled(false);
                        this.ResourceType('Permanent');
                        break;

                    case "Apprentice":
                        this.ServiceType('Apprentice');
                        this.ServiceTypeEnabled(false);
                        this.ResourceType('Apprentice');
                        break;

                    case "Graduate":
                        this.ServiceType('');
                        this.ServiceTypeEnabled(false);
                        this.ResourceType('Graduate');
                        break;

                    case "Temp/Contractor Payr":
                    case "On Call Contract":
                        this.ServiceType('');
                        this.ServiceTypeEnabled(false);
                        this.ResourceType('Fixed Term Contract (Fixed Perm)');
                        break;

                    case "Intern":
                        this.ServiceType('');
                        this.ServiceTypeEnabled(false);
                        this.ResourceType('Intern');
                        break;

                    case "Contingent WF":
                        this.ServiceType('');
                        this.ServiceTypeEnabled(false);
                        this.ResourceType('Contingent Worker');
                        break;

                    case "Managed Services":
                        this.ServiceType('');
                        this.ServiceTypeEnabled(true);
                        break;

                    case "Consultant":
                        this.ServiceType('');
                        this.ServiceTypeEnabled(false);
                        this.ResourceType('Consultant');
                        break;
                }

                this.ServiceType.subscribe((newValue) => {
                    switch (newValue) {
                        case "SI Partner":
                            this.ResourceType('SI Partner');
                            break;
                        case "Fixed Price Engagement":
                            this.ResourceType('Fixed Price Engagement');
                            break;
                        case "Outsourced (Managed Service)":
                            this.ResourceType('Outsourced (Managed Service)');
                            break;
                    }
                });
            });

            this.SelectElement = $('#SelectLineManager')[0];
            this.LineManagerViewModel = ko.observable(new LineManagerViewModel(searchResourcesUri, this.SelectElement));
            this.LineManagerViewModel().OnSelect = this.cb_Search

        }

        ChangeSiteList(countryName: any, siteArray: KnockoutObservableArray) {
            // Find the Lookup for the passed country name;
            var country = Enumerable.From(this.Countries()).FirstOrDefault(null, (x) => {
                return x.LookupValue == countryName
            });

            if (country) {
                var siteList = Enumerable.From(this.Sites()).Where((x) => {
                    return x.DependentLookupId == country.LookupId;
                }).ToArray();
                siteArray(siteList);
            }
        }

        Populate(json: string) {
            var obj = <any>$.parseJSON(json);
            this.Countries(obj.Countries);
            this.Sites(obj.Sites);
        }

        cb_AddComment() {
            this.AddComment();
        }
        AddComment() {

            this.IsLoadingComment(true);
            $.ajax({
                type: 'POST',
                url: this.AddCommentUri,
                data: { vacancyId: this.VacancyId, comment: this.NewComment() },
                dataType: 'JSON',
                success: (data) => {
                    $('.jsonComment').empty();
                    $.each(data.Comments, function (index, value) {
                        var xValue = <any>value;
                        $('.jsonComment').append($('<tr><td>' + xValue.User + '</td><td>' + moment(xValue.Date).format('DD/MM/YYYY HH:mm:ss') + '</td><td>' + xValue.Comment + '</td></tr>'));
                    });

                    this.ClearComment();
                    this.IsLoadingComment(false);
                }
            });
        }

        OnOrgUnitSelected(node) {
            this.SelectedOrgUnitId(node.EntityId);
            this.SelectedOrgUnit(node.Name);
        }
        cb_OnOrgUnitSelected(node) { this.OnOrgUnitSelected(node); }

        ClearComment() {
            this.NewComment('');
        }
        cb_ClearComment() { this.ClearComment(); }

        ShowLineManagers() {
            $(this.SelectElement).modal().css({ width: 'auto', 'margin-left': function () { return -($(this).width() / 2); } });;
        }
        cb_ShowLineManagers() { this.ShowLineManagers(); }

        CalculateContractedHoursPerWeek() {
            if (this.UsualFTE() != 0) {
                this.MaxContractedHours(this.ContractedHoursPerWeek() / this.UsualFTE()); 
            } else {
                this.MaxContractedHours(0); 
            }
        }
        cb_CalculateContractedHoursPerWeek() { this.CalculateContractedHoursPerWeek(); }
    }
}