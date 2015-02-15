/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../Definitions/moment/moment.d.ts" />
/// <reference path="../HasCallbacks.ts" />

module ViewModels {

    export class MismatchesViewModel extends HasCallbacks {

        public AttestedImageUri: string;

        AttestMismatch(mismatchId: number) {
            var url = 'Attest';
            $.ajax({
                type: 'POST',
                url: url,
                data: { id: mismatchId },
                dataType: 'JSON',
                success: (result) => {
                    
                    var tooltipText = 'Attested By: ' + result.AttestedBy + ' Attested Date: ' +
                        moment(result.AttestedDate).format('DD/MM/YYYY hh:mm:ss');

                    var img = $('#attested-' + mismatchId);
                    img.attr('src', this.AttestedImageUri);
                    img.tooltip({ title: tooltipText });
                }
            });
        }

        cb_AttestMismatch(mismatchId: number) {
            this.AttestMismatch(mismatchId);
        }

        cb_AttestTooltipText(AttestedBy: string, AttestedDate: string) {
            return this.AttestTooltipText(AttestedBy, AttestedDate);
        }

        AttestTooltipText(AttestedBy: string, AttestedDate: string) {
            var tooltipText = 'Attested By: ' + AttestedBy + ' Attested Date: ' +
                moment(AttestedDate).format('DD/MM/YYYY hh:mm:ss');

            return tooltipText;
        }
    }
}