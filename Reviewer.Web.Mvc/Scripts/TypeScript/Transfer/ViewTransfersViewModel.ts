/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../SearchViewModel.ts" />
/// <reference path="../Models.ts" />
/// <reference path="ProcessTransferViewModel.ts" />

module ViewModels {
    
    export class ViewTransfersViewModel extends SearchViewModel	{
        ProcessTransferViewModel: KnockoutObservableAny;
        ProcessTransferElement: any;

        Incoming: boolean;
        Outgoing: boolean;
        OnlyRejected: boolean;
        OnTransferApproved: Function;

        constructor(searchUri: string, incoming: boolean, outgoing: boolean, processTransferUri: string, onlyRejected : boolean)
        {
            super(searchUri);

            this.Incoming = incoming;
            this.Outgoing = outgoing;
            this.OnlyRejected = onlyRejected;

            this.ProcessTransferElement = $('#ProcessTransferViewModel')[0];
            this.ProcessTransferViewModel = ko.observable(new ProcessTransferViewModel(processTransferUri, this.ProcessTransferElement));
            this.ProcessTransferViewModel().OnProcess = () => {
                this.cb_Search();
                if (this.OnTransferApproved != null)
                {
                    this.OnTransferApproved();
                }
            } 
        }

        ProcessTransfer(transfer)
        {
            this.ProcessTransferViewModel().Setup(transfer);
            $(this.ProcessTransferElement).modal();
        }
        cb_ProcessTransfer(transfer) { this.ProcessTransfer(transfer); }

        Search(searchRequest: ITransferSearchRequestModel) {
            searchRequest.Incoming = this.Incoming;
            searchRequest.Outgoing = this.Outgoing;
            searchRequest.OnlyRejected = this.OnlyRejected;

            super.Search(searchRequest);
        }

        ComputeCanDoApprove(): boolean {
            return false;
        }
        cb_ComputeCanDoApprove() { return this.ComputeCanDoApprove(); }

        OnResponse(response : ISearchResponse)
        {
            super.OnResponse(response);
    	}

        ParseRejectionReason(notes: string): string {
            if (notes == null) {
                return '';
            } else {
                var parts = notes.split('\r', 1);
                return parts[0];
            }
        }
    }
}