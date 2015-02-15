/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />

module ViewModels {
    export class LeaverViewModel extends HasCallbacks {
        Exception: string;
        OriginalBRID: string;
        ActualExitDate: string; 
        EnteredBRID: KnockoutObservableString;
        Action: KnockoutObservableNumber;
        CanViewButtons: KnockoutComputedFunctions;
        CanViewExcpetion: KnockoutComputedFunctions;
        ActualDateHasBorder: KnockoutComputedFunctions; 

        constructor(originalBrid: string, enteredBrid: string, action: number, exception : string, actualExitDate : string) {
            super();

            // Initialize the variables 
            this.Exception = exception
            this.OriginalBRID = originalBrid;
            this.ActualExitDate = actualExitDate;
            this.EnteredBRID = ko.observable(enteredBrid);
            this.Action = ko.observable(action);
            this.EnteredBRID.subscribe((x) => {
                if (x != this.OriginalBRID) {
                    this.Action(0);
                }
            });
            this.CanViewButtons = ko.computed(this.cb_ComputeCanViewRadioButtons);
            this.CanViewExcpetion = ko.computed(this.cb_ComputeCanViewExceptions);
            this.ActualDateHasBorder = ko.computed(this.cb_ComputeHasActualExitDate);
        }

        ComputeCanViewRadioButtons(): boolean {
            if (this.OriginalBRID != this.EnteredBRID()) {
                return false;
            } else {
                return true;
            }
        }

        cb_ComputeCanViewRadioButtons() { return this.ComputeCanViewRadioButtons(); }

        ComputeCanViewException() {
            if (this.Exception == "") {
                //do nothing 
            } else {
                alert(this.Exception);
            }
        }

        cb_ComputeCanViewExceptions() { return this.ComputeCanViewException(); }

        ComputeHasActualExitDate() {
            if (this.ActualExitDate == "")
            {
                document.getElementById("ActualExitDate").style.borderColor="#FF0000"; 
            } else {
                document.getElementById("ActualExitDate").style.borderColor = "#CCCCCC";
            }
        }

        cb_ComputeHasActualExitDate() { return this.ComputeHasActualExitDate(); }
    }
} 