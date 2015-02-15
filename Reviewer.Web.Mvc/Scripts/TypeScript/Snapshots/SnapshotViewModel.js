/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../Models.ts" />
/// <reference path="../SearchViewModel.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ViewModels;
(function (ViewModels) {
    var SnapshotViewModel = (function (_super) {
        __extends(SnapshotViewModel, _super);
        function SnapshotViewModel(searchUri, createUri) {
            var _this = this;
            _super.call(this, searchUri);

            this.CreateUri = createUri;
            this.SnapshotName = ko.observable('');

            this.CanCreate = ko.computed(function () {
                if (_this.IsLoading() == true)
                    return false;
                if (_this.SnapshotName() == '')
                    return false;

                return true;
            });
        }
        SnapshotViewModel.prototype.CreateSnapshot = function () {
            var _this = this;
            var data = {
                snapshotName: this.SnapshotName()
            };

            this.IsLoading(true);

            $.ajax({
                type: "POST",
                url: this.CreateUri,
                data: data,
                dataType: "json",
                traditional: true,
                success: function (result) {
                    _this.IsLoading(false);
                    if (result.Success) {
                        _this.SnapshotName('');
                        _this.cb_Search();
                        alert('Snapshot has been created.');
                    } else {
                        alert(result.Message);
                    }
                }
            });
        };
        SnapshotViewModel.prototype.cb_CreateSnapshot = function () {
            this.CreateSnapshot();
        };
        return SnapshotViewModel;
    })(ViewModels.SearchViewModel);
    ViewModels.SnapshotViewModel = SnapshotViewModel;
})(ViewModels || (ViewModels = {}));
