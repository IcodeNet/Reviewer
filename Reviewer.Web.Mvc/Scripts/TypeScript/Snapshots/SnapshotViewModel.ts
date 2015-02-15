/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../Models.ts" />
/// <reference path="../SearchViewModel.ts" />

module ViewModels {

    export class SnapshotViewModel extends SearchViewModel {
        CreateUri: string;

        public SnapshotName: KnockoutObservableString;
        public CanCreate: KnockoutObservableFunctions;

        constructor(searchUri: string, createUri: string) {
            super(searchUri);

            this.CreateUri = createUri;
            this.SnapshotName = ko.observable('');

            this.CanCreate = ko.computed(() =>
            {
                if (this.IsLoading() == true)
                    return false;
                if (this.SnapshotName() == '')
                    return false;

                return true;
            });
        }  

        CreateSnapshot() {
            var data = {
                snapshotName: this.SnapshotName()
            }

            this.IsLoading(true);

            $.ajax({
                type: "POST",
                url: this.CreateUri,
                data: data,
                dataType: "json",
                traditional: true,
                success: (result) => {
                    this.IsLoading(false);
                    if (result.Success)
                    {
                        this.SnapshotName(''); // Clear snapshot name.
                        this.cb_Search();
                        alert('Snapshot has been created.');
                    }
                    else {
                        alert(result.Message);
                    }
                }
            });
        }
        cb_CreateSnapshot() { this.CreateSnapshot(); }
    }
}
