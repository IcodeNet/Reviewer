/// <reference path="Definitions/jquery/jquery.d.ts" />
/// <reference path="Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="Definitions/linq/linq.d.ts" />
var Tooltips;
(function (Tooltips) {
    var Tooltip = (function () {
        function Tooltip() {
        }
        Tooltip.prototype.ShowErrorsAsTooltips = function (errors) {
            if (errors != null && errors != '') {
                var jsonErrors = $.parseJSON(errors);
                jsonErrors.forEach(function (x, i, arr) {
                    var element = $(("[name='{0}']").format(x.Key));
                    element.tooltip({
                        placement: 'right',
                        trigger: 'hover',
                        title: x.Value[0]
                    });

                    if (element.parent().hasClass('controls')) {
                        if (element.parent().parent().hasClass('control-group')) {
                            // Add the 'error' class to highlight it red.
                            element.parent().parent().addClass('error');

                            // If we change it remove the Red. We do not know if it is valid because it is
                            // server side but we cannot leave it red.
                            element[0].onchange = function () {
                                element.parent().parent().removeClass('error');
                            };
                        }
                    }
                });
            }
        };
        return Tooltip;
    })();
    Tooltips.Tooltip = Tooltip;
})(Tooltips || (Tooltips = {}));
