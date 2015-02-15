var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ViewModels;
(function (ViewModels) {
    var MismatchesViewModel = (function (_super) {
        __extends(MismatchesViewModel, _super);
        function MismatchesViewModel() {
            _super.apply(this, arguments);
        }
        MismatchesViewModel.prototype.AttestMismatch = function (mismatchId) {
            var _this = this;
            var url = 'Attest';
            $.ajax({
                type: 'POST',
                url: url,
                data: { id: mismatchId },
                dataType: 'JSON',
                success: function (result) {
                    var tooltipText = 'Attested By: ' + result.AttestedBy + ' Attested Date: ' + moment(result.AttestedDate).format('DD/MM/YYYY hh:mm:ss');

                    var img = $('#attested-' + mismatchId);
                    img.attr('src', _this.AttestedImageUri);
                    img.tooltip({ title: tooltipText });
                }
            });
        };

        MismatchesViewModel.prototype.cb_AttestMismatch = function (mismatchId) {
            this.AttestMismatch(mismatchId);
        };

        MismatchesViewModel.prototype.cb_AttestTooltipText = function (AttestedBy, AttestedDate) {
            return this.AttestTooltipText(AttestedBy, AttestedDate);
        };

        MismatchesViewModel.prototype.AttestTooltipText = function (AttestedBy, AttestedDate) {
            var tooltipText = 'Attested By: ' + AttestedBy + ' Attested Date: ' + moment(AttestedDate).format('DD/MM/YYYY hh:mm:ss');

            return tooltipText;
        };
        return MismatchesViewModel;
    })(HasCallbacks);
    ViewModels.MismatchesViewModel = MismatchesViewModel;
})(ViewModels || (ViewModels = {}));
