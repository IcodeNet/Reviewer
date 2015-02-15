var BootstrapAutocompleteProviders;
(function (BootstrapAutocompleteProviders) {
    var BaseProvider = (function () {
        function BaseProvider(url) {
            this.Url = url;
        }
        BaseProvider.prototype.Provide = function () {
        };
        BaseProvider.ApplyTo = function ApplyTo(element, options, url) {
            var provider = new BaseProvider(url);
            element.typeahead(options);
            options.source = provider.Provide;
        };
        return BaseProvider;
    })();
    BootstrapAutocompleteProviders.BaseProvider = BaseProvider;    
})(BootstrapAutocompleteProviders || (BootstrapAutocompleteProviders = {}));
