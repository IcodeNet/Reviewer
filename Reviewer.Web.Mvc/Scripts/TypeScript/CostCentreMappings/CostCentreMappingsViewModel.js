var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ViewModels;
(function (ViewModels) {
    var CostCentreMappingsViewModel = (function (_super) {
        __extends(CostCentreMappingsViewModel, _super);
        function CostCentreMappingsViewModel(getAllUrl, saveUrl) {
            _super.call(this, getAllUrl);

            this.SaveUrl = saveUrl;
        }
        CostCentreMappingsViewModel.prototype.OnResponse = function (response) {
            var _this = this;
            var costCentreModels = Enumerable.From(response.Results).Select(function (x) {
                return new CostCentreMap(_this.SaveUrl, x.CostCentreMappingId, x.CostCentre, x.RecoveryCostCentre);
            }).ToArray();

            var blankRow = new CostCentreMap(this.SaveUrl, 0, '', '');
            blankRow.OnSave = this.cb_OnCostCentreSave;
            costCentreModels.push(blankRow);

            response.Results = costCentreModels;

            _super.prototype.OnResponse.call(this, response);
        };

        CostCentreMappingsViewModel.prototype.OnCostCentreSave = function (costCentreMap) {
            if (costCentreMap.CostCentreMappingId() == 0) {
                var blankRow = new CostCentreMap(this.SaveUrl, 0, '', '');
                blankRow.OnSave = this.cb_OnCostCentreSave;
                this.Results.push(blankRow);
            }
        };
        CostCentreMappingsViewModel.prototype.cb_OnCostCentreSave = function (costCentreMap) {
            this.OnCostCentreSave(costCentreMap);
        };
        return CostCentreMappingsViewModel;
    })(ViewModels.SearchViewModel);
    ViewModels.CostCentreMappingsViewModel = CostCentreMappingsViewModel;

    var CostCentreMap = (function (_super) {
        __extends(CostCentreMap, _super);
        function CostCentreMap(saveUrl, costCentreMappingId, costCentre, recoveryCostCentre) {
            var _this = this;
            _super.call(this);

            this.SaveUrl = saveUrl;
            this.CostCentreMappingId = ko.observable(costCentreMappingId);
            this.CostCentre = ko.observable(costCentre);
            this.RecoveryCostCentre = ko.observable(recoveryCostCentre);
            this.IsLoading = ko.observable(false);
            this.IsEditing = ko.observable(costCentreMappingId == 0);
            this.IsUpdate = ko.computed(function () {
                if (_this.CostCentreMappingId() != 0) {
                    return true;
                }
                ;
            });
        }
        CostCentreMap.prototype.Edit = function () {
            this.IsEditing(true);
        };
        CostCentreMap.prototype.cb_Edit = function () {
            this.Edit();
        };

        CostCentreMap.prototype.Save = function () {
            var _this = this;
            if (this.CostCentre().match(/[a-zA-Z]/) == null && this.RecoveryCostCentre().match(/[a-zA-Z]/) == null) {
                if (this.CostCentre().length != 5 || this.RecoveryCostCentre().length != 5) {
                    alert('A cost centre or recovery cost centre should be 5 digits');
                } else {
                    var data = {
                        CostCentreMappingId: this.CostCentreMappingId(),
                        CostCentre: this.CostCentre(),
                        RecoveryCostCentre: this.RecoveryCostCentre()
                    };

                    this.IsLoading(true);

                    $.ajax({
                        type: "POST",
                        url: this.SaveUrl,
                        data: data,
                        dataType: "json",
                        traditional: true,
                        success: function (result) {
                            if (result.Exception != null) {
                                alert(result.Exception);
                            } else {
                                if (_this.OnSave != null) {
                                    _this.OnSave(_this);
                                }

                                _this.CostCentreMappingId(result.CostCentreMappingId);
                                _this.IsEditing(false);
                            }

                            _this.IsLoading(false);
                        }
                    });
                }
            } else {
                alert('Invalid Entry, A Cost Centre or Recovery Cost Centre Must Not Be Alphanumeric!');
            }
        };
        CostCentreMap.prototype.cb_Save = function () {
            this.Save();
        };
        return CostCentreMap;
    })(HasCallbacks);
    ViewModels.CostCentreMap = CostCentreMap;
})(ViewModels || (ViewModels = {}));
