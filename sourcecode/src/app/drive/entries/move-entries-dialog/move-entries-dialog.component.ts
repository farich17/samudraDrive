import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DriveState} from '../../state/drive-state';
import { DriveFolder } from '../../folders/models/driveFolder';
import { take } from 'rxjs/operators';
import { FoldersTreeService } from '../../sidebar/folders-tree/folders-tree.service';
import { BaseDialog } from 'common/core/ui/dialogs/base-dialog';
import { MoveEntries } from '../../state/actions/commands';
import { MoveEntriesFailed, MoveEntriesSuccess } from '../../state/actions/events';
import { DriveEntry } from '../../files/models/drive-entry';

@Component({
    selector: 'move-entries-dialog',
    templateUrl: './move-entries-dialog.component.html',
    styleUrls: ['./move-entries-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FoldersTreeService],
})
export class MoveEntriesDialogComponent extends BaseDialog implements OnInit {
    public selectedFolder: DriveFolder;
    @Select(DriveState.selectedEntries) selectedEntries$: Observable<DriveEntry[]>;

    constructor(
        protected dialogRef: MatDialogRef<MoveEntriesDialogComponent>,
        protected store: Store,
        protected actions: Actions,
    ) {
        super();
    }

    ngOnInit() {
        const failure = this.actions.pipe(ofAction(MoveEntriesFailed)).subscribe(() => {
            this.loading.next(false);
        });

        const success = this.actions.pipe(ofAction(MoveEntriesSuccess), take(1))
            .subscribe(() => {
                this.selectedFolder = null;
                this.close();
            });

        this.addSubs(success, failure);
    }

    public confirm() {
        this.loading.next(true);

        this.store.dispatch(new MoveEntries(this.selectedFolder.id))
            .subscribe(() => {
                this.loading.next(false);
            });
    }
}
