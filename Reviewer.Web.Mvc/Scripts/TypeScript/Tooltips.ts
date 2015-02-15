/// <reference path="Definitions/jquery/jquery.d.ts" />
/// <reference path="Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="Definitions/linq/linq.d.ts" />

module Tooltips {

    export class Tooltip {

        ShowErrorsAsTooltips(errors: string) {
            if (errors != null && errors != '')
            {
                var jsonErrors = <any[]><any>$.parseJSON(errors);
                jsonErrors.forEach((x, i, arr) => {
                    var element = $((<any>"[name='{0}']").format(x.Key));
                    element.tooltip(
                        {
                            placement: 'right',
                            trigger: 'hover',
                            title: x.Value[0]
                        });
                    
                    // If we are inside a 'controls' element.
                    if (element.parent().hasClass('controls')) {
                        // If that is inside a 'control-group'.
                        if (element.parent().parent().hasClass('control-group')) {
                            // Add the 'error' class to highlight it red.
                            element.parent().parent().addClass('error');

                            // If we change it remove the Red. We do not know if it is valid because it is
                            // server side but we cannot leave it red.
                            element[0].onchange = () => {
                                element.parent().parent().removeClass('error');
                            }
                        }
                    }
                });
            }
        }
    }
}