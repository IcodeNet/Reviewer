window.Reviewer = window.Reviewer || {};

(function (ns) {
    var rootPath;
    ns.rootPath = rootPath;
}(window.Reviewer));


(function (ns) {
    var viewModelHelper = function () {
        var self = this;

        self.modelIsValid = ko.observable(true);
        self.modelErrors = ko.observableArray();
        self.isLoading = ko.observable(false);

        self.apiGet = function (uri, data, sucessCallback, failureCallback, alwaysCallback) {
            self.isLoading(true);
            self.modelIsValid(true);

            $.get(Reviewer.rootPath + uri, data)
                .done(sucessCallback)
                .fail(function (result) {
                    if (failureCallback == null) {

                        var msg = result;
                        
                        if (result.status != 400) {
                            self.modelErrors([result.status + ':' + result.statusText + ':' + result.responseText]);

                             msg = result.responseText;
                           
                        } else {
                            self.modelErrors(JSON.parse(result.responseText));
                            
                              msg = JSON.parse(result.responseText);
                        }

                        toastr.options = {
                            "closeButton": true,
                            "timeOut": "0",
                            "extendedTimeOut": "0"
                        };

                        toastr.error(msg, "Result");

                        self.modelIsValid(false);
                    } else {
                        failureCallback(result);
                    }
                })
                .always(function () {
                    if (alwaysCallback == null) {

                        self.isLoading(false);
                    } else {
                        alwaysCallback();
                    }
                });
        };


        self.apiPost = function (uri, data, sucessCallback, failureCallback, alwaysCallback) {
            self.isLoading(true);
            self.modelIsValid(true);

            $.post(Reviewer.rootPath + uri, data)
                .done(sucessCallback)
                .fail(function (result) {
                    if (failureCallback == null) {
                        if (result.status != 400)
                            self.modelErrors([result.status + ':' + result.statusText + ':' + result.responseText]);
                        else {
                            self.modelErrors(JSON.parse(result.responseText));
                        }
                        self.modelIsValid(false);
                    } else {
                        failureCallback(result);
                    }
                })
                .always(function () {
                    if (alwaysCallback == null) {

                        self.isLoading(false);
                    } else {
                        alwaysCallback();
                    }
                });
        };


        self.apiDelete = function (uri, data, sucessCallback, failureCallback, alwaysCallback) {
            self.isLoading(true);
            self.modelIsValid(true);

            $.ajax({ type: 'DELETE', url: Reviewer.rootPath + uri + "?id=" + data.id, data: data })
                .done(sucessCallback)
                .fail(function (result) {
                    if (failureCallback == null) {
                        if (result.status != 400)
                            self.modelErrors([result.status + ':' + result.statusText + ':' + result.responseText]);
                        else {
                            self.modelErrors(JSON.parse(result.responseText));
                        }
                        self.modelIsValid(false);
                    } else {
                        failureCallback(result);
                    }
                })
                .always(function () {
                    if (alwaysCallback == null) {

                        self.isLoading(false);
                    } else {
                        alwaysCallback();
                    }
                });
        };


    };

    ns.ViewModelHelper = viewModelHelper;

}(window.Reviewer));





