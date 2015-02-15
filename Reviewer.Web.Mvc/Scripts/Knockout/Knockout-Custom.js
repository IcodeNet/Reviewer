ko.unapplyBindings = function ($node, remove) {
    // unbind events
    $node.find("*").each(function () {
        $(this).unbind();
    });

    // Remove KO subscriptions and references
    if (remove) {
        ko.removeNode($node[0]);
    } else {
        ko.cleanNode($node[0]);
    }
};

ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor().datepickerOptions || {};
        $(element).datepicker(options);

        //when a user changes the date, update the view model
        ko.utils.registerEventHandler(element, "changeDate", function (event) {
            var value = valueAccessor();
            if (ko.isObservable(value)) {
                if (event.date && event.date.setHours)
                {
                    event.date.setHours(event.date.getHours() - event.date.getTimezoneOffset() / 60);
                }
                value(event.date);
            }
        });

        ko.utils.registerEventHandler(element, "focusout", function (ev) {
            var value = valueAccessor();
            if (ko.isObservable(value)) {
                var momentDate = new moment(element.value, "DD/MM/YYYY");
                if (momentDate.toDate)
                {
                    var jsDate = momentDate.toDate();
                    value(jsDate);
                }
                else
                {
                    value(null);
                }
            }
        });

    },
    update: function (element, valueAccessor) {
        var widget = $(element).data("datepicker");
        //when the view model is updated, update the widget
        if (widget) {
            var date = ko.utils.unwrapObservable(valueAccessor());
            if (date)
                widget.setValue(date);
            else
                widget.setValue('');
        }
    }
};