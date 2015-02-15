/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../SearchViewModel.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../Models.ts" />

module ViewModels {
    export class CostCentreMappingsViewModel extends SearchViewModel {

        SaveUrl: string;

        constructor(getAllUrl: string, saveUrl: string) {
            super(getAllUrl);

            this.SaveUrl = saveUrl;
        }

        OnResponse(response: ISearchResponse) {

            var costCentreModels = Enumerable.From(response.Results).Select((x) => {
                return new CostCentreMap(this.SaveUrl, x.CostCentreMappingId, x.CostCentre, x.RecoveryCostCentre);
            }).ToArray();

            var blankRow = new CostCentreMap(this.SaveUrl, 0, '', '')
            blankRow.OnSave = this.cb_OnCostCentreSave;
            costCentreModels.push(blankRow);

            response.Results = costCentreModels;

            super.OnResponse(response);
        }

        OnCostCentreSave(costCentreMap: CostCentreMap) {
            if (costCentreMap.CostCentreMappingId() == 0) {
                var blankRow = new CostCentreMap(this.SaveUrl, 0, '', '')
                blankRow.OnSave = this.cb_OnCostCentreSave;
                this.Results.push(blankRow);
            }
        }
        cb_OnCostCentreSave(costCentreMap: CostCentreMap) { this.OnCostCentreSave(costCentreMap); }
    }

    export class CostCentreMap extends HasCallbacks {

        CostCentreMappingId: KnockoutObservableNumber;
        CostCentre: KnockoutObservableString;
        RecoveryCostCentre: KnockoutObservableString;
        IsLoading: KnockoutObservableBool;
        SaveUrl: string;
        IsEditing: KnockoutObservableBool;
        IsUpdate: KnockoutObservableBool;

        OnSave: Function;

        constructor(saveUrl: string, costCentreMappingId: number, costCentre: string, recoveryCostCentre: string) {
            super();

            this.SaveUrl = saveUrl;
            this.CostCentreMappingId = ko.observable(costCentreMappingId);
            this.CostCentre = ko.observable(costCentre);
            this.RecoveryCostCentre = ko.observable(recoveryCostCentre);
            this.IsLoading = ko.observable(false);
            this.IsEditing = ko.observable(costCentreMappingId == 0);
            this.IsUpdate = ko.computed(() => {
                if (this.CostCentreMappingId() != 0) {
                    return true;
                };
            });
        }

        Edit() {
            this.IsEditing(true);
        }
        cb_Edit() { this.Edit(); }

        Save() {

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
                        success: (result) => { 

                            if (result.Exception != null) {
                                alert(result.Exception);
                            } else {
                                if (this.OnSave != null) {
                                    this.OnSave(this);
                                }

                                this.CostCentreMappingId(result.CostCentreMappingId);
                                this.IsEditing(false);
                            }

                            this.IsLoading(false);
                        }
                    });
                }
            } else {
                alert('Invalid Entry, A Cost Centre or Recovery Cost Centre Must Not Be Alphanumeric!')
            }
        }
        cb_Save() { this.Save(); }
    }
}
