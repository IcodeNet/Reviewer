// Usage in HTML
// <div data-bind="dump: $data"></div>
// <div data-bind="dump: $root.results"></div> (if results was an observable/observableArray)
// <div data-bind="dump: $root.results()[0].someProperty"></div> (first items property)

ko.bindingHandlers.dump = {
    init: function (element, valueAccessor, allBindingsAccessor, viewmodel, bindingContext) {
        var context = valueAccessor();
        var allBindings = allBindingsAccessor();
        var pre = document.createElement('pre');

        element.appendChild(pre);

        var dumpJSON = ko.computed({
            read: function () {
                var en = allBindings.enabled === undefined || allBindings.enabled;
                return en ? ko.toJSON(valueAccessor(), null, 2) : '';
            },
            disposeWhenNodeIsRemoved: element
        });

        ko.applyBindingsToNode(pre,
          {
              text: dumpJSON,
              visible: dumpJSON
          }
          );

        return { controlsDescendentBindings: true };
    }
};