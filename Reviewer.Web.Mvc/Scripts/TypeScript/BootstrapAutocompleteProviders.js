/// <reference path="Definitions/jquery/jquery.d.ts" />
/// <reference path="Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="Definitions/linq/linq.d.ts" />
/// <reference path="HasCallbacks.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BootstrapAutocompleteProviders;
(function (BootstrapAutocompleteProviders) {
    var BaseProvider = (function (_super) {
        __extends(BaseProvider, _super);
        function BaseProvider(url, options) {
            _super.call(this);

            if (options == null) {
                options = { minLength: 2 };
            }

            this.Url = url;
            this.Options = options;
            this.Options.source = this.cb_Provide;
        }
        BaseProvider.prototype.ApplyTo = function (element) {
            element.typeahead(this.Options);
        };

        BaseProvider.prototype.AlwaysTrueMatcher = function () {
            return true;
        };
        BaseProvider.prototype.DefaultSorter = function (items) {
            return items;
        };

        BaseProvider.prototype.GetDataIdentifiers = function (data) {
            return data;
        };

        BaseProvider.prototype.Provide = function (query, callback) {
            var _this = this;
            $.getJSON(this.Url, { query: query }, function (data) {
                _this.Data = data;
                callback(_this.GetDataIdentifiers(_this.Data));
            });
        };
        BaseProvider.prototype.cb_Provide = function (query, callback) {
            this.Provide(query, callback);
        };
        return BaseProvider;
    })(HasCallbacks);
    BootstrapAutocompleteProviders.BaseProvider = BaseProvider;

    var CostCentreProvider = (function (_super) {
        __extends(CostCentreProvider, _super);
        function CostCentreProvider(url, options) {
            _super.call(this, url, options);

            this.Options.matcher = this.AlwaysTrueMatcher;
            this.Options.sorter = this.DefaultSorter;
            this.Options.highlighter = this.cb_Highlighter;
        }
        CostCentreProvider.prototype.GetDataIdentifiers = function (data) {
            return jQuery.map(data, function (x) {
                return x.Code;
            });
        };

        CostCentreProvider.prototype.Highlighter = function (code) {
            var costCentre = Enumerable.From(this.Data).First(function (x) {
                return x.Code == code;
            });
            var html = costCentre.Code + " - " + costCentre.Name;
            return html;
        };
        CostCentreProvider.prototype.cb_Highlighter = function (item) {
            return this.Highlighter(item);
        };
        return CostCentreProvider;
    })(BaseProvider);
    BootstrapAutocompleteProviders.CostCentreProvider = CostCentreProvider;

    var WFPUserBRIDProvider = (function (_super) {
        __extends(WFPUserBRIDProvider, _super);
        function WFPUserBRIDProvider(url, options) {
            _super.call(this, url, options);

            this.Options.matcher = this.AlwaysTrueMatcher;
            this.Options.sorter = this.DefaultSorter;
            this.Options.highlighter = this.cb_Highlighter;
        }
        WFPUserBRIDProvider.prototype.GetDataIdentifiers = function (data) {
            return jQuery.map(data, function (x) {
                return x.Username;
            });
        };

        WFPUserBRIDProvider.prototype.Highlighter = function (username) {
            var user = Enumerable.From(this.Data).First(function (x) {
                return x.Username == username;
            });
            return user.Username;
        };
        WFPUserBRIDProvider.prototype.cb_Highlighter = function (item) {
            return this.Highlighter(item);
        };
        return WFPUserBRIDProvider;
    })(BaseProvider);
    BootstrapAutocompleteProviders.WFPUserBRIDProvider = WFPUserBRIDProvider;
})(BootstrapAutocompleteProviders || (BootstrapAutocompleteProviders = {}));
