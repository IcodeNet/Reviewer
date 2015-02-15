ko.bindingHandlers.typeahead = {
    init: function (element, valueAccessor) {

        var observableSource = valueAccessor();
        var elem = $(element)[0];
      
        var options = {
            source: ko.utils.unwrapObservable(observableSource),
            items : 4
        };
        
        elem.typeahead(options);
    },
    update: function () {
        
    }
};