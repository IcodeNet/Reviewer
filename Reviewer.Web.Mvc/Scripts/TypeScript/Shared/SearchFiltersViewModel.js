/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../Definitions/moment/moment.d.ts" />
/// <reference path="../HasCallbacks.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ViewModels;
(function (ViewModels) {
    var SearchFiltersViewModel = (function (_super) {
        __extends(SearchFiltersViewModel, _super);
        function SearchFiltersViewModel(domicileCountry, domicileSite) {
            var _this = this;
            _super.call(this);

            this.Countries = ko.observableArray();
            this.Sites = ko.observableArray();
            this.AllSites = ko.observableArray();
            this.DomicileCountry = ko.observable(domicileCountry);
            this.DomicileSite = ko.observable(domicileSite);

            this.DomicileCountry.subscribe(function (newValue) {
                // Find the Lookup for the passed country name;
                var country = Enumerable.From(_this.Countries()).FirstOrDefault(null, function (x) {
                    return x.LookupValue == newValue;
                });

                if (country) {
                    var siteList = Enumerable.From(_this.AllSites()).Where(function (x) {
                        return x.DependentLookupId == country.LookupId;
                    }).ToArray();
                    _this.Sites(siteList);
                }
            });
        }
        SearchFiltersViewModel.prototype.Populate = function (json) {
            var obj = $.parseJSON(json);
            this.AllSites(obj.Sites);
            this.Countries(obj.Countries);
        };
        return SearchFiltersViewModel;
    })(HasCallbacks);
    ViewModels.SearchFiltersViewModel = SearchFiltersViewModel;
})(ViewModels || (ViewModels = {}));
