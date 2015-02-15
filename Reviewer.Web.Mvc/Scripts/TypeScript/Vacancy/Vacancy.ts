/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />

module ViewModels {
    export class VacancyViewModel extends HasCallbacks {
        private Countries: KnockoutObservableArray;
        private Sites: KnockoutObservableArray;

        private DomicileCountry: KnockoutObservableString;
        private WorkLocationCountry: KnockoutObservableString;
        private DomicileSite: KnockoutObservableString;
        private WorkLocationSite: KnockoutObservableString;

        private DomicileCountrySiteList: KnockoutObservableArray;
        private WorkLocationCountrySiteList: KnockoutObservableArray;

        private SAPPositionNumber: KnockoutObservableString;
        private StaffID: KnockoutObservableString;
        private VacancyId: KnockoutObservableString;
        private HasResource: KnockoutComputed;
        private HasVacancyId: KnockoutComputed;
        private NewComment: KnockoutObservableString;

        //private comment: KnockoutObservableString;

        private message: KnockoutObservableArray;
        private id: KnockoutObservableArray;

        private Url: string;
        CanAddComment: KnockoutComputedFunctions; 

        constructor(addCommentUrl: string) {
            super();

            this.Countries = ko.observableArray();
            this.Sites = ko.observableArray();
            this.DomicileCountrySiteList = ko.observableArray();
            this.WorkLocationCountrySiteList = ko.observableArray();

            this.DomicileCountry = ko.observable('');
            this.DomicileCountry.subscribe((newValue) => {
                this.ChangeSiteList(newValue, this.DomicileCountrySiteList);
            });

            this.WorkLocationCountry = ko.observable('');
            this.WorkLocationCountry.subscribe((newValue) => {
                this.ChangeSiteList(newValue, this.WorkLocationCountrySiteList);
            });
             
            this.DomicileSite = ko.observable('');
            this.WorkLocationSite = ko.observable('');
            //this.comment = ko.observable('');

            this.SAPPositionNumber = ko.observable('');
            this.StaffID = ko.observable('');
            this.VacancyId = ko.observable('');
            this.Url = addCommentUrl;

            this.HasResource = ko.computed(() => {
                return this.StaffID() != '';
            });

            this.HasVacancyId = ko.computed(() => {
                return this.VacancyId() != '';
            });

            this.NewComment = ko.observable('');

            this.CanAddComment = ko.computed(this.cb_ComputeCanAddComment);
        }

        ChangeSiteList(countryName: any, siteArray: KnockoutObservableArray) {
            // Find the Lookup for the passed country name;
            var country = Enumerable.From(this.Countries()).FirstOrDefault(null, (x) => {
                return x.LookupValue == countryName
            });

            if (country)
            {
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

        AddComment(roleId: number) { 
            if (this.NewComment().length > 0) {
                $.ajax({
                    type: 'POST',
                    url: this.Url,
                    data: { id: roleId, comment: this.NewComment() },
                    dataType: 'JSON',
                    success: function (data) {
                        VacancyViewModel.prototype.ClearComment();
                        $('.jsonComment').empty();
                        $.each(data.Comments, function (index, value) {
                            $('.jsonComment').append($('<tr><td>' + value.User + '</td><td>' + moment(value.Date).format('DD/MM/YYYY HH:mm:ss') + '</td><td>' + value.Comment + '</td></tr>'));
                        })
                }
                });
            } 
        }

        ClearComment() {
            this.NewComment = ko.observable('');
            $('.commentInput').val(""); 
        }

        cb_ComputeCanAddComment() { return this.ComputeCanAddComment() };

        ComputeCanAddComment(): boolean {
            if (this.NewComment() == "") {
                return false;
            } else {
                return true;
            }
        }
    }
}