/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../Definitions/moment/moment.d.ts" />
/// <reference path="../HasCallbacks.ts" />

module ViewModels {
    export class SearchFiltersViewModel extends HasCallbacks {

        private Countries: KnockoutObservableArray;
        private Sites: KnockoutObservableArray;
        private AllSites: KnockoutObservableArray; 
        private DomicileCountry: KnockoutObservableString;
        private DomicileSite: KnockoutObservableString;

        constructor(domicileCountry: string, domicileSite: string) {
            super();

            this.Countries = ko.observableArray();
            this.Sites = ko.observableArray();
            this.AllSites = ko.observableArray();
            this.DomicileCountry = ko.observable(domicileCountry);
            this.DomicileSite = ko.observable(domicileSite);

            this.DomicileCountry.subscribe((newValue) => {
                // Find the Lookup for the passed country name;
                var country = Enumerable.From(this.Countries()).FirstOrDefault(null, (x) => {
                return x.LookupValue == newValue
            });

                if (country) {
                    var siteList = Enumerable.From(this.AllSites()).Where((x) => {
                        return x.DependentLookupId == country.LookupId;
                    }).ToArray();
                    this.Sites(siteList);
                }
            });
        }

        Populate(json: string) {
            var obj = <any>$.parseJSON(json);
            this.AllSites(obj.Sites); 
            this.Countries(obj.Countries);
        }
    }
}